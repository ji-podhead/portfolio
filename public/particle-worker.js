// This script runs in a separate thread.
// It contains the particle engine logic directly to avoid module import issues in workers.

// --- Start of Particle Engine Logic (from engine.ts) ---

const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

let killCount = 0;
const positionVector = new Float32Array(3);
const rotationVector = new Float32Array(3);
const scaleVector = new Float32Array(3);
const directionVector = new Float32Array(3);

class Particles {
	constructor() {
        this.amount = 0;
        this.noise = 0;
        this.pointCloud = [];
        this.startPositionFromgeometry = false;
        this.force = [];
        this.attributesoverLifeTime = new Map();
        this.properties = new Map();
        this.spawFrequency = 1;
        this.maxSpawnCount = 0;
        this.spawnOverTime = false;
        this.waitingtime = 0;
        this.burstCount = 0;
        this.instance = { instanceCount: 0 }; // Simplified for worker context
	}

    // This is a simplified version of the engine for the worker context
    // It only contains the logic necessary for the simulation update loop.

    resetParticle(index) {
		const attributesoverLifeTimeValues = this.attributesoverLifeTime;
		const indexA0=index*3;

		const sourceValues = this.properties.get("sourceValues");
        const rot=sourceValues.get("rotation");
        const scale=sourceValues.get("scale");
        const pos =sourceValues.get("transform");
        const direc=sourceValues.get("direction");

        const pos1 = this.startPositionFromgeometry ? [this.pointCloud[indexA0], this.pointCloud[indexA0+1], this.pointCloud[indexA0+2]] : pos.values;

        positionVector[0] = pos1[0] || 0;
        positionVector[1] = pos1[1] || 0;
        positionVector[2] = pos1[2] || 0;

        for (let i=0;i<3;i++){
            rotationVector[i]=rot.values[i];
            scaleVector[i]=scale.values[i];
        }

        if(pos.random){
            positionVector[0]+=range(0,1,pos.minRange,pos.maxRange,Math.random());
            positionVector[1]+=range(0,1,pos.minRange,pos.maxRange,Math.random());
            positionVector[2]+=range(0,1,pos.minRange,pos.maxRange,Math.random());
        }

        const transArray = this.properties.get("transform").array;
        const scaleArray = this.properties.get("scale").array;
        const rotArray = this.properties.get("rotation").array;

        for (let i=0;i<3;i++){
            transArray[indexA0+i]=positionVector[i];
            scaleArray[indexA0+i]=scaleVector[i];
            rotArray[indexA0+i]=rotationVector[i];
        }

        const direc1=this.properties.get("direction")
        for (let i=0;i<3;i++) { direc1.array[indexA0+i]=direc.values[i]; }
        if(direc.random){
            for (let i=0;i<3;i++) { direc1.array[indexA0+i]+=range(0,1,direc.minRange,direc.maxRange,Math.random()); }
        }

		attributesoverLifeTimeValues.forEach((value, attribute) => {
			if (attribute !== "transform" && attribute !== "rotation" && attribute !== "scale" && attribute !== "force" && attribute !== "direction") {
                const sourceAttribute = sourceValues.get(attribute);
                const attrArray = this.properties.get(attribute).array;
                let randoms = [0,0,0];

                if(sourceAttribute.random){
                    for(let i=0; i<3; i++) randoms[i]=range(0,1,sourceAttribute.minRange,sourceAttribute.maxRange,Math.random());
                }

                for(let i=0; i<sourceAttribute.values.length; i++) {
                    attrArray[indexA0+i] = sourceAttribute.values[i] + randoms[i];
                }
			}
		})
    }

