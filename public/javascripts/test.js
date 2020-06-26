var div = document.getElementById("div2");

var video = document.createElement('video');

video.src = '/images/Standing/1.mp4';
video.autoplay = true;
video.muted = true;
video.height = 400;
video.width = 400;
video.crossOrigin = 'anonymous';

div.appendChild(video);

let pose;
const poseNet = ml5.poseNet(video, modelReady);

let options = {
    inputs: 34,
    outputs: 3,
    task: 'classification',
    debug: true
}
let nn = ml5.neuralNetwork(options);

const modelInfo = {
    model: 'models/model.json',
    metadata: 'models/model_meta.json',
    weights: 'models/model.weights.bin',
};

nn.load(modelInfo, nnLoaded);

function nnLoaded() {
    console.log('pose classification ready');
    classifyPose();
}

function classifyPose() {
    if (pose) {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        nn.classify(inputs, gotResult);
    } else {
        setTimeout(classifyPose, 100);
    }
}

function gotResult(error, results) {

    if (results[0].confidence > 0.75) {
    //     poseLabel = results[0].label.toUpperCase();
        console.log(results[0].label);
    }

    classifyPose();
}

function modelReady() {
    console.log('posenet ready');
    poseNet.on('pose', gotPoses);
}



function gotPoses(poses) {
    if (poses.length > 0 && !video.ended) {
        // console.log(poses);
        pose = poses[0].pose;
    }

}