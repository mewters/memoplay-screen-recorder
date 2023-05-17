import { useEffect, useMemo, useState } from 'react';
import { ipcRenderer } from 'electron';
import { FileService } from '../../services/FileService';
import { RecorderService } from '../../services/RecorderService';
import { UserMediaService } from '../../services/UserMediaService';
import useLocalStorage from '../useLocalStorage.hook';
import useTimeCounter from '../useTimeCounter.hook';
import { LocalStorage } from '../../services/StorageService';

export default function useIndex() {
    const [isRecording, setIsRecording] = useState(false),
        [isRecordingPaused, setIsRecordingPaused] = useState(false),
        [folder, setFolder] = useLocalStorage('folderName', ''),
        [fileName, setFileName] = useState(''),
        [fileType, setFileType] = useLocalStorage('fileType', 'webm'),
        [hasTime, setHasTime] = useLocalStorage('hasTimeOnFileName', true),
        [audioSourceId, setAudioSourceId] = useLocalStorage(
            'audioSourceId',
            '-0'
        ),
        [videoSourceId, setVideoSourceId] = useLocalStorage(
            'videoSourceId',
            '-0'
        ),
        [cameraSourceId, setCameraSourceId] = useLocalStorage(
            'cameraSourceId',
            '-0'
        ),
        [audioSource, setAudioSource] = useState<MediaStream>(),
        [videoSource, setVideoSource] = useState<MediaStream>(),
        [cameraSource, setCameraSource] = useState<MediaStream>(),
        [audioSourceList, setAudioSourceList] = useState<
            MediaDeviceInfo[] | null
        >(null),
        [videoSourceList, setVideoSourceList] = useState<{
            windowSources: Electron.DesktopCapturerSource[];
            screenSources: Electron.DesktopCapturerSource[];
        } | null>(null),
        [cameraSourceList, setCameraSourceList] = useState<
            MediaDeviceInfo[] | null
        >(null),
        fileTypeList = useMemo(
            () => [
                {
                    label: 'WebM',
                    value: 'webm',
                },
                {
                    label: 'MP4',
                    value: 'mp4',
                },
            ],
            []
        ),
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
            UserMediaService.listCameraSources().then(setCameraSourceList);
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

    useEffect(() => {
        selectCameraSource(cameraSourceId);
    }, [cameraSourceList, cameraSourceId]);

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

    function selectCameraSource(sourceId: string) {
        if (cameraSourceList && cameraSourceList.length) {
            const source = cameraSourceList.find(
                (source) => source.deviceId === sourceId
            );

            if (source) {
                UserMediaService.getCameraStream(source)
                    .then(setCameraSource)
                    .catch((_error) => {
                        setCameraSourceId('-0');
                    });
            } else {
                setCameraSourceId('-0');
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
                    fileType = LocalStorage.get('fileType', 'webm'),
                    fullFileName = `${fileName}${
                        hasTime ? Date.now().toString() : ''
                    }.${fileType}`;

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
        fileTypeList,
        fileType,
        setFileType,
        fileName,
        setFileName,
        hasTime,
        setHasTime,
        audioSourceId,
        videoSourceId,
        cameraSourceId,
        setAudioSourceId,
        setVideoSourceId,
        setCameraSourceId,
        audioSourceList,
        videoSourceList,
        cameraSourceList,
        stopTimer,
        audioSource,
        videoSource,
        cameraSource,
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
