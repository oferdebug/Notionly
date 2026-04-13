'use client';
import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {doc, updateDoc} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {Input} from '@/components/ui/input';
import {useState} from 'react';
import Toolbar from '@/components/Editor/Toolbar';
import Placeholder from '@tiptap/extension-placeholder';

interface EditorProps {
        id:string;
        initialContent?:string;
        initialTitle?:string;


    }
    function Editor({id,initialContent,initialTitle}:EditorProps ) {
    const [title, setTitle] = useState(initialTitle || '');
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
        <div className={'min-h-screen p-4 border border-border'}>
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
            <Toolbar editor={editor} />
            {editor && (
                <div className="prose prose-invert max-w-none mt-4 tiptap">
                    <EditorContent editor={editor} />
                </div>
            )}
        </div>
    );

}


export default Editor
