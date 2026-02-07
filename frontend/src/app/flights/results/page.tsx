"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ResultsPage() {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<unknown[]>([]);

    useEffect(() => {
        // Feature: GetExpSearch
        const fetchResults = async () => {
            // Mock API call to backend /flights/express-search-results
            try {
                const res = await fetch('http://localhost:3001/flights/express-search-results');
                const data = await res.json();
                setResults(data.results || []);
            } catch (e) {
                console.error("Failed to fetch search results", e);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Flight Results</h1>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-32 w-full bg-slate-200 rounded-lg"></div>
                    <div className="h-32 w-full bg-slate-200 rounded-lg"></div>
                    <div className="h-32 w-full bg-slate-200 rounded-lg"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Placeholder for results */}
                    <Card className="p-4">
                        <CardContent>
                            <p>No results found (Mock).</p>
                        </CardContent>
                    </Card>
                    <Button onClick={() => window.location.href = '/flights/review'}>Select Flight</Button>
                </div>
            )}
        </div>
    );
}
