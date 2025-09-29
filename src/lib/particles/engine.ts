import * as THREE from 'three';
import * as glMatrix from "gl-matrix";

// Helper functions
export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
export const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
export const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
export const range = (x1: number, y1: number, x2: number, y2: number, a: number) => lerp(x2, y2, invlerp(x1, y1, a));

// Private variables for calculations
let killCount = 0;
const positionVector = new Float32Array(3);
const rotationVector = new Float32Array(3);
const scaleVector = new Float32Array(3);
const directionVector = new Float32Array(3);

export class Particles {
    // Define properties with types
    amount: number;
    vertCount: number;
    noise: number;
    pointCloud: any[];
    startPositionFromgeometry: boolean;
    forcefield: any[];
    force: any[];
    forceFieldForce: any[];
    attributesoverLifeTime: Map<string, any>;
    properties: Map<string, any>;
    spawFrequency: number;
    maxSpawnCount: number;
    spawnOverTime: boolean;
    waitingtime: number;
    burstCount: number;
    additionalBurstCount: number;
    evenFunctions: Map<any, any>;
    particleEventFunctions: Map<any, any>;
    instance: THREE.InstancedBufferGeometry;
    childParticles: Map<any, any>;
    childSpawnTimer: number;
    particleKillFunction: any;
    particleBirthFunction: any;
    spawnOfset: number;
    indexSlide: boolean;

	constructor() {
        // Initialize with default values
        this.amount = 0;
        this.vertCount = 0;
        this.noise = 0;
        this.pointCloud = [];
        this.startPositionFromgeometry = false;
        this.forcefield = [];
        this.force = [];
        this.forceFieldForce = [];
        this.attributesoverLifeTime = new Map();
        this.properties = new Map();
        this.spawFrequency = 1;
        this.maxSpawnCount = 0;
        this.spawnOverTime = false;
        this.waitingtime = 0;
        this.burstCount = 0;
        this.additionalBurstCount = 0;
        this.evenFunctions = new Map();
        this.particleEventFunctions = new Map();
        this.instance = new THREE.InstancedBufferGeometry();
        this.childParticles = new Map();
        this.childSpawnTimer = 0;
        this.particleKillFunction = null;
        this.particleBirthFunction = null;
        this.spawnOfset = 0;
        this.indexSlide = false;
	}

	addChildParticleSysthem(particleSysthem: Particles, spawnOverLifeTime: number, spawnFrequencyOverLifeTime: number) {
		particleSysthem.instance.instanceCount=0;
		this.childParticles.set(this.childParticles.size, {
			ps: particleSysthem,
			spawnOverLifeTime: spawnOverLifeTime,
			spawnFrequencyOverLifeTime: spawnFrequencyOverLifeTime,
			tempIndex:0
		})
	}

	setMorphTargets(morphTargets: any[]) {
		for (let i = 0; i < morphTargets.length; i++) {
			this.properties.set("morphTargets", parseInt(morphTargets[i]))
		}
		this.properties.get("morphTargetInfluences").attribute.needsUpdate = true
	}

	setMaxLifeTime(maxLifeTime: number,random?: boolean,minRange?: number,maxRange?: number) {
		const temp=this.properties.get("sourceValues").get("maxLifeTime")
		if(typeof random !== 'undefined'){
			temp.random=random
			temp.minRange=minRange
			temp.maxRange=maxRange

		}else{
			temp.random=false
		}
		temp.values=maxLifeTime
	}

	setNoise(strength: number) {
		this.noise = strength
	}

	setTransform(x: number, y: number, z: number, index: number) {
		const indexA0=index*3
		const trans= this.properties.get("transform").array
		trans[indexA0]= x
		trans[indexA0+1]= y
		trans[indexA0+2]= z
	}

    setStartDirection(x: number, y: number, z: number,random?: boolean,minRange?: number,maxRange?: number){
		const direc=this.properties.get("sourceValues").get("direction")
		direc.values[0]=x
		direc.values[1]=y
		direc.values[2]=z
		if(random==true){
			direc.random=true
			direc.minRange=minRange
			direc.maxRange=maxRange
		}
		else{
			direc.random=false
		}
	}

