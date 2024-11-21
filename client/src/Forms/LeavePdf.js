import React from "react";
import { Page, Text, View, Document, Font } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
export const LeavePdf = () => {
  const currentDate = new Date().toLocaleDateString();
  const queryString = window.location.search;

  // Parse the query string into URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Access individual parameters using get() method
  const name = urlParams.get("name");
  const surname = urlParams.get("surname");
  const birthId = urlParams.get("birthId");
  const message = urlParams.get("message");
  const leaveDate = urlParams.get("leaveDate");
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
              Prepúšťacia správa
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
              }}
            >
              Potvrdzujeme prepustenie pacienta/ky {name} {surname}{" "}
              hospitalizovaného/nu dňa {leaveDate}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>Rodné číslo: {birthId}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>Dôvod: {message}</Text>
          </View>

          <View style={{ position: "absolute", left: 10, bottom: 10 }}>
            <Text>{currentDate}</Text>
          </View>
          <View style={{ position: "absolute", right: 280, bottom: 10 }}>
            <Text>..........................................</Text>
            <Text>Pečiatka a podpis lekára</Text>
          </View>
          <View style={{ position: "absolute", right: 10, bottom: 10 }}>
            <Text>.............................................</Text>
            <Text>Pečiatka a podpis primára</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
