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

    // This is a subset of the original methods, adapted for the current use case.
    // A full implementation would require porting all methods from workerParticles.js

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

    setStartPositionFromArray(deactivate: boolean, array: Float32Array, random?: boolean, minRange?: number, maxRange?: number) {
        if (deactivate == false) {
			this.pointCloud = Array.from(array); // Simplified point cloud creation
			this.startPositionFromgeometry = true
		} else {
			this.startPositionFromgeometry = false
		}

        const pos=this.properties.get("sourceValues").get("transform");
		if(random){
			pos.random=random
			pos.minRange=minRange
			pos.maxRange=maxRange
		} else{
			pos.random=false
		}
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

    resetParticle(index: number) {
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

		attributesoverLifeTimeValues.forEach((value: any, attribute: string) => {
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

	updateSimulation(delta: number, respawn: boolean, reset: boolean, kill: boolean) {
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

                this.attributesoverLifeTime.forEach((value: any, attribute: string) => {
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

	InitializeParticles(mesh: THREE.Mesh, amount: number) {
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
		const rotationAttribute= 	new THREE.InstancedBufferAttribute( matrixArray[2], 3 )

		instancedGeometry.setAttribute('aInstanceColor',colorAttribute)
		instancedGeometry.setAttribute('aInstanceEmissive',emissiveAttribute)
		instancedGeometry.setAttribute('opacity1',opacityAttribute)
		instancedGeometry.setAttribute( 'boxPosition', boxPositionAttribute);
		instancedGeometry.setAttribute( 'boxSize',boxSizeAttribute );
		instancedGeometry.setAttribute( 'rotation', rotationAttribute);
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
		this.properties.set("rotation", { array: matrixArray[2], attribute: rotationAttribute})
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
        'vec4 diffuseColor = vec4( vInstanceColor/255.0, vOpacity );',
        )}`
        shader.fragmentShader = `
          varying vec3 vInstanceEmissive;
          ${shader.fragmentShader.replace(
        'vec3 totalEmissiveRadiance = emissive;',
        'vec3 totalEmissiveRadiance = vInstanceEmissive/255.0; ',
        )}`
        };
		this.instance.instanceCount=0
		const instaneMesh = new THREE.Mesh(
			instancedGeometry,
			instanceMaterial
		)
        return instaneMesh;
	}

    startPS(){
        const	lifeTime=this.properties.get("lifeTime").array;
        const max=this.properties.get("sourceValues").get("maxLifeTime");
        const sourceValues = this.properties.get("sourceValues");
        const col=sourceValues.get("color");
        const collArr =this.properties.get("color").array;
        const emm=sourceValues.get("emission");
        const emmArr =this.properties.get("emission").array;
        const op=sourceValues.get("opacity");
        const opArr =this.properties.get("opacity").array;

        for (let i =0;i<this.amount;i++){
            const index=i*3
            opArr[i]=op.values[0]
            for (let j=0;j<3;j++){
                collArr[index+j]=col.values[j]
                emmArr[index+j]=emm.values[j]
            }
            if(col.random==true){
                for(let j=0; j<3; j++) collArr[index+j]+=range(0,1,col.minRange,col.maxRange,Math.random());
            }
            if(emm.random==true){
                for(let j=0; j<3; j++) emmArr[index+j]+=range(0,1,emm.minRange,emm.maxRange,Math.random());
            }
            lifeTime[i*2]=0
            lifeTime[(i*2)+1]=max.values
            if(max.random==true){
                lifeTime[(i*2)+1]+=range(0,1,max.minRange,max.maxRange,Math.random())
            }
        }
        this.instance.instanceCount=this.burstCount
    }
}