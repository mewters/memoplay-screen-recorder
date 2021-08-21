import { desktopCapturer } from 'electron';

export const UserMediaService = {
    async listVideoSources(): Promise<{
        windowSources: Electron.DesktopCapturerSource[];
        screenSources: Electron.DesktopCapturerSource[];
    }> {
        const sources = await desktopCapturer.getSources({
                types: ['window', 'screen'],
            }),
            windowSources = sources.filter((item) =>
                item.id.includes('window')
            ),
            screenSources = sources.filter((item) =>
                item.id.includes('screen')
            );
        return {
            windowSources,
            screenSources,
        };
    },
    async getVideoStream(
        source: Electron.DesktopCapturerSource
    ): Promise<MediaStream> {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                //@ts-ignore
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    minWidth: 1280,
                    maxWidth: 1920,
                    minHeight: 720,
                    maxHeight: 1080,
                },
            },
        });

        return mediaStream;
    },

    async listAudioSources(): Promise<MediaDeviceInfo[]> {
        const sources = await navigator.mediaDevices.enumerateDevices(),
            audioSources = sources.filter((item) => item.kind === 'audioinput');

        return audioSources;
    },
    async getAudioStream(source: MediaDeviceInfo): Promise<MediaStream> {
        let audio: boolean | { deviceId: string } = true;
        if (source) {
            audio = {
                deviceId: source.deviceId,
            };
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio,
            video: false,
        });

        return mediaStream;
    },
};