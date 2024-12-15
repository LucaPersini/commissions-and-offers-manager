const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
  configApp: () => ipcRenderer.invoke('config_app'),
  getAllCommissions: () => ipcRenderer.invoke('get-all-commissions'),
  getCommissionsYears: () => ipcRenderer.invoke('get-commissions-years'),
  updateCommission: (commission) => ipcRenderer.invoke('update-commission', commission),
  deleteCommission: (commission) => ipcRenderer.invoke('delete-commission', commission),
  getAllOffers: () => ipcRenderer.invoke('get-all-offers'),
  getOffersYears: () => ipcRenderer.invoke('get-offers-years'),
  updateOffer: (offer) => ipcRenderer.invoke('update-offer', offer),
  deleteOffer: (offer) => ipcRenderer.invoke('delete-offer', offer),
  selectDatabaseFolder: () => ipcRenderer.invoke('select-db-folder'),
  getNumberOfCommissionsByYear: (year) => ipcRenderer.invoke('get-number-of-commissions-by-year', year),
  selectSavingFolder: () => ipcRenderer.invoke('select-saving-folder'),
  addCommission: (newCommission) => ipcRenderer.invoke('add-commission', newCommission),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path),
  getNumberOfOffersByYear: (year) => ipcRenderer.invoke('get-number-of-offers-by-year', year),
  addOffer: (newOffer) => ipcRenderer.invoke('add-offer', newOffer),
})