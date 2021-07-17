import React, { useEffect, useRef, useState } from 'react';
import { VideoContainer, VideoStyled } from './ScreenPreview.styled';

interface ScreenPreviewProps {
    videoSource?: MediaStream;
}

const ScreenPreview = (props: ScreenPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement>(null),
        [isPip, setPip] = useState(false);

    useEffect(() => {
        if (props.videoSource && videoRef.current) {
            videoRef.current.srcObject = props.videoSource;
            videoRef.current.onenterpictureinpicture = () => setPip(true);
            videoRef.current.onleavepictureinpicture = () => setPip(false);
        }
    }, [props.videoSource]);

    async function startPIP() {
        if (props.videoSource && videoRef.current) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                videoRef.current.requestPictureInPicture();
            }
        }
    }

    return (
        <VideoContainer onClick={startPIP} isPip={isPip}>
            <VideoStyled muted autoPlay ref={videoRef} />
        </VideoContainer>
    );
};

export default ScreenPreview;
