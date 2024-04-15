const lekar = require("../models/lekar");
const {hashPacienti} = require("../utils/hashData");
const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
    getPacienti: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            pacienti = await lekar.getPacienti(req.params.id);
            if (req.role === 0) {
                pacienti = hashPacienti(pacienti);
            }
            res.status(200).json(pacienti);
        })().catch((err) => {
            insertLogs({
                status: "failed to get pacienti",
                description: "Failed to get pacienti with id:" + req.params.id,
                table: "PACIENT_TAB",
            })
            res.status(500).send(err);
        });
    },

    getLekari: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            lekari = await lekar.getLekari(req.params.id);
            res.status(200).json(lekari);
        })().catch((err) => {
            insertLogs({
                status: "failed to get lekari",
                description: "Failed to get lekari with id:" + req.params.id,
                table: "LEKAR_TAB",
            })
            res.status(500).send(err);
        });
    },

    getOperacie: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            if (req.role === 0) {
                operacie = await lekar.getOperacieAdmin();
                // operacie = await lekar.getOperacie(req.params.id);
                operacie = hashPacienti(operacie);
            } else {
                operacie = await lekar.getOperacie(req.params.id);
            }
            res.status(200).json(operacie);
        })().catch((err) => {
            insertLogs({
                status: "failed to get operacie",
                description: "Failed to get operacie with id:" + req.params.id,
                table: "OPERACIA_TAB",
            })
            res.status(500).send(err);
        });
    },

    getVysetrenia: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            if (req.role === 0) {
                vysetrenia = await lekar.getVysetreniaAdmin();
                vysetrenia = hashPacienti(vysetrenia);
            } else {
                vysetrenia = await lekar.getVysetrenia(req.params.id);
            }
            res.status(200).json(vysetrenia);
        })().catch((err) => {
            insertLogs({
                status: "failed to get vysetrenia",
                description: "Failed to get vysetrenia with id:" + req.params.id,
                table: "VYSETRENIE_TAB",
            })
            res.status(500).send(err);
        });
    },

    getHospitalizacie: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            if (req.role === 0) {
                hospitalizacie = await lekar.getHospitalizacieAdmin();
                hospitalizacie = hashPacienti(hospitalizacie);
            } else {
                hospitalizacie = await lekar.getHospitalizacie(req.params.id);
            }
            res.status(200).json(hospitalizacie);
        })().catch((err) => {
            insertLogs({
                status: "failed to get hospitalizacie",
                description: "Failed to get hospitalizacie with id:" + req.params.id,
                table: "HOSPITALIZACIA_TAB",
            })
            res.status(500).send(err);
        });
    },

    getLekarInfo: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            info = await lekar.getLekarInfo(req.params.id);
            res.status(200).json(info);
        })().catch((err) => {
            insertLogs({
                status: "failed to get lekar info",
                description: "Failed to get lekar info with id:" + req.params.id,
                table: "LEKAR_TAB",
            })
            res.status(500).send(err);
        });
    },

    getNemocnicaOddelenia: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            info = await lekar.getNemocnicaOddelenia(req.params.id);
            res.status(200).json(info);
        })().catch((err) => {
            insertLogs({
                status: "failed to get nemocnica oddelenia",
                description: "Failed to get nemocnica oddelenia with id:" + req.params.id,
                table: "NEMOCNICA_TAB",
            })
            res.status(500).send(err);
        });
    },

    getKonzilia: (req, res) => {
        const konzilium = require("../models/konzilium");
        (async () => {
            info = await konzilium.getKonzilia(req.params.id);
            res.status(200).json(info);
        })().catch((err) => {
            insertLogs({
                status: "failed to get konzilia",
                description: "Failed to get konzilia with id:" + req.params.id,
                table: "KONZILIUM_TAB",
            })
            res.status(500).send(err);
        });
    },

    getZaznamy: (req, res) => {
        const zaznam = require("../models/zdravotny_zaznam");
        (async () => {
            info = await zaznam.getZaznamy(req.params.id);
            res.status(200).json(info);
        })().catch((err) => {
            insertLogs({
                status: "failed to get zaznamy",
                description: "Failed to get zaznamy with id:" + req.params.id,
                table: "ZDRAVOTNY_ZAZNAM_TAB",
            })
            res.status(500).send(err);
        });
    },

    getMiestnosti: (req, res) => {
        const miestnost = require("../models/miestnost");
        (async () => {
            info = await miestnost.getMiestnosti(req.params.id);
            res.status(200).json(info);
        })().catch((err) => {
            insertLogs({
                status: "failed to get miestnosti",
                description: "Failed to get miestnosti with id:" + req.params.id,
                table: "MIESTNOST_TAB",
            })
            res.status(500).send(err);
        });
    },

    getNeobsadeneLozka: (req, res) => {
        const lozko = require("../models/lozko");
        (async () => {
            info = await lozko.getNeobsadeneLozka(req.params.id);
            res.status(200).json(info);
        })().catch((err) => {
            insertLogs({
                status: "failed to get neobsadene lozka",
                description: "Failed to get neobsadene lozka with id:" + req.params.id,
                table: "LOZKO_TAB",
            })
            res.status(500).send(err);
        });
    },

    updateKonzilium: (req, res) => {
        const konzilium = require("../models/konzilium");
        (async () => {
            info = await konzilium.updateKonzilium(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: "failed to update konzilium",
                description: "Failed to update konzilium with id:" + req.body.id,
                table: "KONZILIUM_TAB",
            })
            res.status(500).send(err);
        });
    },
};
