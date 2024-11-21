import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
    fontFamily: "Open Sans",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  container: {
    flexDirection: "row",
    marginBottom: 10,
    gap: "10px",
  },
  column: {
    flex: 1,
    backgroundColor: "#CCCCCC",
    padding: 10,
  },
  boldText: {
    fontSize: 8,
    marginBottom: 5,
    fontWeight: "bold",
  },
  text: {
    fontSize: 8,
    marginBottom: 5,
    backgroundColor: "white",
    padding: "1px",
    minHeight: "20px",
  },
  textSmall: {
    fontSize: 7,
    marginBottom: 5,
    backgroundColor: "white",
    padding: "5px",
    minHeight: "30px",
  },
  twoColumns: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  bottomContainer: {
    backgroundColor: "#CCCCCC",
    padding: 10,
  },
});

export const PdfMandate = () => {
  const currentDate = new Date().toLocaleDateString();
  const queryString = window.location.search;

  // Parse the query string into URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Access individual parameters using get() method
  const name = urlParams.get("name");
  const surname = urlParams.get("surname");
  const birthId = urlParams.get("birthId");
  const city = urlParams.get("city");
  const PSC = urlParams.get("PSC");
  const dateOfBirth = urlParams.get("dateOfBirth");
  Font.register({
    family: "Open Sans",
    fonts: [
      {
        src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
      },
      {
        src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf",
        fontWeight: 700,
      },
    ],
  });

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>PLNOMOCNESTVO</Text>
          <View style={styles.container}>
            <View style={styles.column}>
              <Text style={styles.boldText}>SPLNOMOCNITEĽ</Text>
              <Text style={styles.text}>
                {name} {surname}
              </Text>
              <Text style={styles.boldText}>TRVALÉ BYDLISKO</Text>
              <Text style={styles.text}>
                {city} {PSC}
              </Text>
              <View style={styles.twoColumns}>
                <View style={{ flexGrow: "1" }}>
                  <Text style={styles.boldText}>Dátum narodenia</Text>
                  <Text style={styles.text}>{dateOfBirth}</Text>
                </View>
                <View style={{ flexGrow: "1" }}>
                  <Text style={styles.boldText}>Rodné číslo</Text>
                  <Text style={styles.text}>{birthId}</Text>
                </View>
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.boldText}>SPLNOMOCNENEC</Text>
              <Text style={styles.text}></Text>
              <Text style={styles.boldText}>TRVALÉ BYDLISKO</Text>
              <Text style={styles.text}></Text>
              <View style={styles.twoColumns}>
                <View style={{ flexGrow: "1" }}>
                  <Text style={styles.boldText}>Dátum narodenia</Text>
                  <Text style={styles.text}></Text>
                </View>
                <View style={{ flexGrow: "1" }}>
                  <Text style={styles.boldText}>Rodné číslo</Text>
                  <Text style={styles.text}></Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.boldText}>
              POSKYTOVATEĽ ZDRAVOTNEJ STAROSTLIVOSTI
            </Text>
            <View style={styles.twoColumns}>
              <View style={{ flexGrow: "1", width: "50%" }}>
                <Text style={styles.boldText}>OBCHODNÉ MENO</Text>
                <Text style={styles.text}></Text>
              </View>
              <View style={{ flexGrow: "1", width: "50%" }}>
                <Text style={styles.boldText}>IČO</Text>
                <Text style={styles.text}></Text>
              </View>
            </View>
            <View style={styles.twoColumns}>
              <View style={{ flexGrow: "1", width: "50%" }}>
                <Text style={styles.boldText}>SÍDLO</Text>
                <Text style={styles.text}></Text>
              </View>
              <View style={{ flexGrow: "1", width: "50%" }}>
                <Text style={styles.boldText}>REGISTRÁCIA V OR</Text>
                <Text style={styles.text}></Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.textSmall}>
              Splnomocniteľ udeľuje v zmysle ustanovenia § 31 a nasl.
              Občianskeho zákonníka plnomocenstvo splnomocnencovi, aby ho
              zastupoval voči poskytovateľovi pri právnych a iných úkonoch v
              nasledovnom rozsahu: {"\n"}
              {"\n"}Pri preberaní zásielok a dokumentov určených na doručenie
              pre splnomocniteľa osobným prevzatím splnomocniteľom u
              poskytovateľa, a to vrátane zásielok a dokumentov obsahujúcich
              výsledky zdravotných vyšetrení splnomocniteľa v zdravotníckych
              zariadeniach poskytovateľa, jeho lekárske správy a informácie o
              jeho zdravotnom stave alebo súvisiace s jeho zdravotným stavom,
              vrátane informácií zo zdravotnej dokumentácie, spravidla vo forme
              uzavretého listu alebo inej uzavretej písomnosti. {"\n"}
              {"\n"}Splnomocniteľ splnomocňuje poskytovateľa na odovzdanie a
              doručenie zásielok určených splnomocniteľovi k osobnému prevzatiu
              splnomocniteľom u poskytovateľa, splnomocnencovi do jeho rúk, a to
              vrátane zásielok obsahujúcich výsledky vyšetrení, lekárske správy,
              informácie o zdravotnom stave splnomocniteľa alebo súvisiace s
              jeho zdravotným stavom, vrátane informácií zo zdravotnej
              dokumentácie v zdravotníckych zariadeniach poskytovateľa.{"\n"}
              {"\n"}
              Splnomocniteľ preberá zodpovednosť za všetky následky, ktoré
              vzniknú výkonom zastúpenia splnomocnencom podľa tohto
              plnomocenstva, najmä porušením tajomstva prepravovaných správ
              (listové tajomstvo), porušením mlčanlivosti, stratou alebo
              zneužitím informácií a údajov doručovaných splnomocniteľovi
              prostredníctvom splnomocnenca.{"\n"}
              {"\n"} Plnomocenstvo udeľuje splnomocniteľ splnomocnencovi na dobu
              určitú – do konca kalendárneho roka, v ktorom ho splnomocniteľ
              udelil a jeho účinnosť zaniká skôr v prípadoch uvedených v § 33b
              Občianskeho zákonníka a smrťou splnomocniteľa. {"\n"}
              {"\n"}Splnomocnenec nie je oprávnený udeliť plnomocenstvo inej
              osobe, aby namiesto neho konala za splnomocniteľa.
            </Text>
            <View style={styles.twoColumns}>
              <View style={{ flexGrow: "1", width: "50%" }}>
                <Text style={styles.boldText}>MIESTO</Text>
                <Text style={styles.text}></Text>
              </View>
              <View style={{ flexGrow: "1", width: "50%" }}>
                <Text style={styles.boldText}>DÁTUM</Text>
                <Text style={styles.text}>{currentDate}</Text>
              </View>
            </View>
            <View style={styles.twoColumns}>
              <View style={{ flexGrow: "1" }}>
                <Text style={styles.boldText}>
                  SPLNOMOCNITEĽ (ÚRADNE OVERENÝ PODPIS)
                </Text>
                <Text style={styles.text}></Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.textSmall}>
              Splnomocnenec uvedené plnomocenstvo prijíma v celom rozsahu, čo
              potvrdzuje svojím vlastnoručným podpisom a zaväzuje sa konať
              výlučne v rozsahu jeho oprávnenia.{"\n"}
              {"\n"} Splnomocnenec si je vedomý, že je povinný podľa zákona
              zachovávať tajomstvo prepravovaných správ (listové tajomstvo) a
              mlčanlivosť o údajoch a informáciách, ktoré mu poskytne alebo
              sprístupní na základe tohto plnomocenstva poskytovateľ a
              zabezpečiť ich ochranu tak, aby nedošlo k ich strate alebo
              zneužitiu.{"\n"}
              {"\n"} Splnomocnenec berie na vedomie povinnosť preukázať svoju
              totožnosť pri konaní na základe tohto plnomocenstva predložením
              dokladu totožnosti.
            </Text>
            <View style={styles.twoColumns}>
              <View style={{ flexGrow: "1", width: "50%" }}>
                <Text style={styles.boldText}>MIESTO</Text>
                <Text style={styles.text}></Text>
              </View>
              <View style={{ flexGrow: "1", width: "50%" }}>
                <Text style={styles.boldText}>DÁTUM</Text>
                <Text style={styles.text}></Text>
              </View>
            </View>
            <View style={styles.twoColumns}>
              <View style={{ flexGrow: "1" }}>
                <Text style={styles.boldText}>
                  SPLNOMOCNENEC (VLASTNORUČNÝ PODPIS)
                </Text>
                <Text style={styles.text}></Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
