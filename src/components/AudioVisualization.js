import React, { Component } from 'react';

import { UserMediaService } from './../services/UserMediaService';

class AudioVisualization extends Component{
    static defaultProps = {
        audioDevice: null
    }

    state = {
        isDrawActive: true
    }

    constructor(props){
        super(props);
        this.canvas = React.createRef();
        this.canDraw = false;
        //this.audioMini = React.createRef();
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

    toggleDrawActive = () => {
        this.setState(({isDrawActive}) => {
            return {isDrawActive: !isDrawActive};
        }, () => {
            this.draw();
        })
    }
 
    start(){
        this.startAudio();
        this.startCanvas();
        this.canDraw = true;
        this.draw();

        //this.getBarValues();
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

    getBarValues(){
        const {bufferLength, dataArray, analyser} = this;

        //requestAnimationFrame(this.getBarValues.bind(this));
        //setTimeout(this.getBarValues.bind(this), 1000/10)

        if(!this.audioStream){
            return false;
        }
        analyser.getByteFrequencyData(dataArray);

        const numArrays = 3,
            numElements = Math.floor(bufferLength / numArrays),
            maxNumber = Math.max(...dataArray),
            arrayList = [];

        for(let i = 0; i < numArrays; i++){
            const number = this.average(dataArray.slice(0, numElements));
            arrayList.push( Math.trunc(((number / maxNumber) || 0 ) * 10) + '0' )  ;
        }
    }

    average(numbers){
        const length = numbers.length,
            values = numbers.reduce((previous, current) => current += previous);
        return values/length;
    }

    draw() {
        if(this.canDraw && this.state.isDrawActive){
            const canvas = this.canvas.current,
                {width, height} = canvas,
                {canvasCtx, bufferLength, dataArray, analyser} = this;
            
            this.clearCanvas();

            requestAnimationFrame(this.draw.bind(this));
            //setTimeout(this.draw.bind(this), 1000/10)


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
        const {state} = this,
            canvasStyle = state.isDrawActive ? {} : {backgroundColor: '#333'};

        return (
            <div>
                {/* <AudioVisualizationMini ref={this.audioMini} /> */}
                <canvas style={canvasStyle} onClick={this.toggleDrawActive} ref={this.canvas} height={50} width={100} />
            </div>
        )
    }
}

class AudioVisualizationMini extends Component{
    state = {
        bar1: 0,
        bar2: 0,
        bar3: 0
    }

    render(){
        const {bar1, bar2, bar3} = this.state,
            a = `bar-height-${bar1}`,
            b = `bar-height-${bar2}`,
            c = `bar-height-${bar3}`;
        return (
            <div className="audio-visualization-mini" >
                <div className="audio-visualization-bar-container" >
                    <div className={"audio-bar " + a} ></div>
                    <div className={"audio-bar " + b} ></div>
                    <div className={"audio-bar " + c} ></div>
                </div>
            </div>
        );
    }
    
}

export default AudioVisualization;