"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, CreditCard, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { flightApi } from '@/lib/api';

interface SSRData {
    Baggage?: any[];
    Meals?: any[];
}

interface SSRSelection {
    baggage: any[];
    meals: any[];
}

interface SSRSelectorProps {
    tui: string;
    onSelectionChange?: (selection: SSRSelection, totalCost: number) => void;
    initialSelection?: SSRSelection;
}

export default function SSRSelector({ tui, onSelectionChange, initialSelection }: SSRSelectorProps) {
    const [ssrData, setSSRData] = useState<SSRData | null>(null);
    const [loadingSSR, setLoadingSSR] = useState(false);
    const [selectedSSR, setSelectedSSR] = useState<SSRSelection>(
        initialSelection || { baggage: [], meals: [] }
    );
    const [showManualForm, setShowManualForm] = useState(false);
    const [apiError, setApiError] = useState(false);

    // Manual entry states
    const [manualBaggage, setManualBaggage] = useState({ description: '', price: '' });
    const [manualMeal, setManualMeal] = useState({ description: '', price: '' });

    useEffect(() => {
        if (tui) {
            fetchSSR();
        }
    }, [tui]);

    // Notify parent when selection changes
    useEffect(() => {
        if (onSelectionChange) {
            const totalCost = [...selectedSSR.baggage, ...selectedSSR.meals]
                .reduce((sum, item) => sum + (item.Price || 0), 0);
            onSelectionChange(selectedSSR, totalCost);
        }
    }, [selectedSSR, onSelectionChange]);

    const fetchSSR = async () => {
        setLoadingSSR(true);
        setApiError(false);
        console.log("🎒 Fetching SSR options...");

        try {
            const clientId = sessionStorage.getItem('client_id') || 'FVI6V120g22Ei5ztGK0FIQ==';
            const data = await flightApi.getSSR(tui, clientId);
            console.log("🎒 SSR Full Response:", data);

            let baggage: any[] = [];
            let meals: any[] = [];

            // 1. Check for new nested structure: Trips[0].Journey[0].Segments[0].SSR
            if (data?.Trips?.[0]?.Journey?.[0]?.Segments?.[0]?.SSR) {
                const ssrList = data.Trips[0].Journey[0].Segments[0].SSR;
                console.log("✅ SSR loaded from nested structure:", ssrList);

                ssrList.forEach((item: any) => {
                    // Map API item to UI format
                    const uiItem = {
                        ...item,
                        Price: item.SSRNetAmount || item.Charge || 0,
                        Weight: item.Description // Fallback for baggage display
                    };

                    if (item.Type === "2") {
                        baggage.push(uiItem);
                    } else if (item.Type === "1") {
                        meals.push(uiItem);
                    }
                });

                setSSRData({ Baggage: baggage, Meals: meals });
            }
            // 2. Fallback: Check for old direct structure
            else if (data.Baggage || data.Meals) {
                setSSRData({ Baggage: data.Baggage, Meals: data.Meals });
            }
            // 3. Fallback: Check for flat SSR array
            else if (data.SSR) {
                setSSRData(data.SSR);
            } else {
                console.warn("⚠️ SSR not available or unknown format", data);
                // Don't show error immediately, just show empty
                setSSRData({ Baggage: [], Meals: [] });
            }

        } catch (error: any) {
            console.error("❌ SSR fetch error:", error);
            setApiError(true);
        } finally {
            setLoadingSSR(false);
        }
    };

    const handleSSRSelect = (type: 'baggage' | 'meals', item: any, isChecked: boolean) => {
        setSelectedSSR(prev => {
            if (isChecked) {
                return {
                    ...prev,
                    [type]: [...prev[type], item]
                };
            } else {
                return {
                    ...prev,
                    [type]: prev[type].filter((i: any) => i.Code !== item.Code)
                };
            }
        });
    };

    const addManualBaggage = () => {
        if (!manualBaggage.description || !manualBaggage.price) return;

        const newItem = {
            Code: `MANUAL_BAG_${Date.now()}`,
            Description: manualBaggage.description,
            Weight: manualBaggage.description,
            Price: parseFloat(manualBaggage.price)
        };

        setSelectedSSR(prev => ({
            ...prev,
            baggage: [...prev.baggage, newItem]
        }));

        setManualBaggage({ description: '', price: '' });
    };

    const addManualMeal = () => {
        if (!manualMeal.description || !manualMeal.price) return;

        const newItem = {
            Code: `MANUAL_MEAL_${Date.now()}`,
            Description: manualMeal.description,
            Name: manualMeal.description,
            Price: parseFloat(manualMeal.price)
        };

        setSelectedSSR(prev => ({
            ...prev,
            meals: [...prev.meals, newItem]
        }));

        setManualMeal({ description: '', price: '' });
    };

    const removeManualItem = (type: 'baggage' | 'meals', code: string) => {
        setSelectedSSR(prev => ({
            ...prev,
            [type]: prev[type].filter((i: any) => i.Code !== code)
        }));
    };

    return (
        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                    </div>
                    Add Extra Services
                </CardTitle>
                {(apiError || ssrData) && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowManualForm(!showManualForm)}
                        className="text-xs"
                    >
                        {showManualForm ? 'Hide Form' : 'Add Manually'}
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-6">
                {loadingSSR ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                        <p className="text-slate-500">Loading available services...</p>
                    </div>
                ) : (
                    <>
                        {/* API-loaded SSR options */}
                        {ssrData && !apiError ? (
                            <div className="space-y-6">
                                {/* Baggage Section */}
                                {ssrData.Baggage && ssrData.Baggage.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                            🧳 Extra Baggage
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {ssrData.Baggage.map((item: any, idx: number) => {
                                                const isSelected = selectedSSR.baggage.some((b: any) => b.Code === item.Code);
                                                return (
                                                    <label
                                                        key={idx}
                                                        className={`border rounded-xl p-4 cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={(e) => handleSSRSelect('baggage', item, e.target.checked)}
                                                                className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-slate-800">{item.Weight || item.Description}</p>
                                                                <p className="text-sm text-slate-600 mt-1">
                                                                    ₹{item.Price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Meals Section */}
                                {ssrData.Meals && ssrData.Meals.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                            🍽️ Meals
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {ssrData.Meals.map((meal: any, idx: number) => {
                                                const isSelected = selectedSSR.meals.some((m: any) => m.Code === meal.Code);
                                                return (
                                                    <label
                                                        key={idx}
                                                        className={`border rounded-xl p-4 cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={(e) => handleSSRSelect('meals', meal, e.target.checked)}
                                                                className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-slate-800">{meal.Name || meal.Description}</p>
                                                                <p className="text-sm text-slate-600 mt-1">
                                                                    ₹{meal.Price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Show message if no SSR available */}
                                {(!ssrData.Baggage || ssrData.Baggage.length === 0) &&
                                    (!ssrData.Meals || ssrData.Meals.length === 0) && (
                                        <p className="text-sm text-slate-500 italic text-center py-4">
                                            No extra services available for this flight.
                                        </p>
                                    )}
                            </div>
                        ) : null}

                        {/* Manual Form (shown when API fails or user clicks Add Manually) */}
                        {(apiError || showManualForm) && (
                            <div className="space-y-6 mt-6">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <h3 className="font-semibold text-slate-700 mb-4">Add Extra Baggage Manually</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-slate-600">Description</Label>
                                            <Input
                                                placeholder="e.g., 15 KG Extra Baggage"
                                                value={manualBaggage.description}
                                                onChange={(e) => setManualBaggage({ ...manualBaggage, description: e.target.value })}
                                                className="h-10"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-600">Price (₹)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="1500"
                                                    value={manualBaggage.price}
                                                    onChange={(e) => setManualBaggage({ ...manualBaggage, price: e.target.value })}
                                                    className="h-10"
                                                />
                                                <Button
                                                    onClick={addManualBaggage}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <h3 className="font-semibold text-slate-700 mb-4">Add Meals Manually</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-slate-600">Description</Label>
                                            <Input
                                                placeholder="e.g., Vegetarian Meal"
                                                value={manualMeal.description}
                                                onChange={(e) => setManualMeal({ ...manualMeal, description: e.target.value })}
                                                className="h-10"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-600">Price (₹)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="350"
                                                    value={manualMeal.price}
                                                    onChange={(e) => setManualMeal({ ...manualMeal, price: e.target.value })}
                                                    className="h-10"
                                                />
                                                <Button
                                                    onClick={addManualMeal}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Show manually added items */}
                                {(selectedSSR.baggage.length > 0 || selectedSSR.meals.length > 0) && (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-slate-700">Selected Items:</h4>
                                        {selectedSSR.baggage.map((item: any) => (
                                            <div key={item.Code} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                <div>
                                                    <p className="font-semibold text-slate-800">🧳 {item.Description || item.Weight}</p>
                                                    <p className="text-sm text-slate-600">₹{item.Price}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeManualItem('baggage', item.Code)}
                                                    className="text-red-500 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {selectedSSR.meals.map((item: any) => (
                                            <div key={item.Code} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                <div>
                                                    <p className="font-semibold text-slate-800">🍽️ {item.Description || item.Name}</p>
                                                    <p className="text-sm text-slate-600">₹{item.Price}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeManualItem('meals', item.Code)}
                                                    className="text-red-500 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {!loadingSSR && !ssrData && !apiError && (
                            <p className="text-sm text-slate-500 italic text-center py-4">
                                Extra services not available.
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
