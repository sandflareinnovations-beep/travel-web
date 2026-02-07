"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Key, ShieldCheck, Mail, ArrowRight, UserCog, User, Globe, Hash, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { flightApi } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [payload, setPayload] = useState({
        MerchantID: "300",
        ApiKey: "kXAY9yHARK",
        ClientID: "bitest",
        Password: "staging@1",
        AgentCode: "",
        BrowserKey: "caecd3cd30225512c1811070dce615c1",
        Key: "ef20-925c-4489-bfeb-236c8b406f7e"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayload({ ...payload, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            await flightApi.signature(payload);
            router.push('/');
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900 py-12 px-4">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/90" />
            </div>

            <div className="w-full max-w-2xl z-10 animate-fade-in-up">
                <Card className="border-none bg-white/95 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-white/20">
                    <CardHeader className="pt-10 pb-2 flex flex-col items-center text-center space-y-4">
                        <div className="w-full flex justify-center mb-2">
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">FLYINCO.</span>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API Authentication</h1>
                            <p className="text-slate-500 text-sm font-medium mt-1">Provide your credentials to access the platform</p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Merchant ID */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Merchant ID
                                </Label>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="MerchantID"
                                        value={payload.MerchantID}
                                        onChange={handleChange}
                                        className="pl-12 h-12 bg-slate-50/50 border-slate-200"
                                    />
                                </div>
                            </div>

                            {/* API Key */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5" /> API Key
                                </Label>
                                <div className="relative group">
                                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="ApiKey"
                                        value={payload.ApiKey}
                                        onChange={handleChange}
                                        type="password"
                                        className="pl-12 h-12 bg-slate-50/50 border-slate-200"
                                    />
                                </div>
                            </div>

                            {/* Client ID */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" /> Client ID
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="ClientID"
                                        value={payload.ClientID}
                                        onChange={handleChange}
                                        className="pl-12 h-12 bg-slate-50/50 border-slate-200"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5" /> Password
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="Password"
                                        value={payload.Password}
                                        onChange={handleChange}
                                        type="password"
                                        className="pl-12 h-12 bg-slate-50/50 border-slate-200"
                                    />
                                </div>
                            </div>

                            {/* Agent Code */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                    <UserCog className="w-3.5 h-3.5" /> Agent Code
                                </Label>
                                <Input
                                    name="AgentCode"
                                    value={payload.AgentCode}
                                    onChange={handleChange}
                                    className="h-12 bg-slate-50/50 border-slate-200"
                                    placeholder="Optional"
                                />
                            </div>

                            {/* Browser Key */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5" /> Browser Key
                                </Label>
                                <Input
                                    name="BrowserKey"
                                    value={payload.BrowserKey}
                                    onChange={handleChange}
                                    className="h-12 bg-slate-50/50 border-slate-200"
                                />
                            </div>
                        </div>

                        {/* Secret Key (Full Width) */}
                        <div className="mt-6 space-y-2">
                            <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide">Technical Key</Label>
                            <Input
                                name="Key"
                                value={payload.Key}
                                onChange={handleChange}
                                className="h-12 bg-slate-50/50 border-slate-200 text-slate-500 font-mono text-sm"
                            />
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <Button
                            className="w-full mt-8 h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 text-lg"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Establish Secure Session"}
                            {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                        </Button>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-400/80 text-xs mt-8 font-medium">
                    &copy; 2026 Flyinco Systems. Professional Travel API Interface.
                </p>
            </div>
        </div>
    );
}
