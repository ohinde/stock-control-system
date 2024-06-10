import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '****************',
  database: 'stock_control_system',
});

app.use(express.json());
app.use(cors());

// -------------------- Stock Table -------------------- \\

// Stock Table get request for loading the complete stock table
app.get('/stock', (req, res) => {
  const q = 'SELECT * FROM stock_control_system.stock_table;';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Stock Table get request for loading the list of all part numbers
app.get('/stock/partnumbers', (req, res) => {
  const q = 'SELECT partNumber FROM stock_control_system.stock_table;';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Part Search get request for loading individual part information
app.get('/stock/search', (req, res) => {
  const q = 'SELECT * FROM stock_control_system.stock_table WHERE partNumber = ?;';

  const values = [req.query.partNumber];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Post request for creating new stock items
app.post('/stock/create', (req, res) => {
  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  let currentYear = date.getFullYear();

  let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

  const q =
    'INSERT INTO stock_control_system.stock_table (`partNumber`,`partDescription`,`partCategory`,`partSupplier`,`quantity`,`location`,`lastUpdated`,`updatedBy`) VALUES (?)';
  const values = [
    req.body.partNumber,
    req.body.partDescription,
    req.body.partCategory,
    req.body.partSupplier,
    req.body.quantity,
    req.body.location,
    currentDate,
    req.body.updatedBy,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json('Stock Item Added Successfully');
  });
});

// Post request for updating stock levels
app.post('/stock/update/quantity', (req, res) => {
  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  let currentYear = date.getFullYear();

  let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

  const q =
    'UPDATE stock_control_system.stock_table SET `quantity` = ?, `lastUpdated` = ?, `updatedBy` = ? WHERE `partNumber` = ?;';
  const values = [req.body[0].quantity, currentDate, req.body[0].updatedBy, req.body[0].partNumber];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json('Stock Item Added Successfully');
  });
});

// Post request for updating stock location
app.post('/stock/update/location', (req, res) => {
  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  let currentYear = date.getFullYear();

  let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

  const q =
    'UPDATE stock_control_system.stock_table SET `location` = ?, `lastUpdated` = ?, `updatedBy` = ? WHERE `partNumber` = ?;';
  const values = [req.body[0].location, currentDate, req.body[0].updatedBy, req.body[0].partNumber];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json('Stock Item Location Updated Successfully');
  });
});

// Post request for updating additional notes per stock item
app.post('/stock/update/notes', (req, res) => {
  const q = 'UPDATE stock_control_system.stock_table SET `additionalNotes` = ? WHERE `partNumber` = ?;';
  const values = [req.body[0].additionalNotes, req.body[0].partNumber];

  console.log(values);

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json('Additional Notes Updated Successfully');
  });
});

// -------------------- Stock Table - Settings - Categories -------------------- \\

// Stock settings get request for loading categories
app.get('/stock/categories', (req, res) => {
  const q = 'SELECT * FROM stock_control_system.stock_categories;';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Stock post request for adding new part category
app.post('/stock/categories/add', (req, res) => {
  const q = 'INSERT INTO stock_control_system.stock_categories (`categoryName`) VALUES (?);';

  const values = [req.body.categoryName];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json('Category Created Successfully');
  });
});

// Stock post request for remove a part category
app.post('/stock/categories/remove', (req, res) => {
  const q = 'DELETE FROM stock_control_system.stock_categories WHERE categoryName = ?;';

  const values = [req.body.categoryName];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json('Category Deleted Successfully');
  });
});

// -------------------- Stock Table - Settings - Locations -------------------- \\

// Stock settings get request for loading locations
app.get('/stock/locations', (req, res) => {
  const q = 'SELECT * FROM stock_control_system.stock_locations;';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Stock Table post request for adding new stock locations
app.post('/stock/locations/add', (req, res) => {
  const q =
    'INSERT INTO stock_control_system.stock_locations (`locationName`,`rowLetter`,`shelfNumber`,`shelfPosition`) VALUES (?);';

  const values = [req.body.locationName, req.body.rowLetter, req.body.shelfNumber, req.body.shelfPosition];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json('Location Created Successfully');
  });
});

