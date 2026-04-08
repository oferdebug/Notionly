import React from 'react'
import NewDocumentButton from "@/components/newDocumentButton";
import SidebarHeader from "@/components/sidebar/SidebarHeader";
import SidebarNav from "@/components/sidebar/SidebarNav";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {MenuIcon} from "lucide-react";
import Recents from "@/components/sidebar/Recents";


function Sidebar() {
    // const menuOptions=(
    //     <>
    //         <NewDocumentButton />
    //     </>
    // )
    return (
        <div className={'flex flex-col items-center p-3 md:p-6 bg-gray-300 h-screen relative'}>
            <Sheet>
                <SheetTrigger>
                    <MenuIcon className={'p-2 hover:opacity-30 rounded-lg'} size={34} />
                </SheetTrigger>
                <SheetContent side={'left'}>
                    <SheetHeader>
                        <SheetTitle className={'text-center'}>Menu</SheetTitle>
                        <div>
                            {/** Options **/}
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>


            {/*<div className={'hidden md:inline'}>{menuOptions}</div>*/}
            <SidebarHeader />
            <NewDocumentButton />
            <SidebarNav />
            <Recents />
        </div>
    )
}

export default Sidebar
