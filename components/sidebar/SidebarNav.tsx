'use client';
import React from 'react'
import {Bot, Home, Inbox, Library, Presentation, Search, User} from "lucide-react";
import Link from "next/link";

function SidebarNav() {
    const navItems=[
        {
            label:'Search',
            href:'/',
            icon:Search,
        },
        {
            label:'Home',
            href:'/home',
            icon:Home,
        },
        {
            label:'Meetings',
            href:'/meetings',
            icon:Presentation,
        },
        {
            label:'AI',
            href:'/ai',
            icon:Bot,
        },
        {
            label:'Inbox',
            href:'/inbox',
            icon:Inbox,
        },
        {
            label:'Library',
            href:'/library',
            icon:Library,
        },
    ];
    return(
        <div className={'w-full'}>
            {navItems.map((item)=>(
                <Link href={item.href} key={item.label} className={'flex items-center gap-2 p-2 hover:bg-gray-200 rounded-lg'}>
                    <item.icon size={20} />
                    <p className={'text-sm font-medium'}>{item.label}</p>
                </Link>
            ))}
        </div>
    );
};

export default SidebarNav
