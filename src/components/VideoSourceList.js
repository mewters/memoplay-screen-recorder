import React, {Component} from 'react';

const require = window.require;
const { desktopCapturer } = require('electron');

class VideoSourceList extends Component{

    static defaultProps = {
        onSelect: () => {}
    }

    state = {
        screenSources: [],
        windowSources: [],
        selectedSource: {}
    }

    componentDidMount(){
        this.getSources();
    }

    getSources(){
        desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
            const windowSources = sources.filter(item => item.id.includes('window')),
                screenSources = sources.filter(item => item.id.includes('screen'));

            this.setState({
                windowSources,
                screenSources
            });
        })
    }

    _handleChange = (event) => {
        const selectedSource = this.state.screenSources.find(item => item.id === event.target.value);
        if(selectedSource){
            this.setState({selectedSource});
            this.props.onSelect(selectedSource);
        }
    }

    render(){
        const {state} = this;
        return (
            <div>
                <div>Screens</div>
                <select value={state.selectedSource.id} onChange={(this._handleChange)} >
                    <option></option>
                    {
                        state.screenSources.map(item => <option key={item.id} value={item.id} >{item.name}</option>)
                    }
                </select>
                {/*
                <ul>
                    {
                        state.screenSources.map(item => <VideoSourceListItem key={item.id} selectedSource={state.selectedSource} onSelect={this.onSourceSelect} item={item} />)
                    }
                </ul>
                
                <hr />

                {!state.selectedSource ? '' : <img src={state.selectedSource.thumbnail.toDataURL()} />}
                <div>Windows</div>
                <ul>
                    {
                        state.windowSources.map(item => <VideoSourceListItem key={item.id} selectedSource={state.selectedSource} onSelect={this.onSourceSelect} item={item} />)
                    }
                </ul>
                
                */}
                
            </div>
        )
    }
}

function VideoSourceListItem(props){
    const { item, selectedSource } = props;
    let classes = '';

    if(selectedSource && item.id === selectedSource.id){
        classes += 'is-selected';
    }
    return (
        <li onClick={() => props.onSelect(item)} className={classes} >
            <img src={item.thumbnail.toDataURL()} />
            <div>{item.name}</div>
        </li>
    );
}

export default VideoSourceList;