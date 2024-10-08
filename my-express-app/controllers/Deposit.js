const Deposit = require('../models/Deposit');

const DepositController = {
  getAll: (req, res) => {
    Deposit.getAll((err, deposits) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(deposits);
    });
  },

  getTocallshuttle: (req, res) => {
    Deposit.getTocallshuttle((err, deposits) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(deposits);
    });
  },
  
  getById: (req, res) => {
    const id = req.params.id;
    Deposit.getById(id, (err, deposit) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(deposit);
    });
  },

  getCheckin: (req, res) => {
    const id = req.params.id;
    Deposit.getCheckin(id, (err, deposit) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(deposit);
    });
  },

  getBooking: (req, res) => {
    const id = req.params.id;
    Deposit.getBooking(id, (err, deposit) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(deposit);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Deposit.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Deposit.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Deposit.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },
  checkAvailability: (req, res) => {
    const { Type_ID, Booking_DateTime } = req.body;
  
    Deposit.checkAvailability(Type_ID, (err, parkingId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (parkingId) {
        return res.json({ available: true, Parking_ID: parkingId }); 
      } else {
        return res.json({ available: false }); 
      }
    });
  },
  

};

module.exports = DepositController;