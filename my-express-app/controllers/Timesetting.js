const Timesetting = require('../models/Timesetting');

const TimesettingController = {
  getAll: (req, res) => {
    Timesetting.getAll((err, Timesetting) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(Timesetting);
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Timesetting.update(id, data, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};

module.exports = TimesettingController;
