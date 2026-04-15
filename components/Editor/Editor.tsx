'use client';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toolbar from '@/components/Editor/Toolbar';
import Placeholder from '@tiptap/extension-placeholder';
import { Smile, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import EmojiPicker from 'emoji-picker-react';
import CoverImage from '@/components/CoverImage/CoverImage';

interface EditorProps {
    id: string;
    initialContent?: string;
    initialTitle?: string;
    initialEmoji?: string;
    initialCover?: string;
}

function Editor({
    id,
    initialContent,
    initialTitle,
    initialEmoji,
    initialCover,
}: EditorProps) {
    const [title, setTitle] = useState(initialTitle || '');
    const [emoji, setEmoji] = useState(initialEmoji || '');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this document?',
        );
        if (!confirmed) return;
        await deleteDoc(doc(db, 'documents', id));
        router.push('/');
    };

    const handleEmojiSelect = async (emojiData: { emoji: string }) => {
        setEmoji(emojiData.emoji);
        setShowEmojiPicker(false);
        const docRef = doc(db, 'documents', id);
        await updateDoc(docRef, { emoji: emojiData.emoji });
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing...',
            }),
        ],
        immediatelyRender: false,
        editable: true,
        autofocus: true,
        content: initialContent,
        onUpdate: async ({ editor }) => {
            const docRef = doc(db, 'documents', id);
            await updateDoc(docRef, {
                content: editor.getHTML(),
            });
        },
    });

    return (
        <>
            <Breadcrumbs title={title} emoji={emoji} />
            <CoverImage id={id} initialCover={initialCover} />
            <div className="min-h-screen p-4 border border-border">
                <div className="relative mb-2">
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-4xl hover:opacity-70"
                        aria-label="Select emoji"
                    >
                        {emoji || (
                            <Smile
                                size={36}
                                className="text-muted-foreground"
                            />
                        )}
                    </button>
                    {showEmojiPicker && (
                        <div className="absolute top-12 left-0 z-50">
                            <EmojiPicker
                                onEmojiClick={handleEmojiSelect}
                                theme={'dark' as any}
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <input
                        value={title}
                        onChange={async (e) => {
                            setTitle(e.target.value);
                            const docRef = doc(db, 'documents', id);
                            await updateDoc(docRef, { title: e.target.value });
                        }}
                        placeholder="Untitled"
                        className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground"
                    />
                    <Button
                        onClick={handleDelete}
                        variant="ghost"
                        size="icon"
                        className="hover:text-destructive"
                        aria-label="Delete document"
                    >
                        <Trash2 size={20} />
                    </Button>
                </div>
                <Toolbar editor={editor} />
                {editor && (
                    <div className="prose prose-invert max-w-none mt-4 tiptap">
                        <EditorContent editor={editor} />
                    </div>
                )}
            </div>
        </>
    );
}

export default Editor;
