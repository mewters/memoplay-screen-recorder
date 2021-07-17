declare module 'fix-webm-duration' {
    export default ysFixWebmDuration;
}

declare const ysFixWebmDuration: (
    videoBlob: Blob,
    duration: number,
    callback: (fixedBlob: Blob) => void
) => {};
