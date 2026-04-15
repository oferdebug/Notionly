'use client';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    title: string;
    emoji?: string;
}

export default function Breadcrumbs({ title, emoji }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link
                href="/"
                className="flex items-center gap-2 hover:text-foreground"
            >
                <Home size={14} />
                <span>Home</span>
            </Link>
            <ChevronRight size={14} />
            <span className="text-foreground truncate">
                {emoji && <span className="mr-1">{emoji}</span>}
                {title || 'Untitled'}
            </span>
        </nav>
    );
}
