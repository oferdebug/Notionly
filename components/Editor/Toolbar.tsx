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
} from 'lucide-react';

function Toolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;
    return (
        <div className="overflow-x-auto border-b border-border">
            <div className="flex items-center gap-0.5 p-2 w-max">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
                    aria-label="Bold"
                >
                    <Bold className="w-5 h-5" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
                    aria-label="Italic"
                >
                    <Italic className="w-5 h-5" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('strike') ? 'bg-muted' : ''}`}
                    aria-label="Strikethrough"
                >
                    <Strikethrough className="w-5 h-5" />
                </button>
                <div className="w-px h-5 bg-border mx-1 shrink-0" />
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
                    aria-label="Heading 1"
                >
                    <Heading1 className="w-5 h-5" />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
                    aria-label="Heading 2"
                >
                    <Heading2 className="w-5 h-5" />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}`}
                    aria-label="Heading 3"
                >
                    <Heading3 className="w-5 h-5" />
                </button>
                <div className="w-px h-5 bg-border mx-1 shrink-0" />
                <button
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
                    aria-label="Bullet list"
                >
                    <List className="w-5 h-5" />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
                    aria-label="Ordered list"
                >
                    <ListOrdered className="w-5 h-5" />
                </button>
                <div className="w-px h-5 bg-border mx-1 shrink-0" />
                <button
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
                    aria-label="Blockquote"
                >
                    <Quote className="w-5 h-5" />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={`p-1.5 rounded hover:bg-muted/50 shrink-0 ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
                    aria-label="Code block"
                >
                    <Code className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default Toolbar;
