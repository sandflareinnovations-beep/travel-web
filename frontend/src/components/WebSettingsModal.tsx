"use client";

import { useState, useEffect } from "react";
import { useFlightStore } from "@/store/useFlightStore";
import { X, Check } from "lucide-react";

interface WebSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CURRENCIES = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "AED", symbol: "AED", name: "UAE Dirham" },
];

export default function WebSettingsModal({ isOpen, onClose }: WebSettingsModalProps) {
    const { webSettings, setWebSettings } = useFlightStore();

    // Local state for changes before saving
    const [localSettings, setLocalSettings] = useState(webSettings);

    // Sync local state when modal opens or store changes
    useEffect(() => {
        if (isOpen) {
            setLocalSettings(webSettings);
        }
    }, [isOpen, webSettings]);

    const handleSave = () => {
        setWebSettings(localSettings);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Toggles Group */}
                    <div className="space-y-4">
                        {/* Refundable */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800">Refundable Fares Only</h3>
                                <p className="text-xs text-slate-500">Show only refundable flights by default</p>
                            </div>
                            <button
                                onClick={() => setLocalSettings(s => ({ ...s, isRefundable: !s.isRefundable }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.isRefundable ? "bg-blue-600" : "bg-slate-200"
                                    }`}
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${localSettings.isRefundable ? "translate-x-6" : "translate-x-0"
                                    }`} />
                            </button>
                        </div>

                        {/* Direct Flight */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800">Direct Flights Only</h3>
                                <p className="text-xs text-slate-500">Prefer non-stop flights</p>
                            </div>
                            <button
                                onClick={() => setLocalSettings(s => ({ ...s, isDirect: !s.isDirect }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.isDirect ? "bg-blue-600" : "bg-slate-200"
                                    }`}
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${localSettings.isDirect ? "translate-x-6" : "translate-x-0"
                                    }`} />
                            </button>
                        </div>

                        {/* Student Fare */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800">Student Fares</h3>
                                <p className="text-xs text-slate-500">Search for student discounts</p>
                            </div>
                            <button
                                onClick={() => setLocalSettings(s => ({ ...s, isStudent: !s.isStudent }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.isStudent ? "bg-blue-600" : "bg-slate-200"
                                    }`}
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${localSettings.isStudent ? "translate-x-6" : "translate-x-0"
                                    }`} />
                            </button>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Currency Selection */}
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-3">Currency</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {CURRENCIES.map((curr) => (
                                <button
                                    key={curr.code}
                                    onClick={() => setLocalSettings(s => ({ ...s, currency: curr.code }))}
                                    className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${localSettings.currency === curr.code
                                            ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm"
                                            : "border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-600"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs text-slate-500 font-mono">
                                            {curr.symbol}
                                        </span>
                                        {curr.code}
                                    </span>
                                    {localSettings.currency === curr.code && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
