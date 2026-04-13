'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FileText } from 'lucide-react';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

interface Document {
    id: string;
    title: string;
}

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({
    open,
    onOpenChange,
}: SearchDialogProps) {
    const { user } = useUser();
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        if (!open || !user?.id) return;

        const fetchDocs = async () => {
            const q = query(
                collection(db, 'documents'),
                where('userId', '==', user.id),
            );
            const snapshot = await getDocs(q);
            setDocuments(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    title: (doc.data().title as string) || 'Untitled',
                })),
            );
        };

        fetchDocs();
    }, [open, user?.id]);

    const handleSelect = (id: string) => {
        onOpenChange(false);
        router.push(`/doc/${id}`);
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <Command>
                <CommandInput placeholder="Search documents..." />
                <CommandList>
                    <CommandEmpty>No documents found.</CommandEmpty>
                    <CommandGroup heading="Documents">
                        {documents.map((doc) => (
                            <CommandItem
                                key={doc.id}
                                onSelect={() => handleSelect(doc.id)}
                            >
                                <FileText size={16} className="mr-2" />
                                {doc.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    );
};