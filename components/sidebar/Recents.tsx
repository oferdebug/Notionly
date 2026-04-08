'use client';
import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {useUser} from '@clerk/nextjs';

function Recents() {
    const { user } = useUser();
    interface Document {
        id: string;
        title: string;
        userId: string;
    }

    const [recents, setRecents] = useState<Document[]>([]);
    useEffect(() => {
        if(!user?.id) return;
        const q = query(
            collection(db, 'documents'),
            where('userId', '==', user?.id),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            return setRecents(
                snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Document[],
            );
        });
        return () => unsubscribe();
    }, [user?.id]);
    return (
        <div className={'w-full'}>
            { user ? `Recents for ${user.firstName}` : 'Recents'}
            {recents.map((recent) => (
                <div key={recent.id}>{recent.title}</div>
            ))}

        </div>
    );
}

export default Recents;
