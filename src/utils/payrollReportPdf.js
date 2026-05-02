import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatMoney = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

export function generateMonthlyPayrollReport({ payrolls, month, year }) {
    if (!payrolls || payrolls.length === 0) {
        toast.error("No payroll records to generate report");
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    const xMargin = 14;
    const primaryBlue = [22, 58, 117];

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(24, 38, 65);
    doc.text("MONTHLY SALARY REPORT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 11;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(58, 102, 170);
    doc.text(`${MONTHS[month - 1]} ${year}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 9;

    doc.setDrawColor(205, 215, 230);
    doc.setLineWidth(0.35);
    doc.line(xMargin, yPosition, pageWidth / 2 - 16, yPosition);
    doc.line(pageWidth / 2 + 16, yPosition, pageWidth - xMargin, yPosition);
    yPosition += 7;

    const totalBasic = payrolls.reduce((sum, p) => sum + Number(p.earnings?.basic || 0), 0);
    const totalDeductions = payrolls.reduce((sum, p) => {
        return sum + (Number(p.deductions?.pf || 0) + Number(p.deductions?.esi || 0) + Number(p.deductions?.ptax || 0) + Number(p.deductions?.leaveDeduction || 0));
    }, 0);
    const totalNet = payrolls.reduce((sum, p) => {
        const gross = Number(p.earnings?.basic || 0) + Number(p.earnings?.hra || 0) + Number(p.earnings?.bonus || 0);
        const deductions = Number(p.deductions?.pf || 0) + Number(p.deductions?.esi || 0) + Number(p.deductions?.ptax || 0) + Number(p.deductions?.leaveDeduction || 0);
        return sum + (gross - deductions);
    }, 0);

    const statsTop = yPosition + 4;
    const statHeight = 24;
    const statGap = 2;
    const statWidth = (pageWidth - xMargin * 2 - statGap * 3) / 4;
    const statItems = [
        { label: "TOTAL EMPLOYEES", value: String(payrolls.length), icon: "people" },
        { label: "BASIC PAY", value: formatMoney(totalBasic), icon: "wallet" },
        { label: "DEDUCTIONS", value: formatMoney(totalDeductions), icon: "pie" },
        { label: "NET PAYABLE", value: formatMoney(totalNet), icon: "hand" },
    ];

    const drawStatIcon = (iconType, cx, cy) => {
        doc.setDrawColor(...primaryBlue);
        doc.setLineWidth(0.5);
        if (iconType === "people") {
            doc.circle(cx - 1.8, cy - 1.6, 1.6);
            doc.circle(cx + 2.2, cy - 1.4, 1.4);
            doc.line(cx - 4.6, cy + 3.0, cx - 0.1, cy + 3.0);
            doc.line(cx - 4.0, cy + 1.9, cx - 1.0, cy + 1.9);
            doc.line(cx + 0.4, cy + 3.1, cx + 4.7, cy + 3.1);
            doc.line(cx + 1.0, cy + 2.0, cx + 3.8, cy + 2.0);
            return;
        }
        if (iconType === "wallet") {
            doc.roundedRect(cx - 4.8, cy - 3.2, 9.6, 6.6, 1.1, 1.1);
            doc.line(cx + 1.6, cy - 1.2, cx + 4.8, cy - 1.2);
            doc.circle(cx + 2.2, cy + 0.9, 0.5);
            return;
        }
        if (iconType === "pie") {
            doc.circle(cx, cy, 4.2);
            doc.line(cx, cy, cx, cy - 4.2);
            doc.line(cx, cy, cx + 3.2, cy + 1.9);
            return;
        }
        doc.setLineWidth(0.5);
        doc.line(cx - 4.4, cy + 2.2, cx - 1.3, cy + 1.2);
        doc.line(cx - 1.3, cy + 1.2, cx + 1.2, cy + 2.1);
        doc.roundedRect(cx + 1.2, cy - 0.8, 4.1, 3.2, 0.8, 0.8);
        doc.text("$", cx + 2.4, cy + 1.4);
    };

    statItems.forEach((item, idx) => {
        const left = xMargin + idx * (statWidth + statGap);
        const iconCx = left + 9;
        const iconCy = statsTop + 8;

        if (idx !== 0) {
            doc.setDrawColor(210, 218, 232);
            doc.setLineWidth(0.35);
            doc.line(left - statGap / 2, statsTop + 2, left - statGap / 2, statsTop + statHeight - 2);
        }

        drawStatIcon(item.icon, iconCx, iconCy);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(96, 110, 132);
        doc.text(item.label, left + 18, statsTop + 7.6);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(24, 38, 65);
        doc.text(item.value, left + 18, statsTop + 17.5);
    });

    yPosition = statsTop + statHeight + 10;

    const availableWidth = pageWidth - xMargin * 2;
    const colRatios = [0.135, 0.30, 0.19, 0.19, 0.185];
    const colWidths = colRatios.map((r) => Math.floor(availableWidth * r));
    colWidths[colWidths.length - 1] += availableWidth - colWidths.reduce((a, b) => a + b, 0);
    const headers = ["EMP ID", "EMPLOYEE NAME", "BASIC PAY", "DEDUCTIONS", "NET PAYABLE"];
    const headerHeight = 10;
    const rowHeight = 9;
    const xStart = xMargin;

    const drawTableHeader = (y) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(255, 255, 255);
        let x = xStart;
        headers.forEach((h, i) => {
            doc.setFillColor(...primaryBlue);
            doc.rect(x, y, colWidths[i], headerHeight, "F");
            doc.setDrawColor(235, 240, 248);
            doc.setLineWidth(0.25);
            doc.rect(x, y, colWidths[i], headerHeight);
            doc.text(h, x + colWidths[i] / 2, y + 6.6, { align: "center" });
            x += colWidths[i];
        });
    };

    drawTableHeader(yPosition);
    yPosition += headerHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(34, 45, 68);

    payrolls.forEach((p, rowIndex) => {
        const gross = Number(p.earnings?.basic || 0) + Number(p.earnings?.hra || 0) + Number(p.earnings?.bonus || 0);
        const deductions = Number(p.deductions?.pf || 0) + Number(p.deductions?.esi || 0) + Number(p.deductions?.ptax || 0) + Number(p.deductions?.leaveDeduction || 0);
        const net = gross - deductions;

        if (rowIndex % 2 === 0) {
            doc.setFillColor(243, 246, 251);
            doc.rect(xStart, yPosition, availableWidth, rowHeight, "F");
        }

        const rowData = [
            p.employee?.employeeId || "-",
            `${p.employee?.firstName || ""} ${p.employee?.lastName || ""}`.trim() || "-",
            formatMoney(p.earnings?.basic || 0),
            formatMoney(deductions),
            formatMoney(net),
        ];

        let x = xStart;
        rowData.forEach((cell, i) => {
            doc.setTextColor(34, 45, 68);
            doc.setDrawColor(213, 220, 232);
            doc.setLineWidth(0.25);
            doc.rect(x, yPosition, colWidths[i], rowHeight);
            if (i <= 1) {
                doc.text(String(cell), x + colWidths[i] / 2, yPosition + 6, { align: "center", maxWidth: colWidths[i] - 4 });
            } else {
                doc.text(String(cell), x + colWidths[i] - 3, yPosition + 6, { align: "right", maxWidth: colWidths[i] - 6 });
            }
            x += colWidths[i];
        });

        yPosition += rowHeight;

        if (yPosition > pageHeight - 40 && rowIndex < payrolls.length - 1) {
            doc.addPage();
            yPosition = 24;
            drawTableHeader(yPosition);
            yPosition += headerHeight;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
        }
    });

    const footerY = pageHeight - 28;
    doc.setDrawColor(220);
    doc.setLineWidth(0.5);
    doc.line(xMargin, footerY, pageWidth - xMargin, footerY);

    doc.setFontSize(9);
    doc.setTextColor(100, 110, 125);
    doc.text("Prepared by: Payroll Department", xMargin, footerY + 10);
    doc.text(`Report Date: ${new Date().toLocaleDateString("en-IN")}`, pageWidth - xMargin, footerY + 10, { align: "right" });

    doc.save(`Payroll_Report_${MONTHS[month - 1]}_${year}.pdf`);
    toast.success("Report downloaded successfully");
}
