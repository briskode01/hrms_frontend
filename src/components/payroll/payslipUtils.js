// @ts-nocheck
// client/src/components/payroll/payslipUtils.js

// ─── Constants ────────────────────────────────────────────────
export const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
];

// ─── Formatting helpers ───────────────────────────────────────
export const fmt     = (v) => Number(v || 0).toLocaleString("en-IN");
export const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" }).toUpperCase() : "—";

// ─── Number → Indian words ────────────────────────────────────
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

export function toWords(n) {
    n = Math.round(n);
    if (n === 0)        return "Zero";
    if (n < 20)         return ones[n];
    if (n < 100)        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)       return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + toWords(n % 100) : "");
    if (n < 100000)     return toWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + toWords(n % 1000) : "");
    if (n < 10000000)   return toWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + toWords(n % 100000) : "");
    return toWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + toWords(n % 10000000) : "");
}

// ─── Derive computed values from a payroll record ─────────────
export function derivePayrollAmounts(payroll) {
    const ear = payroll?.earnings   || {};
    const ded = payroll?.deductions || {};

    const basic    = Number(ear.basic  || 0);
    const hra      = Number(ear.hra    || 0);
    const bonus    = Number(ear.bonus  || 0);
    const pf       = Number(ded.pf    || 0);
    const esi      = Number(ded.esi   || 0);
    const ptax     = Number(ded.ptax  || 0);
    const leaveDed = Number(ded.leaveDeduction || 0);

    const totalEarnings = basic + hra + bonus;
    const totalDed      = pf + esi + ptax + leaveDed;
    const netPay        = totalEarnings - totalDed;

    return { basic, hra, bonus, pf, esi, ptax, leaveDed, totalEarnings, totalDed, netPay,
             netWords: toWords(netPay) + " Rupees Only" };
}

// ─── Parse pipe-separated bank details string ─────────────────
export function parseBankDetails(raw = "") {
    const [bankName = "—", bankAcc = "—", pan = "—"] = raw
        ? raw.split("|").map(s => s.trim())
        : [];
    return { bankName, bankAcc, pan };
}

