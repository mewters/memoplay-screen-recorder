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
    systemAudioTarget: null,
    isLoading: false
  }

  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.timeCounter = React.createRef();
    this.savefilepath = React.createRef();
    this.videoSourceList = React.createRef();
    this.audioSourceList = React.createRef();
  }

  componentDidMount(){
    this.handleShortcuts();

    ipcRenderer.on('back:convert-video:complete', () => {
      this.setState({isLoading: false});
    })
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
    ipcRenderer.on('delete', ()=> {
      this.cancelRecording();
    });
  }

  onVideoSourceSelect = async (source) => {
    this.setState({videoTarget: source});
    const video = this.video.current;

    UserMediaService.getVideo(source)
      .then(stream => {
        console.log(source, stream)
        video.srcObject = stream;
        video.muted = true;
        video.onloadedmetadata = (e) => video.play();
      })
      .catch(() => {
        const videoSourceList = this.videoSourceList.current;
        videoSourceList.selectSource(videoSourceList.state.screenSources[0]);
      })
  }

  onAudioSourceSelect = async (source) => {
    this.setState({audioTarget: source});

    UserMediaService.getAudio(source)
      .then(stream => {
        console.log(source, stream)
      })
      .catch(() => {
        const audioSourceList = this.audioSourceList.current;
        audioSourceList.selectSource(audioSourceList.state.audioSources[0]);
      })
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
    const savefilepath = this.savefilepath.current;
    if(this.state.isLoading){
      return false;
    }
    if(!savefilepath.state.folder){
      remote.dialog.showMessageBox({
        message: 'Select a folder to save the file'
      });
      this.savefilepath.current.selectFolder();
      return false;
    }

    const {videoTarget, audioTarget, isRecording, canRecordSystemAudio, systemAudioTarget} = this.state,
      stream = this.video.current.srcObject;
    if(videoTarget && !isRecording){
      if(audioTarget){
        const audioStream = await UserMediaService.getAudio(audioTarget),
          audioTracks = audioStream.getAudioTracks();
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
      ipcRenderer.send('win:pause');
    }
  }

  resume = async () => {
    const {isRecording, isPaused} = this.state;
    if(isRecording && isPaused){
      RecorderService.resume();
      this.setState({isRecording: true, isPaused: false});
      this.timeCounter.current.start();
      ipcRenderer.send('win:resume');
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
      format = savefilepath.state.format,
      fileName = `${savefilepath.state.filename || Date.now().toString()}${!hasTime ? '' : (Date.now().toString())}.webm`;

    await FileService.save(buffer, folder, fileName);
    if(format !== 'webm'){
      this.setState({isLoading: true});
      ipcRenderer.send('win:convert-video', {folder, fileName, type: format});
    }
    console.log('save')
  }

  deleteRecording = async () => {
    const {isRecording} = this.state;
    if(isRecording){
      await RecorderService.stop();
      this.setState({isRecording: false, isPaused: false});
      this.timeCounter.current.stop();
      this.timeCounter.current.reset();
      ipcRenderer.send('win:cancel');
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
      }
    })
  }

  controlButtons(){
    const { isRecording, isPaused } = this.state;

    if(isRecording && !isPaused){
      return (
        <>
          <button className="record-control-button" onClick={this.cancelRecording} ><i className="fas fa-trash-alt" /><span>Delete</span></button>
          <button className="record-control-button" onClick={this.pause} ><i className="fas fa-pause" /><span>Pause</span></button>
          <button className="record-control-button" onClick={this.stop} ><i className="fas fa-stop" /><span>Stop</span></button>
        </>
      )
    }else{
      return (
        <>
          <button className="record-control-button" onClick={this.cancelRecording} ><i className="fas fa-trash-alt" /><span>Delete</span></button>
          <button className="record-control-button" onClick={this.resume} ><i className="fas fa-play" /><span>Resume</span></button>
          <button className="record-control-button" onClick={this.stop} ><i className="fas fa-stop" /><span>Stop</span></button>
        </>
      )
    }
  }


  render() {
    const { isRecording, canRecordSystemAudio, audioTarget, isLoading } = this.state;
    let appClassName = 'App';
    if(isRecording){
      appClassName += ' is-recording';
    }
    return (
      <div className={appClassName}>
        <div className="app-container" >
          <video className="video-preview" ref={this.video} />
          <div className="audio-visualization-container" >
            <AudioVisualization height={50} width={100} audioDevice={audioTarget}  />
          </div>

          <div className="settings-control">
            <div className="settings-sources" >
              <VideoSourceList ref={this.videoSourceList} onSelect={this.onVideoSourceSelect} />
              <AudioSourceList ref={this.audioSourceList} onSelect={this.onAudioSourceSelect} />
              <label style={{'display': 'none'}} >
                <input disabled type="checkbox" checked={canRecordSystemAudio} onChange={this.onRecordSystemAudioChange} /> Record System Audio
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

        <div className={'loading-container' + (isLoading ? ' is-loading' : '')}>
          <span>Wait . . .</span>
        </div>
      </div>
    );
  }
}

export default App;
