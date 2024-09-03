const Posit = require('../models/Posit');

const PositController = {
  getAll: (req, res) => {
    Posit.getAll((err, posits) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(posits);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Posit.getById(id, (err, posit) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(posit);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Posit.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Posit.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Posit.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = PositController;
