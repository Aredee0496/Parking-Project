const Type = require('../models/Type');

const TypeController = {
  getAll: (req, res) => {
    Type.getAll((err, types) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(types);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Type.getById(id, (err, type) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(type);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Type.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Type.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Type.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = TypeController;
