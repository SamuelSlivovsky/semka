module.exports = {
  getManazeriLekarni: (req, res) => {
    const manazerLekarne = require("../models/manazer_lekarne");
    (async () => {
      manazeriLekarni = await manazerLekarne.getManazeriLekarni(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(manazeriLekarni);
    })();
  },

  getLekarnici: (req, res) => {
    const lekarnik = require("../models/manazer_lekarne");
    (async () => {
      lekarnici = await lekarnik.getLekarnici(req.params.id);
      // if (req.role === 0) {
      //     lekarnici = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(lekarnici);
    })();
  },

  insertZamestnanecLekarne: (req, res) => {
    const zamestnanecLekarne = require("../models/manazer_lekarne");
    (async () => {
      ret_val = await zamestnanecLekarne.insertZamestnanecLekarne(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getLaboranti: (req, res) => {
    const laborant = require("../models/manazer_lekarne");
    (async () => {
      laboranti = await laborant.getLaboranti(req.params.id);
      // if (req.role === 0) {
      //     lekarnici = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(laboranti);
    })();
  },

  insertLaborantLekarne: (req, res) => {
    const laborantLekarne = require("../models/manazer_lekarne");
    (async () => {
      ret_val = await laborantLekarne.insertLaborantLekarne(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  deleteZamestnanciLekarne: (req, res) => {
    const zamestnanecLekarne = require("../models/manazer_lekarne");
    const cisloZam = req.params.id; // Získanie cisla zam z URL parametra
    zamestnanecLekarne
      .deleteZamestnanciLekarne(cisloZam)
      .then(() => {
        res.status(200).json({ message: "Zamestnanec bol úspešne vymazaný." });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err.message); // Odoslanie správy o chybe
      });
  },

  getManazerLekarneInfo: (req, res) => {
    const manazerLekarne = require("../models/manazer_lekarne");
    (async () => {
      info = await manazerLekarne.getManazerLekarneInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getLekarniciInfo: (req, res) => {
    const lekarnik = require("../models/manazer_lekarne");
    (async () => {
      info = await lekarnik.getLekarniciInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getLaborantiInfo: (req, res) => {
    const laborant = require("../models/manazer_lekarne");
    (async () => {
      info = await laborant.getLaborantiInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getPouzivatelInfo: (req, res) => {
    const pouzivatel = require("../models/manazer_lekarne");
    (async () => {
      info = await pouzivatel.getPouzivatelInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getZoznamLiekov: (req, res) => {
    const liek = require("../models/manazer_lekarne");
    (async () => {
      zoznamLiekov = await liek.getZoznamLiekov(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(zoznamLiekov);
    })();
  },

  getDetailLieku: (req, res) => {
    const detailLieku = require("../models/manazer_lekarne");
    (async () => {
      detailyLiekov = await detailLieku.getDetailLieku(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(detailyLiekov);
    })();
  },

  getZoznamZdravotnickychPomocok: (req, res) => {
    const pomocka = require("../models/manazer_lekarne");
    (async () => {
      zoznamZdravotnickychPomocok =
        await pomocka.getZoznamZdravotnickychPomocok(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(zoznamZdravotnickychPomocok);
    })();
  },

  getDetailZdravotnickejPomocky: (req, res) => {
    const detailZdravotnickejPomocky = require("../models/manazer_lekarne");
    (async () => {
      detailyZdravotnickychPomocok =
        await detailZdravotnickejPomocky.getDetailZdravotnickejPomocky(
          req.params.id
        );
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(detailyZdravotnickychPomocok);
    })();
  },

  getReportInfo: (req, res) => {
    const report = require("../models/manazer_lekarne");
    (async () => {
      info = await report.getReportInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getUcinnaLatka: (req, res) => {
    const ucinnaLatka = require("../models/manazer_lekarne");
    (async () => {
      ucinneLatky = await ucinnaLatka.getUcinnaLatka(req.params.id);
      res.status(200).json(ucinneLatky);
    })();
  },

  insertUcinneLatky: (req, res) => {
    const ucinneLatky = require("../models/manazer_lekarne");
    (async () => {
      ret_val = await ucinneLatky.insertUcinneLatky(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  updateUcinnaLatka: (req, res) => {
    const ucinnaLatka = require("../models/manazer_lekarne");
    (async () => {
      ret_val = await ucinnaLatka.updateUcinnaLatka(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  insertUcinnaLatka: (req, res) => {
    const ucinnaLatka = require("../models/manazer_lekarne");
    (async () => {
      ret_val = await ucinnaLatka.insertUcinnaLatka(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  deleteUcinnaLatka: (req, res) => {
    const ucinnaLatka = require("../models/manazer_lekarne");
    const idUcinnaLatka = req.params.id; // Získanie idUcinnaLatka z URL parametra
    ucinnaLatka
      .deleteUcinnaLatka(idUcinnaLatka)
      .then(() => {
        res
          .status(200)
          .json({ message: "Účinná látka bola úspešne vymazaná." });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err.message); // Odoslanie správy o chybe
      });
  },

  getZoznamMiest: (req, res) => {
    const mesto = require("../models/manazer_lekarne");
    (async () => {
      zoznamMiest = await mesto.getZoznamMiest(req.params.id);
      res.status(200).json(zoznamMiest);
    })();
  },

  getZoznamAktualnychRezervacii: (req, res) => {
    const rezervacia = require("../models/manazer_lekarne");
    (async () => {
      zoznamRezervacii = await rezervacia.getZoznamAktualnychRezervacii(
        req.params.id
      );
      res.status(200).json(zoznamRezervacii);
    })();
  },

  insertRezervaciaLieku: (req, res) => {
    const rezervacia = require("../models/manazer_lekarne");
    (async () => {
      ret_val = await rezervacia.insertRezervaciaLieku(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  deleteRezervaciaLieku: (req, res) => {
    const rezervacia = require("../models/manazer_lekarne");
    const idRezervacie = req.params.id; // Získanie idRezervacie z URL parametra
    rezervacia
      .deleteRezervaciaLieku(idRezervacie)
      .then(() => {
        res.status(200).json({ message: "Rezervácia bola úspešne zrušená." });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err.message); // Odoslanie správy o chybe
      });
  },
};
