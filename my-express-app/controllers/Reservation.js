const Reservation = require('../models/Reservation');

const ReservationController = {
  getAll: (req, res) => {
    Reservation.getAll((err, reservations) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(reservations);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Reservation.getById(id, (err, reservation) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(reservation);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Reservation.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Reservation.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Reservation.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = ReservationController;
