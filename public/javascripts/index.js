var saveBtn = document.getElementById('save');
var div = document.getElementById("div1");
var video;
let options = {
    inputs: 34,
    outputs: 2,
    task: 'classification',
    debug: true
}
let nn =  ml5.neuralNetwork(options);
let targetLabel;
let poseNet;

saveBtn.onclick = function (){
    nn.saveData();
}

async function start(){
    for (const dir in dirs) {
         await  new Promise (resolve => setTimeout(resolve,10000))
         addVid(`/images/${dir}/${dirs[dir]}`);
         targetLabel = dir;
    }
}
 
 function addVid(srcStr){
        video = document.createElement('video');
        video.src =srcStr ;
        video.autoplay = true;
        video.muted = true;
        video.height = 400;
        video.width = 400;
        video.crossOrigin = 'anonymous';
        div.appendChild(video)

        poseNet = ml5.poseNet(video,modelReady);
}

async function modelReady() {
    console.log('posenet ready');
    await poseNet.on('pose', gotPoses);
    
}

function gotPoses(results) {
    poses = results;
    console.log(video.ended,video.src);
    
    if (poses.length > 0 && !video.ended) {
        // console.log(poses);
        pose = poses[0].pose;
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        target = [targetLabel];
        nn.addData(inputs, target);
    }
}

start();