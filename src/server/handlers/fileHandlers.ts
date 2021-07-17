import path from 'path';
import { app } from 'electron';

const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../assets');

export const FileHandlers = {
    getAssetPath(...paths: string[]): string {
        return path.join(RESOURCES_PATH, ...paths);
    },
};
