const Officer = require('../models/Officer');

const OfficerController = {
  getAll: (req, res) => {
    Officer.getAll((err, officers) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(officers);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Officer.getById(id, (err, officer) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(officer);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Officer.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Officer.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Officer.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = OfficerController;
