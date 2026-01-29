// utils/generateCertificate.js
import PDFDocument from "pdfkit";
import fs from "fs";

const generateCertificate = (studentName, courseName) => {
    const doc = new PDFDocument();
    const filePath = `certificates/${studentName}-${courseName}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(26).text("Certificate of Completion", { align: "center" });
    doc.moveDown();

    doc.fontSize(18).text(
        `This is to certify that ${studentName}\n
    has successfully completed the course\n
    "${courseName}"`,
        { align: "center" }
    );

    doc.moveDown(2);
    doc.text("Date: " + new Date().toDateString(), { align: "center" });

    doc.end();
    return filePath;
};

export default generateCertificate;
