import React, { Component } from 'react';
import './App.css';

import { UserMediaService } from './services/UserMediaService';
import { RecorderService } from './services/RecorderService';
import { FileService } from './services/FileService';

import AudioSourceList from './components/AudioSourceList';
import VideoSourceList from './components/VideoSourceList';
import AudioVisualization from './components/AudioVisualization';
import TimeCounter from './components/TimeCounter';
import SaveFilepath from './components/SaveFilepath';

const require = window.require;
const { ipcRenderer, remote } = require('electron');
// https://zhirzh.github.io/2017/09/02/mediarecorder/

class App extends Component { 

  state = {
    isRecording: false,
    isPaused: false,
    canRecordSystemAudio: false,
    videoTarget: null,
    audioTarget: null,
    systemAudioTarget: null
  }

  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.timeCounter = React.createRef();
    this.savefilepath = React.createRef();
  }

  componentDidMount(){
    this.handleShortcuts();
  }

  handleShortcuts(){
    ipcRenderer.on('play', ()=> {
      const {isRecording, isPaused} = this.state;
      if(!isRecording && !isPaused){
        this.start();
      }else if(isRecording && !isPaused){
        this.pause();
      }else{
        this.resume();
      }
    });
    ipcRenderer.on('stop', ()=> {
      this.stop();
    });
  }

  onVideoSourceSelect = async (source) => {
    this.setState({videoTarget: source});
    const video = this.video.current,
      stream = await UserMediaService.getVideo(source);
    console.log(source)
    video.srcObject = stream;
    video.muted = true;
    video.onloadedmetadata = (e) => video.play();
  }

  onAudioSourceSelect = async (source) => {
    this.setState({audioTarget: source});
    console.log(source)
  }

  onRecordSystemAudioChange = async (event) => {
    const canRecordSystemAudio = event.currentTarget.checked;
    let systemAudioTarget = false;
    if(canRecordSystemAudio){
      systemAudioTarget = await UserMediaService.getAudio();
    }
    this.setState({canRecordSystemAudio, systemAudioTarget});
  }

  start = async () => {
    const {videoTarget, isRecording, canRecordSystemAudio, systemAudioTarget} = this.state,
      stream = this.video.current.srcObject;
    if(videoTarget && !isRecording){
      if(canRecordSystemAudio){
        const audioTracks = systemAudioTarget.getAudioTracks();
        stream.addTrack(audioTracks[0]);
      }
      RecorderService.start(stream);
      this.setState({isRecording: true, isPaused: false});
      this.timeCounter.current.start();
      ipcRenderer.send('win:start');
    }
  }

  pause = async () => {
    const {isRecording, isPaused} = this.state;
    if(isRecording && !isPaused){
      RecorderService.pause();
      this.setState({isRecording: true, isPaused: true});
      this.timeCounter.current.stop();
    }
  }

  resume = async () => {
    const {isRecording, isPaused} = this.state;
    if(isRecording && isPaused){
      RecorderService.resume();
      this.setState({isRecording: true, isPaused: false});
      this.timeCounter.current.start();
    }
  }

  stop = async () => {
    const {isRecording} = this.state;
    if(isRecording){
      const buffer = await RecorderService.stop();
      this.setState({isRecording: false, isPaused: false});
      this.timeCounter.current.stop();
      this.timeCounter.current.reset();
      ipcRenderer.send('win:stop');
      return this.saveFile(buffer);
    }
  }

  saveFile = async (buffer) => {
    const savefilepath = this.savefilepath.current;
    const folder = `${savefilepath.state.folder || '.'}/`,
      hasTime = savefilepath.state.hasTime,
      fileName = `${savefilepath.state.filename || Date.now().toString()}${!hasTime ? '' : (Date.now().toString())}.webm`;

    FileService.save(buffer, folder, fileName);
  }

  deleteRecording = async () => {
    const {isRecording} = this.state;
    if(isRecording){
      await RecorderService.stop();
      this.setState({isRecording: false, isPaused: false});
      this.timeCounter.current.stop();
      this.timeCounter.current.reset();
    }
  }

  cancelRecording = async () => {
    this.pause();
    const options = {
      type: 'question',
      buttons: ['No', 'Yes'],
      defaultId: 2,
      title: 'Question',
      message: 'Do you want to delete the current recording?',
      detail: 'it cannot be undone',
    };
    remote.dialog.showMessageBox(null, options, (response) => {
      if(response === 1){ // Yes
        this.deleteRecording();
      }else{
        this.resume();
      }
    })
  }

  controlButtons(){
    const { isRecording, isPaused } = this.state;

    if(isRecording && !isPaused){
      return ([
        <button className="record-control-button" onClick={this.cancelRecording} ><i className="fas fa-trash-alt" /><span>Delete</span></button>,
        <button className="record-control-button" onClick={this.pause} ><i className="fas fa-pause" /><span>Pause</span></button>,
        <button className="record-control-button" onClick={this.stop} ><i className="fas fa-stop" /><span>Stop</span></button>
      ])
    }else{
      return ([
        <button className="record-control-button" onClick={this.cancelRecording} ><i className="fas fa-trash-alt" /><span>Delete</span></button>,
        <button className="record-control-button" onClick={this.resume} ><i className="fas fa-play" /><span>Resume</span></button>,
        <button className="record-control-button" onClick={this.stop} ><i className="fas fa-stop" /><span>Stop</span></button>
      ])
    }
  }


  render() {
    const { isRecording, canRecordSystemAudio, systemAudioTarget } = this.state;
    let appClassName = 'App';
    if(isRecording){
      appClassName += ' is-recording';
    }
    return (
      <div className={appClassName}>
        <div className="app-container" >
          <video className="video-preview" ref={this.video} />
          <div className="audio-visualization-container" >
            <AudioVisualization height={50} width={100} audioStream={systemAudioTarget}  />
          </div>

          <div className="settings-control">
            <div className="settings-sources" >
              <VideoSourceList onSelect={this.onVideoSourceSelect} />
              <AudioSourceList onSelect={this.onAudioSourceSelect} />
              <label>
                <input type="checkbox" checked={canRecordSystemAudio} onChange={this.onRecordSystemAudioChange} /> Record System Audio
              </label>
            </div>
            <div className="record-control" > 
              <button className="record-control-button" onClick={this.start} ><i className="fas fa-circle" /><span>Record</span></button>
            </div>
          </div>

          <div className="recording-control" >
            <div className="time-counter-container" >
              <TimeCounter ref={this.timeCounter} isActive />
            </div>
            <div className="record-control" >
              {this.controlButtons()}
            </div>
          </div>

          <div className="save-file-container" >
              <SaveFilepath ref={this.savefilepath} />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
