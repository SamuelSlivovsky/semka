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
      ret_val = await miestnost.getWardRoomsAvailability();
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
