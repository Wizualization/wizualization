import * as THREE from 'three';
import DynamicTimeWarping from 'dynamic-time-warping';
import { Group } from 'three';
import { prepare } from '@react-three/fiber/dist/declarations/src/core/renderer';

// data is an array of arrays with the x coordinate in 0 and y in 1
function prepareSignature(data:number[][]) {
    //console.log(data)
    var xMean = 0;
    var yMean = 0;
    var diffData = [];
    for (var i = 0; i < data.length; i++) {
        xMean = xMean + data[i][0];
        yMean = yMean + data[i][1];
    }
    xMean = xMean / data.length;
    yMean = yMean / data.length;
    for (var i = 0; i < data.length; i++) {
        diffData[i] = [data[i][0] - xMean, data[i][1] - yMean];
    }
    return diffData;
}

function jointMatrixToVec(joint: any){
    let jointVec = new THREE.Vector3(1,1,1);
    if(typeof(joint) != 'undefined'){
        //jointVec.setFromMatrixPosition(joint['matrix']);
        //jointVec = joint.position;
        jointVec = joint;
    } 
    return(jointVec)
}

function jointsToVecs(ser:any[]){
    //console.log(typeof(ser))
    //console.log(ser)
    //console.log(ser.keys())
    var vecs:any = {
        thumb0: [], 
        index0: [], 
        middle0: [], 
        ring0: [], 
        pinky0: [], 
        thumb1: [], 
        index1: [], 
        middle1: [], 
        ring1: [], 
        pinky1: []
    }
    for(var i = 0; i < ser.length; i++){
        let o = ser[i];
        let thumb0 = jointMatrixToVec(o['thumb0']);
        let index0 = jointMatrixToVec(o['index0']);
        let middle0 = jointMatrixToVec(o['middle0']);
        let ring0 = jointMatrixToVec(o['ring0']);
        let pinky0 = jointMatrixToVec(o['pinky0']);
        let thumb1 = jointMatrixToVec(o['thumb1']);
        let index1 = jointMatrixToVec(o['index1']);
        let middle1 = jointMatrixToVec(o['middle1']);
        let ring1 = jointMatrixToVec(o['ring1']);
        let pinky1 = jointMatrixToVec(o['pinky1']);
        
        vecs.thumb0.push([thumb0.x, thumb0.y])//, thumb0.z],
        vecs.index0.push([index0.x, index0.y])//, index0.z],
        vecs.middle0.push([middle0.x, middle0.y])//, middle0.z],
        vecs.ring0.push([ring0.x, ring0.y])//, ring0.z],
        vecs.pinky0.push([pinky0.x, pinky0.y])//, pinky0.z],
        vecs.thumb1.push([thumb1.x, thumb1.y])//, thumb1.z],
        vecs.index1.push([index1.x, index1.y])//, index1.z],
        vecs.middle1.push([middle1.x, middle1.y])//, middle1.z],
        vecs.ring1.push([ring1.x, ring1.y])//, ring1.z],
        vecs.pinky1.push([pinky1.x, pinky1.y])//, pinky1.z]
    }//)

    return vecs;
    
}

