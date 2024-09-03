const Reservationstatus = require('../models/Reservationstatus');

const ReservationstatusController = {
  getAll: (req, res) => {
    Reservationstatus.getAll((err, reservationstatuss) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(reservationstatuss);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Reservationstatus.getById(id, (err, reservationstatus) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(reservationstatus);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Reservationstatus.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Reservationstatus.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Reservationstatus.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = ReservationstatusController;
