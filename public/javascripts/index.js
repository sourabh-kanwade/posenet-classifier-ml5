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
let saveCounter = 0;

async function start(){
    for (const dir in dirs) {
        for (let i = 0; i < dirs[dir].length; i++) {
            document.getElementById("status").innerHTML = "Loading";
            await  new Promise (resolve => setTimeout(resolve,20000))
            
            console.log(`/images/${dir}/${dirs[dir][i]}`);
            addVid(`/images/${dir}/${dirs[dir][i]}`);
            
        }
         targetLabel = dir;
         ++saveCounter;
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
    // console.log('posenet ready');
    document.getElementById("status").innerHTML = "Processing";
    await poseNet.on('pose', gotPoses);
    
}

function gotPoses(results) {
    poses = results;
    // console.log(video.ended,video.src);
    
    if (poses.length > 0 && !video.ended) {
        console.log(poses);
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
    if(video.ended){
        console.log('video.ended',video.src);
        video.remove();
        if(saveCounter == Object.keys(dirs).length){
            saveCounter++;
            document.getElementById("status").innerHTML = "Done";
            console.log('save');
            nn.saveData();
        }
    }
    
}

start();