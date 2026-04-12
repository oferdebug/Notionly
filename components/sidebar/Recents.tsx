'use client';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

function Recents() {
    const { user } = useUser();
    interface Document {
        id: string;
        title: string;
        userId: string;
    }

    const [recents, setRecents] = useState<Document[]>([]);
    useEffect(() => {
        if (!user?.id) {
            setRecents([]);
            return;
        }
        const q = query(
            collection(db, 'documents'),
            where('userId', '==', user?.id),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            return setRecents(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Document[],
            );
        });
        return () => unsubscribe();
    }, [user?.id]);
    return (
        <div className={'w-full'}>
            {user?.firstName ? `Recents for ${user.firstName}` : 'Recents'}
            {recents.map((recent) => (
                <Link
                    key={recent.id}
                    href={`/doc/${recent.id}`}
                    className="block"
                >
                    {recent.title}
                </Link>
            ))}
        </div>
    );
}

export default Recents;
