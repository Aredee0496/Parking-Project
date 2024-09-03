const Parkingstatus = require('../models/Parkingstatus');

const ParkingstatusController = {
  getAll: (req, res) => {
    Parkingstatus.getAll((err, parkingstatuss) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(parkingstatuss);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Parkingstatus.getById(id, (err, parkingstatus) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(parkingstatus);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Parkingstatus.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Parkingstatus.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Parkingstatus.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = ParkingstatusController;
