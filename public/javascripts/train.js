let options = {
    inputs: 34,
    outputs: 3,
    task: 'classification',
    debug: true
}
let nn = ml5.neuralNetwork(options);
nn.loadData('/data/data.json', dataReady);


function dataReady() {
    nn.normalizeData();
    nn.train({ epochs: 1000 }, finished);
}

function finished() {
    console.log('model trained');
    nn.save();
}