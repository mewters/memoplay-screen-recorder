export class AudioWaveService {
    audioStream: MediaStream;
    canvasWidth: number;
    canvasHeight: number;
    analyser: AnalyserNode;
    bufferLength: number;
    dataArray: Uint8Array;

    constructor(
        audioStream: MediaStream,
        canvasWidth = 100,
        canvasHeight = 100
    ) {
        this.audioStream = audioStream;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        const audioCtx = new AudioContext();
        this.analyser = audioCtx.createAnalyser();

        const source = audioCtx.createMediaStreamSource(audioStream);

        source.connect(this.analyser);

        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }

    getBars(): { x: number; y: number; width: number; height: number }[] {
        this.analyser.getByteFrequencyData(this.dataArray);

        const width = (this.canvasWidth / this.bufferLength) * 2.5,
            bars = [];

        let x = 0,
            y = 0,
            height = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            height = this.dataArray[i] / 2;
            y = this.canvasHeight - height / 2;
            // canvasCtx.fillStyle = 'rgb(50, ' + (barHeight + 100) + ',50)';
            // canvasCtx.fillRect(x, this.canvasHeight - barHeight / 2, barWidth, barHeight);
            bars.push({
                x,
                y,
                width,
                height,
            });

            x += width + 1;
        }

        return bars;
    }
}
