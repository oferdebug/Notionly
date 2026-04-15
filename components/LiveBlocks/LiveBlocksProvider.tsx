'use client';
import { ReactNode } from 'react';
import {
    LiveblocksProvider as Provider,
    RoomProvider,
} from '@liveblocks/react';

export function LiveblocksWrapper({
    children,
    roomId,
}: {
    children: ReactNode;
    roomId: string;
}) {
    return (
        <Provider publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}>
            <RoomProvider id={roomId}>{children}</RoomProvider>
        </Provider>
    );
}
