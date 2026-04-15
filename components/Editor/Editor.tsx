'use client';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import {  doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toolbar from '@/components/Editor/Toolbar';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Smile, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import CoverImage from '@/components/CoverImage/CoverImage';
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useRoom, useSelf } from '@liveblocks/react';

interface EditorProps {
    id: string;
    initialTitle?: string;
    initialEmoji?: string;
    initialCover?: string;
}

function Editor({
    id,
    initialTitle,
    initialEmoji,
    initialCover,
}: EditorProps) {
    const [title, setTitle] = useState(initialTitle || '');
    const [emoji, setEmoji] = useState(initialEmoji || '');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
    const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(
        null,
    );
    const router = useRouter();
    const room = useRoom();
    const userInfo = useSelf((me) => me.info);
    const [randomColor] = useState(
        () => '#' + Math.floor(Math.random() * 16777215).toString(16),
    );

    useEffect(() => {
        const yDocument = new Y.Doc();
        const yjsProvider = new LiveblocksYjsProvider(room, yDocument);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setYDoc(yDocument);
        setProvider(yjsProvider);

        return () => {
            yDocument.destroy();
            yjsProvider.destroy();
        };
    }, [room]);

    const handleDelete = async () => {
        const confirmed = window.confirm('Move this document to trash?');
        if (!confirmed) return;
        await updateDoc(doc(db, 'documents', id), {
            trashedAt: new Date(),
        });
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
            StarterKit.configure({
                undoRedo: false,
            }),
            Placeholder.configure({
                placeholder: 'Start writing...',
            }),
            ...(yDoc && provider
                ? [
                      Collaboration.configure({
                          document: yDoc,
                      }),
                      CollaborationCursor.configure({
                          provider,
                          user: {
                              name: userInfo?.name || 'Anonymous',
                              color: randomColor,
                          },
                      }),
                  ]
                : []),
        ],
        immediatelyRender: false,
        editable: true,
        autofocus: true,
    });

    if (!yDoc || !provider) {
        return <div>Loading...</div>;
    }

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
                                theme={Theme.DARK}
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
