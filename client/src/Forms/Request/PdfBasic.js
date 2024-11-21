import React from "react";
import { Page, Text, View, Document, Font } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
export const PdfBasic = () => {
  const currentDate = new Date().toLocaleDateString();
  const queryString = window.location.search;

  // Parse the query string into URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Access individual parameters using get() method
  const name = urlParams.get("name");
  const surname = urlParams.get("surname");
  const birthId = urlParams.get("birthId");
  const insurance = urlParams.get("insurance");
  const city = urlParams.get("city");
  const age = urlParams.get("age");
  const PSC = urlParams.get("PSC");
  const reason = urlParams.get("reason");
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
        <Page
          style={{
            padding: "10px",
            fontFamily: "Open Sans",
            display: "flex",
            gap: "20px",
          }}
        >
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
              }}
            >
              Žiadanka
            </Text>
          </View>
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              Vyšetrenie
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold" }}>Meno pacienta: </Text>
            <Text style={{ marginLeft: "10px" }}>
              {name} {surname}
            </Text>
            <Text style={{ marginLeft: "20px", fontWeight: "bold" }}>Vek:</Text>
            <Text style={{ marginLeft: "10px" }}>{age}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>Rodné číslo: {birthId}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>Poisťovňa: {insurance}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>Adresa: {city}</Text>
            <Text style={{ marginLeft: "20px" }}>Psč: {PSC}</Text>
          </View>
          <View>
            <Text>Dôvod: {reason}</Text>
          </View>
          <View style={{ position: "absolute", left: 10, bottom: 10 }}>
            <Text>{currentDate}</Text>
          </View>
          <View style={{ position: "absolute", right: 10, bottom: 10 }}>
            <Text>..............................</Text>
            <Text>Pečiatka a podpis</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
