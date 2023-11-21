import React, { useRef } from 'react';
import { Document, Page, Text, View, PDFViewer } from '@react-pdf/renderer';
import html2pdf from 'html2pdf.js';

const PDFGenerator = ({ content }) => {
  const pdfRef = useRef();

  const downloadPDF = () => {
    const element = pdfRef.current;
    const options = {
      margin: 1,
      filename: 'generated.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <div>
      <PDFViewer>
        <Document>
          <Page size="A4">
            <View>
              <Text>{content}</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default PDFGenerator;
