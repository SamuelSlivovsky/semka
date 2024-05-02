module.exports = {
  getRoomsByHospital: (req, res) => {
    const miestnost = require('../models/miestnost');
    (async () => {
      ret_val = await miestnost.getRoomsForHospital(req.params.hospitalId);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getWardRoomsAvailability: (req, res) => {
    const miestnost = require('../models/miestnost');
    (async () => {
      ret_val = await miestnost.getWardRoomsAvailability(req.params.hospitalId, req.params.from);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  movePatientToAnotherRoom: (req, res) => {
    const miestnost = require('../models/miestnost');
    (async () => {
      ret_val = await miestnost.movePatientToAnotherRoom(
        req.params.bedIdFrom,
        req.params.bedIdTo,
        req.params.hospitalizedFrom,
        req.params.hospitalizedTo,
        req.params.dateWhenMove
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
