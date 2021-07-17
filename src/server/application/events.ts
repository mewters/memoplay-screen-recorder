import { app, ipcMain, dialog } from 'electron';

app.whenReady().then(() => {
    ipcMain.on('startSelectFolder', async (event) => {
        const { filePaths } = await dialog.showOpenDialog({
                properties: ['openDirectory'],
            }),
            [folder] = filePaths;

        event.reply('onSelectFolder', folder);
    });
    ipcMain.on('startDeleteRecording', async (event) => {
        const options = {
                type: 'question',
                buttons: ['No', 'Yes'],
                defaultId: 2,
                title: 'Question',
                message: 'Do you want to delete the current recording?',
                detail: 'it cannot be undone',
            },
            { response } = await dialog.showMessageBox(options);

        if (response === 1) {
            event.reply('onDeleteRecording');
        }
    });
});
