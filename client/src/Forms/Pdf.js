import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";

export const Pdf = (props) => {
  return (
    <Document>
      <Page>
        <View>
          <Text>Text in PDF</Text>
        </View>
        <View>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};
