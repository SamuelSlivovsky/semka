const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
    insertPacientZTP: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.insertPacientZTP(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: "failed to insert pacient",
                description: "Failed to insert pacient with body: " + req.body,
                table: "pacient",
            })
            res.status(403).send(err);
        });
    },

    getNajviacChoriPocet: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getNajviacChoriPocet(req.params.pocet);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get most ill",
                description: "Failed to get most ill pacients",
                table: "pacient",
            })
            res.status(403).send(err);
        });
    },

    getNajviacOperovanyPercenta: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getNajviacOperovanyPercenta(req.params.percent);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get most operated",
                description: "Failed to get most operated pacients",
                table: "pacient",
            })
            res.status(403).send(err);
        });
    },

    getNajviacHospitalizovaniPercenta: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getNajviacHospitalizovaniPercenta(
                req.params.percent
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get most hospitalized",
                description: "Failed to get most hospitalized pacients",
                table: "pacient",
            })
            res.status(403).send(err);
        });
    },

    getTopZamestnanciVyplatyPocet: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getTopZamestnanciVyplatyPocet(req.params.pocet);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get top employees",
                description: "Failed to get top employees by salary",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },

    getTopZamestnanciVyplatyOddelenie: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getTopZamestnanciVyplatyOddelenie(
                req.params.id_oddelenia,
                req.params.rok
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get top employees",
                description: "Failed to get top employees by salary in department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },

    getNajviacPredpisovaneLiekyRoka: (req, res) => {
        const liek = require("../models/liek");
        console.log(req.params);
        (async () => {
            ret_val = await liek.getNajviacPredpisovaneLiekyRoka(req.params.rok);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get most prescribed drugs",
                description: "Failed to get most prescribed drugs of the year",
                table: "liek",
            })
            res.status(403).send(err);
        });
    },

    getSumaVyplatRoka: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getSumaVyplatRoka(
                req.params.id_oddelenia,
                req.params.rok
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get sum of salaries",
                description: "Failed to get sum of salaries of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },

    getTypyChoroby: (req, res) => {
        const typ_choroby = require("../models/typ_choroby");
        (async () => {
            ret_val = await typ_choroby.getTypyChoroby();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get types of illness",
                description: "Failed to get types of illness",
                table: "typ_choroby",
            })
            res.status(500).send(err);
        });
    },

    getChoroby: (req, res) => {
        const choroba = require("../models/choroba");
        console.log(req.params);
        (async () => {
            ret_val = await choroba.getChoroby(req.params.typ);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get illnesses",
                description: "Failed to get illnesses",
                table: "choroba",
            })
            res.status(500).send(err);
        });
    },

    getTypyZtp: (req, res) => {
        const typ_ztp = require("../models/typ_ztp");
        console.log(req.params);
        (async () => {
            ret_val = await typ_ztp.getTypyZtp();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get types of ZTP",
                description: "Failed to get types of ZTP",
                table: "typ_ztp",
            })
            res.status(500).send(err);
        });
    },

    getTypyOckovania: (req, res) => {
        const typ_ockovania = require("../models/typ_ockovania");

        (async () => {
            ret_val = await typ_ockovania.getTypyOckovania();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get types of vaccination",
                description: "Failed to get types of vaccination",
                table: "typ_ockovania",
            })
            res.status(500).send(err);
        });
    },

    getTypyOckovaniaPacienti: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getTypyOckovaniaPacienti();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get types of vaccination",
                description: "Failed to get types of vaccination of patients",
                table: "pacient",
            })
            res.status(403).send(err);
        });
    },

    getZamestnanciOddeleni: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getZamestnanciOddeleni();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get employees of department",
                description: "Failed to get employees of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },

    getNajcastejsieChorobyRokaPocet: (req, res) => {
        const choroba = require("../models/choroba");
        console.log(req.params);
        (async () => {
            ret_val = await choroba.getNajcastejsieChorobyRokaPocet(
                req.params.pocet,
                req.params.rok
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get most common illnesses",
                description: "Failed to get most common illnesses of the year",
                table: "choroba",
            })
            res.status(403).send(err);
        });
    },

    getNeobsadeneLozkaOddeleniaTyzden: (req, res) => {
        const lozko = require("../models/lozko");
        console.log(req.params);
        (async () => {
            ret_val = await lozko.getNeobsadeneLozkaOddeleniaTyzden(
                req.params.id_oddelenia
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get unoccupied beds",
                description: "Failed to get unoccupied beds of department",
                table: "lozko",
            })
            res.status(403).send(err);
        });
    },

    getLiekyMenejAkoPocet: (req, res) => {
        const sklad = require("../models/sklad");
        console.log(req.params);
        (async () => {
            ret_val = await sklad.getLiekyMenejAkoPocet(req.params.pocet);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get drugs with less quantity",
                description: "Failed to get drugs with less quantity",
                table: "sklad",
            })
            res.status(403).send(err);
        });
    },

    getMenovciPacientLekar: (req, res) => {
        const os_udaje = require("../models/os_udaje");
        console.log(req.params);
        (async () => {
            ret_val = await os_udaje.getMenovciPacientLekar();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get names of patients and doctors",
                description: "Failed to get names of patients and doctors",
                table: "os_udaje",
            })
            res.status(403).send(err);
        });
    },

    getOperaciePocetLekarovTrvanie: (req, res) => {
        const operacia = require("../models/operacia");
        console.log(req.params);
        (async () => {
            ret_val = await operacia.getOperaciePocetLekarovTrvanie(
                req.params.pocetLekarov,
                req.params.trvanie
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get operations",
                description: "Failed to get operations",
                table: "operacia",
            })
            res.status(403).send(err);
        });
    },

    getKrajePodlaPoctuOperovanych: (req, res) => {
        const kraj = require("../models/kraj");
        console.log(req.params);
        (async () => {
            ret_val = await kraj.getKrajePodlaPoctuOperovanych();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get regions by number of operated",
                description: "Failed to get regions by number of operated",
                table: "kraj",
            })
            res.status(403).send(err);
        });
    },

    getPacientiChorobaP13: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getPacientiChorobaP13();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get patients with illness P13",
                description: "Failed to get patients with illness P13",
                table: "pacient",
            })
            res.status(403).send(err);
        });
    },

    getPriemernyVek: (req, res) => {
        const lekar = require("../models/lekar");
        console.log(req.params);
        (async () => {
            ret_val = await lekar.getPriemernyVek();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get average age",
                description: "Failed to get average age of patients",
                table: "lekar",
            })
            res.status(403).send(err);
        });
    },

  getPocetPacientiPodlaVeku: (req, res) => {
    const pacient = require("../models/pacient");
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getPocetPacientiPodlaVeku(
        req.params.cislo_zam,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
        insertLogs({
            status: "failed to get number of patients by age",
            description: "Failed to get number of patients by age",
            table: "pacient",
        })
      res.status(403).send(err);
    });
  },

    getPomerMuziZeny: (req, res) => {
        const os_udaje = require("../models/os_udaje");
        console.log(req.params);
        (async () => {
            ret_val = await os_udaje.getPomerMuziZeny(
        req.params.cislo_zam,
        req.params.rok
      );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get ratio",
                description: "Failed to get ratio",
                table: "os_udaje",
            })
            res.status(403).send(err);
        });
    },

    getHospitalizacieNemocniceXML: (req, res) => {
        res.header("Content-Type", "application/xml");
        const nemocnica = require("../models/nemocnica");
        console.log(req.params);
        (async () => {
            ret_val = await nemocnica.getHospitalizacieNemocniceXML(
                req.params.id_nemocnice
            );
            res.status(200).send(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get hospitalizations",
                description: "Failed to get hospitalizations",
                table: "nemocnica",
            })
            res.status(403).send(err);
        });
    },

    getOperacieNemocniceXML: (req, res) => {
        res.header("Content-Type", "application/xml");
        const nemocnica = require("../models/nemocnica");
        console.log(req.params);
        (async () => {
            ret_val = await nemocnica.getOperacieNemocniceXML(
                req.params.id_nemocnice
            );
            res.status(200).send(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get operations",
                description: "Failed to get operations",
                table: "nemocnica",
            })
            res.status(403).send(err);
        });
    },

    getOckovaniaNemocniceXML: (req, res) => {
        res.header("Content-Type", "application/xml");
        const nemocnica = require("../models/nemocnica");
        console.log(req.params);
        (async () => {
            ret_val = await nemocnica.getOckovaniaNemocniceXML(
                req.params.id_nemocnice
            );
            res.status(200).send(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get vaccinations",
                description: "Failed to get vaccinations",
                table: "nemocnica",
            })
            res.status(403).send(err);
        });
    },

    getVysetreniaNemocniceXML: (req, res) => {
        res.header("Content-Type", "application/xml");
        const nemocnica = require("../models/nemocnica");
        console.log(req.params);
        (async () => {
            ret_val = await nemocnica.getVysetreniaNemocniceXML(
                req.params.id_nemocnice
            );
            res.status(200).send(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get examinations",
                description: "Failed to get examinations",
                table: "nemocnica",
            })
            res.status(403).send(err);
        });
    },

    getZamestnanciFotka: (req, res) => {
        const zamestnanec = require("../models/zamestnanec");
        (async () => {
            ret_val = await zamestnanec.getZamestnanciFotka(
                req.params.id_zamestnanca
            );
            res.status(200).write(ret_val.FOTKA, "binary");
            res.end(null, "binary");
        })().catch((err) => {
            insertLogs({
                status: "failed to get employees photo",
                description: "Failed to get employees photo",
                table: "zamestnanec",
            })
            res.status(403).send(err);
        });
    },

    getZamestnanciOddelenia: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getZamestnanciOddelenia(
                req.params.id_oddelenia
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get employees of department",
                description: "Failed to get employees of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },

    getPocetPacientovOddelenia: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getPocetPacientovOddelenia(
                req.params.cislo_zam,
            req.params.rok);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get number of patients",
                description: "Failed to get number of patients of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },
    getPocetOperaciiOddelenia: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getPocetOperaciiOddelenia(req.params.cislo_zam,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getPocetOperaciiZamestnanca: (req, res) => {
    const oddelenie = require("../models/oddelenie");
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getPocetOperaciiZamestnanca(
                req.params.cislo_zam,
                req.params.rok
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get number of operations",
                description: "Failed to get number of operations of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },
    getPocetHospitalizaciiOddelenia: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getPocetHospitalizaciiOddelenia(
                req.params.cislo_zam,
                req.params.rok
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get number of hospitalizations",
                description: "Failed to get number of hospitalizations of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },
    getPocetVysetreniOddelenia: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getPocetVysetreniOddelenia(req.params.cislo_zam,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getPocetVysetreniZamestnanca: (req, res) => {
    const oddelenie = require("../models/oddelenie");
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getPocetVysetreniZamestnanca(
                req.params.cislo_zam,
                req.params.rok
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get number of examinations",
                description: "Failed to get number of examinations of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },
    getPocetZamOddelenia: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getPocetZamOddelenia(
                req.params.cislo_zam,
                req.params.rok
            );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get number of employees",
                description: "Failed to get number of employees of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },

    getKrvneSkupinyOddelenia: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getKrvneSkupinyOddelenia(
        req.params.cislo_zam,
        req.params.rok
      );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get blood types",
                description: "Failed to get blood types of department",
                table: "oddelenie",
            })
            res.status(403).send(err);
        });
    },

    getZamestnanec: (req, res) => {
        const zamestnanec = require("../models/zamestnanec");
        console.log(req.params);
        (async () => {
            ret_val = await zamestnanec.getZamestnanec(req.params.id_zamestnanca);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get employee",
                description: "Failed to get employee",
                table: "zamestnanec",
            })
            res.status(403).send(err);
        });
    },

    getZoznamLekarov: (req, res) => {
        const lekar = require("../models/lekar");

        (async () => {
            ret_val = await lekar.getZoznamLekarov(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  getUdalostiOddelenia: (req, res) => {
    const oddelenie = require("../models/oddelenie");

    (async () => {
      ret_val = await oddelenie.getUdalostiOddelenia(
        req.params.cislo_zam,
        req.params.rok
      );
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get list of doctors",
                description: "Failed to get list of doctors",
                table: "lekar",
            })
            res.status(403).send(err);
        });
    },
};
