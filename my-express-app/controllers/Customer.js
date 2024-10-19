const Customer = require('../models/Customer');

const CustomerController = {
  getAll: (req, res) => {
    Customer.getAll((err, customers) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(customers);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Customer.getById(id, (err, customer) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(customer);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Customer.create(data, (err, newId) => { 
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: newId }); 
    });
  },

  register: (req, res) => {
    const data = req.body;
    Customer.register(data, (err, newId) => { 
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: newId }); 
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Customer.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Customer.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = CustomerController;
