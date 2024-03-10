const fs = require("fs");
const {hash} = require("bcrypt");

function generujRodneCislo(pohlavie, rodnecislo) {

    let rokRodneCislo = parseInt(rodnecislo.substring(0, 2));
    // Ak je rodné číslo staršie ako 54, znamená to, že ide o rodné číslo z 20. storočia, inak z 19. storočia
    rokRodneCislo = rokRodneCislo < 54 ? 2000 + rokRodneCislo : 1900 + rokRodneCislo;
    // Generovanie náhodného roku narodenia
    let rok = Math.floor(Math.random() * 11) - 5 + rokRodneCislo;
    // prekonvertovanie roku na posledne dve cislice
    rok = rok.toString().substring(2, 4);
    const mesiac = Math.floor(Math.random() * 12) + 1;
    const den = Math.floor(Math.random() * 28) + 1;
    // Kód pohlavia (muž: 0-1, žena: 5-6) z tretiej číslice pre cudzinca 2-3 muz 7-8 zena
    let formatovanyMesiac;
    // Ak ide o muža, mesiac sa neupravuje, inak sa k nemu pridá 50 pre cudincov u muzov pridavam 20 a 30 a u zien 70 a 80
    switch (pohlavie) {
        case "muz":
            formatovanyMesiac = mesiac < 10 ? "0" + mesiac : mesiac;
            break;
        case "zena":
            formatovanyMesiac = 50 + mesiac;
            break;
        case "muzCudzinec":
            formatovanyMesiac = 20 + mesiac;
            break;
        case "zenaCudzinec":
            formatovanyMesiac = 70 + mesiac;
            break;
    }

    // Pridanie nuly pred číslice menšie ako 10
    const formatovanyDen = den < 10 ? "0" + den : den;

    // Generovanie kontrolného kódu (4-miestne číslo)
    const kontrolnyKod = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    // Spojenie všetkých častí do rodného čísla
    const rodneCislo = `${rok}${formatovanyMesiac}${formatovanyDen}/${kontrolnyKod}`;
    return rodneCislo;
}

//TODO zistit zlozitost analyza hashovania dat kolko trvaju a aky maju dopad
//Zamysliet sa nad moznostou nahradenia a zasifrovania aby nebolo mozne spojit napriklad vzacne ochorenia s osobou
//Ale toto vedie k tomu ze musim identifikovat skrite vazby medzi chorobami a pacientami

function zistiPohlavie(rodneCislo) {
    const pohlavieKod = parseInt(rodneCislo.charAt(2));
    // Kód pohlavia (muž: 0-1, žena: 5-6) z tretiej číslice pre cudzinca 2-3 muzCudzinec 7-8 zenaCudzinec
    switch (pohlavieKod) {
        case 0:
        case 1:
            return "muz";
        case 5:
        case 6:
            return "zena";
        case 2:
        case 3:
            return "muzCudzinec";
        case 7:
        case 8:
            return "zenaCudzinec";
    }

}


function calculateAgeAndBirthDate(rod_cislo) {
    let thirdDigit = parseInt(rod_cislo.substring(2, 3));
    let year, month, day, birthDate, age;

    if (thirdDigit === 2 || thirdDigit === 3) {
        year = '19' + rod_cislo.substring(0, 2);
        month = ('0' + (parseInt(rod_cislo.substring(2, 4)) % 20)).slice(-2);
        day = rod_cislo.substring(4, 6);
    } else if (thirdDigit === 7 || thirdDigit === 8) {
        year = '19' + rod_cislo.substring(0, 2);
        month = ('0' + (parseInt(rod_cislo.substring(2, 4)) % 70)).slice(-2);
        day = rod_cislo.substring(4, 6);
    } else {
        year = '19' + rod_cislo.substring(0, 2);
        month = ('0' + (parseInt(rod_cislo.substring(2, 4)) % 50)).slice(-2);
        day = rod_cislo.substring(4, 6);
    }

    birthDate = new Date(year, month - 1, day);
    let currentDate = new Date();
    age = currentDate.getFullYear() - birthDate.getFullYear();
    let m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    birthDate = birthDate.toLocaleDateString();

    return { age, birthDate };
}

function nacitajDataZoSuboru(nazovSuboru) {
    //Moznost prepojenia s API v buducnosti
    try {
        const obsahSuboru = fs.readFileSync(`${nazovSuboru}`, "utf-8");
        //Oddelovac v subore medzi menami
        return obsahSuboru.split(";");
    } catch (error) {
        console.error("Chyba pri načítavaní mení zo súboru:", error);
        return [];
    }
}

