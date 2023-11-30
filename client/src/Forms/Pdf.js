import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";

export const Pdf = (props) => {
  console.log(props);
  return (
    <Document>
      <Page>
        <View>
          <Text>{props.eventType}</Text>
        </View>
        <View>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};
