const require = window.require;

export const RecorderService = {
    recorder: null,
    blobs: [],
    start(stream){
        if(!RecorderService.recorder){
            RecorderService.recorder = new MediaRecorder(stream);
            RecorderService.blobs = [];

            RecorderService.recorder.ondataavailable = function(event){
                RecorderService.blobs.push(event.data);
            }

            RecorderService.recorder.start();
        }
    },
    async stop(){
        return new Promise((resolve) =>  {
            if(RecorderService.recorder && RecorderService.recorder.state !== null){
                RecorderService.recorder.onstop = function(){
                    RecorderService.toArrayBuffer(new Blob(RecorderService.blobs, {type: 'video/webm'}), function(arrayBuffer){
                        const buffer = RecorderService.toBuffer(arrayBuffer);
                        resolve(buffer);
                    })
                    RecorderService.recorder = null;
                }
                RecorderService.recorder.stop();
            }
        })
    },
    pause(){
        if(RecorderService.recorder && RecorderService.recorder.state === 'recording'){
            RecorderService.recorder.pause();
        }
    },
    resume(){
        if(RecorderService.recorder && RecorderService.recorder.state === 'paused'){
            RecorderService.recorder.resume();
        }
    },
    toArrayBuffer(blob, callback){
		let fileReader = new FileReader();
		fileReader.onload = function(){
			let arrayBuffer = this.result;
			callback(arrayBuffer);
		}
		fileReader.readAsArrayBuffer(blob);
	},
	toBuffer(arrayBuffer){
		let buffer = new Buffer(arrayBuffer.byteLength);
		let arr = new Uint8Array(arrayBuffer)
		for(let i = 0; i < arr.byteLength; i++){
			buffer[i] = arr[i];
		}
		return buffer;
	}
};