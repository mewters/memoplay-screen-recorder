import fs from 'fs';

export const FileService = {
    saveVideo(
        buffer: NodeJS.ArrayBufferView,
        path: string,
        name: string
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const filename = `${path}/${name}`;
            fs.writeFile(filename, buffer, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(filename);
                }
            });
        });
    },
};
