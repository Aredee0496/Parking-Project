const Callshuttlestatus = require('../models/Callshuttlestatus');

const CallshuttlestatusController = {
  getAll: (req, res) => {
    Callshuttlestatus.getAll((err, callshuttlestatuss) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(callshuttlestatuss);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Callshuttlestatus.getById(id, (err, callshuttlestatus) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(callshuttlestatus);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Callshuttlestatus.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Callshuttlestatus.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Callshuttlestatus.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = CallshuttlestatusController;
