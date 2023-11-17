import React, { Component } from "react";
import { render, hydrate } from "react-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Pdf } from "./Pdf";

export default class PDFLink extends Component {
  state = {
    loading: false,
  };

  download = (filename, url) => {
    const element = document.createElement("a");
    element.setAttribute("href", `${url}`);
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  createAndDownloadPDF = (pdfContent, filename, divId, callback) => {
    setTimeout(() => {
      const link = (
        <div id={divId}>
          <PDFDownloadLink document={pdfContent} fileName={filename}>
            {({ blob, url, loading, error }) => {
              if (!loading) {
                this.download(filename, URL.createObjectURL(blob));
                callback();
              }
            }}
          </PDFDownloadLink>
        </div>
      );
      const elem = document.createElement("div");
      document.getElementById("pdfButton").appendChild(elem);
      hydrate(link, elem);
    }, 50);
  };

  buildPDF = () => {
    const { loading } = this.state;
    if (!loading) {
      this.setState({ loading: true }, () => {
        this.createAndDownloadPDF(this.generatePDF(), `file.pdf`, `file`, () =>
          this.setState({ loading: false })
        );
      });
    }
  };

  generatePDF = () => {
    // CertificatePDF is a component that returns a PDF <Document />
    return <Pdf {...this.props} />;
  };

  render() {
    const { loading } = this.state;
    return loading ? (
      <div id="pdfButton">Loading...</div>
    ) : (
      <button onClick={this.buildPDF}>
        Click here to download a certificate
      </button>
    );
  }
}
