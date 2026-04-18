'use client';
import React, { useEffect, useState } from 'react';
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@clerk/nextjs';
import { FileText, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Document {
    id: string;
    title: string;
    userId: string;
    emoji?: string;
    trashedAt: { seconds: number };
}

export default function TrashPage() {
    const { user } = useUser();
    const [trashed, setTrashed] = useState<Document[]>([]);

    useEffect(() => {
        if (!user?.id) return;
        const q = query(
            collection(db, 'documents'),
            where('userId', '==', user.id),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as Document[];
            setTrashed(docs.filter((d) => d.trashedAt));
        });
        return () => unsubscribe();
    }, [user?.id]);

    const handleRestore = async (id: string) => {
        await updateDoc(doc(db, 'documents', id), {
            trashedAt: null,
        });
    };

    const handleDeleteForever = async (id: string) => {
        const confirmed = window.confirm(
            'Delete permanently? This cannot be undone.',
        );
        if (!confirmed) return;
        await deleteDoc(doc(db, 'documents', id));
    };

    const formatDate = (timestamp: { seconds: number }) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Trash</h1>
            {trashed.length === 0 ? (
                <p className="text-muted-foreground">No documents in trash.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {trashed.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="shrink-0 w-4 text-center">
                                    {item.emoji || (
                                        <FileText
                                            size={16}
                                            className="text-muted-foreground"
                                        />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <span className="block truncate text-sm">
                                        {item.title}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        Deleted {formatDate(item.trashedAt)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    onClick={() => handleRestore(item.id)}
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Restore document"
                                >
                                    <RotateCcw size={16} />
                                </Button>
                                <Button
                                    onClick={() => handleDeleteForever(item.id)}
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-destructive"
                                    aria-label="Delete permanently"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
