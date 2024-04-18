module.exports = {
  getDepartureTypes: (req, res) => {
    const types = require('../models/vyjazdy');

    (async () => {
        ret_val = await types.getDepartureTypes();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(500).send(err);
    });
  },

  getDeparturePlans: (req, res) => {
    const plans = require('../models/vyjazdy');

    (async () => {
        ret_val = await plans.getDeparturePlans();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(500).send(err);
    });
  },

  getDepartures: (req, res) => {
    const dep = require('../models/vyjazdy');

    (async () => {
        ret_val = await dep.getDepartures();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(500).send(err);
    });
  },

  getDeparturesHistory: (req, res) => {
    const dep = require('../models/vyjazdy');

    (async () => {
        ret_val = await dep.getDeparturesHistory();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(500).send(err);
    });
  },

  getDepartureNoVehicle: (req, res) => {
    const dep = require('../models/vyjazdy');

    (async () => {
        ret_val = await dep.getDepartureNoVehicle();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(500).send(err);
    });
  },

  insertDeparturePlan: (req, res) => {
    const dep_plan = require("../models/vyjazdy");
    (async () => {
      ret_val = await dep_plan.insertDeparturePlan(req.body);
      res.status(201);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  insertVehicleToDeparture: (req, res) => {
    const dep_plan = require("../models/vyjazdy");
    (async () => {
      ret_val = await dep_plan.insertVehicleToDeparture(req.body);
      res.status(201);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  }
}