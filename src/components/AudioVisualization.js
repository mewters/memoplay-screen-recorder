import React, { Component } from 'react';

import { UserMediaService } from './../services/UserMediaService';

class AudioVisualization extends Component{
    static defaultProps = {
        audioDevice: null
    }

    constructor(props){
        super(props);
        this.canvas = React.createRef();
        this.canDraw = false;
    }

    async componentDidUpdate(){
        if(this.props.audioDevice){
            this.start();
        }else{
            this.stop();
        }
    }

    async componentDidMount(){
        this.canvasCtx = this.canvas.current.getContext('2d');
        if(this.props.audioDevice){
            this.start();
        }
    }
 
    start(){
        this.startAudio();
        this.startCanvas();
        this.canDraw = true;
        this.draw();
    }

    stop(){
        this.canDraw = false;
        this.clearCanvas();
    }

    async startAudio(){
        if(this.props.audioDevice){
            this.audioStream = await UserMediaService.getAudio(this.props.audioDevice);
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
            analyser = audioCtx.createAnalyser(),
            source = audioCtx.createMediaStreamSource(this.audioStream);
        
            source.connect(analyser);

            analyser.fftSize = 256;
            this.analyser = analyser;
            this.bufferLength = analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
        }
    }

    startCanvas(){
        const canvas = this.canvas.current;
        canvas.width = this.props.width || 100;
        canvas.height = this.props.height || 100;
    }

    
    clearCanvas(){
        const canvas = this.canvas.current,
            {width, height} = canvas;
        this.canvasCtx.clearRect(0, 0, width, height);
    }

    draw() {
        if(this.canDraw){
            const canvas = this.canvas.current,
                {width, height} = canvas,
                {canvasCtx, bufferLength, dataArray, analyser} = this;
            
            this.clearCanvas();

            requestAnimationFrame(this.draw.bind(this));

            if(!this.audioStream){
                return false;
            }

    
            analyser.getByteFrequencyData(dataArray);
    
            /*canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            canvasCtx.fillRect(0, 0, width, height);*/

            const barWidth = (width / bufferLength) * 2.5;
            let barHeight,
            x = 0;

            for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i]/2;
        
                canvasCtx.fillStyle = 'rgb(50, ' + (barHeight + 100) + ',50)';
                canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight);
        
                x += barWidth + 1;
            }
            

           /*const barWidth = width;
           let barHeight;

           for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i]/2;

                var grad1 = canvasCtx.createLinearGradient(0, height * .2, 0, height);
                grad1.addColorStop(0.2, '#f15a47'); //red
                grad1.addColorStop(0.5, '#f2ee47'); // yellow
                grad1.addColorStop(1, '#389f47'); // green

                canvasCtx.fillStyle = grad1;
       
                //canvasCtx.fillStyle = 'rgb(50, ' + (barHeight + 100) + ',50)';
                canvasCtx.fillRect(0, height - barHeight / 2, barWidth, barHeight);
           }*/
        }


    }

    render(){
        return (
            <div>
                <canvas ref={this.canvas} height={50} width={100} />
            </div>
        )
    }
}

export default AudioVisualization;