'use client'
import { useUser } from '@clerk/nextjs'
import Image from "next/image";
import {FilePlus, SquarePen, User} from "lucide-react";

function SidebarHeader() {
    const { user } = useUser()

    return (
        <div className="flex items-center space-x-2">
            {user && (
                <div className="flex items-center gap-2">
                    <Image
                        src={user?.imageUrl}
                        alt={user?.fullName || "User Profile"}
                        width={40}
                        height={40}
                        className='rounded-full'
                    />
                    <div className="flex-1 flex-col">
                        <p className="text-sm font-semibold line-clamp-1">
                            {user?.fullName}
                        </p>
                    </div>
                <SquarePen size={34} className={'ml-auto text-gray-500'} />
                </div>
            )}
        </div>
    )
}

export default SidebarHeader;
