const Parking = require('../models/Parking');

const ParkingController = {
  getAll: (req, res) => {
    Parking.getAll((err, parkings) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(parkings);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Parking.getById(id, (err, parking) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(parking);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Parking.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Parking.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Parking.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = ParkingController;
