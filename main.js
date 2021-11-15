const { app, dialog, ipcMain, BrowserWindow, Menu } = require('electron');
const path = require('path');

console.log(path.join(__dirname, 'preload.js'));

function createWindow() {
	Menu.setApplicationMenu(null);
	const mainWindow = new BrowserWindow({
		width: 450,
		height: 600,
		resizable: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js")
		}
	});
	mainWindow.loadFile(path.join(__dirname, "calc.html"));
}
app.whenReady().then(() => {
	createWindow();
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('openFile', (e) => dialog.showOpenDialog({
	title: 'Open File',
	properties: ['openFile'],
	filters: [{ name: 'Calculator Log', extensions: ['calc'] }]
}));

ipcMain.handle('saveFile', (e) => dialog.showSaveDialog({
	title: 'Save File',
	properties: ['createDirectory', 'showOverwriteConfirmation'],
	filters: [{ name: 'Calculator Log', extensions: ['calc'] }]
}));
