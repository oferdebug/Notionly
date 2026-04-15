'use client';
import Link from 'next/link';
import {ChevronRight,Home} from 'lucide-react';

interface BreadcrumbsProps {
    title:string;
}

export default function Breadcrumbs({title}:BreadcrumbsProps) {
    return (
        <nav
            className={
                'flex items-center gap-2 text-sm text-muted-foreground mb-4'
            }
        >
            <Link
                href={'/'}
                className={'flex items-center gap-2 hover:text-foreground'}
            >
                <Home size={14} className={'text-muted-foreground'} />
                <span>Home</span>
            </Link>
            <ChevronRight size={14} className={'text-muted-foreground'} />
            <span className={'text-foreground truncate'}>
                {title || 'Untitled'}
            </span>
        </nav>
    );
}
