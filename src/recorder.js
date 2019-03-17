const require = window.require;

var { desktopCapturer } = require('electron');
var fs = require('fs');

var videoElement = document.querySelector('video');
var listElement = document.querySelector('ul');
var outputElement = document.querySelector('#output');

var Rec = {
	recorder: null,
	blobs: [],
	start(){
		if(this.recorder === null && ScreenManager.selectedSource){
			outputElement.innerHTML = 'Recording . . .';
			navigator.webkitGetUserMedia({
				audio: false,
				video: {
					mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: ScreenManager.selectedSource.id,
                        minWidth: 800,
                        maxWidth: 1280,
                        minHeight: 600,
                        maxHeight: 720
                    }  
				}
			}, this.handleStream, this.handleUserMediaError)
		}
	},
	stop(){
		if(Rec.recorder.state !== null){
			Rec.recorder.onstop = function(){
				videoElement.src = '';
				Rec.toArrayBuffer(new Blob(Rec.blobs, {type: 'video/webm'}), function(arrayBuffer){
					var buffer = Rec.toBuffer(arrayBuffer);
					var fileName = './my-video.webm';
					fs.writeFile(fileName, buffer, function(err){
						if(err){
							outputElement.innerHTML = 'ERROR';
						}else{
							outputElement.innerHTML = 'Saved video: ' + fileName;
							videoElement.src = fileName;
							videoElement.play();
							videoElement.controls = true;
						}
					})
				})
				Rec.recorder = null;
			}

			Rec.recorder.stop();
		}
	},
	handleStream(stream){
		Rec.recorder = new MediaRecorder(stream);
		Rec.blobs = [];
		videoElement.poster = '';
		videoElement.src = URL.createObjectURL(stream);
		Rec.recorder.ondataavailable = function(event){
			Rec.blobs.push(event.data);
		}
		Rec.recorder.start();
	},
	handleUserMediaError(e){
		console.error('handleUserMediaError', e);
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
}


var ScreenManager = {
	sources: [],
	selectedSource: null,
	listScreens(){
		desktopCapturer.getSources({types: ['window', 'screen']}, function(error, sources){
			var template = '';
			ScreenManager.sources = sources;
			sources.forEach(source => {
				template += `<li onclick="ScreenManager.setScreen('${source.id}')" >
								<img src="${source.thumbnail.toDataURL()}" />
								<h3>${source.name}</h3>
							</li>`;
			})
			listElement.innerHTML = template;
		})
	},
	setScreen(sourceId){
		this.selectedSource = this.sources.find(source => source.id === sourceId);
		videoElement.poster = this.selectedSource.thumbnail.toDataURL();
		videoElement.src = '';
		videoElement.controls = false;
	}
}

//ScreenManager.listScreens()