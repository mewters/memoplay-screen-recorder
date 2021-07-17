import ysFixWebmDuration from 'fix-webm-duration';

interface RecorderServiceInterface {
    recorder: MediaRecorder | null;
    blobs: Blob[];
    start: (stream: MediaStream) => void;
    stop: (duration: number) => Promise<Buffer>;
    pause: () => void;
    resume: () => void;
    toArrayBuffer: (blob: Blob) => Promise<ArrayBuffer>;
    toBuffer: (blob: Blob) => Promise<Buffer>;
    fixWebmDuration: (videoBlob: Blob, duration: number) => Promise<Blob>;
}

export const RecorderService: RecorderServiceInterface = {
    recorder: null,
    blobs: [],
    start(stream: MediaStream) {
        if (!RecorderService.recorder) {
            RecorderService.recorder = new MediaRecorder(stream);
            RecorderService.blobs = [];

            RecorderService.recorder.ondataavailable = function (
                event: BlobEvent
            ) {
                RecorderService.blobs.push(event.data);
            };

            RecorderService.recorder.start();
        }
    },
    async stop(duration): Promise<Buffer> {
        return new Promise((resolve) => {
            if (
                RecorderService.recorder &&
                RecorderService.recorder.state !== null
            ) {
                RecorderService.recorder.onstop = async function () {
                    const videoBlob = new Blob(RecorderService.blobs, {
                            type: 'video/mp4; codecs="avc1.4d002a"',
                        }),
                        fixedBlob = await RecorderService.fixWebmDuration(
                            videoBlob,
                            duration
                        );

                    const buffer = await RecorderService.toBuffer(fixedBlob);
                    resolve(buffer);
                    RecorderService.recorder = null;
                };
                RecorderService.recorder.stop();
            }
        });
    },
    pause() {
        if (
            RecorderService.recorder &&
            RecorderService.recorder.state === 'recording'
        ) {
            RecorderService.recorder.pause();
        }
    },
    resume() {
        if (
            RecorderService.recorder &&
            RecorderService.recorder.state === 'paused'
        ) {
            RecorderService.recorder.resume();
        }
    },
    toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
        return new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = function () {
                let arrayBuffer = this.result as ArrayBuffer;
                resolve(arrayBuffer);
            };
            fileReader.readAsArrayBuffer(blob);
        });
    },
    async toBuffer(blob: Blob): Promise<Buffer> {
        const arrayBuffer = await RecorderService.toArrayBuffer(blob);
        let buffer = Buffer.alloc(arrayBuffer.byteLength);
        let arr = new Uint8Array(arrayBuffer);
        for (let i = 0; i < arr.byteLength; i++) {
            buffer[i] = arr[i];
        }
        return buffer;
    },
    fixWebmDuration(videoBlob: Blob, duration: number): Promise<Blob> {
        return new Promise((resolve) => {
            ysFixWebmDuration(videoBlob, duration, (fixedBlob: Blob) => {
                resolve(fixedBlob);
            });
        });
    },
};
