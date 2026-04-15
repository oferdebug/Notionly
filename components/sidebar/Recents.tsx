'use client';
import React, { useEffect, useState } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FileText, Trash2 } from 'lucide-react';

interface Document {
    id: string;
    title: string;
    userId: string;
    createdAt: { seconds: number };
    emoji?: string;
    trashedAt?: { seconds: number } | null;
}

function Recents() {
    const { user } = useUser();

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
            const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Document[];
            setRecents(docs.filter((d) => !d.trashedAt));
        });
        return () => unsubscribe();
    }, [user?.id]);

    const handleTrash = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const confirmed = window.confirm('Move this document to trash?');
        if (!confirmed) return;
        await updateDoc(doc(db, 'documents', id), {
            trashedAt: new Date(),
        });
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
                            <div className="shrink-0 w-4 text-center">
                                {recent.emoji || (
                                    <FileText
                                        size={16}
                                        className="text-muted-foreground"
                                    />
                                )}
                            </div>
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
                            onClick={(e) => handleTrash(e, recent.id)}
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