    setForce(force: number[]) {
		this.force = force
		this.properties.get("sourceValues").set("force", force)
	}

	setBurstCount(count: number) {
		if(this.maxSpawnCount<count){
			this.burstCount=this.maxSpawnCount
		}else{
			this.burstCount = count
		}
	}

	setSpawnOverTime(bool: boolean) {
		this.spawnOverTime = bool
	}

	setSpawnFrequency(freq: number) {
		this.spawFrequency = freq
	}

	setMaxSpawnCount(count: number) {
		if (count > this.amount) {
			count = this.amount
		}
		this.maxSpawnCount=count
		this.instance.instanceCount = 0
	}

    setSourceAttributes(attributes: string | string[], values: any,random?: boolean | boolean[],minRange?: number | number[],maxRange?: number | number[]) {
		const sourceValues = this.properties.get("sourceValues")
		if (Array.isArray(attributes)) {
			for (let i=0;i< attributes.length;i++) {
				const temp =sourceValues.get(attributes[i])
				temp.values=values[i]
				temp.random= (random as boolean[])[i]
				temp.minRange= (minRange as number[])[i]
				temp.maxRange= (maxRange as number[])[i]
			}
		} else {
            const temp = sourceValues.get(attributes)
            temp.values=values
            temp.random=random
            temp.minRange=minRange
            temp.maxRange=maxRange
		}
	}

    setAttributeOverLifeTime(attribute: string, values: number[],end: number[],bezier?: boolean,bezierControllPointA?: number[],bezierControllPointB?: number[]) {
		if(typeof bezier == "boolean"){
		    this.attributesoverLifeTime.set(attribute, {values:values,end:end,bezier:bezier, bezierControllPointA:bezierControllPointA,bezierControllPointB:bezierControllPointB})
		}else{
		    this.attributesoverLifeTime.set(attribute, {values:values,end:end,bezier:false})
		}
	}

    updateValues(attributes: string | string[]) {
		if (Array.isArray(attributes)) {
			for (const attribute of attributes) {
                try {
                    this.properties.get(attribute).attribute.needsUpdate = true
                }
                catch { console.warn(attribute + " is not defined, pls check your spelling, or check if the attribute exist") }
            }
		} else {
            this.properties.get(attributes).attribute.needsUpdate = true;
        }
	}

    resetParticle(index: number) {
		const attributesoverLifeTimeValues = this.attributesoverLifeTime;
		const indexA0=index*3;
		const indexA1=indexA0+1;
		const indexA2=indexA1+1;

		const sourceValues = this.properties.get("sourceValues");
        const rot=sourceValues.get("rotation");
        const scale=sourceValues.get("scale");
        const pos =sourceValues.get("transform");
        const direc=sourceValues.get("direction");

        // Simplified reset logic
        const pos1 = this.startPositionFromgeometry ? [this.pointCloud[index*3], this.pointCloud[index*3+1], this.pointCloud[index*3+2]] : pos.values;

        for (let i=0;i<3;i++){
            positionVector[i]=pos1[i];
            rotationVector[i]=rot.values[i];
            scaleVector[i]=scale.values[i];
        }

        // Apply randomness if configured
        if(pos.random){
            positionVector[0]+=range(0,1,pos.minRange,pos.maxRange,Math.random());
            positionVector[1]+=range(0,1,pos.minRange,pos.maxRange,Math.random());
            positionVector[2]+=range(0,1,pos.minRange,pos.maxRange,Math.random());
        }
        // ... (Repeat for rotation and scale)

        const transArray = this.properties.get("transform").array;
        const scaleArray = this.properties.get("scale").array;
        const rotArray = this.properties.get("rotation").array;

        for (let i=0;i<3;i++){
            transArray[indexA0+i]=positionVector[i];
            scaleArray[indexA0+i]=scaleVector[i];
            rotArray[indexA0+i]=rotationVector[i];
        }

        const direc1=this.properties.get("direction")
        direc1.array[indexA0]=direc.values[0]
        direc1.array[indexA1]=direc.values[1]
        direc1.array[indexA2]=direc.values[2]
        if(direc.random){
            direc1.array[(indexA0)]+=range(0,1,direc.minRange,direc.maxRange,Math.random())
            direc1.array[(indexA1)]+=range(0,1,direc.minRange,direc.maxRange,Math.random())
            direc1.array[(indexA2)]+=range(0,1,direc.minRange,direc.maxRange,Math.random())
        }

		attributesoverLifeTimeValues.forEach((value: any, attribute: string) => {
			if (attribute !== "transform" && attribute !== "rotation" && attribute !== "scale" && attribute !== "force" && attribute !== "direction") {
                const sourceAttribute = sourceValues.get(attribute);
                const attrArray = this.properties.get(attribute).array;
                let randomX=0, randomY=0, randomZ=0;

                if(sourceAttribute.random){
                    randomX=range(0,1,sourceAttribute.minRange,sourceAttribute.maxRange,Math.random());
                    randomY=range(0,1,sourceAttribute.minRange,sourceAttribute.maxRange,Math.random());
                    randomZ=range(0,1,sourceAttribute.minRange,sourceAttribute.maxRange,Math.random());
                }

                switch (sourceAttribute.values.length) {
                    case (3):
                        attrArray[indexA0]=sourceAttribute.values[0]+randomX;
                        attrArray[indexA1]=sourceAttribute.values[1]+randomY;
                        attrArray[indexA2]=sourceAttribute.values[2]+randomZ;
                        break;
                    case (2):
                        attrArray[indexA0]=sourceAttribute.values[0]+randomX;
                        attrArray[indexA1]=sourceAttribute.values[1]+randomY;
                        break;
                    case (1):
                        attrArray[indexA0]=sourceAttribute.values[0]+randomZ;
                        break;
                }
			}
		})
    }

