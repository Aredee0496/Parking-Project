const Shuttle = require('../models/Shuttle');

const ShuttleController = {
  getAll: (req, res) => {
    Shuttle.getAll((err, shuttles) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(shuttles);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Shuttle.getById(id, (err, shuttle) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(shuttle);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Shuttle.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Shuttle.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Shuttle.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = ShuttleController;
