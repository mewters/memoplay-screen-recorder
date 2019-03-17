import React, {Component} from 'react';

const require = window.require;

class AudioSourceList extends Component{

    static defaultProps = {
        onSelect: () => {}
    }

    state = {
        audioSources: [],
        selectedSource: {}
    }

    componentDidMount(){
        this.getSources();
    }

    async getSources(){
        const sources = await navigator.mediaDevices.enumerateDevices(),
            audioSources = sources.filter(item => item.kind === 'audioinput');
        this.setState({
            audioSources
        }, () => {
            this._loadFromStorage();
        });
        return audioSources;
    }

    _handleChange = (event) => {
        const selectedSource = this.state.audioSources.find(item => item.deviceId === event.target.value);
        this.selectSource(selectedSource);
    }

    _loadFromStorage(){
        const sourceId = localStorage.getItem('_audio_source'),
            selectedSource = this.state.audioSources.find(item => item.deviceId === sourceId);
        if(selectedSource){
            this.selectSource(selectedSource);
        }else{
            this.selectSource(this.state.audioSources[0]);
        }
    }

    selectSource = (selectedSource) => {
        if(selectedSource){
            this.setState({selectedSource});
            localStorage.setItem('_audio_source', selectedSource.deviceId);
            this.props.onSelect(selectedSource);
        }
    }

    render(){
        const {state} = this;
        return (
            <div>
                <div>Audio input source</div>
                <select disabled value={state.selectedSource.deviceId} onChange={this._handleChange} >
                    {
                        state.audioSources.map(item => <option key={item.deviceId} value={item.deviceId} >{item.label}</option>)
                    }
                </select>
                {/*
                <ul>
                    {
                        state.audioSources.map(item => <AudioSourceListItem key={item.deviceId} selectedSource={state.selectedSource} onSelect={this.onSourceSelect} item={item} />)
                    }
                </ul>
                */}
            </div>
        )
    }
}

function AudioSourceListItem(props){
    const { item, selectedSource } = props,
        cutIndex = item.label.lastIndexOf('('),
        label = item.label.substr(0, cutIndex).trim();
    let classes = '';

    if(selectedSource && item.deviceId === selectedSource.deviceId){
        classes += 'is-selected';
    }

    return (
        <li onClick={() => props.onSelect(item)} className={classes} >
            <div>{label}</div>
        </li>
    );
}

export default AudioSourceList;