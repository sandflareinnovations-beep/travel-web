"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ArrowRight, UserCog, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (role: 'admin' | 'agent') => {
        setIsLoading(true);
        setTimeout(() => {
            if (role === 'admin') {
                router.push('/');
            } else {
                router.push('/agent');
            }
        }, 800);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900">
            {/* Background Image - High Quality Minimal Travel Theme */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/90" />
            </div>

            <div className="w-full max-w-md z-10 p-4 animate-fade-in-up">
                <Card className="border-none bg-white/95 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-white/20">
                    <CardHeader className="pt-10 pb-2 flex flex-col items-center text-center space-y-4">
                        {/* Logo Placed Inside - No Background Box */}
                        <div className="w-full flex justify-center mb-2">
                            <img
                                src="/flyinco-logo.png"
                                alt="FLYINCO"
                                className="h-16 object-contain drop-shadow-sm transition-transform hover:scale-105 duration-500"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl font-black text-slate-900 tracking-tighter">FLYINCO.</span>';
                                }}
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                            <p className="text-slate-500 text-sm font-medium mt-1">Please enter your details to sign in</p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 pt-6">
                        <Tabs defaultValue="agent" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100/80 p-1.5 rounded-2xl h-auto">
                                <TabsTrigger
                                    value="agent"
                                    className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-semibold transition-all duration-300 text-slate-500"
                                >
                                    <User className="mr-2 h-4 w-4" /> Agent
                                </TabsTrigger>
                                <TabsTrigger
                                    value="admin"
                                    className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm font-semibold transition-all duration-300 text-slate-500"
                                >
                                    <UserCog className="mr-2 h-4 w-4" /> Admin
                                </TabsTrigger>
                            </TabsList>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide">Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="name@company.com"
                                            className="pl-12 h-14 bg-slate-50/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 rounded-2xl transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold ml-1 text-xs uppercase tracking-wide">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-12 h-14 bg-slate-50/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 rounded-2xl transition-all font-medium"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">Forgot Password?</a>
                                    </div>
                                </div>
                            </div>

                            <TabsContent value="agent">
                                <Button
                                    className="w-full mt-6 h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 text-lg"
                                    onClick={() => handleLogin('agent')}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Authenticating..." : "Sign In"}
                                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                                </Button>
                            </TabsContent>

                            <TabsContent value="admin">
                                <Button
                                    className="w-full mt-6 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 text-lg"
                                    onClick={() => handleLogin('admin')}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Authenticating..." : "Admin Access"}
                                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-400/80 text-xs mt-8 font-medium">
                    &copy; 2025 Flyinco Systems. All rights reserved.
                </p>
            </div>
        </div>
    );
}
