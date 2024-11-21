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
    fontSize: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    backgroundColor: "white",
    padding: "1px",
    minHeight: "20px",
  },
  twoColumns: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
});

export const PdfResults = () => {
  const currentDate = new Date().toLocaleDateString();
  const queryString = window.location.search;

  // Parse the query string into URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Access individual parameters using get() method
  const name = urlParams.get("name");
  const surname = urlParams.get("surname");
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
          <Text style={styles.title}>
            ŽIADOSŤ O ZASLANIE VÝSLEDKOV {"\n"} ZDRAVOTNÝCH VYŠETRENÍ E-MAILOM
          </Text>
          <View style={styles.container}>
            <View style={styles.column}>
              <Text style={styles.boldText}>
                Ja (meno a priezvisko pacienta)
              </Text>
              <Text style={styles.text}>
                {name} {surname}
              </Text>
              <Text style={styles.boldText}>
                svojím podpisom potvrdzujem, že žiadam o doručenie výsledkového
                listu obsahujúceho výsledky zdravotných vyšetrení, ktoré som
                žiadal(a) vyšetriť dňa
              </Text>

              <Text style={styles.text}></Text>
              <Text style={styles.boldText}>na e-mailovú adresu</Text>
              <Text style={styles.text}></Text>
              <Text style={styles.boldText}>
                Zároveň som si vedomý(á), že zaslaný súbor bude chránený heslom,
                ktoré bude odoslané na mobilné telefónne číslo
              </Text>
              <Text style={styles.text}></Text>
              <View style={styles.twoColumns}>
                <View style={{ flexGrow: "1" }}>
                  <Text style={styles.boldText}>Podpis</Text>
                  <Text style={styles.text}></Text>
                </View>
                <View style={{ flexGrow: "1" }}>
                  <Text style={styles.boldText}>Dátum</Text>
                  <Text style={styles.text}>{currentDate}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.title}>
            ŽIADOSŤ O ZASLANIE VÝSLEDKOV {"\n"}ZDRAVOTNÝCH VYŠETRENÍ E-MAILOM
          </Text>
          <View style={styles.container}>
            <View style={styles.column}>
              <Text style={styles.boldText}>
                Ja (meno a priezvisko pacienta)
              </Text>
              <Text style={styles.text}>
                {name} {surname}
              </Text>
              <Text style={styles.boldText}>
                svojím podpisom potvrdzujem, že žiadam o doručenie výsledkového
                listu obsahujúceho výsledky zdravotných vyšetrení, ktoré som
                žiadal(a) vyšetriť dňa
              </Text>

              <Text style={styles.text}></Text>
              <Text style={styles.boldText}>na e-mailovú adresu</Text>
              <Text style={styles.text}></Text>
              <Text style={styles.boldText}>
                Zároveň som si vedomý(á), že zaslaný súbor bude chránený heslom,
                ktoré bude odoslané na mobilné telefónne číslo
              </Text>
              <Text style={styles.text}></Text>
              <View style={styles.twoColumns}>
                <View style={{ flexGrow: "1" }}>
                  <Text style={styles.boldText}>Podpis</Text>
                  <Text style={styles.text}></Text>
                </View>
                <View style={{ flexGrow: "1" }}>
                  <Text style={styles.boldText}>Dátum</Text>
                  <Text style={styles.text}>{currentDate}</Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
