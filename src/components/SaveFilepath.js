import React, { Component } from 'react';

const require = window.require;
const { remote } = require('electron');

class SaveFilepath extends Component{
    state = {
        folder: '',
        filename: '',
        hasTime: false,
        format: ''
    }

    constructor(props){
        super(props);
        this.formatList = ['mp4', 'avi'];
    }

    componentDidMount(){
        const folder = localStorage.getItem('_filepath_folder') || '',
            format = localStorage.getItem('_filepath_format') || 'webm',
            hasTime = localStorage.getItem('_filepath_hasTime') === 'true';
        this.setState({
            folder,
            format,
            hasTime
        })
    }

    selectFolder = async () => {
        const folder = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
        if(folder){
            this.setState({folder: folder[0]});
            localStorage.setItem(`_filepath_folder`, folder[0]);
        }
    }

    handleChange = (event) => {
        const { target } = event,
            {name} = target,
            value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value
        })

        localStorage.setItem(`_filepath_${name}`, value);
    }

    render(){
        const {folder, filename, format, hasTime} = this.state;
        return(
            <div className="save-file-path" >
                <input name="folder" type="text" onClick={this.selectFolder} value={folder} placeholder="folder" readOnly />
                <input name="filename" type="text" onChange={this.handleChange} value={filename} placeholder="file name" />
                <select name="format" onChange={this.handleChange} value={format} >
                    <option value="webm" >webm (default)</option>
                    {
                        this.formatList.map(format => <option key={format} value={format} >{format}</option>)
                    }
                </select>
                <label>
                    <input name="hasTime" type="checkbox" onChange={this.handleChange} checked={hasTime} />
                    Time
                </label>
            </div>
        );
    }
}

export default SaveFilepath;