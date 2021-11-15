const { contextBridge, ipcRenderer } = require('electron');
const dayjs = require('dayjs');
const fs = require('fs');
contextBridge.exposeInMainWorld('$openFile', async () => {
	const result = await ipcRenderer.invoke('openFile');
	if (result.canceled)
		return null;
	else
		return fs.readFileSync(result.filePaths[0], { encoding: 'utf-8' });
});

contextBridge.exposeInMainWorld('$saveFile', async (text) => {
	const result = await ipcRenderer.invoke('saveFile');
	if (!result.canceled)
		fs.writeFileSync(result.filePath, text, { encoding: 'utf-8' });
});

contextBridge.exposeInMainWorld('$now', () => dayjs().format('YYYY-MM-DD HH:mm:ss'));