export default function ComputeDTW(ser1: any[], ser2: any[]){
    /* our "ser" series are actually going to be arrays of gesture objects like
    [{"thumb0": {"matrix": [], [...]}}, [...]]
    we only care about the matrices, but we need to convert them to vector3s
    */
    //console.log(ser1)
    const vecs1 = jointsToVecs(ser1);
    const vecs2 = jointsToVecs(ser2);
    //console.log(vecs1);
    /*var distFunc = function( a: any, b: any) {
        return Math.abs( a - b );
    };*/
    var distFunc = function (a:any, b:any) {
        var xDiff = a[0] - b[0];
        var yDiff = a[1] - b[1];
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    var sig1 = {}
    var sig2 = {}
    sig1['thumb0'] = prepareSignature(vecs1.thumb0);
    sig1['index0'] = prepareSignature(vecs1.index0);
    sig1['middle0'] = prepareSignature(vecs1.middle0);
    sig1['ring0'] = prepareSignature(vecs1.ring0);
    sig1['pinky0'] = prepareSignature(vecs1.pinky0);
    sig1['thumb1'] = prepareSignature(vecs1.thumb1);
    sig1['index1'] = prepareSignature(vecs1.index1);
    sig1['middle1'] = prepareSignature(vecs1.middle1);
    sig1['ring1'] = prepareSignature(vecs1.ring1);
    sig1['pinky1'] = prepareSignature(vecs1.pinky1);

    sig2['thumb0'] = prepareSignature(vecs2.thumb0);
    sig2['index0'] = prepareSignature(vecs2.index0);
    sig2['middle0'] = prepareSignature(vecs2.middle0);
    sig2['ring0'] = prepareSignature(vecs2.ring0);
    sig2['pinky0'] = prepareSignature(vecs2.pinky0);
    sig2['thumb1'] = prepareSignature(vecs2.thumb1);
    sig2['index1'] = prepareSignature(vecs2.index1);
    sig2['middle1'] = prepareSignature(vecs2.middle1);
    sig2['ring1'] = prepareSignature(vecs2.ring1);
    sig2['pinky1'] = prepareSignature(vecs2.pinky1);

    //console.log(sig1)
    var dtw = {}
    var dist = {} 
    var path = {}

    dtw['thumb0'] = new DynamicTimeWarping(sig1['thumb0'], sig2['thumb0'], distFunc);
    dtw['index0'] = new DynamicTimeWarping(sig1['index0'], sig2['index0'], distFunc);
    dtw['middle0'] = new DynamicTimeWarping(sig1['middle0'], sig2['middle0'], distFunc);
    dtw['ring0'] = new DynamicTimeWarping(sig1['ring0'], sig2['ring0'], distFunc);
    dtw['pinky0'] = new DynamicTimeWarping(sig1['pinky0'], sig2['pinky0'], distFunc);
    dtw['thumb1'] = new DynamicTimeWarping(sig1['thumb1'], sig2['thumb1'], distFunc);
    dtw['index1'] = new DynamicTimeWarping(sig1['index1'], sig2['index1'], distFunc);
    dtw['middle1'] = new DynamicTimeWarping(sig1['middle1'], sig2['middle1'], distFunc);
    dtw['ring1'] = new DynamicTimeWarping(sig1['ring1'], sig2['ring1'], distFunc);
    dtw['pinky1'] = new DynamicTimeWarping(sig1['pinky1'], sig2['pinky1'], distFunc);

    /*dtw['thumb0'] = new DynamicTimeWarping(vecs1['thumb0'], vecs2['thumb0'], distFunc);
    dtw['index0'] = new DynamicTimeWarping(vecs1['index0'], vecs2['index0'], distFunc);
    dtw['middle0'] = new DynamicTimeWarping(vecs1['middle0'], vecs2['middle0'], distFunc);
    dtw['ring0'] = new DynamicTimeWarping(vecs1['ring0'], vecs2['ring0'], distFunc);
    dtw['pinky0'] = new DynamicTimeWarping(vecs1['pinky0'], vecs2['pinky0'], distFunc);
    dtw['thumb1'] = new DynamicTimeWarping(vecs1['thumb1'], vecs2['thumb1'], distFunc);
    dtw['index1'] = new DynamicTimeWarping(vecs1['index1'], vecs2['index1'], distFunc);
    dtw['middle1'] = new DynamicTimeWarping(vecs1['middle1'], vecs2['middle1'], distFunc);
    dtw['ring1'] = new DynamicTimeWarping(vecs1['ring1'], vecs2['ring1'], distFunc);
    dtw['pinky1'] = new DynamicTimeWarping(vecs1['pinky1'], vecs2['pinky1'], distFunc);*/



    dist['thumb0'] = dtw['thumb0'].getDistance();
    dist['index0'] = dtw['index0'].getDistance();
    dist['middle0'] = dtw['middle0'].getDistance();
    dist['ring0'] = dtw['ring0'].getDistance();
    dist['pinky0'] = dtw['pinky0'].getDistance();
    dist['thumb1'] = dtw['thumb1'].getDistance();
    dist['index1'] = dtw['index1'].getDistance();
    dist['middle1'] = dtw['middle1'].getDistance();
    dist['ring1'] = dtw['ring1'].getDistance();
    dist['pinky1'] = dtw['pinky1'].getDistance();

    path['thumb0'] = dtw['thumb0'].getPath();
    path['index0'] = dtw['index0'].getPath();
    path['middle0'] = dtw['middle0'].getPath();
    path['ring0'] = dtw['ring0'].getPath();
    path['pinky0'] = dtw['pinky0'].getPath();
    path['thumb1'] = dtw['thumb1'].getPath();
    path['index1'] = dtw['index1'].getPath();
    path['middle1'] = dtw['middle1'].getPath();
    path['ring1'] = dtw['ring1'].getPath();
    path['pinky1'] = dtw['pinky1'].getPath();

    return {dtw: dtw, dist: dist, path: path};
}