// ─── Build the self-contained print HTML ─────────────────────
export function buildPayslipHtml(payroll) {
    const emp  = payroll?.employee   || {};
    const att  = payroll?.attendance || {};
    const { basic, hra, bonus, pf, esi, ptax, leaveDed, totalEarnings, totalDed, netPay } =
        derivePayrollAmounts(payroll);

    const nameUC     = `${emp.firstName || ""} ${emp.lastName || ""}`.toUpperCase();
    const monthLabel = `${MONTHS[(payroll.month ?? 1) - 1]} ${payroll.year ?? ""}`;
    
    // Structured bank info
    const b = emp.bankInfo || {};
    let bankName = b.bankName;
    let bankAcc  = b.accountNumber;
    let pan      = b.panNumber;
    let ifsc     = b.ifscCode;
    let pfNo     = b.pfNumber;
    let pfUan    = b.pfUAN;

    // Fallback to parsing bankDetails if bankInfo fields are empty
    if (!bankName && !bankAcc && emp.documents?.bankDetails) {
        const parsed = parseBankDetails(emp.documents.bankDetails);
        bankName = parsed.bankName;
        bankAcc  = parsed.bankAcc;
        pan      = parsed.pan;
    }

    // Style helpers
    const cell  = (s = "") => `style="border:1px solid #ccc;padding:6px 10px;vertical-align:top;${s}"`;
    const hcell = (s = "") => `style="border:1px solid #aaa;padding:7px 10px;font-weight:bold;background:#f1f5f9;${s}"`;
    const row   = (label, val) =>
        `<tr><td ${cell("color:#555;width:160px;")}>${label}</td><td ${cell("font-weight:600;")}>${val ?? ""}</td></tr>`;

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Payslip – ${nameUC} – ${monthLabel}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;background:#fff;}
  table{width:100%;border-collapse:collapse;}
  @page{size:A4;margin:0;}
  @media print{body{padding:8mm;}}
  body{padding:20px;}
</style></head><body>
<div style="border:2px solid #334155;">

  <!-- Header -->
  <table><tr>
    <td style="width:150px;border:1px solid #334155;padding:14px;text-align:center;vertical-align:middle;">
      <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#7c3aed);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:900;">H</div>
      <div style="margin-top:6px;font-weight:900;font-size:11px;color:#4f46e5;">HR MANAGEMENT</div>
      <div style="font-size:9px;color:#64748b;letter-spacing:1px;">SYSTEM</div>
    </td>
    <td style="border:1px solid #334155;padding:14px;text-align:center;vertical-align:middle;">
      <div style="font-size:18px;font-weight:900;">HR Management System</div>
      <div style="font-size:11px;color:#475569;margin-top:4px;">Plot no 222, District Center, Chandrasekharpur,</div>
      <div style="font-size:11px;color:#475569;">Bhubaneswar, Odisha 751016</div>
      <div style="font-size:14px;font-weight:900;text-decoration:underline;margin-top:8px;">Pay slip for the month of ${monthLabel}</div>
    </td>
  </tr></table>

  <!-- Employee Details -->
  <table><tr>
    <td style="width:50%;border:1px solid #334155;padding:0;vertical-align:top;"><table><tbody>
      ${row("Name:", nameUC)}
      ${row("Joining Date:", fmtDate(emp.joiningDate))}
      ${row("Designation:", (emp.designation || "—").toUpperCase())}
      ${row("Department:", emp.department)}
      ${row("Location:", emp.address)}
      ${row("Effective Work Days:", att.workingDays)}
      ${row("LOP:", att.lopDays ?? "0")}
    </tbody></table></td>
    <td style="width:50%;border:1px solid #334155;padding:0;vertical-align:top;"><table><tbody>
      ${row("Employee No :", emp.employeeId)}
      ${row("Bank Name :", bankName)}
      ${row("Bank account No:", bankAcc)}
      ${row("IFSC Code:", ifsc)}
      ${row("Pan No:", pan)}
      ${row("PF No:", pfNo)}
      ${row("PF UAN:", pfUan)}
      ${row("Present Days:", att.presentDays)}
    </tbody></table></td>
  </tr></table>

  <!-- Earnings / Deductions -->
  <table><thead>
    <tr>
      <th colspan="3" ${hcell("text-align:center;border:1px solid #334155;width:55%")}>Earnings</th>
      <th colspan="2" ${hcell("text-align:center;border:1px solid #334155;width:45%")}>Deduction</th>
    </tr>
    <tr>
      <th ${hcell("width:35%;text-align:left;")}></th>
      <th ${hcell("width:10%;text-align:right;")}>Full</th>
      <th ${hcell("width:10%;text-align:right;")}>Actual</th>
      <th ${hcell("width:35%;text-align:left;")}></th>
      <th ${hcell("width:10%;text-align:right;")}>Actual</th>
    </tr>
  </thead><tbody>
    <tr><td ${cell()}>BASIC</td><td ${cell("text-align:right;")}>${fmt(basic)}</td><td ${cell("text-align:right;")}>${fmt(basic)}</td><td ${cell()}>PROF TAX</td><td ${cell("text-align:right;")}>${fmt(ptax)}</td></tr>
    <tr><td ${cell()}>HRA</td><td ${cell("text-align:right;")}>${fmt(hra)}</td><td ${cell("text-align:right;")}>${fmt(hra)}</td><td ${cell()}>PF</td><td ${cell("text-align:right;")}>${fmt(pf)}</td></tr>
    <tr><td ${cell()}>BONUS / INCENTIVE</td><td ${cell("text-align:right;")}>${fmt(bonus)}</td><td ${cell("text-align:right;")}>${fmt(bonus)}</td><td ${cell()}>ESI</td><td ${cell("text-align:right;")}>${fmt(esi)}</td></tr>
    <tr><td ${cell()}>&nbsp;</td><td ${cell()}></td><td ${cell()}></td><td ${cell()}>LEAVE DEDUCTION</td><td ${cell("text-align:right;")}>${fmt(leaveDed)}</td></tr>
    <tr style="background:#f8fafc;">
      <th ${hcell("border:1px solid #334155;text-align:left;")}>Total Earnings:INR.</th>
      <th ${hcell("border:1px solid #334155;")}></th>
      <th ${hcell("border:1px solid #334155;text-align:right;")}>${fmt(totalEarnings)}</th>
      <th ${hcell("border:1px solid #334155;text-align:left;")}>Total Deduction:INR.</th>
      <th ${hcell("border:1px solid #334155;text-align:right;")}>${fmt(totalDed)}</th>
    </tr>
  </tbody></table>

  <!-- Net Pay -->
  <table>
    <tr><td style="border:1px solid #334155;padding:8px 10px;"><b>Net Pay for the month (Total Earnings-Total Deductions): </b><span style="font-weight:900;font-size:14px;">&#8377;${fmt(netPay)}</span></td></tr>
    <tr><td style="border:1px solid #334155;padding:8px 10px;font-style:italic;color:#475569;">(${toWords(netPay)} Rupees Only)</td></tr>
  </table>

  <div style="text-align:center;padding:10px;border-top:1px solid #334155;color:#64748b;font-size:11px;">
    This is a system generated payslip and does not require signature.
  </div>
</div>
</body></html>`;
}

// ─── Print via hidden iframe (no popup blocker) ───────────────
export function printViaIframe(html) {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;border:none;opacity:0;";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    iframe.contentWindow.focus();
    setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 400);
}
