//TODO Doplnit funkcie zamienania udajov
const fs = require('fs');

function generujRodneCislo(pohlavie) {
    let rok = Math.floor(Math.random() * (1999 - 1954 + 1)) + 1954;
    rok = rok % 100;
    const mesiac = Math.floor(Math.random() * 12) + 1;
    const den = Math.floor(Math.random() * 28) + 1;

    // Kód pohlavia (muž: 0-1, žena: 5-6) z tretiej číslice
    let formatovanyMesiac
    if (pohlavie === 'muz') {
        formatovanyMesiac = (mesiac < 10) ? '0' + mesiac : mesiac;
    } else {
        formatovanyMesiac = 50 + mesiac;
    }

    // Pridanie nuly pred číslice menšie ako 10
    const formatovanyDen = den < 10 ? '0' + den : den;
    rok = rok < 10 ? '0' + rok : rok;

    // Generovanie kontrolného kódu (4-miestne číslo)
    const kontrolnyKod = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Spojenie všetkých častí do rodného čísla
    const rodneCislo = `${rok}${formatovanyMesiac}${formatovanyDen}/${kontrolnyKod}`;

    return rodneCislo;
}

function zistiPohlavie(rodneCislo) {
    //TODO pridat podmeniku aby kontrolovalo rodne cislo cudzinca cudzinca
    const pohlavieKod = parseInt(rodneCislo.charAt(2));
    // Ak je pohlavie kód párne číslo, ide o ženu, inak o muža
    return pohlavieKod === 0 || pohlavieKod === 1 ? 'muz' : pohlavieKod === 5 || pohlavieKod === 6 ? 'zena' : null;
}

function nacitajDataZoSuboru(nazovSuboru) {
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
    const menaMuzy = nacitajDataZoSuboru("../server/utils/menaMuzy.txt");
    const menaZeny = nacitajDataZoSuboru("../server/utils/menaZeny.txt");
    const priezviskoMuzy = nacitajDataZoSuboru("../server/utils/priezviskoMuzy.txt")
    const priezviskoZeny = nacitajDataZoSuboru("../server/utils/priezviskoZeny.txt")

    if (menaMuzy.length === 0 || menaZeny === 0) {
        console.error('Nepodarilo sa načítať mená zo súboru.');
        return pacienti;
    }
    // Zmena mien v pacientoch
    const hashovaniPacienti = pacienti.map(pacient => {
        const pohlavie = zistiPohlavie(pacient.ROD_CISLO);
        // Náhodný výber Udajov
        let indexMena;
        let noveMeno;
        let indexPriezviska;
        let novepriezvisko;
        if (pohlavie === 'muz') {
            indexMena = Math.floor(Math.random() * menaMuzy.length);
            indexPriezviska = Math.floor(Math.random() * priezviskoMuzy.length);
            noveMeno = menaMuzy[indexMena];
            novepriezvisko = priezviskoMuzy[indexPriezviska]
        } else {
            indexMena = Math.floor(Math.random() * menaZeny.length);
            indexPriezviska = Math.floor(Math.random() * priezviskoZeny.length);
            noveMeno = menaZeny[indexMena];
            novepriezvisko = priezviskoZeny[indexPriezviska]
        }
        return {
            MENO: noveMeno,
            ROD_CISLO: generujRodneCislo(pohlavie),
            PRIEZVISKO: novepriezvisko,
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