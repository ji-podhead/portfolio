import type { Particles } from './engine';

// This class manages a single particle system worker
export class ParticleWorkerManager {
    private worker: Worker;
    private particle: Particles;
    private index: number;

    constructor(particle: Particles, index: number) {
        this.particle = particle;
        this.index = index;

        // The worker script will be in the public folder
        this.worker = new Worker('/particle-worker.js');
        this.worker.addEventListener("message", this.receiveMessage);
        this.updateWorkerValues();
    }

    private receiveMessage = (event: MessageEvent) => {
        const { index, values } = event.data;
        if (index === this.index) {
            this.particle.instance.instanceCount = values.instanceCount;

            const posAttr = this.particle.instance.attributes.boxPosition as THREE.InstancedBufferAttribute;
            posAttr.array = values.transformArrays[0];
            posAttr.needsUpdate = true;

            const rotAttr = this.particle.instance.attributes.rotation as THREE.InstancedBufferAttribute;
            rotAttr.array = values.transformArrays[2]; // Index 2 for rotation
            rotAttr.needsUpdate = true;

            const scaleAttr = this.particle.instance.attributes.boxSize as THREE.InstancedBufferAttribute;
            scaleAttr.array = values.transformArrays[1]; // Index 1 for scale
            scaleAttr.needsUpdate = true;

            const colorAttr = this.particle.instance.attributes.aInstanceColor as THREE.InstancedBufferAttribute;
            colorAttr.array = values.colorArray;
            colorAttr.needsUpdate = true;

            const emissiveAttr = this.particle.instance.attributes.aInstanceEmissive as THREE.InstancedBufferAttribute;
            emissiveAttr.array = values.emissionArray;
            emissiveAttr.needsUpdate = true;

            const opacityAttr = this.particle.instance.attributes.opacity1 as THREE.InstancedBufferAttribute;
            opacityAttr.array = values.opacityArray;
            opacityAttr.needsUpdate = true;

            this.particle.properties.get("lifeTime").array = values.lifeTime;
            this.particle.properties.get("direction").array = values.directionArray;
        }
    }

    public updateWorkerValues() {
        this.worker.postMessage({
            task: "init",
            index: this.index
        });
        this.worker.postMessage({
            task: "updateDefaultValues",
            value: {
                object: {
                    amount: this.particle.amount,
                    noise: this.particle.noise,
                    pointCloud: this.particle.pointCloud,
                    startPositionFromgeometry: this.particle.startPositionFromgeometry,
                    forcefield: this.particle.forcefield,
                    force: this.particle.force,
                    forceFieldForce: this.particle.forceFieldForce,
                    attributesoverLifeTime: this.particle.attributesoverLifeTime,
                    properties: this.particle.properties,
                    spawFrequency: this.particle.spawFrequency,
                    maxSpawnCount: this.particle.maxSpawnCount,
                    spawnOverTime: this.particle.spawnOverTime,
                    burstCount: this.particle.burstCount,
                    instanceCount: this.particle.instance.instanceCount,
                    spawnOfset: this.particle.spawnOfset
                }
            }
        });
    }

    public updateSimulation(delta: number) {
        this.worker.postMessage({ task: "updateSimulation", value: { delta: delta } });
    }

    public terminate() {
        console.log("Terminating particle worker");
        this.worker.removeEventListener("message", this.receiveMessage);
        this.worker.terminate();
    }
}

// This component can be added to the layout to automatically terminate workers on page unload.
export const ParticleAutoDisposal = ({ managers }: { managers: ParticleWorkerManager[] }) => {
    useEffect(() => {
        const handleUnload = () => {
            managers.forEach(manager => manager.terminate());
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [managers]);

    return null; // This component does not render anything
};