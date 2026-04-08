'use client';
import {useEditor,EditorContent} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase";
import {Input} from "@/components/ui/input";
import {useState} from 'react';

    interface EditorProps {
        id:string;
        initialContent?:string;
        initialTitle?:string;
    }
    function Editor({id,initialContent,initialTitle}:EditorProps ) {
    const [title, setTitle] = useState(initialTitle || '');
    const editor=useEditor({
        extensions:[StarterKit],
        immediatelyRender: false,
        editable:true,
        autoFocus:true,
        content:initialContent,
        onUpdate:async ({editor})=>{
            const docRef = doc(db, "documents", id);
            await updateDoc(docRef, {
                content: editor.getHTML(),
            });
        }
    })
    return (
        <div className={'min-h-screen p-4 border border-gray-500'}>
            <Input
                value={title}
                onChange={async (e) => {
                    setTitle(e.target.value);
                    const docRef = doc(db, 'documents', id);
                    await updateDoc(docRef, { title: e.target.value });
                }}
            />
            { editor && <EditorContent editor={editor} /> }
        </div>

    )

}


export default Editor
