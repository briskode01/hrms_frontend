import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, CreditCard, Landmark, Banknote, CalendarDays, Wallet, FileText, Loader2, Receipt } from "lucide-react";
import API from "@/api/axios";
import toast from "react-hot-toast";

const STEPS = [
    { id: 1, title: "Review Invoice" },
    { id: 2, title: "Payment Details" },
    { id: 3, title: "Select Method" },
    { id: 4, title: "Processing" },
    { id: 5, title: "Confirmation" }
];

export default function PaymentStepperModal({ payroll, onClose, onSuccess, apiPath }) {
    const [currentStep, setCurrentStep] = useState(1);
    
    // Payment Data
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentNote, setPaymentNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);
    const [processStatus, setProcessStatus] = useState("Initializing connection...");

    // Calculations
    const gross = Number(payroll?.earnings?.basic || 0) + Number(payroll?.earnings?.hra || 0) + Number(payroll?.earnings?.bonus || 0);
    const totalDeductions = Number(payroll?.deductions?.pf || 0) + Number(payroll?.deductions?.ptax || 0) + Number(payroll?.deductions?.esi || 0) + Number(payroll?.deductions?.leaveDeduction || 0);
    const net = gross - totalDeductions;

    // Handle processing simulation
    useEffect(() => {
        if (currentStep === 4) {
            setIsProcessing(true);
            const statuses = [
                "Connecting to Payment Gateway...",
                "Authenticating credentials...",
                "Verifying funds availability...",
                "Initiating transfer to employee account...",
                "Awaiting confirmation from receiving bank...",
                "Finalizing transaction..."
            ];
            
            let i = 0;
            const interval = setInterval(() => {
                if (i < statuses.length) {
                    setProcessStatus(statuses[i]);
                    i++;
                } else {
                    clearInterval(interval);
                    executePayment();
                }
            }, 800); // Simulate 4-5 seconds of processing

            return () => clearInterval(interval);
        }
    }, [currentStep]);

    const executePayment = async () => {
        try {
            const endpoint = apiPath
                ? `${apiPath}/${payroll._id}/mark-paid`
                : `/payroll/${payroll._id}/mark-paid`;
            await API.put(endpoint, { paymentMethod });
            setIsProcessing(false);
            setCurrentStep(5);
        } catch (err) {
            toast.error("Payment failed: " + (err.response?.data?.message || err.message));
            setCurrentStep(3); // Go back to method selection
            setIsProcessing(false);
        }
    };

    const handleNext = () => {
        if (currentStep < 5) setCurrentStep(c => c + 1);
    };

    const handleBack = () => {
        if (currentStep > 1 && currentStep < 4) setCurrentStep(c => c - 1);
    };

    // ─────────────────────────────────────────────────────────────
    // Sub-components for each step
    // ─────────────────────────────────────────────────────────────
    
    const Step1Review = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                    {payroll.employee?.firstName?.[0]}{payroll.employee?.lastName?.[0]}
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{payroll.employee?.firstName} {payroll.employee?.lastName}</h3>
                    <p className="text-slate-500">{payroll.employee?.employeeId} · {payroll.employee?.department}</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4" /> Salary Breakdown</h4>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Basic Pay</span>
                        <span className="font-medium">₹{payroll?.earnings?.basic?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Allowances (HRA, Bonus)</span>
                        <span className="font-medium text-emerald-600">+₹{((payroll?.earnings?.hra || 0) + (payroll?.earnings?.bonus || 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Total Deductions</span>
                        <span className="font-medium text-red-500">-₹{totalDeductions.toLocaleString()}</span>
                    </div>
                    <hr className="border-slate-100" />
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-900">Net Payable Amount</span>
                        <span className="text-2xl font-black text-slate-900">₹{net.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const Step2Details = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center">
                <p className="text-emerald-800 font-medium mb-1">Amount to be transferred</p>
                <p className="text-4xl font-black text-emerald-600">₹{net.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> Expected Payment Date
                    </label>
                    <input 
                        type="date" 
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Payment Reference / Note (Optional)
                    </label>
                    <textarea 
                        rows={3}
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="e.g., Salary for March 2026 including performance bonus..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    />
                </div>
            </div>
        </div>
    );

    const Step3Method = () => {
        const methods = [
            { id: "Bank Transfer", icon: Landmark, desc: "Direct NEFT/RTGS transfer to employee account", badge: "Recommended" },
            { id: "Cash", icon: Banknote, desc: "Physical cash handover", badge: null },
            { id: "Cheque", icon: Wallet, desc: "Bank cheque issuance", badge: null }
        ];

        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="font-bold text-slate-800 mb-4">Select Payment Method</h3>
                <div className="grid gap-4">
                    {methods.map((m) => {
                        const Icon = m.icon;
                        const isSelected = paymentMethod === m.id;
                        return (
                            <div 
                                key={m.id}
                                onClick={() => setPaymentMethod(m.id)}
                                className={`relative flex items-center gap-4 p-5 rounded-2xl cursor-pointer border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className={`font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{m.id}</h4>
                                        {m.badge && <span className="text-[10px] uppercase tracking-wider font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{m.badge}</span>}
                                    </div>
                                    <p className={`text-sm mt-0.5 ${isSelected ? 'text-blue-700/80' : 'text-slate-500'}`}>{m.desc}</p>
                                </div>
                                
                                {isSelected && m.id === "Bank Transfer" && (
                                    <div className="absolute -bottom-3 right-6 bg-white border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-slate-600 shadow-sm flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Acc: **** 8472
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };

    const Step4Processing = () => (
        <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Landmark className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mt-8 mb-2">Processing Payment</h3>
            <p className="text-slate-500 max-w-xs mx-auto animate-pulse">{processStatus}</p>
            
            <div className="w-64 h-2 bg-slate-100 rounded-full mt-8 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-[progress_4s_ease-in-out_forwards]"></div>
            </div>
            
            <style jsx>{`
                @keyframes progress {
                    0% { width: 0%; }
                    20% { width: 30%; }
                    50% { width: 60%; }
                    80% { width: 85%; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );

    const Step5Confirmation = () => (
        <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100/50">
                <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Payment Successful!</h3>
            <p className="text-slate-500 mb-8 max-w-sm">
                Successfully transferred <strong>₹{net.toLocaleString()}</strong> to {payroll.employee?.firstName} {payroll.employee?.lastName}.
            </p>
            
            <div className="bg-slate-50 w-full max-w-md rounded-2xl p-6 border border-slate-100 text-left space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-mono font-bold text-slate-700">TXN{Math.random().toString().slice(2, 12)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-bold text-slate-700">{new Date(paymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Method</span>
                    <span className="font-bold text-slate-700">{paymentMethod}</span>
                </div>
            </div>
            
            <div className="flex gap-4 w-full max-w-md">
                <button onClick={() => { onSuccess(); onClose(); }} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors">
                    Done
                </button>
                <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Receipt className="w-4 h-4" /> Receipt
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900">Payment Gateway</h2>
                            <p className="text-xs text-slate-500 font-medium">Secure Disbursement Portal</p>
                        </div>
                    </div>
                    {currentStep < 4 && (
                        <button onClick={onClose} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors">
                            ×
                        </button>
                    )}
                </div>

                {/* Stepper Progress Bar */}
                {currentStep < 4 && (
                    <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between shrink-0">
                        {STEPS.map((step, idx) => (
                            <div key={step.id} className={`flex flex-col items-center gap-2 relative z-10 w-full ${idx === STEPS.length - 1 ? 'max-w-[40px]' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors bg-white ${
                                    currentStep > step.id ? 'border-emerald-500 text-emerald-500' : 
                                    currentStep === step.id ? 'border-blue-600 text-blue-600' : 
                                    'border-slate-200 text-slate-400'
                                }`}>
                                    {currentStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wide absolute -bottom-5 w-max ${
                                    currentStep >= step.id ? 'text-slate-700' : 'text-slate-400'
                                }`}>
                                    {step.title}
                                </span>
                                
                                {idx < STEPS.length - 1 && (
                                    <div className={`absolute top-4 left-8 right-[-1rem] h-[2px] -z-10 ${
                                        currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto flex-1 min-h-[300px]">
                    {currentStep === 1 && <Step1Review />}
                    {currentStep === 2 && <Step2Details />}
                    {currentStep === 3 && <Step3Method />}
                    {currentStep === 4 && <Step4Processing />}
                    {currentStep === 5 && <Step5Confirmation />}
                </div>

                {/* Modal Footer */}
                {currentStep < 4 && (
                    <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex justify-between shrink-0 rounded-b-[2rem]">
                        <button 
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-colors ${
                                currentStep === 1 ? 'text-transparent cursor-default' : 'text-slate-500 hover:bg-slate-200 bg-slate-100'
                            }`}
                        >
                            Back
                        </button>
                        
                        <button 
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
                        >
                            {currentStep === 3 ? "Process Payment" : "Continue"} <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
