import React from 'react';

export const Header = () => {
    return (
        <div className="h-16 flex items-center justify-end px-8 border-b bg-white">
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Last updated: Just now</span>
                {/* Add user profile or other header items here */}
            </div>
        </div>
    );
};
