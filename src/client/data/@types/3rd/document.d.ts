export {};

declare global {
    interface Document {
        pictureInPictureElement: HTMLElement;
        exitPictureInPicture: () => Promise<unknown>;
    }

    interface HTMLVideoElement {
        requestPictureInPicture(): Promise<unknown>;
        onenterpictureinpicture(): void;
        onleavepictureinpicture(): void;
    }
}
