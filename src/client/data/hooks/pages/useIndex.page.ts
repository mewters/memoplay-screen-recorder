import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { FileService } from '../../services/FileService';
import { RecorderService } from '../../services/RecorderService';
import { UserMediaService } from '../../services/UserMediaService';
import useLocalStorage from '../useLocalStorage.hook';
import useTimeCounter from '../useTimeCounter.hook';

export default function useIndex() {
    const [isRecording, setIsRecording] = useState(false),
        [isRecordingPaused, setIsRecordingPaused] = useState(false),
        [folder, setFolder] = useLocalStorage('folderName', ''),
        [fileName, setFileName] = useState(''),
        [hasTime, setHasTime] = useLocalStorage('hasTimeOnFileName', true),
        [audioSourceId, setAudioSourceId] = useLocalStorage(
            'audioSourceId',
            '-0'
        ),
        [videoSourceId, setVideoSourceId] = useLocalStorage(
            'videoSourceId',
            '-0'
        ),
        [audioSource, setAudioSource] = useState<MediaStream>(),
        [videoSource, setVideoSource] = useState<MediaStream>(),
        [audioSourceList, setAudioSourceList] = useState<
            MediaDeviceInfo[] | null
        >(null),
        [videoSourceList, setVideoSourceList] = useState<{
            windowSources: Electron.DesktopCapturerSource[];
            screenSources: Electron.DesktopCapturerSource[];
        } | null>(null),
        {
            totalTime,
            startTimer,
            stopTimer,
            pauseTimer,
            resumeTimer,
        } = useTimeCounter();

    useEffect(() => {
        function updateAudioDevices() {
            UserMediaService.listAudioSources().then(setAudioSourceList);
            UserMediaService.listVideoSources().then(setVideoSourceList);
        }

        updateAudioDevices();

        navigator.mediaDevices.ondevicechange = updateAudioDevices;
    }, []);

    useEffect(() => {
        ipcRenderer.on('play', toggleStartRecording);
        ipcRenderer.on('stop', stopRecording);
        ipcRenderer.on('onSelectFolder', onSelectFolder);
        ipcRenderer.on('onDeleteRecording', deleteRecording);

        return () => {
            ipcRenderer.removeAllListeners('play');
            ipcRenderer.removeAllListeners('stop');
            ipcRenderer.removeAllListeners('onSelectFolder');
            ipcRenderer.removeAllListeners('onDeleteRecording');
        };
    }, [toggleStartRecording, stopRecording, onSelectFolder, deleteRecording]);

    useEffect(() => {
        selectAudioSource(audioSourceId);
    }, [audioSourceList, audioSourceId]);

    useEffect(() => {
        selectVideoSource(videoSourceId);
    }, [videoSourceList, videoSourceId]);

    function selectVideoSource(sourceId: string) {
        if (videoSourceList) {
            const source = [
                ...videoSourceList.windowSources,
                ...videoSourceList.screenSources,
            ].find((source) => source.id === sourceId);

            if (source) {
                UserMediaService.getVideoStream(source).then(setVideoSource);
            } else {
                setVideoSourceId(videoSourceList.screenSources[0].id);
            }
        }
    }

    function selectAudioSource(sourceId: string) {
        if (audioSourceList && audioSourceList.length) {
            const source = audioSourceList.find(
                (source) => source.deviceId === sourceId
            );

            if (source) {
                UserMediaService.getAudioStream(source).then(setAudioSource);
            } else {
                setAudioSourceId(audioSourceList[0].deviceId);
            }
        }
    }

    function startSelectFolder() {
        ipcRenderer.send('startSelectFolder');
    }
    function onSelectFolder(_event: any, folder: string) {
        folder && setFolder(folder);
    }
    function toggleStartRecording() {
        if (!isRecording) {
            startRecording();
        } else {
            if (isRecordingPaused) {
                resumeRecording();
            } else {
                pauseRecording();
            }
        }
    }
    function startRecording() {
        if (!folder) {
            startSelectFolder();
            return;
        }
        if (videoSource && audioSource && !isRecording) {
            videoSource.addTrack(audioSource.getAudioTracks()[0]);
            RecorderService.start(videoSource);
            startTimer();
            setIsRecording(true);
            ipcRenderer.send('win:start');
        }
    }
    function stopRecording() {
        if (isRecording) {
            stopTimer(async (totalTime) => {
                const buffer = await RecorderService.stop(totalTime * 1000),
                    fullFileName = `${fileName}${
                        hasTime ? Date.now().toString() : ''
                    }.webm`;

                await FileService.saveVideo(buffer, folder, fullFileName);
                setIsRecording(false);
                setIsRecordingPaused(false);
                ipcRenderer.send('win:stop');
            });
        }
    }
    function pauseRecording() {
        if (isRecording && !isRecordingPaused) {
            RecorderService.pause();
            pauseTimer();
            setIsRecordingPaused(true);
            ipcRenderer.send('win:pause');
        }
    }
    function resumeRecording() {
        if (isRecording && isRecordingPaused) {
            RecorderService.resume();
            resumeTimer();
            setIsRecordingPaused(false);
            ipcRenderer.send('win:resume');
        }
    }
    function startDeleteRecording() {
        ipcRenderer.send('startDeleteRecording');
    }
    function deleteRecording() {
        if (isRecording) {
            stopTimer(async (totalTime) => {
                await RecorderService.stop(totalTime * 1000);
                setIsRecording(false);
                setIsRecordingPaused(false);
                ipcRenderer.send('win:stop');
            });
        }
    }

    return {
        isRecording,
        isRecordingPaused,
        folder,
        fileName,
        setFileName,
        hasTime,
        setHasTime,
        audioSourceId,
        videoSourceId,
        setAudioSourceId,
        setVideoSourceId,
        audioSourceList,
        videoSourceList,
        stopTimer,
        audioSource,
        videoSource,
        totalTime,
        startTimer,
        pauseTimer,
        resumeTimer,
        startSelectFolder,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        startDeleteRecording,
    };
}
