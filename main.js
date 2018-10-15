// Getting an audio mediastreamtrack and piping it through
// an AudioWorklet processor.

let stream;
let my_worklet;

let start = async () => {
  stream = await navigator.mediaDevices.getUserMedia({audio: true});

  let context = new AudioContext();
  console.log('adding module');
  await context.audioWorklet.addModule('some-processor.js');
  let volume_display = document.getElementById('volume');
  console.log('addModule returned');
  my_worklet = new AudioWorkletNode(context, 'some-processor');
  my_worklet.port.onmessage = (event) => {
    if (event.data.type === 'volume') {
      volume_display.innerText = event.data.volume;
    } else {
      console.log('worklet sent a message: ' + JSON.stringify(event.data));
    }
  };
  my_worklet.port.onmessageerror = (event) => {
    console.log('Error in sending message to worklet:' + event);
  };
  my_worklet.port.postMessage('i am coming');
  let microphone = new MediaStreamAudioSourceNode(context,
                                                  {mediaStream: stream});
  // Learning: Worklet is not triggered unless connected to destination.
  microphone.connect(my_worklet).connect(context.destination);
  /* setTimeout(() => {
    stop();
  }, 1000); */
};

let stop = async() => {
  stream.getAudioTracks()[0].stop();
  my_worklet.port.postMessage('stop');
  console.log('track stopped');
};
