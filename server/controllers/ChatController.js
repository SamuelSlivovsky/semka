module.exports = {
  getSpravy: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getSpravy(req.params.id_skupiny, req.params.userid);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getNextSpravy: (req, res) => {
    console.log(req.params);
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getNextSpravy(req.body);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getUnread: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getUnread(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  isAdmin: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.isAdmin(req.params.id, req.params.id_skupiny);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  insertSprava: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.insertSprava(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  insertUser: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.insertUser(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  updateReadStatus: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      await chat.updateReadStatus(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  getGroups: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getGroups(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getOtherUsers: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getOtherUsers(req.params.id_skupiny, req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getObrazok: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getObrazok(req.params.id);
      if (typeof ret_val !== "undefined") {
        res.status(200).write(ret_val, "binary");
        res.end(null, "binary");
      } else {
        res.status(200).write("");
        res.end(null, "binary");
      }
    })();
  },
  updateHistory: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      await chat.updateHistory(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
