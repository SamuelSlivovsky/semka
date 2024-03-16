import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  eventType: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
  },
  bottomLeft: {
    position: "absolute",
    bottom: 30,
    left: 30,
    fontSize: 10,
  },
});

export const Pdf = (props) => {
  const { eventType, data, desc, doctor, name } = props;
  const today = new Date().toLocaleString();

  return (
    <Document>
      <Page style={{ margin: "10px" }}>
        <View>
          <Text style={styles.eventType}>{eventType}</Text>
        </View>
        <View style={styles.section}>
          <Text>{`Pacient: ${data.MENO} ${data.PRIEZVISKO}`}</Text>
          <Text>{`Dátum: ${data.DATUM}`}</Text>
        </View>
        <View style={styles.section}>
          <Text>Popis: {desc}</Text>
        </View>
        <Text style={styles.bottomLeft}>{today}</Text>
      </Page>
    </Document>
  );
};
