// @ts-nocheck
import { useState, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../api/axios";

export function buildReportPdf(title, rows, total, totalLabel) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    const tableData = rows.map(r => [r.label, r.value]);
    if (total !== undefined && totalLabel) {
        tableData.push([{ content: totalLabel, styles: { fontStyle: 'bold' } }, { content: total, styles: { fontStyle: 'bold' } }]);
    }

    autoTable(doc, {
        startY: 30,
        head: [['Description', 'Amount / Details']],
        body: tableData,
    });

    return doc;
}

export default function usePnlUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState("");

    const upload = useCallback(async ({ doc, fileName, month, year }) => {
        setIsUploading(true);
        try {
            const blob = doc.output("blob");
            const formData = new FormData();
            formData.append("report", blob, fileName);
            formData.append("month", String(month));
            formData.append("year", String(year));

            const res = await API.post("/expenditure/reports/pnl-upload", formData);
            setUploadedUrl(res.data?.data?.fileUrl || "");
            return res.data;
        } finally {
            setIsUploading(false);
        }
    }, []);

    return { upload, isUploading, uploadedUrl };
}
