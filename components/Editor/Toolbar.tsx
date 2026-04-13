'use client';
import React from 'react';
import { Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Undo,
    Redo,
} from 'lucide-react';
function Toolbar({ editor }: { editor: Editor |null }) {
    if (!editor) return null;
    return (
        <div>
            <div
                className={
                    'flex items-center gap-1 border-b border-border p-2 flex-wrap'
                }
            >
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
                >
                    <Bold className={'w-6 h-6'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
                >
                    <Italic className={'w-6 h-6'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('strike') ? 'bg-muted' : ''}`}
                >
                    <Strikethrough className={'w-6 h-6'} />
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
                >
                    <Heading1 className={'w-6 h-6'} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
                >
                    <Heading2 className={'w-6 h-6'} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}`}
                >
                    <Heading3 className={'w-6 h-6'} />
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <button
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
                >
                    <List className={'w-6 h-6'} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
                >
                    <ListOrdered className={'w-6 h-6'} />
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <button
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
                >
                    <Quote className={'h-6 w-6'} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
                >
                    <Code className={'h-6 w-6'} />
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    className={`p-1 rounded hover:bg-muted/50 ${editor.isActive('undo') ? 'bg-muted' : ''}`}
                >
                    <Undo className={'w-6 h-6'} />
                </button>

                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    className={`p-1 rounded hover:bg-muted/50 ${editor.can().redo() ? 'bg-muted' : ''}`}
                >
                    <Redo className={'w-6 h-6'} />
                </button>
            </div>
        </div>
    );
}

export default Toolbar;
