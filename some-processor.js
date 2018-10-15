// An Audio Worklet Processor

class SomeProcessor extends AudioWorkletProcessor {
  constructor() {
    console.log('constructor called');
    super();
    this.count = 0;
    this.stopped = false;
    this.port.postMessage('Processor ready');
    this.volume = null;
    
    this.port.addEventListener('message', (event) => {
      if (event.data === 'stop') {
        console.log('worklet stopping');
        this.stopped = true;
      } else {
        console.log('worklet got a message: ' + event.data);
      }
    }, false);
  }
  process(inputs, outputs, parameters) {
    let input = inputs[0];
    let frame_volume = [];
    for (let channel = 0; channel < input.length; ++channel) {
      // For this application, we don't want to produce output.
      let sum = 0.0;
      for (let i = 0; i < input[channel].length; ++i) {
        sum += input[channel][i] * input[channel][i];
      }
      frame_volume.push(Math.sqrt(sum / input.length) * 1000);
    }
    if (!this.volume) {
      this.volume = frame_volume.slice(0);
    } else {
      for (let i = 0; i < frame_volume.length; ++i) {
        this.volume[i] = this.volume[i] * 0.95 + frame_volume[i] * 0.05;
      }
    }
    this.count++;
    if (this.count % 100 == 0) {
      this.port.postMessage({type: 'volume', volume: this.volume});
    }
    return !this.stopped;
  }
}

registerProcessor('some-processor', SomeProcessor);
console.log('Processor registered');
