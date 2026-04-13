'use client';
import React, { useEffect, useState } from 'react';
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FileText, Trash2 } from 'lucide-react';

function Recents() {
    const { user } = useUser();
    interface Document {
        id: string;
        title: string;
        userId: string;
        createdAt: { seconds: number };
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

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const confirmed = window.confirm(
            'Are you sure you want to delete this document?',
        );
        if (!confirmed) return;
        await deleteDoc(doc(db, 'documents', id));
    };

    const formatDate = (timestamp: { seconds: number }) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

    return (
        <div className="w-full mt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                {user?.firstName ? `Recents for ${user.firstName}` : 'Recents'}
            </h3>
            <div className="flex flex-col gap-1">
                {recents.map((recent) => (
                    <Link
                        key={recent.id}
                        href={`/doc/${recent.id}`}
                        className="flex items-center justify-between group p-2 rounded hover:bg-muted"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText
                                size={16}
                                className="text-muted-foreground shrink-0"
                            />
                            <div className="min-w-0">
                                <span className="block truncate text-sm">
                                    {recent.title}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    {formatDate(recent.createdAt)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => handleDelete(e, recent.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive shrink-0"
                        >
                            <Trash2 size={16} />
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Recents;
