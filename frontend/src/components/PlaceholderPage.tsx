"use client";

import {
    Construction,
    ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
    title: string;
    description: string;
    onBack?: () => void;
}

export function PlaceholderPage({ title, description, onBack }: PlaceholderPageProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-slate-100 p-6 rounded-full">
                <Construction className="h-12 w-12 text-slate-400" />
            </div>
            <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-bold font-heading text-slate-900">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.history.back()}>
                    Go Back
                </Button>
                <Button disabled>
                    Notify Me When Ready
                </Button>
            </div>

            <div className="text-xs text-slate-400 pt-8">
                Module ID: {title.toUpperCase().replace(/\s+/g, '_')}_V1.0
            </div>
        </div>
    );
}

export default PlaceholderPage;