function hashPacienti(pacienti) {
    const menaMuzy = nacitajDataZoSuboru("../server/utils/menaMuzy.txt");
    const menaZeny = nacitajDataZoSuboru("../server/utils/menaZeny.txt");
    const priezviskoMuzy = nacitajDataZoSuboru(
        "../server/utils/priezviskoMuzy.txt"
    );
    const priezviskoZeny = nacitajDataZoSuboru(
        "../server/utils/priezviskoZeny.txt"
    );

    if (menaMuzy.length === 0 || menaZeny === 0) {
        // console.error("Nepodarilo sa načítať mená zo súboru.");
        return pacienti;
    }
    // Zmena mien v pacientoch
    const hashovaniPacienti = pacienti.map((pacient) => {
        const pohlavie = zistiPohlavie(pacient.ROD_CISLO);
        // Náhodný výber Udajov
        let indexMena;
        let noveMeno;
        let indexPriezviska;
        let novepriezvisko;
        let rodneCislo;
        let zoznamRodnychCisel = [];
        if (pohlavie.includes("muz")) {
            indexMena = Math.floor(Math.random() * menaMuzy.length);
            indexPriezviska = Math.floor(Math.random() * priezviskoMuzy.length);
            noveMeno = menaMuzy[indexMena];
            novepriezvisko = priezviskoMuzy[indexPriezviska];
        } else {
            indexMena = Math.floor(Math.random() * menaZeny.length);
            indexPriezviska = Math.floor(Math.random() * priezviskoZeny.length);
            noveMeno = menaZeny[indexMena];
            novepriezvisko = priezviskoZeny[indexPriezviska];
        }
        //generovanie rodneho cisla + kontrola duplicity
        rodneCislo = generujRodneCislo(pohlavie, pacient.ROD_CISLO);
        zoznamRodnychCisel.push(rodneCislo);
        while (zoznamRodnychCisel.includes(rodneCislo)) {
            rodneCislo = generujRodneCislo(pohlavie, pacient.ROD_CISLO);
        }

        const podrobnosti = calculateAgeAndBirthDate(rodneCislo);

        return {
            ...pacient,
            MENO: noveMeno,
            ROD_CISLO: rodneCislo,
            PRIEZVISKO: novepriezvisko,
            VEK: podrobnosti.age,
            DATUM_NARODENIA: podrobnosti.birthDate
        };
    });
    return hashovaniPacienti;
}

function hashMedical(data) {
    const menaMuzy = nacitajDataZoSuboru("../server/utils/menaMuzy.txt");
    const menaZeny = nacitajDataZoSuboru("../server/utils/menaZeny.txt");
    const priezviskoMuzy = nacitajDataZoSuboru(
        "../server/utils/priezviskoMuzy.txt"
    );
    const priezviskoZeny = nacitajDataZoSuboru(
        "../server/utils/priezviskoZeny.txt"
    );
    if (menaMuzy.length === 0 || menaZeny === 0) {
        console.error("Nepodarilo sa načítať mená zo súboru.");
        return data;
    }
    // Zmena mien v medicinskych zaznamoch
    const hashovaneData = data.map((singlerow) => {
        const pohlavie = zistiPohlavie(singlerow.ROD_CISLO);
        // Náhodný výber Udajov
        let indexMena;
        let noveMeno;
        let indexPriezviska;
        let novepriezvisko;
        if (pohlavie === "muz") {
            indexMena = Math.floor(Math.random() * menaMuzy.length);
            indexPriezviska = Math.floor(Math.random() * priezviskoMuzy.length);
            noveMeno = menaMuzy[indexMena];
            novepriezvisko = priezviskoMuzy[indexPriezviska];
        } else {
            indexMena = Math.floor(Math.random() * menaZeny.length);
            indexPriezviska = Math.floor(Math.random() * priezviskoZeny.length);
            noveMeno = menaZeny[indexMena];
            novepriezvisko = priezviskoZeny[indexPriezviska];
        }

        return {
            ...singlerow,
            MENO: noveMeno,
            ROD_CISLO: generujRodneCislo(pohlavie),
            PRIEZVISKO: novepriezvisko,
        };
    });
    return hashovaneData;
}

//Hash dat zdravotnej karty + nahodny pocet dat
function hashZdravotnaKarta(data) {
    if (data.length === 0) {
        console.error("Nepodarilo sa načítať recepty.");
        return data;
    }
    //Nahodny pocet dat
    let randomPocetDat = Math.floor(Math.random() * 10);
    const orezaneData = data.slice(0, randomPocetDat);
    const hashovaneData = orezaneData.map((singlerow) => {
        let novyRecept;
        let indexReceptu = Math.floor(Math.random() * orezaneData.length);
        novyRecept = orezaneData[indexReceptu];

        return {
            ...singlerow,
            RECEPT: novyRecept,
        };
    });
    return hashovaneData;
}

module.exports = {
    hashZdravotnaKarta,
    hashPacienti,
    hashMedical,
};
