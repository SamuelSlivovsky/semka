const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
  getSpravy: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getSpravy(req.params.id_skupiny, req.params.userid);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // insertLogs({
      //   status: "failed get messages",
      //   table: "CHAT_TAB",
      //   description: "Failed to get messages from group with id: " + req.params.id_skupiny + " and user with id: " + req.params.userid,
      // })
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
        // insertLogs({
        //     status: "failed get next messages",
        //     table: "CHAT_TAB",
        //     description: "Failed to get next messages from group with id: " + req.body.id_skupiny + " and user with id: " + req.body.userid,
        // })
      res.status(403).send(err);
    });
  },

  getUnread: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getUnread(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
        // insertLogs({
        //     status: "failed get unread messages",
        //     table: "CHAT_TAB",
        //     description: "Failed to get unread messages for user with id: " + req.params.id,
        // })
      res.status(403).send(err);
    });
  },

  isAdmin: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.isAdmin(req.params.id, req.params.id_skupiny);
      res.status(200).json(ret_val);
    })().catch((err) => {
        // insertLogs({
        //     status: "failed check admin",
        //     table: "CHAT_TAB",
        //     description: "Failed to check if user with id: " + req.params.id + " is admin of group with id: " + req.params.id_skupiny,
        // })
      res.status(403).send(err);
    });
  },

  insertSprava: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.insertSprava(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        // insertLogs({
        //     status: "failed insert message",
        //     table: "CHAT_TAB",
        //     description: "Failed to insert message",
        // })
      res.status(500).send(err);
    });
  },

  insertUser: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.insertUser(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        // insertLogs({
        //     status: "failed insert user",
        //     table: "CHAT_TAB",
        //     description: "Failed to insert user with id: " + req.body.userid + " in group with id: " + req.body.id_skupiny,
        // })
      console.error(err.message);
      res.status(500).json({ error: err.message });
    });
  },

  updateReadStatus: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      await chat.updateReadStatus(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        // insertLogs({
        //     status: "failed update read status",
        //     table: "CHAT_TAB",
        //     description: "Failed to update read status for user with id: " + req.body.userid + " in group with id: " + req.body.id_skupiny,
        // })
      res.status(500).send(err);
    });
  },

  getGroups: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getGroups(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
        // insertLogs({
        //     status: "failed get groups",
        //     table: "CHAT_TAB",
        //     description: "Failed to get groups for user with id: " + req.params.id,
        // })
      res.status(403).send(err);
    });
  },

  getOtherUsers: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getOtherUsers(req.params.id_skupiny, req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      insertLogs({
        status: "failed get dostupne miestnosti",
        table: "Miestnost",
        description: "Failed to get dostupne miestnosti"
      })
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
      // insertLogs({
      //   status: "failed update history",
      //   table: "CHAT_TAB",
      //   description: "Failed to update history for user with id: " + req.body.userid + " in group with id: " + req.body.id_skupiny,
      // })
      res.status(500).send(err);
    });
  },
  createGroup: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.createGroup(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