	updateSimulation(delta, respawn, reset, kill) {
        if(this.maxSpawnCount==0){ return; }

		if(respawn) {
			if (this.waitingtime < this.spawFrequency) {
				this.waitingtime += delta
			} else {
				this.waitingtime = 0
				let burstCountOfset = this.maxSpawnCount-((this.burstCount+this.instance.instanceCount))
                if(burstCountOfset<=0){
                    this.instance.instanceCount += (this.burstCount+burstCountOfset)
                }
                else if(burstCountOfset>0){
                    this.instance.instanceCount += (this.burstCount)
                }
			}
		}

		let force = [...this.force]
		for (let i=0; i < this.instance.instanceCount; i++) {
			const lifeTime= this.properties.get("lifeTime").array
			const lifeTimeIndex=i*2
			lifeTime[lifeTimeIndex]+=delta

			if (lifeTime[lifeTimeIndex]<= lifeTime[(lifeTimeIndex+1)]) {
				let direction=this.properties.get("direction").array
				const lifeTimedelta = (lifeTime[lifeTimeIndex] / lifeTime[lifeTimeIndex+1] )
			    const indexA0=i*3

                const transArray = this.properties.get("transform").array

                for (let j=0;j<3;j++){ directionVector[j]=0 }

                this.attributesoverLifeTime.forEach((value, attribute) => {
                    if (attribute === "force") {
                        for(let j=0; j<3; j++) force[j] += (value.values[j] * lifeTimedelta);
                    } else if(attribute === "direction") {
                        for(let j=0; j<3; j++) direction[indexA0+j] += (value.values[j] * lifeTimedelta);
                    } else {
                        const arr = this.properties.get(attribute).array
                        for(let j=0; j<value.values.length; j++){
                            arr[indexA0+j] = lerp(value.values[j], value.end[j], lifeTimedelta);
                        }
                    }
                })

                for(let j=0; j<3; j++){
                    directionVector[j] += (direction[indexA0+j] !== 0 ? (force[j] * direction[indexA0+j]) : force[j]);
                }

                if (this.noise > 0) {
					const noise = Math.sin(delta * 10 * this.noise)
                    for(let j=0; j<3; j++) directionVector[j] += noise;
				}

                for (let j=0;j<3;j++){
			        transArray[indexA0+j]+=directionVector[j] * delta;
                }
            } else {
				const max=this.properties.get("sourceValues").get("maxLifeTime")
				lifeTime[lifeTimeIndex]=0
				lifeTime[lifeTimeIndex+1]=max.values
                if(max.random==true){
                    lifeTime[lifeTimeIndex+1] += range(0,1,max.minRange,max.maxRange,Math.random())
                }

                if(kill){ killCount+=1 }
                if(reset){ this.resetParticle(i) }
            }
		}
		this.instance.instanceCount-=killCount
        killCount=0
	}
}
// --- End of Particle Engine Logic ---


let particle = null;
let particleIndex = -1;

self.onmessage = function(e) {
    const { task, index, value } = e.data;

    switch (task) {
        case 'init':
            particle = new Particles();
            particleIndex = index;
            break;

        case 'updateDefaultValues':
            if (particle) {
                const config = value.object;
                for (const key in config) {
                    if (particle.hasOwnProperty(key)) {
                        particle[key] = config[key];
                    }
                }
            }
            break;

        case 'updateSimulation':
            if (particle) {
                const delta = value.delta;
                particle.updateSimulation(delta, false, true, true);

                self.postMessage({
                    index: particleIndex,
                    values: {
                        instanceCount: particle.instance.instanceCount,
                        transformArrays: [
                            particle.properties.get("transform").array,
                            particle.properties.get("scale").array,
                            particle.properties.get("rotation").array
                        ],
                        colorArray: particle.properties.get("color").array,
                        emissionArray: particle.properties.get("emission").array,
                        opacityArray: particle.properties.get("opacity").array,
                        lifeTime: particle.properties.get("lifeTime").array,
                        directionArray: particle.properties.get("direction").array
                    }
                }, [
                    particle.properties.get("transform").array.buffer,
                    particle.properties.get("scale").array.buffer,
                    particle.properties.get("rotation").array.buffer,
                    particle.properties.get("color").array.buffer,
                    particle.properties.get("emission").array.buffer,
                    particle.properties.get("opacity").array.buffer,
                    particle.properties.get("lifeTime").array.buffer,
                    particle.properties.get("direction").array.buffer
                ]);
            }
            break;
    }
};