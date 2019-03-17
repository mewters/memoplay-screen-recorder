import React, { Component } from 'react';

class TimeCounter extends Component{
    state = {
        totalSeconds: 0
    }

    constructor(props){
        super(props);
        this.timer = null;
    }

    start(){
        this.timer = setInterval(() => this.increment(), 1000);
    }

    stop(){
        clearInterval(this.timer);
    }

    reset(){
        this.setState({
            totalSeconds: 0
        });
    }

    increment(){
        this.setState(({totalSeconds}) => ({totalSeconds: totalSeconds + 1}));
    }

    numberFormat(number){
        return ('00' + number).slice(-2);
    }

    getTime(){
        const {totalSeconds} = this.state;

        const hours = Math.floor(totalSeconds /3600),
            minutes = Math.floor((totalSeconds - hours*3600)/60),
            seconds = totalSeconds - (hours*3600 + minutes*60);

        return {seconds, minutes, hours};
    }

    render(){
        const {seconds, minutes, hours} = this.getTime();
        return (
            <div className="time-counter" >
                <span>{hours}:{this.numberFormat(minutes)}:{this.numberFormat(seconds)}</span>
            </div>
        );
    }
}

export default TimeCounter;