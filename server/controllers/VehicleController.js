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

  getVehiclesECVPlanHist: (req, res) => {
    const vehicles = require('../models/vehicle');
    
    (async () => {
        ret_val = await vehicles.getVehiclesECVPlanHist(req.params.vehicle_ecv);
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(403).send(err);
    });
  },

  getVehiclesECVPlan: (req, res) => {
    const vehicles = require('../models/vehicle');
    
    (async () => {
        ret_val = await vehicles.getVehiclesECVPlan(req.params.vehicle_ecv);
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(403).send(err);
    });
  },

  getVehicleByHospital: (req, res) => {
    const vehicles = require('../models/vehicle');
    
    (async () => {
        ret_val = await vehicles.getVehicleByHospital(req.params.id_hospital);
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(500).send(err);
    });
  },

  getFreeVehicles: (req, res) => {
    const vehicles = require('../models/vehicle');
    
    (async () => {
        ret_val = await vehicles.getFreeVehicles();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        console.error(err);
        es.status(500).send(err);
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