// Stock Table post request for removing stock locations
app.post('/stock/locations/remove', (req, res) => {
  const q = 'DELETE FROM stock_control_system.stock_locations WHERE locationName = ?;';

  const values = [req.body.location];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json('Location Deleted Successfully');
  });
});

// -------------------- Stock History -------------------- \\

// Stock History get request for loading the complete stock history
app.get('/stock/history', (req, res) => {
  const q = 'SELECT * FROM stock_control_system.stock_history;';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Stock History get request for loading individual part history
app.get('/stock/history/part', (req, res) => {
  const q = 'SELECT * FROM stock_control_system.stock_history WHERE partNumber = ?;';

  const values = [req.query.partNumber];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Stock Histroy post request for adding new history to the database
app.post('/stock/history/add', (req, res) => {
  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  let currentYear = date.getFullYear();

  let currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

  const q =
    'INSERT INTO stock_control_system.stock_history (`partNumber`,`partDescription`,`changesMade`,`quantityChanged`,`reasonForChange`,`dateOfChange`,`changedBy`) VALUES (?);';
  const values = [
    req.body.partNumber,
    req.body.partDescription,
    req.body.changesMade,
    req.body.quantityChanged,
    req.body.reasonForChange,
    currentDate,
    req.body.changedBy,
  ];

  console.log(values);

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json('Stock Item Added Successfully');
  });
});

// -------------------- AOI License Dongles -------------------- \\

// Machine License Dongle get request for loading all license dongle information
app.get('/machines/aoi/licenses', (req, res) => {
  const q = 'SELECT * FROM stock_control_system.stock_dongles;';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Post request for manually creating existing license dongles
app.post('/machines/aoi/licenses/create', (req, res) => {
  const q =
    'INSERT INTO stock_control_system.stock_dongles (`serialNumber`,`licenseDescription`,`allocatedMachineSerialNumber`,`allocatedMachineType`,`allocatedCustomer`) VALUES (?)';
  const values = [
    req.body.serialNumber,
    req.body.licenseDescription,
    req.body.allocatedMachineSerialNumber,
    req.body.allocatedMachineType,
    req.body.allocatedCustomer,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json('License Dongle Added Succesfully');
  });
});

// Post request for allocating an existing license dongle
app.post('/machines/aoi/licenses/allocate', (req, res) => {
  const q =
    'UPDATE stock_control_system.stock_dongles SET `allocatedMachineSerialNumber` = ?, `allocatedMachineType` = ?, `allocatedCustomer` = ? WHERE `serialNumber` = ?;';
  const values = [
    req.body.allocatedMachineSerialNumber,
    req.body.allocatedMachineType,
    req.body.allocatedCustomer,
    req.body.serialNumber,
  ];

  console.log(values);

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json('License Dongle' + req.body.serialNumber + 'Allocated Successfully');
  });
});

// Post request for updating an existing license dongle
app.post('/machines/aoi/licenses/upgrade', (req, res) => {
  const q = 'UPDATE stock_control_system.stock_dongles SET `licenseDescription` = ? WHERE `serialNumber` = ?;';
  const values = [req.body.licenseDescription, req.body.serialNumber];

  console.log(values);

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json('License Dongle' + req.body.serialNumber + 'Updated Successfully');
  });
});

// -------------------- AOI License Dongles - Settings -------------------- \\

// Stock settings get request for loading categories
app.get('/machines/aoi/licenses/options', (req, res) => {
  const q = 'SELECT * FROM stock_control_system.dongle_options;';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// -------------------- Standard Setup -------------------- \\

// Opens the port 8080 for the client to connect to the server
app.listen(8080, () => {
  console.log('Connected to the server!');
});

// Confirms the client is connected to the server
app.get('/', (req, res) => {
  res.json('Connected to the server');
});
