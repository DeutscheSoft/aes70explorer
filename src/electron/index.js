const { app, BrowserWindow } = require('electron');
const pServer = import('../nodejs/lib/index.js');
const { dirname, join } = require('path');

const defaultHtdocs = join(dirname(__filename), "htdocs");

function createWindow (info) {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    title: 'AES70 Explorer',
  })

  win.setMenuBarVisibility(false);
  win.removeMenu();
  win.loadURL('http://localhost:' + info.http.port)
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('leave-full-screen', () => {
    win.removeMenu();
    win.setMenuBarVisibility(false);
  });
}

let backend = null;

async function startUp() {
  const { Backend } = await pServer;

  await app.whenReady()

  backend = new Backend({
    http: {
      port: 0,
      htdocs: defaultHtdocs,
      host: 'localhost',
      manual_devices: true,
      license: true,
    }
  });
  const info = await backend.start();

  createWindow(info)
}

startUp().catch(
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
