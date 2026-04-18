'use client';
import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sparkles, Loader2 } from 'lucide-react';

interface AiMenuProps {
	editor: Editor | null;
}

export default function AIMenu({ editor }: AiMenuProps) {
	const [loading, setLoading] = useState(false);

	if (!editor) return null;

	const handleAI = async (action: string) => {
		const { from, to } = editor.state.selection;
		const selectedText = editor.state.doc.textBetween(from, to);

		if (!selectedText && action !== 'continue') return;

		const text = selectedText || editor.getHTML();

		setLoading(true);
		try {
			const res = await fetch('/api/ai', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ text, action }),
			});
			const data = await res.json();
			if (data.result) {
				if (action === 'continue') {
					editor.chain().insertContent(data.result).run();
				} else {
					editor.chain().insertContentAt({ from, to }, data.result).run();
				}
			}
		} catch (error) {
			console.error('AI Error:', error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label="AI Assistant"
					disabled={loading}
				>
					{loading ? (
						<Loader2 size={20} className="animate-spin" />
					) : (
						<Sparkles size={20} className="text-yellow-500" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem onClick={() => handleAI('improve')}>
					✨ Improve writing
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAI('fix_grammar')}>
					📝 Fix grammar
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAI('summarize')}>
					📋 Summarize
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAI('continue')}>
					➡️ Continue writing
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAI('translate_he')}>
					🇮🇱 Translate to Hebrew
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAI('translate_en')}>
					🇺🇸 Translate to English
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
