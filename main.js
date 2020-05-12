const { app, BrowserWindow } = require('electron')

function createWindow() {
    // Cria uma janela de navegação.
    let win = new BrowserWindow({
        width: 1024,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        },
        center: true,
        minWidth: 1024,
        minHeight: 768,
        icon: __dirname + "/Assets/Icones/agenda.png"

    })

    // e carregar o index.html do aplicativo.
    win.loadFile('index.html')

    // win.webContents.openDevTools()

    // win.removeMenu();
}

app.whenReady().then(createWindow)