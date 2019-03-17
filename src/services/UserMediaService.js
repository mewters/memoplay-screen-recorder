export const UserMediaService = {
    async getVideo(source){
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { 
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                minWidth: 1280,
                maxWidth: 1920,
                minHeight: 720,
                maxHeight: 1080,
              }
            }
          })
          .then(UserMediaService.handleStream)
          .catch(UserMediaService.handleUserMediaError)
    },
    async getAudio(source = null){
      let audio = true;
      if(source){
        audio = {
          mandatory: {
            chromeMediaSource: 'desktop',
          }
        };
      }
      return navigator.mediaDevices.getUserMedia({
          audio,
          video: false
        })
        .then(UserMediaService.handleStream)
        .catch(UserMediaService.handleUserMediaError)
    },
    async handleStream(stream){
      return stream;
    },
    async handleUserMediaError(error){
      throw Error(error);
    }
};

