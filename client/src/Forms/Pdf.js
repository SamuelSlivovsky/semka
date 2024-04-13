import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  eventType: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
  },
  bottomRight: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
  bottomLeft: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 10,
  },
  image: {
    width: 200,
    height: "auto",
  },
});

export const Pdf = (props) => {
  const { eventType, data, desc, doctor, name, image } = props;
  const today = new Date().toLocaleString();

  return (
    <Document>
      <Page style={{ margin: "10px", padding: "10px" }}>
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
        {image && <Image src={image} style={styles.image} />}
        <Text style={styles.bottomLeft}>{today}</Text>
        <View style={styles.bottomRight}>
          <Text>......................</Text>
          <Text>Podpis lekára</Text>
        </View>
      </Page>
    </Document>
  );
};
