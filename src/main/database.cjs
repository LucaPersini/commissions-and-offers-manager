const sqlite = require('better-sqlite3');

function createDataBase(path) {
  if (!path || typeof path !== 'string') {
    throw new Error('Invalid path. Please proved a valid string for the database path.')
  }

  let db;
  try {
    db = new sqlite(path);
  } catch (err) {
    throw err;
  }

  const createCommissionsTableQuery = `CREATE TABLE IF NOT EXISTS Commissions (
    id VARCHAR(8) PRIMARY KEY,
    year VARCHAR(4),
    client VARCHAR(255),
    commissionCode CHAR,
    description VARCHAR(255),
    commissionType VARCHAR(255),
    acceptanseDate DATE,
    state VARCHAR(255),
    folder VARCHAR(255)
  )`;

  const createOffersTableQuery = `CREATE TABLE IF NOT EXISTS Offers(
    id VARCHAR(8) PRIMARY KEY,
    year VARCAHR(8),
    client VARCHAR(255),
    offerCode CHAR,
    description VARCAHR(255),
    offerType VARCHAR(255),
    receptionDate DATE,
    state VARCHAR(255),
    folder VARCHAR(255),
    commission VARCHAR(255),
    commissionId VARCHAR(255),
    commissionFolder VARCHAR(255)
    )`;

  try {
    const createCommissionsTable = db.prepare(createCommissionsTableQuery);
    const createOffersTable = db.prepare(createOffersTableQuery);
    createCommissionsTable.run();
    createOffersTable.run();
  } catch (err) {
    throw err
  }

  return db;
}

function addCommission(db, commission) {
  const addCommissionQuery = `INSERT INTO Commissions(
      id,
      year,
      client,
      commissionCode,
      description,
      commissionType,
      acceptanseDate,
      state,
      folder)
      VALUES(@id, @year, @client, @commissionCode, @description, @commissionType, @acceptanseDate, @state, @folder)`

  try {
    const insert = db.prepare(addCommissionQuery);
    insert.run(commission);
  } catch (err) {
    throw err;
  }
}

function getAllCommissions(db) {
  const getAllCommissionsQuery = `SELECT * FROM Commissions`;

  try {
    const select = db.prepare(getAllCommissionsQuery);
    const result = select.all();
    return result;
  } catch (err) {
    throw err;
  }
}

function updateCommission(db, updatedCommission) {
  const updateCommissionQuery = `UPDATE Commissions
    SET year = @year, 
    client = @client,
    commissionCode = @commissionCode,
    description = @description,
    commissionType = @commissionType,
    acceptanseDate = @acceptanseDate,
    state = @state,
    folder = @folder
    WHERE id = @id`;

  try {
    const update = db.prepare(updateCommissionQuery);
    update.run(updatedCommission)
  } catch (err) {
    throw err;
  }

  return { success: true };
}

function deleteCommission(db, commissionToDelete) {
  const deleteCommissionQuery = `DELETE FROM Commissions WHERE id = @id`;

  try {
    const dlt = db.prepare(deleteCommissionQuery);
    dlt.run(commissionToDelete);
  } catch (err) {
    throw err;
  }

  return { success: true };
}

function getCommissionsYear(db) {
  const getCommissionYearQuery = `SELECT DISTINCT year FROM Commissions ORDER BY year ASC`;

  try {
    const select = db.prepare(getCommissionYearQuery);
    const result = select.all();
    return result;
  } catch (err) {
    throw err;
  }
}

function addOffer(db, offer) {
  const addOfferQuery = `INSERT INTO Offers(
  id,
  year,
  client,
  offerCode,
  description,
  offerType,
  receptionDate,
  state,
  folder,
  commission,
  commissionId,
  commissionFolder)
  VALUES (@id, @year, @client, @offerCode, @description, @offerType, @receptionDate, @state, @folder, @commission, @commissionId, @commissionFolder)`;

  try {
    const insert = db.prepare(addOfferQuery);
    insert.run(offer);
  } catch (err) {
    throw err;
  }

  return { success: true };
}


function getAllOffers(db) {
  const getAllOffersQuery = `SELECT * FROM Offers`;

  try {
    const select = db.prepare(getAllOffersQuery);
    const result = select.all();
    return result;
  } catch (err) {
    throw err;
  }
}

function updateOffer(db, offerToUpdate) {
  const updateOfferQuery = `UPDATE Offers
    SET year = @year,
    client = @client,
    offerCode = @offerCode,
    description = @description,
    offerType = @offerType,
    receptionDate = @receptionDate,
    state = @state,
    folder = @folder,
    commission = @commission,
    commissionId = @commissionId,
    commissionFolder = @commissionFolder
    WHERE id = @id`;

  try {
    const update = db.prepare(updateOfferQuery);
    update.run(offerToUpdate);
  } catch (err) {
    throw err;
  }

  return { success: true };
}

function deleteOffer(db, offerToDelete) {
  const deleteOfferQuery = `DELETE FROM Offers WHERE id = @id`;

  try {
    const dlt = db.prepare(deleteOfferQuery);
    dlt.run(offerToDelete);
  } catch (err) {
    throw err;
  }

  return { success: true };
}

function getOffersYear(db) {
  const getOffersYearQuery = `SELECT DISTINCT year FROM Offers ORDER BY year ASC`;

  try {
    const select = db.prepare(getOffersYearQuery);
    const result = select.all();
    return result;
  } catch (err) {
    throw err;
  }
}

function getNumberOfCommissionsByYear(db, year) {
  const getNumberOfCommissionsByYearQuery = `SELECT COUNT(year) as count FROM Commissions WHERE year = ${year}`;

  try {
    const select = db.prepare(getNumberOfCommissionsByYearQuery);
    const result = select.get();
    return result;
  } catch (err) {
    throw err;
  }
}

function getNumberOfOffersByYear(db, year) {
  const getNumberOfOffersByYearQuery = `SELECT COUNT(year) as count FROM Offers WHERE year = ${year}`;

  try {
    const select = db.prepare(getNumberOfOffersByYearQuery);
    const result = select.get();
    return result;
  } catch (err) {
    throw err;
  }
}


module.exports = {
  createDataBase,
  addCommission,
  getAllCommissions,
  updateCommission,
  deleteCommission,
  getCommissionsYear,
  addOffer,
  getAllOffers,
  updateOffer,
  deleteOffer,
  getOffersYear,
  getNumberOfCommissionsByYear,
  getNumberOfOffersByYear,
}