'use client';
import React from 'react';
import NewDocumentButton from '@/components/newDocumentButton';
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarNav from '@/components/sidebar/SidebarNav';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import Recents from '@/components/sidebar/Recents';
import {MenuIcon} from "lucide-react";


function Sidebar() {

    return (
        <div className={'p-2 md:flex md:flex-col md:items-center md:p-6 md:bg-card md:h-screen md:relative'}>
            <Sheet>
                <div className={'md:hidden'}>
                    <SheetTrigger>
                        <MenuIcon className={'p-2 hover:opacity-30 rounded-lg'} size={34} />
                    </SheetTrigger>
                </div>
                <SheetContent side={'left'}>
                    <SheetHeader>
                        <SheetTitle className={'text-center'}>Menu</SheetTitle>
                        <div className={'flex items-center justify-between w-full'}>
                            <SidebarHeader />
                            <NewDocumentButton />
                        </div>
                        <hr className={'my-4'} />
                            <SidebarNav />
                            <Recents />
                    </SheetHeader>
                </SheetContent>
            </Sheet>


            <div className={'hidden md:flex md:flex-col'}>
            <NewDocumentButton />
            <SidebarNav />
            <Recents />
            </div>
        </div>
    )
}

export default Sidebar
