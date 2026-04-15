'use client';
import React, { useEffect, useState } from 'react';
import {
    Bot,
    Home,
    Inbox,
    Library,
    Presentation,
    Search,
    Trash2,
} from 'lucide-react';
import Link from 'next/link';
import SearchDialog from '@/components/SearchDialog';

function SidebarNav() {
    const [searchOpen, setSearchOpen] = useState(false);

    const navItems = [
        {
            label: 'Home',
            href: '/home',
            icon: Home,
        },
        {
            label: 'Meetings',
            href: '/meetings',
            icon: Presentation,
        },
        {
            label: 'AI',
            href: '/ai',
            icon: Bot,
        },
        {
            label: 'Inbox',
            href: '/inbox',
            icon: Inbox,
        },
        {
            label: 'Library',
            href: '/library',
            icon: Library,
        },
        {
            label: 'Trash',
            href: '/trash',
            icon: Trash2,
        },
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={'w-full'}>
            <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 p-2 w-full hover:bg-muted rounded-lg"
            >
                <Search size={20} />
                <p className="text-sm font-medium">Search</p>
            </button>

            {navItems.map((item) => (
                <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg"
                >
                    <item.icon size={20} />
                    <p className="text-sm font-medium">{item.label}</p>
                </Link>
            ))}

            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
    );
}

export default SidebarNav;
