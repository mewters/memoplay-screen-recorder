(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,a){e.exports=a(27)},19:function(e,t,a){},22:function(e,t,a){},27:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(12),o=a.n(c),i=(a(19),a(1)),s=a.n(i),u=a(2),l=a(3),d=a(4),f=a(6),h=a(5),m=a(7),p=(a(22),{getVideo:function(){var e=Object(u.a)(s.a.mark(function e(t){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",navigator.mediaDevices.getUserMedia({audio:!1,video:{mandatory:{chromeMediaSource:"desktop",chromeMediaSourceId:t.id,minWidth:1280,maxWidth:1920,minHeight:720,maxHeight:1080}}}).then(p.handleStream).catch(p.handleUserMediaError));case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),getAudio:function(){var e=Object(u.a)(s.a.mark(function e(){var t,a,n=arguments;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:null,a=!0,t&&(a={deviceId:t.deviceId}),e.abrupt("return",navigator.mediaDevices.getUserMedia({audio:a,video:!1}).then(p.handleStream).catch(p.handleUserMediaError));case 4:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),handleStream:function(){var e=Object(u.a)(s.a.mark(function e(t){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",t);case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),handleUserMediaError:function(){var e=Object(u.a)(s.a.mark(function e(t){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:throw Error(t);case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()}),v=a(8),g=(0,window.require)("fs"),b={save:function(e,t,a){return new Promise(function(n,r){var c="".concat(t,"/").concat(a);g.writeFile(c,e,function(e){e?r(e):(n(c),console.log(c))})})}},S=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(f.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(r)))).state={audioSources:[],selectedSource:{}},a._handleChange=function(e){var t=a.state.audioSources.find(function(t){return t.deviceId===e.target.value});a.selectSource(t)},a.selectSource=function(e){e&&(a.setState({selectedSource:e}),localStorage.setItem("_audio_source",e.deviceId),a.props.onSelect(e))},a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){this.getSources()}},{key:"getSources",value:function(){var e=Object(u.a)(s.a.mark(function e(){var t,a,n=this;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,navigator.mediaDevices.enumerateDevices();case 2:return t=e.sent,a=t.filter(function(e){return"audioinput"===e.kind}),this.setState({audioSources:a},function(){n._loadFromStorage()}),e.abrupt("return",a);case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"_loadFromStorage",value:function(){var e=localStorage.getItem("_audio_source"),t=this.state.audioSources.find(function(t){return t.deviceId===e});t?this.selectSource(t):this.selectSource(this.state.audioSources[0])}},{key:"render",value:function(){var e=this.state;return r.a.createElement("div",null,r.a.createElement("div",null,"Audio input source"),r.a.createElement("select",{value:e.selectedSource.deviceId,onChange:this._handleChange,className:"settings-select"},e.audioSources.map(function(e){return r.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)})))}}]),t}(n.Component);S.defaultProps={onSelect:function(){}};var w=S,y=a(9),k=(0,window.require)("electron").desktopCapturer,E=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(f.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(r)))).state={screenSources:[],windowSources:[],selectedSource:{}},a._handleChange=function(e){var t=a.state,n=t.screenSources,r=t.windowSources,c=[].concat(Object(y.a)(n),Object(y.a)(r)).find(function(t){return t.id===e.target.value});a.selectSource(c)},a.selectSource=function(e){e&&(a.setState({selectedSource:e}),localStorage.setItem("_video_source",e.id),a.props.onSelect(e))},a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){this.getSources()}},{key:"getSources",value:function(){var e=this;k.getSources({types:["window","screen"]},function(t,a){var n=a.filter(function(e){return e.id.includes("window")}),r=a.filter(function(e){return e.id.includes("screen")});e.setState({windowSources:n,screenSources:r},function(){e._loadFromStorage()})})}},{key:"_loadFromStorage",value:function(){var e=this.state,t=e.screenSources,a=e.windowSources,n=localStorage.getItem("_video_source"),r=[].concat(Object(y.a)(t),Object(y.a)(a)).find(function(e){return e.id===n});r?this.selectSource(r):this.selectSource(t[0])}},{key:"render",value:function(){var e=this.state;return r.a.createElement("div",null,r.a.createElement("div",null,"Video input  source"),r.a.createElement("select",{value:e.selectedSource.id,onChange:this._handleChange,className:"settings-select"},r.a.createElement("option",null,"-- SCREENS --"),e.screenSources.map(function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)}),r.a.createElement("option",null,"-- WINDOWS --"),e.windowSources.map(function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)})))}}]),t}(n.Component);E.defaultProps={onSelect:function(){}};var O=E,j=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(f.a)(this,Object(h.a)(t).call(this,e))).canvas=r.a.createRef(),a.canDraw=!1,a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"componentDidUpdate",value:function(){var e=Object(u.a)(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.props.audioDevice?this.start():this.stop();case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var e=Object(u.a)(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.canvasCtx=this.canvas.current.getContext("2d"),this.props.audioDevice&&this.start();case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"start",value:function(){this.startAudio(),this.startCanvas(),this.canDraw=!0,this.draw()}},{key:"stop",value:function(){this.canDraw=!1,this.clearCanvas()}},{key:"startAudio",value:function(){var e=Object(u.a)(s.a.mark(function e(){var t,a;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.props.audioDevice){e.next=10;break}return e.next=3,p.getAudio(this.props.audioDevice);case 3:this.audioStream=e.sent,t=new(window.AudioContext||window.webkitAudioContext),a=t.createAnalyser(),t.createMediaStreamSource(this.audioStream).connect(a),a.fftSize=256,this.analyser=a,this.bufferLength=a.frequencyBinCount,this.dataArray=new Uint8Array(this.bufferLength);case 10:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"startCanvas",value:function(){var e=this.canvas.current;e.width=this.props.width||100,e.height=this.props.height||100}},{key:"clearCanvas",value:function(){var e=this.canvas.current,t=e.width,a=e.height;this.canvasCtx.clearRect(0,0,t,a)}},{key:"draw",value:function(){if(this.canDraw){var e=this.canvas.current,t=e.width,a=e.height,n=this.canvasCtx,r=this.bufferLength,c=this.dataArray,o=this.analyser;if(this.clearCanvas(),requestAnimationFrame(this.draw.bind(this)),!this.audioStream)return!1;o.getByteFrequencyData(c);for(var i,s=t/r*2.5,u=0,l=0;l<r;l++)i=c[l]/2,n.fillStyle="rgb(50, "+(i+100)+",50)",n.fillRect(u,a-i/2,s,i),u+=s+1}}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("canvas",{ref:this.canvas,height:50,width:100}))}}]),t}(n.Component);j.defaultProps={audioDevice:null};var C=j,x=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(f.a)(this,Object(h.a)(t).call(this,e))).state={totalSeconds:0},a.timer=null,a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"start",value:function(){var e=this;this.timer=setInterval(function(){return e.increment()},1e3)}},{key:"stop",value:function(){clearInterval(this.timer)}},{key:"reset",value:function(){this.setState({totalSeconds:0})}},{key:"increment",value:function(){this.setState(function(e){return{totalSeconds:e.totalSeconds+1}})}},{key:"numberFormat",value:function(e){return("00"+e).slice(-2)}},{key:"getTime",value:function(){var e=this.state.totalSeconds,t=Math.floor(e/3600),a=Math.floor((e-3600*t)/60);return{seconds:e-(3600*t+60*a),minutes:a,hours:t}}},{key:"render",value:function(){var e=this.getTime(),t=e.seconds,a=e.minutes,n=e.hours;return r.a.createElement("div",{className:"time-counter"},r.a.createElement("span",null,n,":",this.numberFormat(a),":",this.numberFormat(t)))}}]),t}(n.Component),R=a(13),A=(0,window.require)("electron").remote,N=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(f.a)(this,Object(h.a)(t).call(this,e))).state={folder:"",filename:"",hasTime:!1,format:""},a.selectFolder=Object(u.a)(s.a.mark(function e(){var t;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:(t=A.dialog.showOpenDialog({properties:["openDirectory"]}))&&(a.setState({folder:t[0]}),localStorage.setItem("_filepath_folder",t[0]));case 2:case"end":return e.stop()}},e)})),a.handleChange=function(e){var t=e.target,n=t.name,r="checkbox"===t.type?t.checked:t.value;a.setState(Object(R.a)({},n,r)),localStorage.setItem("_filepath_".concat(n),r)},a.formatList=["mp4","avi"],a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=localStorage.getItem("_filepath_folder")||"",t=localStorage.getItem("_filepath_format")||"webm",a="true"===localStorage.getItem("_filepath_hasTime");this.setState({folder:e,format:t,hasTime:a})}},{key:"render",value:function(){var e=this.state,t=e.folder,a=e.filename,n=e.format,c=e.hasTime;return r.a.createElement("div",{className:"save-file-path"},r.a.createElement("input",{name:"folder",type:"text",onClick:this.selectFolder,value:t,placeholder:"folder",readOnly:!0}),r.a.createElement("input",{name:"filename",type:"text",onChange:this.handleChange,value:a,placeholder:"file name"}),r.a.createElement("select",{name:"format",onChange:this.handleChange,value:n},r.a.createElement("option",{value:"webm"},"webm (default)"),this.formatList.map(function(e){return r.a.createElement("option",{value:e},e)})),r.a.createElement("label",null,r.a.createElement("input",{name:"hasTime",type:"checkbox",onChange:this.handleChange,checked:c}),"Time"))}}]),t}(n.Component),D=(0,window.require)("electron"),_=D.ipcRenderer,I=D.remote,T=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(f.a)(this,Object(h.a)(t).call(this,e))).state={isRecording:!1,isPaused:!1,canRecordSystemAudio:!1,videoTarget:null,audioTarget:null,systemAudioTarget:null,isLoading:!1},a.onVideoSourceSelect=function(){var e=Object(u.a)(s.a.mark(function e(t){var n;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a.setState({videoTarget:t}),n=a.video.current,p.getVideo(t).then(function(e){console.log(t,e),n.srcObject=e,n.muted=!0,n.onloadedmetadata=function(e){return n.play()}}).catch(function(){var e=a.videoSourceList.current;e.selectSource(e.state.screenSources[0])});case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.onAudioSourceSelect=function(){var e=Object(u.a)(s.a.mark(function e(t){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a.setState({audioTarget:t}),p.getAudio(t).then(function(e){console.log(t,e)}).catch(function(){var e=a.audioSourceList.current;e.selectSource(e.state.audioSources[0])});case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.onRecordSystemAudioChange=function(){var e=Object(u.a)(s.a.mark(function e(t){var n,r;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.currentTarget.checked,r=!1,!n){e.next=6;break}return e.next=5,p.getAudio();case 5:r=e.sent;case 6:a.setState({canRecordSystemAudio:n,systemAudioTarget:r});case 7:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.start=Object(u.a)(s.a.mark(function e(){var t,n,r,c,o,i,u,l;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=a.savefilepath.current,!a.state.isLoading){e.next=3;break}return e.abrupt("return",!1);case 3:if(t.state.folder){e.next=7;break}return I.dialog.showMessageBox({message:"Select a folder to save the file"}),a.savefilepath.current.selectFolder(),e.abrupt("return",!1);case 7:if(n=a.state,r=n.videoTarget,c=n.audioTarget,o=n.isRecording,n.canRecordSystemAudio,n.systemAudioTarget,i=a.video.current.srcObject,!r||o){e.next=19;break}if(!c){e.next=15;break}return e.next=12,p.getAudio(c);case 12:u=e.sent,l=u.getAudioTracks(),i.addTrack(l[0]);case 15:v.a.start(i),a.setState({isRecording:!0,isPaused:!1}),a.timeCounter.current.start(),_.send("win:start");case 19:case"end":return e.stop()}},e)})),a.pause=Object(u.a)(s.a.mark(function e(){var t,n,r;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=a.state,n=t.isRecording,r=t.isPaused,n&&!r&&(v.a.pause(),a.setState({isRecording:!0,isPaused:!0}),a.timeCounter.current.stop());case 2:case"end":return e.stop()}},e)})),a.resume=Object(u.a)(s.a.mark(function e(){var t,n,r;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=a.state,n=t.isRecording,r=t.isPaused,n&&r&&(v.a.resume(),a.setState({isRecording:!0,isPaused:!1}),a.timeCounter.current.start());case 2:case"end":return e.stop()}},e)})),a.stop=Object(u.a)(s.a.mark(function e(){var t;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!a.state.isRecording){e.next=10;break}return e.next=4,v.a.stop();case 4:return t=e.sent,a.setState({isRecording:!1,isPaused:!1}),a.timeCounter.current.stop(),a.timeCounter.current.reset(),_.send("win:stop"),e.abrupt("return",a.saveFile(t));case 10:case"end":return e.stop()}},e)})),a.saveFile=function(){var e=Object(u.a)(s.a.mark(function e(t){var n,r,c,o,i;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.savefilepath.current,r="".concat(n.state.folder||".","/"),c=n.state.hasTime,o=n.state.format,i="".concat(n.state.filename||Date.now().toString()).concat(c?Date.now().toString():"",".webm"),e.next=4,b.save(t,r,i);case 4:"webm"!==o&&(a.setState({isLoading:!0}),_.send("win:convert-video",{folder:r,fileName:i,type:o})),console.log("save");case 6:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.deleteRecording=Object(u.a)(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!a.state.isRecording){e.next=7;break}return e.next=4,v.a.stop();case 4:a.setState({isRecording:!1,isPaused:!1}),a.timeCounter.current.stop(),a.timeCounter.current.reset();case 7:case"end":return e.stop()}},e)})),a.cancelRecording=Object(u.a)(s.a.mark(function e(){var t;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a.pause(),t={type:"question",buttons:["No","Yes"],defaultId:2,title:"Question",message:"Do you want to delete the current recording?",detail:"it cannot be undone"},I.dialog.showMessageBox(null,t,function(e){1===e?a.deleteRecording():a.resume()});case 3:case"end":return e.stop()}},e)})),a.video=r.a.createRef(),a.timeCounter=r.a.createRef(),a.savefilepath=r.a.createRef(),a.videoSourceList=r.a.createRef(),a.audioSourceList=r.a.createRef(),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.handleShortcuts(),_.on("back:convert-video:complete",function(){e.setState({isLoading:!1})})}},{key:"handleShortcuts",value:function(){var e=this;_.on("play",function(){var t=e.state,a=t.isRecording,n=t.isPaused;a||n?a&&!n?e.pause():e.resume():e.start()}),_.on("stop",function(){e.stop()})}},{key:"controlButtons",value:function(){var e=this.state,t=e.isRecording,a=e.isPaused;return t&&!a?r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{className:"record-control-button",onClick:this.cancelRecording},r.a.createElement("i",{className:"fas fa-trash-alt"}),r.a.createElement("span",null,"Delete")),r.a.createElement("button",{className:"record-control-button",onClick:this.pause},r.a.createElement("i",{className:"fas fa-pause"}),r.a.createElement("span",null,"Pause")),r.a.createElement("button",{className:"record-control-button",onClick:this.stop},r.a.createElement("i",{className:"fas fa-stop"}),r.a.createElement("span",null,"Stop"))):r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{className:"record-control-button",onClick:this.cancelRecording},r.a.createElement("i",{className:"fas fa-trash-alt"}),r.a.createElement("span",null,"Delete")),r.a.createElement("button",{className:"record-control-button",onClick:this.resume},r.a.createElement("i",{className:"fas fa-play"}),r.a.createElement("span",null,"Resume")),r.a.createElement("button",{className:"record-control-button",onClick:this.stop},r.a.createElement("i",{className:"fas fa-stop"}),r.a.createElement("span",null,"Stop")))}},{key:"render",value:function(){var e=this.state,t=e.isRecording,a=e.canRecordSystemAudio,n=e.audioTarget,c=e.isLoading,o="App";return t&&(o+=" is-recording"),r.a.createElement("div",{className:o},r.a.createElement("div",{className:"app-container"},r.a.createElement("video",{className:"video-preview",ref:this.video}),r.a.createElement("div",{className:"audio-visualization-container"},r.a.createElement(C,{height:50,width:100,audioDevice:n})),r.a.createElement("div",{className:"settings-control"},r.a.createElement("div",{className:"settings-sources"},r.a.createElement(O,{ref:this.videoSourceList,onSelect:this.onVideoSourceSelect}),r.a.createElement(w,{ref:this.audioSourceList,onSelect:this.onAudioSourceSelect}),r.a.createElement("label",{style:{display:"none"}},r.a.createElement("input",{disabled:!0,type:"checkbox",checked:a,onChange:this.onRecordSystemAudioChange})," Record System Audio")),r.a.createElement("div",{className:"record-control"},r.a.createElement("button",{className:"record-control-button",onClick:this.start},r.a.createElement("i",{className:"fas fa-circle"}),r.a.createElement("span",null,"Record")))),r.a.createElement("div",{className:"recording-control"},r.a.createElement("div",{className:"time-counter-container"},r.a.createElement(x,{ref:this.timeCounter,isActive:!0})),r.a.createElement("div",{className:"record-control"},this.controlButtons())),r.a.createElement("div",{className:"save-file-container"},r.a.createElement(N,{ref:this.savefilepath}))),r.a.createElement("div",{className:"loading-container"+(c?" is-loading":"")},r.a.createElement("span",null,"Wait . . .")))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(T,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},8:function(e,t,a){"use strict";(function(e){a.d(t,"a",function(){return o});var n=a(1),r=a.n(n),c=a(2),o={recorder:null,blobs:[],start:function(e){o.recorder||(o.recorder=new MediaRecorder(e),o.blobs=[],o.recorder.ondataavailable=function(e){o.blobs.push(e.data)},o.recorder.start())},stop:function(){var e=Object(c.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise(function(e){o.recorder&&null!==o.recorder.state&&(o.recorder.onstop=function(){o.toArrayBuffer(new Blob(o.blobs,{type:"video/webm"}),function(t){var a=o.toBuffer(t);e(a)}),o.recorder=null},o.recorder.stop())}));case 1:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),pause:function(){o.recorder&&"recording"===o.recorder.state&&o.recorder.pause()},resume:function(){o.recorder&&"paused"===o.recorder.state&&o.recorder.resume()},toArrayBuffer:function(e,t){var a=new FileReader;a.onload=function(){var e=this.result;t(e)},a.readAsArrayBuffer(e)},toBuffer:function(t){for(var a=new e(t.byteLength),n=new Uint8Array(t),r=0;r<n.byteLength;r++)a[r]=n[r];return a}}}).call(this,a(23).Buffer)}},[[14,1,2]]]);
//# sourceMappingURL=main.d8d866f9.chunk.js.map