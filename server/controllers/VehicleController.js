module.exports = {
  getVehicles: (req, res) => {
    const vehicles = require('../models/vehicle');

    (async () => {
        ret_val = await vehicles.getVehicles();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(403).send(err);
    });
  },
  
  getVehiclesECV: (req, res) => {
    const vehicles = require('../models/vehicle');

    (async () => {
        ret_val = await vehicles.getVehiclesECV();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(403).send(err);
    });
  },

  insertVehicle: (req, res) => {
    const veh = require("../models/vehicle");
    (async () => {
      ret_val = await veh.insertVehicle(req.body);
      res.status(201);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  updateVehicle: (req, res) => {
    const veh = require("../models/vehicle");
    (async () => {
      ret_val = await veh.updateVehicle(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  }
}