	updateSimulation(delta: number, respawn: boolean, reset: boolean, kill: boolean, translate: boolean) {
        if(this.maxSpawnCount==0){
			return(console.warn("No need to update the PS! => maxSpawnCount is 0"))
		}

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
		for (let count=this.instance.instanceCount;count>0;count--) {
			const index =(this.instance.instanceCount-count)
			const lifeTime= this.properties.get("lifeTime").array
			const lifeTimeIndex=index*2
			lifeTime[lifeTimeIndex]+=delta

			if (lifeTime[lifeTimeIndex]<= lifeTime[(lifeTimeIndex+1)]) {
				let direction=this.properties.get("direction").array
				const lifeTimedelta = (lifeTime[(lifeTimeIndex)]/lifeTime[lifeTimeIndex+1] )
			    const indexA0=index*3
			    const indexA1=indexA0+1
			    const indexA2=indexA1+ 1

                const transArray = this.properties.get("transform").array

                for (let i=0;i<3;i++){ directionVector[i]=0 }

                // Simplified Over-Lifetime Logic
                this.attributesoverLifeTime.forEach((value: any, attribute: string) => {
                    if (attribute === "force") {
                        force[0] += (value.values[0])
                        force[1] += (value.values[1])
                        force[2] += (value.values[2])
                    } else if(attribute === "direction") {
                        direction[indexA0]+= (value.values[0])
						direction[indexA1]+= (value.values[1])
						direction[indexA2]+=(value.values[2])
                    } else {
                        const arr = this.properties.get(attribute).array
                        // simplified lerp
                        arr[indexA0] += (value.end[0] - value.values[0]) * lifeTimedelta;
                        if(value.values.length > 1) arr[indexA1] += (value.end[1] - value.values[1]) * lifeTimedelta;
                        if(value.values.length > 2) arr[indexA2] += (value.end[2] - value.values[2]) * lifeTimedelta;
                    }
                })

				directionVector[0] +=(direction[indexA0]!==0?(force[0]*direction[indexA0]):force[0])
				directionVector[1] +=(direction[indexA1]!==0?(force[1]*direction[indexA1]):force[1])
				directionVector[2] +=(direction[indexA2]!==0?(force[2]*direction[indexA2]):force[2])

                if (this.noise > 0) {
					const noise = Math.sin(delta * 10 * this.noise)
					directionVector[0] += noise
					directionVector[1] += noise
					directionVector[2] += noise
				}

				for (let i=0;i<3;i++){
			        transArray[indexA0+i]+=directionVector[i]
                }
            } else {
				const max=this.properties.get("sourceValues").get("maxLifeTime")
				lifeTime[lifeTimeIndex]=0
				lifeTime[lifeTimeIndex+1]=max.values
                if(max.random==true){
                    lifeTime[lifeTimeIndex+1]	+=range(0,1,max.minRange,max.maxRange,Math.random())
                }

                if(kill){ killCount+=1 }
                if(reset){ this.resetParticle(index) }
            }
		}
		this.instance.instanceCount-=killCount
        killCount=0
	}

