import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircle,
    // faEye,
    // faEyeSlash,
    faFolder,
    // faMicrophone,
    // faMicrophoneSlash,
    faPause,
    faPlay,
    faStop,
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

import AudioWaves from '../../components/data-display/AudioWaves/AudioWaves';
import ScreenPreview from '../../components/data-display/ScreenPreview/ScreenPreview';
import useIndex from '../../../data/hooks/pages/useIndex.page';
import TimeDisplay from '../../components/data-display/TimeDisplay/TimeDisplay';
import Select from '../../components/inputs/Select/Select';
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    TextField,
} from '@material-ui/core';
import {
    MainContainer,
    ControlsContainer,
    FileNameContainer,
    PreviewsContainer,
    SourceSelectorContainer,
    ButtonsContainer,
    PageContainer,
} from './index.styled';
import { ControlButton } from '../../components/inputs/ControlButton/ControlButton';

export default function Index() {
    const {
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
        audioSource,
        videoSource,
        cameraSource,
        totalTime,
        startSelectFolder,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        startDeleteRecording,
    } = useIndex();

    return (
        <PageContainer>
            <MainContainer isRecording={isRecording}>
                <PreviewsContainer>
                    <ScreenPreview videoSource={videoSource} />

                    <AudioWaves audioSource={audioSource} />

                    {cameraSourceId !== '-0' && (
                        <ScreenPreview videoSource={cameraSource} />
                    )}
                </PreviewsContainer>

                <SourceSelectorContainer isRecording={isRecording}>
                    {videoSourceList && videoSourceId && (
                        <Select
                            native
                            label={'Video input source'}
                            value={videoSourceId}
                            onChange={(event) =>
                                setVideoSourceId(event.target.value as string)
                            }
                        >
                            <optgroup label="-- SCREENS --">
                                {videoSourceList.screenSources.map((source) => (
                                    <option value={source.id} key={source.id}>
                                        {source.name}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="-- WINDOWS --">
                                {videoSourceList.windowSources.map((source) => (
                                    <option value={source.id} key={source.id}>
                                        {source.name}
                                    </option>
                                ))}
                            </optgroup>
                        </Select>
                    )}

                    {audioSourceList && audioSourceId && (
                        <Select
                            native
                            label={
                                audioSourceList.length
                                    ? 'Audio input source'
                                    : 'No audio input sources'
                            }
                            value={audioSourceId}
                            onChange={(event) =>
                                setAudioSourceId(event.target.value as string)
                            }
                        >
                            {audioSourceList.map((source) => (
                                <option
                                    value={source.deviceId}
                                    key={source.deviceId}
                                >
                                    {source.label}
                                </option>
                            ))}
                        </Select>
                    )}

                    <Select
                        native
                        label={
                            cameraSourceList?.length
                                ? 'Camera input source'
                                : 'No camera input sources'
                        }
                        value={cameraSourceId}
                        onChange={(event) =>
                            setCameraSourceId(event.target.value as string)
                        }
                    >
                        <option value={'-0'}>No Camera</option>
                        {cameraSourceList?.map((source) => (
                            <option
                                value={source.deviceId}
                                key={source.deviceId}
                            >
                                {source.label}
                            </option>
                        ))}
                    </Select>
                </SourceSelectorContainer>

                <ControlsContainer isRecording={isRecording}>
                    {!isRecording ? (
                        <ControlButton
                            title={'Record'}
                            startIcon={<FontAwesomeIcon icon={faCircle} />}
                            onClick={startRecording}
                        />
                    ) : (
                        <>
                            <TimeDisplay time={totalTime} />
                            <ButtonsContainer>
                                <ControlButton
                                    title={'Delete'}
                                    startIcon={
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    }
                                    onClick={startDeleteRecording}
                                />
                                {isRecordingPaused ? (
                                    <ControlButton
                                        title={'Resume'}
                                        startIcon={
                                            <FontAwesomeIcon icon={faPlay} />
                                        }
                                        onClick={resumeRecording}
                                    />
                                ) : (
                                    <ControlButton
                                        title={'Pause'}
                                        startIcon={
                                            <FontAwesomeIcon icon={faPause} />
                                        }
                                        onClick={pauseRecording}
                                    />
                                )}
                                <ControlButton
                                    title={'Stop'}
                                    startIcon={
                                        <FontAwesomeIcon icon={faStop} />
                                    }
                                    onClick={stopRecording}
                                />
                            </ButtonsContainer>
                        </>
                    )}
                </ControlsContainer>
            </MainContainer>
            <FileNameContainer>
                <TextField
                    label={'Folder'}
                    value={folder}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <ControlButton
                                    title={'Change Folder'}
                                    startIcon={
                                        <FontAwesomeIcon icon={faFolder} />
                                    }
                                    onClick={startSelectFolder}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label={'File Name'}
                    value={fileName}
                    onChange={(event) => setFileName(event.target.value)}
                />
                <Select
                    native
                    label={'File Type'}
                    value={fileType}
                    onChange={(event) =>
                        setFileType(event.target.value as string)
                    }
                >
                    {fileTypeList.map((fileType) => (
                        <option value={fileType.value} key={fileType.value}>
                            {fileType.label}
                        </option>
                    ))}
                </Select>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={hasTime}
                                onChange={(event) =>
                                    setHasTime(event.target.checked)
                                }
                            />
                        }
                        label="Time"
                    />
                </FormGroup>
            </FileNameContainer>
        </PageContainer>
    );
}
