//TODO Doplnit funkcie zamienania udajov
const fs = require('fs');

function zistiPohlavie(rodneCislo) {
    //TODO pridat podmeniku aby kontrolovalo rodne cislo cudzinca cudzinca
    const pohlavieKod = rodneCislo[2];
    // Ak je pohlavie kód párne číslo, ide o ženu, inak o muža
    return pohlavieKod % 2 === 0 ? 'zena' : 'muz';
}

function nacitajMenaZoSuboru(nazovSuboru) {
    try {
        const obsahSuboru = fs.readFileSync(`${nazovSuboru}`, 'utf-8');
        //Oddelovac v subore medzi menami
        return obsahSuboru.split(';');
    } catch (error) {
        console.error('Chyba pri načítavaní mení zo súboru:', error);
        return [];
    }
}

function hashPacienti(pacienti) {
    const mena = nacitajMenaZoSuboru("../server/utils/menaMuzy.txt"); // Príklad názvu súboru

    if (mena.length === 0) {
        console.error('Nepodarilo sa načítať mená zo súboru.');
        return pacienti;
    }
    // Zmena mien v pacientoch
    const hashovaniPacienti = pacienti.map(pacient => {
        const pohlavie = zistiPohlavie(pacient.ROD_CISLO);
        const indexMena = pohlavie === 'muz' ? Math.floor(Math.random() * 250) : Math.floor(Math.random() * 250) + 250; // Náhodný výber mena
        const noveMeno = mena[indexMena];
        return {
            MENO: noveMeno,
            ROD_CISLO: pacient.ROD_CISLO,
            PRIEZVISKO: pacient.PRIEZVISKO,
            PSC: pacient.PSC,
            ID_PACIENTA: pacient.ID_PACIENTA
        };
    });
    return hashovaniPacienti;
}

function hashVysetrenia() {

}

function hashHosp() {

}

function hashOperacie() {

}

module.exports = {
    hashPacienti,
    hashVysetrenia,
    hashHosp,
    hashOperacie
};