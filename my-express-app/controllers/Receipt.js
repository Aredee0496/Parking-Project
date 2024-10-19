const Receipt = require('../models/Receipt');

const ReceiptController = {
  getAll: (req, res) => {
    Receipt.getAll((err, receipts) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(receipts);
    });
  },

  get: (req, res) => {
    Receipt.get((err, receipts) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(receipts);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Receipt.getById(id, (err, receipt) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(receipt);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Receipt.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Receipt.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Receipt.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = ReceiptController;
