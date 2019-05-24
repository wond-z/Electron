const electron = require('electron');
const {ipcMain} = require('electron')
const path = require('path')

const {app} = electron;
const {BrowserWindow} = electron;

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1300,
        height: 700,
        title: 'Wellist',
    });
    win.loadURL(`file://${__dirname}/index.html`);
    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
})



// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg)
//     event.returnValue = 'this is syn'
// })

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg);

    // 收到新消息后创建新窗口
    const modalPath = path.join('file://', __dirname, '/new.html')
    let win = new BrowserWindow({width: 1300, height: 700})
    win.webContents.openDevTools();
    win.webContents.on('did-finish-load', function() {
        win.webContents.send('ping', 'whoooooooh!');
    });
    win.on('close', function () { win = null })
    win.loadURL(modalPath)
    win.show()

    // 主进程给渲染进程回复消息
    // event.sender.send('asynchronous-reply', 'this is asyn reply')
})
