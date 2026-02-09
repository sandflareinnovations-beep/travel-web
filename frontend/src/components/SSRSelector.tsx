"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, CreditCard, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SSRItem {
    Code: string;
    Description?: string;
    Weight?: string;
    Name?: string;
    Price: number;
    Currency?: string;
}

interface SSRSelection {
    baggage: SSRItem[];
    meals: SSRItem[];
}

interface SSRSelectorProps {
    baggage: SSRItem[]; // Passed from parent
    meals: SSRItem[];   // Passed from parent
    onSelectionChange?: (selection: SSRSelection, totalCost: number) => void;
    initialSelection?: SSRSelection;
    currencySymbol?: string;
}

export default function SSRSelector({
    baggage = [],
    meals = [],
    onSelectionChange,
    initialSelection,
    currencySymbol = '₹'
}: SSRSelectorProps) {

    // Check if we have any paid items
    const hasPaidBaggage = baggage.some(item => item.Price > 0);
    const hasPaidMeals = meals.some(item => item.Price > 0);
    const hasAnyPaidOptions = hasPaidBaggage || hasPaidMeals;

    const [selectedSSR, setSelectedSSR] = useState<SSRSelection>(
        initialSelection || { baggage: [], meals: [] }
    );

    // Manual entry states - Keeping this but gating it behind "Add Manually" if needed, 
    // or we could remove it to be strictly compliant. 
    // For now, I'll keep the UI but it won't be the primary way. 
    // Actually, user requirement: "If GetPrice.SSR contains only items with Charge = 0... Hide paid SSR UI completely".
    // So if !hasAnyPaidOptions, we should render nothing or just a message.

    const [showManualForm, setShowManualForm] = useState(false);

    // Manual States
    const [manualBaggage, setManualBaggage] = useState({ description: '', price: '' });
    const [manualMeal, setManualMeal] = useState({ description: '', price: '' });

    // Notify parent when selection changes
    useEffect(() => {
        if (onSelectionChange) {
            const totalCost = [...selectedSSR.baggage, ...selectedSSR.meals]
                .reduce((sum, item) => sum + (item.Price || 0), 0);
            onSelectionChange(selectedSSR, totalCost);
        }
    }, [selectedSSR, onSelectionChange]);

    // If no paid options available, return null or empty state
    // "If GetPrice.SSR contains only items with Charge = 0 OR SSR is empty... Hide paid SSR UI completely"
    if (!hasAnyPaidOptions && selectedSSR.baggage.length === 0 && selectedSSR.meals.length === 0) {
        return null;
    }

    const handleSSRSelect = (type: 'baggage' | 'meals', item: SSRItem, isChecked: boolean) => {
        setSelectedSSR(prev => {
            if (isChecked) {
                return {
                    ...prev,
                    [type]: [...prev[type], item]
                };
            } else {
                return {
                    ...prev,
                    [type]: prev[type].filter((i: SSRItem) => i.Code !== item.Code)
                };
            }
        });
    };

    // --- Manual Add Helpers (Optional / Debugging) ---
    const addManualBaggage = () => {
        if (!manualBaggage.description || !manualBaggage.price) return;
        const newItem: SSRItem = {
            Code: `MANUAL_BAG_${Date.now()}`,
            Description: manualBaggage.description,
            Weight: manualBaggage.description,
            Price: parseFloat(manualBaggage.price)
        };
        setSelectedSSR(prev => ({ ...prev, baggage: [...prev.baggage, newItem] }));
        setManualBaggage({ description: '', price: '' });
    };

    const addManualMeal = () => {
        if (!manualMeal.description || !manualMeal.price) return;
        const newItem: SSRItem = {
            Code: `MANUAL_MEAL_${Date.now()}`,
            Description: manualMeal.description,
            Name: manualMeal.description,
            Price: parseFloat(manualMeal.price)
        };
        setSelectedSSR(prev => ({ ...prev, meals: [...prev.meals, newItem] }));
        setManualMeal({ description: '', price: '' });
    };

    const removeManualItem = (type: 'baggage' | 'meals', code: string) => {
        setSelectedSSR(prev => ({
            ...prev,
            [type]: prev[type].filter((i: SSRItem) => i.Code !== code)
        }));
    };

    return (
        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden mt-6">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                    </div>
                    Add Extra Services
                </CardTitle>

                {/* Optional Manual Add Toggle */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowManualForm(!showManualForm)}
                    className="text-xs"
                >
                    {showManualForm ? 'Hide Manual Form' : 'Add Manually'}
                </Button>
            </CardHeader>
            <CardContent className="p-6">

                <div className="space-y-6">
                    {/* Baggage Section */}
                    {hasPaidBaggage && (
                        <div>
                            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                🧳 Extra Baggage
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {baggage.filter(item => item.Price > 0).map((item, idx) => {
                                    const isSelected = selectedSSR.baggage.some((b) => b.Code === item.Code);
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
                                                        {currencySymbol}{item.Price}
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
                    {hasPaidMeals && (
                        <div className={hasPaidBaggage ? "pt-6 border-t border-slate-100" : ""}>
                            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                🍽️ Meals
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {meals.filter(item => item.Price > 0).map((meal, idx) => {
                                    const isSelected = selectedSSR.meals.some((m) => m.Code === meal.Code);
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
                                                        {currencySymbol}{meal.Price}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Manual Form Section */}
                {showManualForm && (
                    <div className="space-y-6 mt-6 pt-6 border-t border-slate-100">
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
                                    <Label className="text-xs text-slate-600">Price ({currencySymbol})</Label>
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
                                    <Label className="text-xs text-slate-600">Price ({currencySymbol})</Label>
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
                        {(selectedSSR.baggage.some(i => i.Code.startsWith('MANUAL')) || selectedSSR.meals.some(i => i.Code.startsWith('MANUAL'))) && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-slate-700">Manually Added Items:</h4>
                                {selectedSSR.baggage.filter(i => i.Code.startsWith('MANUAL')).map((item) => (
                                    <div key={item.Code} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <div>
                                            <p className="font-semibold text-slate-800">🧳 {item.Description || item.Weight}</p>
                                            <p className="text-sm text-slate-600">{currencySymbol}{item.Price}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => removeManualItem('baggage', item.Code)} className="text-red-500 hover:bg-red-50">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {selectedSSR.meals.filter(i => i.Code.startsWith('MANUAL')).map((item) => (
                                    <div key={item.Code} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <div>
                                            <p className="font-semibold text-slate-800">🍽️ {item.Description || item.Name}</p>
                                            <p className="text-sm text-slate-600">{currencySymbol}{item.Price}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => removeManualItem('meals', item.Code)} className="text-red-500 hover:bg-red-50">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
