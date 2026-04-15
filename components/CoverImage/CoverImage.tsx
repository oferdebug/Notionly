'use client';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

interface CoverImageProps {
    id: string;
    initialCover?: string;
}

export default function CoverImage({ id, initialCover }: CoverImageProps) {
    const [cover, setCover] = useState(initialCover || '');

    const handleUpload = async (result: any) => {
        const url = result.info.secure_url;
        setCover(url);
        const docRef = doc(db, 'documents', id);
        await updateDoc(docRef, { cover: url });
    };

    const handleRemove = async () => {
        setCover('');
        const docRef = doc(db, 'documents', id);
        await updateDoc(docRef, { cover: '' });
    };

    if (!cover) {
        return (
            <CldUploadWidget uploadPreset="notionly" onSuccess={handleUpload}>
                {({ open }) => (
                    <button
                        onClick={() => open()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <ImagePlus size={16} />
                        Add cover
                    </button>
                )}
            </CldUploadWidget>
        );
    }

    return (
        <div className="relative w-full h-48 mb-4 group">
            <Image
                src={cover}
                alt="Cover"
                fill
                className="object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100">
                <CldUploadWidget
                    uploadPreset="notionly"
                    onSuccess={handleUpload}
                >
                    {({ open }) => (
                        <button
                            onClick={() => open()}
                            className="bg-background/80 p-1 rounded hover:bg-background"
                        >
                            <ImagePlus size={16} />
                        </button>
                    )}
                </CldUploadWidget>
                <button
                    onClick={handleRemove}
                    className="bg-background/80 p-1 rounded hover:bg-background"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
