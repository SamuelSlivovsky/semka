import React from "react";
import { Page, Text, View, Document, Font } from "@react-pdf/renderer";

export const Pdf = (props) => {
  const currentDate = new Date().toLocaleDateString();
  const { data, reason } = props;
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
          <Text>
            Meno pacienta: {data.MENO} {data.PRIEZVISKO}
          </Text>
          <Text style={{ marginLeft: "auto" }}>Vek: {data.VEK}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>Rodné číslo: {data.ROD_CISLO}</Text>
          <Text style={{ marginLeft: "auto" }}>
            Poisťovňa: {data.NAZOV_POISTOVNE}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>Adresa: {data.NAZOV_OBCE}</Text>
          <Text style={{ marginLeft: "auto" }}>Psč: {data.PSC}</Text>
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
  );
};
