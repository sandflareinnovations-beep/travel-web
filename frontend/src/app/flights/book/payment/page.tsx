"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CheckCircle, Loader2, Wallet, CreditCard,
    AlertCircle, ArrowLeft, Lock, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { flightApi, StartPayPayload } from '@/lib/api';
import { useFlightStore } from '@/store/useFlightStore';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setSelectedFlight } = useFlightStore();

    // URL-ൽ നിന്ന് tid (Transaction ID), amt (Amount), tui എന്നിവ എടുക്കുന്നു
    const transactionId = searchParams.get('tid');
    const amount = searchParams.get('amt');
    const tuiParam = searchParams.get('tui');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            if (!transactionId || !amount) {
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [transactionId, amount, router]);

    const handlePayment = async () => {
        if (!transactionId || !amount) {
            setErrorMsg("Missing transaction details. Please try again.");
            return;
        }

        setLoading(true);
        setStatus('processing');
        setErrorMsg('');

        try {
            const clientId = flightApi.getStoredClientId();
            const token = flightApi.getStoredToken();

            const payload: StartPayPayload = {
                TransactionID: Number(transactionId),
                PaymentAmount: 0,
                NetAmount: Number(amount),
                StartPay: true,
                BrowserKey: "e3f560de2c422e2ed29f4e4b8ab27017",
                ClientID: clientId,
                TUI: tuiParam || "", // Use TUI from URL parameter
                Hold: false,
                Promo: null,
                PaymentType: "Deposit",
                BankCode: "",
                GateWayCode: "",
                MerchantID: "",
                PaymentCharge: 0,
                ReleaseDate: "",
                OnlinePayment: false,
                DepositPayment: true,
                Card: {
                    Number: "", Expiry: "", CVV: "", CHName: "", Address: "",
                    City: "", State: "", Country: "", PIN: "", International: false,
                    SaveCard: false, FName: "", LName: "", EMIMonths: "0"
                },
                VPA: "",
                CardAlias: "",
                QuickPay: null,
                RMSSignature: "",
                TargetCurrency: "INR",
                TargetAmount: 0,
                ServiceType: "ITI"
            };

            console.log("Initiating Payment for ID:", transactionId);
            const response = await flightApi.startPay(payload);
            console.log("Payment Response:", response);

            // ✅ കൺഫർമേഷൻ ചെക്ക്: 200 (Success) അല്ലെങ്കിൽ 6033 (In Progress)
            if (response.Code === "200" || response.Code === "6033" || response.Status === "Success") {
                setStatus('success');

                // സെഷൻ വിവരങ്ങൾ ക്ലിയർ ചെയ്യുന്നു - Using Store now
                sessionStorage.removeItem('bookingPassengers');
                setSelectedFlight(null); // Clear store flight

                // ✅ 2 സെക്കന്റിന് ശേഷം പുതിയ ടിക്കറ്റ് പേജിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു
                // ✅ ശരിയായ പാത്ത് ഇതാണ്
                setTimeout(() => {
                    router.push(`/flights/bookings/${transactionId}`);
                }, 2000);

            } else {
                const msg = Array.isArray(response.Msg) ? response.Msg[0] : response.Msg;
                throw new Error(msg || "Transaction failed. Please contact support.");
            }

        } catch (err: any) {
            console.error("Payment Execution Error:", err);
            setStatus('failed');
            setErrorMsg(err.message || "Something went wrong. Check your wallet balance.");
        } finally {
            setLoading(false);
        }
    };

    if (!isReady) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mb-6">
                <Button variant="ghost" className="pl-0 text-slate-500 hover:bg-transparent" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Review
                </Button>
            </div>

            <Card className="max-w-md w-full shadow-2xl rounded-[2.5rem] overflow-hidden border-none ring-1 ring-slate-100">
                <CardHeader className="bg-slate-900 text-white py-12 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-emerald-500" />
                    <div className="relative z-10">
                        <div className="mx-auto bg-slate-800 w-20 h-20 rounded-3xl flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
                            <Wallet className="h-10 w-10 text-emerald-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Agent Wallet Payment</CardTitle>
                        <p className="text-slate-500 text-xs mt-2 font-mono uppercase tracking-widest">Transaction ID: {transactionId}</p>
                    </div>
                </CardHeader>

                <CardContent className="pt-10 px-10 pb-12 bg-white">
                    {status === 'success' ? (
                        <div className="text-center py-6 animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-12 w-12 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Payment Done!</h3>
                            <p className="text-slate-500 text-sm">Generating your flight ticket...</p>
                            <Loader2 className="h-5 w-5 animate-spin mx-auto mt-8 text-blue-600" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="text-center">
                                <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Total Payable Amount</span>
                                <div className="text-5xl font-black text-slate-900 mt-2 flex items-center justify-center gap-1">
                                    <span className="text-xl text-slate-400 font-bold">₹</span>
                                    {Number(amount).toLocaleString()}
                                </div>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex gap-4">
                                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-900">Secure Wallet Transaction</p>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Direct deduction from Deposit</p>
                                </div>
                            </div>

                            {status === 'failed' && (
                                <Alert variant="destructive" className="rounded-2xl bg-red-50 border-red-100 text-red-900">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className="font-bold">Payment Error</AlertTitle>
                                    <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                className="w-full h-16 text-lg font-black bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> VERIFYING...</>
                                ) : (
                                    <>CONFIRM & PAY <Lock className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>

                            <p className="text-[10px] text-center text-slate-400 font-medium px-4">
                                By clicking "Confirm & Pay", you authorize the deduction of ₹{amount} from your agent wallet.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>}>
            <PaymentContent />
        </Suspense>
    );
}