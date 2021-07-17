import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import useAnimationFrame from '../../../../data/hooks/useAnimationFrame.hook';
import { AudioWaveService } from '../../../../data/services/AudioWaveService';
import { CanvasStyled, CanvasContainer } from './AudioWaves.styled';

interface AudioWavesProps {
    audioSource?: MediaStream;
}

const AudioWaves = (props: AudioWavesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null),
        [audioWaves, setAudioWaves] = useState<AudioWaveService>(),
        [isWavesActive, setWavesActive] = useState(true);

    useEffect(() => {
        if (props.audioSource && canvasRef.current) {
            setAudioWaves(
                new AudioWaveService(
                    props.audioSource,
                    canvasRef.current.width,
                    canvasRef.current.height
                )
            );
        }
    }, [props.audioSource]);

    useAnimationFrame(
        isWavesActive,
        () => {
            if (audioWaves && canvasRef.current) {
                const canvasContext = canvasRef.current.getContext('2d');
                if (!canvasContext) {
                    return;
                }
                const canvasWidth = canvasRef.current.width,
                    canvasHeight = canvasRef.current.height;

                canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

                const soundBars = audioWaves.getBars();

                soundBars.forEach(({ x, y, width, height }) => {
                    canvasContext.fillStyle = `rgba(113, 255, 111, .7)`;
                    canvasContext.fillRect(x, y, width, height);
                });
            }
        },
        [audioWaves]
    );

    return (
        <CanvasContainer onClick={() => setWavesActive(!isWavesActive)}>
            <CanvasStyled
                width={100}
                height={50}
                ref={canvasRef}
                hidden={!isWavesActive}
            />
        </CanvasContainer>
    );
};

export default AudioWaves;
