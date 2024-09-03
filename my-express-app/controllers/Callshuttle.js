const Callshuttle = require('../models/Callshuttle');

const CallshuttleController = {
  getAll: (req, res) => {
    Callshuttle.getAll((err, callshuttles) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(callshuttles);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Callshuttle.getById(id, (err, callshuttle) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(callshuttle);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Callshuttle.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Callshuttle.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Callshuttle.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = CallshuttleController;