	InitializeParticles(scene: THREE.Scene, mesh: THREE.Mesh, amount: number) {
		this.spawnOfset=0
		this.indexSlide=false

        // Default values
        const startPosition = {values:[0, 0, 0],random:false, minRange: 0, maxRange: 0 };
        const startScale = {values:[1, 1, 1],random:false, minRange: 0, maxRange: 0 };
        const startRotation = {values:[0, 0, 0],random:false, minRange: 0, maxRange: 0 };
        const startColor = {values:[255, 255, 255],random:false, minRange: 0, maxRange: 0 };
        const startForce = [0,0,0];
        const startDirection = {values:[0, 0, 0],random:false, minRange: 0, maxRange: 0 };
        const startOpacity = {values:[1],random:false, minRange: 0, maxRange: 0 };
        const maxLifeTime = {values:10,random:false, minRange: 0, maxRange: 0 };

		this.amount = amount
		this.maxSpawnCount = amount;
        this.burstCount = amount;
		this.force = startForce;
		this.attributesoverLifeTime = new Map();
		this.properties = new Map();

		const geometry = mesh.geometry
		const instancedGeometry = new THREE.InstancedBufferGeometry()
		this.instance = instancedGeometry
		instancedGeometry.index = geometry.index
		instancedGeometry.maxInstancedCount = this.amount

		const emissionArray = new Uint8Array(this.amount * 3)
		const colorArray = new Uint8Array(this.amount * 3)
		const directionArray = new Float32Array(this.amount*3)
		const opacityArray = new Float32Array(this.amount)
		const matArraySize = this.amount * 3
		const lifeTimeArray = new Float32Array(amount*2)
		const matrixArray = [
			new Float32Array(matArraySize), // Position
			new Float32Array(matArraySize), // Scale
			new Float32Array(matArraySize), // Rotation
		]

		const emissiveAttribute = new THREE.InstancedBufferAttribute(emissionArray, 3, true)
		const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3, true)
		const opacityAttribute = new THREE.InstancedBufferAttribute(opacityArray, 1, true)
		const boxPositionAttribute=	new THREE.InstancedBufferAttribute( matrixArray[0], 3 )
		const boxSizeAttribute=   	new THREE.InstancedBufferAttribute( matrixArray[1], 3 )
		const rotatioAttributen= 	new THREE.InstancedBufferAttribute( matrixArray[2], 3 )

		instancedGeometry.setAttribute('aInstanceColor',colorAttribute)
		instancedGeometry.setAttribute('aInstanceEmissive',emissiveAttribute)
		instancedGeometry.setAttribute('opacity1',opacityAttribute)
		instancedGeometry.setAttribute( 'boxPosition', boxPositionAttribute);
		instancedGeometry.setAttribute( 'boxSize',boxSizeAttribute );
		instancedGeometry.setAttribute( 'rotation', rotatioAttributen);
		Object.keys(geometry.attributes).forEach(attributeName => {
			(instancedGeometry.attributes as any)[attributeName] = (geometry.attributes as any)[attributeName]
		})

