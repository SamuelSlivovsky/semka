const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
  insertRecept: (req, res) => {
    const recept = require("../models/recept");
    (async () => {
      ret_val = await recept.insertRecept(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      insertLogs({
        status: "failed insert recept",
        table: "Recept",
        description: "Failed to insert recept with body:" +
          " " + "ID_LIEKU:" + req.body.id_lieku + " CISLO_ZAM:" + req.body.cislo_zam,
      })
        res.status(500).json({ error: err.message });
    });
  },
  insertPriloha: (req, res) => {
    const priloha = require("../models/priloha");
    (async () => {
      ret_val = await priloha.insertPriloha(req.body.image);
      res.status(200).json("success");
    })().catch((err) => {
      insertLogs({
        status: "failed insert priloha",
        table: "Priloha",
        description: "Failed to insert priloha",
      })
        res.status(500).json({ error: err.message });
    });
  },
  insertVysetrenie: async (req, res) => {
    const zdravotny_zaznam = require("../models/zdravotny_zaznam");
    try {
      await zdravotny_zaznam.insertVysetrenie(req.body);
      res.status(200).json("success");
    }catch (err) {
        insertLogs({
            status: "failed insert vysetrenie",
            table: "Vysetrenie",
            description: "Failed to insert vysetrenie with body:" +
                " " + "POPIS:" + req.body.popis + " DATUM:" + req.body.datum,
        })
        res.status(500).json({ error: err.message });
    }
  },

  insertHospitalizacia: (req, res) => {
    const zdravotny_zaznam = require("../models/zdravotny_zaznam");
    (async () => {
      ret_val = await zdravotny_zaznam.insertHospitalizacia(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        insertLogs({
            status: "failed insert hospitalizacia",
            table: "Hospitalizacia",
            description: "Failed to insert hospitalizacia with body:" +
            " " + "NAZOV: " + req.body.nazov + "POPIS:" + req.body.popis + " DATUM:" + req.body.datum,
        })
        res.status(500).json({ error: err.message });
    });
  },
  insertOperacia: (req, res) => {
    const zdravotny_zaznam = require("../models/zdravotny_zaznam");
    (async () => {
      ret_val = await zdravotny_zaznam.insertOperacia(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        insertLogs({
            status: "failed insert operacia",
            table: "Operacia",
            description: "Failed to insert operacia with body:" +
            " " + "NAZOV: " + req.body.nazov + "POPIS:" + req.body.popis + " DATUM:" + req.body.datum,
        })
        res.status(500).json({ error: err.message });
    });
  },

  insertOckovanie: (req, res) => {
    const ockovanie = require("../models/ockovanie");
    (async () => {
      ret_val = await ockovanie.insertOckovanie(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        insertLogs({
            status: "failed insert ockovanie",
            table: "Ockovanie",
            description: "Failed to insert ockovanie with body:" +
            " " + "ID_VAKCINY: " + req.body.id_vakciny +" DATUM:" + req.body.datum,
        })
        res.status(500).json({ error: err.message });
    });
  },

  insertChoroba: (req, res) => {
    const choroba = require("../models/choroba");
    (async () => {
      ret_val = await choroba.insertChoroba(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        insertLogs({
            status: "failed insert choroba",
            table: "Choroba",
            description: "Failed to insert choroba with body:" +
            " " + "NAZOV: " + req.body.nazov + "TYP:" + req.body.typ,
        })
        res.status(500).json({ error: err.message });
    });
  },

  insertTypZtp: (req, res) => {
    const typZtp = require("../models/typ_ztp");
    (async () => {
      ret_val = await typZtp.insertTypZtp(req.body);
      res.status(200).json("success");
    })().catch((err) => {
    insertLogs({
                status: "failed insert typ ztp",
                table: "TypZtp",
                description: "Failed to insert typ ztp with body:" +
                " " + "TYP: " + req.body.id_typu_ztp,
            })
        res.status(500).json({ error: err.message });;
    });
  },

  insertPacient: (req, res) => {
    const pacient = require("../models/pacient");
    (async () => {
      ret_val = await pacient.insertPacient(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        insertLogs({
            status: "failed insert pacient",
            table: "Pacient",
            description: "Failed to insert pacient with body:" +
            " " + "ROD_CISLO: " + req.body.rod_cislo + "MENO:" + req.body.meno + "PRIEZVISKO:" + req.body.priezvisko,
        })
      res.status(500).send(err);
    });
  },

  insertKonzilium: (req, res) => {
    const konzilium = require("../models/konzilium");
    (async () => {
      ret_val = await konzilium.insertKonzilium(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        insertLogs({
            status: "failed insert konzilium",
            table: "Konzilium",
            description: "Failed to insert konzilium with body:" +
            " " + "POPIS: " + req.body.popis + "DATUM:" + req.body.datum,
        })
      res.status(500).send(err);
    });
  },

  insertKonziliumUser: (req, res) => {
    const konzilium = require("../models/konzilium");
    (async () => {
      ret_val = await konzilium.insertKonziliumUser(req.body);
      res.status(200).json("success");
    })().catch((err) => {
        insertLogs({
            status: "failed insert konzilium user",
            table: "Konzilium",
            description: "Failed to insert konzilium user with body:"
        })
      res.status(500).send(err);
    });
  },

  getObce: (req, res) => {
    const obec = require("../models/obec");
    (async () => {
      ret_val = await obec.getObce();
      res.status(200).json(ret_val);
    })().catch((err) => {
      insertLogs({
        status: "failed get obce",
        table: "Obec",
        description: "Failed to get obce"
      })
      res.status(500).send(err);
    });
  },
  getDostupneMiestnosti: (req, res) => {
    const miestnost = require("../models/miestnost");
    (async () => {
      ret_val = await miestnost.getDostupneMiestnosti(
        req.params.id_oddelenia,
        req.params.trvanie,
        req.params.datum
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
        insertLogs({
            status: "failed get dostupne miestnosti",
            table: "Miestnost",
            description: "Failed to get dostupne miestnosti"
        })
      res.status(500).send(err);
    });
  },
  getNemocnice: (req, res) => {
    const nemocnica = require("../models/nemocnica");
    (async () => {
      ret_val = await nemocnica.getNemocnice();
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  getNemocnicaNazvy: (req, res) => {
    const nemocnica = require("../models/nemocnica");
    (async () => {
      ret_val = await nemocnica.getNemocnicaNazvy();
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  }
};
