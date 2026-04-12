'use client'
import {useUser} from '@clerk/nextjs'
import Image from "next/image";

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
                </div>
            )}
        </div>
    )
}

export default SidebarHeader;