		const sourceValues = new Map()
		sourceValues.set("transform", startPosition)
		sourceValues.set("color", startColor)
		sourceValues.set("emission", {values:[0,0,0],random:false,minRange:0,maxRange:0})
		sourceValues.set("rotation", startRotation)
		sourceValues.set("scale", startScale)
		sourceValues.set("force", startForce);
		sourceValues.set("direction", startDirection);
		sourceValues.set("opacity",startOpacity)
		sourceValues.set("maxLifeTime",maxLifeTime)
		this.properties.set("sourceValues", sourceValues)
		this.properties.set("transform", { array: matrixArray[0], attribute: boxPositionAttribute })
		this.properties.set("rotation", { array: matrixArray[2], attribute: rotatioAttributen})
		this.properties.set("scale", { array: matrixArray[1], attribute: boxSizeAttribute })
		this.properties.set("color", { array: colorArray, attribute: colorAttribute })
		this.properties.set("emission", { array: emissionArray, attribute: emissiveAttribute })
		this.properties.set("direction",{array:directionArray})
		this.properties.set("lifeTime",{array:lifeTimeArray})
		this.properties.set("opacity",{array:opacityArray,attribute:opacityAttribute})

		const instanceMaterial = (mesh.material as THREE.Material).clone();
        if((instanceMaterial as any).transparent){
			(instanceMaterial as any).depthWrite=false
		}

        instanceMaterial.onBeforeCompile = shader => {
            shader.vertexShader = `
            attribute vec3 boxPosition;
            attribute vec3 boxSize;
            attribute vec3 rotation;
            attribute vec3 aInstanceColor;
            attribute vec3 aInstanceEmissive;
            attribute float opacity1;
            mat4 rotationMatrix(vec3 axis, float angle)
            {
                axis = normalize(axis);
                float s = sin(angle);
                float c = cos(angle);
                float oc = 1.0 - c;
                return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                            0.0,                                0.0,                                0.0,                                1.0);
            }
            mat4 rotateXYZ() {
              return rotationMatrix(vec3(1, 0, 0), rotation.x) * rotationMatrix(vec3(0, 1, 0), rotation.y) * rotationMatrix(vec3(0, 0, 1), rotation.z) ;
            }
            ` + shader.vertexShader;
            shader.vertexShader = `
          varying vec3 vInstanceColor;
          varying vec3 vInstanceEmissive;
          varying float vOpacity;
          ${shader.vertexShader.replace(
        `#include <color_vertex>`,
        `#include <color_vertex>
             vInstanceColor = aInstanceColor;
             vInstanceEmissive = aInstanceEmissive;
             vOpacity=opacity1;
              `
        )}`
            shader.vertexShader = shader.vertexShader.replace(
                `#include <begin_vertex>`,
            `#include <begin_vertex>
            mat4 rotationMatrix = rotateXYZ();
            mat4 scaleMatrix =  mat4(
                                     boxSize.x,0.0,0.0,0.0,
                                     0.0,boxSize.y,0.0,0.0,
                                     0.0,0.0,boxSize.z,0.0,
                                     0.0,0.0,0.0,1.0);
            mat4 positionMatrix = mat4(
                                        1.0,0.0,0.0,boxPosition.x,
                                        0.0,1.0,0.0,boxPosition.y,
                                        0.0,0.0,1.0,boxPosition.z,
                                        0.0,0.0,0.0,1.0);
             mat4 _aInstanceMatrix = positionMatrix * rotationMatrix * scaleMatrix;
                                        transformed = (_aInstanceMatrix * vec4( position , 1. )).xyz;
            vNormal = (vec4(normalize(position), 1.0) * _aInstanceMatrix).xyz;
            `,
          );
        shader.fragmentShader = `
          varying vec3 vInstanceColor;
          varying float vOpacity;
          ${shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        'vec4 diffuseColor = vec4( vInstanceColor/255.0, vOpacity );', // Divide color by 255
        )}`
        shader.fragmentShader = `
          varying vec3 vInstanceEmissive;
          ${shader.fragmentShader.replace(
        'vec3 totalEmissiveRadiance = emissive;',
        'vec3 totalEmissiveRadiance = vInstanceEmissive/255.0; ', // Divide emissive by 255
        )}`
        };
		this.instance.instanceCount=0
		const instaneMesh = new THREE.Mesh(
			instancedGeometry,
			instanceMaterial
		)
		// scene.add(instaneMesh) // We no longer add to scene directly
        return instaneMesh; // Return the mesh to be used in React components
	}
}