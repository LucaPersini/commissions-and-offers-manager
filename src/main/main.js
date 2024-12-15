import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import fs from 'fs';
import dbController from './database.cjs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const APPFOLDER = process.env.APPDATA + '/commissions_manager_config';
const CONFIGPATH = APPFOLDER + '/config.json';

const CONFIGDATA = {
  databasePath: ''
}

const commissionsFolderStructure = [
  '01 FORNITI',
  '02 DOCUMENTI',
  '03 TECNICO',
  '04 CONSEGNA',
  '05 E-MAIL',
  '06 VARIE'
];

const offersFolderStructure = [
  '01 FORNITI',
  '02 PREVENTIVI FORNITORI',
  '03 INVIO'
];

let db;

ipcMain.handle('config_app', () => {
  let parsedData;

  try {
    if (!fs.existsSync(APPFOLDER)) {
      fs.mkdirSync(APPFOLDER);
      fs.writeFileSync(CONFIGPATH, JSON.stringify(CONFIGDATA));
    }

    const result = fs.readFileSync(CONFIGPATH, 'utf-8');
    parsedData = JSON.parse(result);
  } catch (err) {
    return { success: false, error: 'Config file error' }
  }

  if (parsedData.databasePath == '') {
    return { success: false, error: 'invalid_path' }
  } else {
    try {
      const databaseFilePath = parsedData.databasePath + '/database.db';
      db = dbController.createDataBase(databaseFilePath);
    } catch (err) {
      return { success: false, error: 'It was not possible to create the database.' }
    }
    return { success: true, msg: 'Configuaration completed' }
  }
})

ipcMain.handle('get-all-commissions', () => {
  let data;
  try {
    data = dbController.getAllCommissions(db);
  } catch (err) {
    return { success: false, err };
  }

  return { success: true, data };
})

ipcMain.handle('get-commissions-years', () => {
  let data;
  try {
    data = dbController.getCommissionsYear(db);
  } catch (err) {
    return { success: false, err };
  }

  return { success: true, data };
})

ipcMain.handle('update-commission', (event, commission) => {
  try {
    dbController.updateCommission(db, commission);
  } catch (err) {
    return { success: false, err };
  }

  return { success: true };
})

ipcMain.handle('delete-commission', (event, commission) => {
  try {
    dbController.deleteCommission(db, commission);
  } catch (err) {
    return { success: false, err };
  }

  return { success: true };
})

ipcMain.handle('get-all-offers', () => {
  let data;
  try {
    data = dbController.getAllOffers(db);
  } catch (err) {
    return { success: false, err };
  }

  return { success: true, data };
})

ipcMain.handle('get-offers-years', () => {
  let data;

  try {
    data = dbController.getOffersYear(db);
  } catch (err) {
    return { success: false };
  }

  return { success: true, data };
})

ipcMain.handle('update-offer', (event, offer) => {
  try {
    dbController.updateOffer(db, offer);
  } catch (error) {
    return { success: false, error };
  }

  return { success: true };
})

ipcMain.handle('delete-offer', (event, offer) => {
  try {
    dbController.deleteOffer(db, offer);
  } catch (err) {
    return { success: false };
  }

  return { success: true };
})

ipcMain.handle('select-db-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if (!result.canceled) {
    try {
      const data = fs.readFileSync(CONFIGPATH);
      const parsedData = JSON.parse(data);
      parsedData.databasePath = result.filePaths;
      fs.writeFileSync(CONFIGPATH, JSON.stringify(parsedData), 'utf-8');
      return { success: true };
    } catch {
      return { success: false }
    }
  }
})

ipcMain.handle('get-number-of-commissions-by-year', (event, year) => {
  try {
    const result = dbController.getNumberOfCommissionsByYear(db, year);
    return { success: true, data: result };
  } catch (err) {
    return { success: false };
  }
})

ipcMain.handle('get-number-of-offers-by-year', (event, year) => {
  try {
    const result = dbController.getNumberOfOffersByYear(db, year);
    return { success: true, data: result };
  } catch (err) {
    return { success: false };
  }
})

ipcMain.handle('select-saving-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if (!result.canceled) {
    return { success: true, data: result };
  } else {
    return { success: false };
  }
})

ipcMain.handle('add-commission', async (event, newCommission) => {
  try {
    commissionsFolderStructure.forEach(folder => {
      const path = `${newCommission.folder}\/${folder}`;
      fs.mkdirSync(path, { recursive: true });
    });

    const result = dbController.addCommission(db, newCommission);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, err };
  }
})

ipcMain.handle('open-folder', async (event, path) => {
  try {
    await shell.openPath(path);
    return { success: true };
  } catch (err) {
    return { success: false, err };
  }
})

ipcMain.handle('add-offer', (event, newOffer) => {
  try {
    offersFolderStructure.forEach(folder => {
      const path = `${newOffer.folder}\/${folder}`;
      fs.mkdirSync(path, { recursive: true });
    });

    const result = dbController.addOffer(db, newOffer);
    return { success: true };
  } catch (err) {
    return { success: false, err };
  }
})