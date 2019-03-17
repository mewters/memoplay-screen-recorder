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
        });
        return audioSources;
    }

    _handleChange = (event) => {
        const selectedSource = this.state.audioSources.find(item => item.deviceId === event.target.value);
        if(selectedSource){
            this.setState({selectedSource});
            this.props.onSelect(selectedSource);
        }
    }

    render(){
        const {state} = this;
        return (
            <div>
                <div>Audio input source</div>
                <select value={state.selectedSource.deviceId} onChange={this._handleChange} >
                    <option></option>
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