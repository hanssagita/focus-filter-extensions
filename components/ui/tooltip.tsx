import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TooltipProps {
    children: React.ReactNode;
    content: string;
    className?: string;
}

export function Tooltip({ children, content, className }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={cn(
                        'absolute z-50 px-3 py-2 text-sm text-foreground bg-card border border-border rounded-md shadow-lg',
                        'bottom-full left-1/2 -translate-x-1/2 mb-2 w-64',
                        'animate-in fade-in-0 zoom-in-95',
                        className
                    )}
                >
                    <div className="relative">
                        {content}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-card" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
