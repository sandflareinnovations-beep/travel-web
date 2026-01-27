import React from 'react';

export default function AgentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* 
        Agent Layout: 
        Focused on booking. No sidebars to distract. 
        Navigation handled within the page or a top bar if needed later.
      */}
            {children}
        </div>
    );
}
