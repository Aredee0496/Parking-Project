const Car = require('../models/Car');

const CarController = {
  getAll: (req, res) => {
    Car.getAll((err, cars) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(cars);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Car.getById(id, (err, car) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(car);
    });
  },

  create: (req, res) => {
    const data = req.body;
    Car.create(data, (err, insertId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: insertId });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Car.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Car.delete(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = CarController;
