'use client';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { Editor, Range } from '@tiptap/core';
import { Extension, ReactRenderer } from '@tiptap/react';
import Suggestion, {
	type SuggestionKeyDownProps,
	type SuggestionProps,
} from '@tiptap/suggestion';
import type { LucideIcon } from 'lucide-react';
import {
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Minus,
	Quote,
	Type,
} from 'lucide-react';
import tippy, { type Instance } from 'tippy.js';

type SlashCommandItem = {
	title: string;
	icon: LucideIcon;
	command: (props: { editor: Editor; range: Range }) => void;
};

type SlashSuggestionProps = SuggestionProps<SlashCommandItem, SlashCommandItem>;

type CommandListHandle = {
	onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cmd =
	(fn: (e: any) => void) =>
	({ editor }: { editor: Editor }) =>
		fn(editor);

const items: SlashCommandItem[] = [
	{
		title: 'Text',
		icon: Type,
		command: cmd((e) => e.chain().focus().setParagraph().run()),
	},
	{
		title: 'Heading 1',
		icon: Heading1,
		command: cmd((e) => e.chain().focus().toggleHeading({ level: 1 }).run()),
	},
	{
		title: 'Heading 2',
		icon: Heading2,
		command: cmd((e) => e.chain().focus().toggleHeading({ level: 2 }).run()),
	},
	{
		title: 'Heading 3',
		icon: Heading3,
		command: cmd((e) => e.chain().focus().toggleHeading({ level: 3 }).run()),
	},
	{
		title: 'Bullet List',
		icon: List,
		command: cmd((e) => e.chain().focus().toggleBulletList().run()),
	},
	{
		title: 'Ordered List',
		icon: ListOrdered,
		command: cmd((e) => e.chain().focus().toggleOrderedList().run()),
	},
	{
		title: 'Quote',
		icon: Quote,
		command: cmd((e) => e.chain().focus().toggleBlockquote().run()),
	},
	{
		title: 'Code Block',
		icon: Code,
		command: cmd((e) => e.chain().focus().toggleCodeBlock().run()),
	},
	{
		title: 'Divider',
		icon: Minus,
		command: cmd((e) => e.chain().focus().setHorizontalRule().run()),
	},
];

const CommandList = forwardRef<CommandListHandle, SlashSuggestionProps>(
	(props, ref) => {
		const [selectedIndex, setSelectedIndex] = useState(0);

		const selectItem = (index: number) => {
			const item = props.items[index];
			if (item) {
				props.command(item);
			}
		};

		useImperativeHandle(ref, () => ({
			onKeyDown: ({ event }: SuggestionKeyDownProps) => {
				if (event.key === 'ArrowUp') {
					setSelectedIndex(
						(selectedIndex + props.items.length - 1) % props.items.length,
					);
					return true;
				}
				if (event.key === 'ArrowDown') {
					setSelectedIndex((selectedIndex + 1) % props.items.length);
					return true;
				}
				if (event.key === 'Enter') {
					selectItem(selectedIndex);
					return true;
				}
				return false;
			},
		}));

		useEffect(() => setSelectedIndex(0), []);

		return (
			<div className="bg-popover border border-border rounded-lg shadow-lg p-1 w-52">
				{props.items.length ? (
					props.items.map((item, index: number) => {
						const Icon = item.icon;
						return (
							<button
								type="button"
								key={item.title}
								onClick={() => selectItem(index)}
								className={`flex items-center gap-2 w-full p-2 rounded text-sm text-left ${
									index === selectedIndex ? 'bg-muted' : ''
								}`}
							>
								<Icon size={16} className="text-muted-foreground" />
								{item.title}
							</button>
						);
					})
				) : (
					<div className="p-2 text-sm text-muted-foreground">No results</div>
				)}
			</div>
		);
	},
);

CommandList.displayName = 'CommandList';

const SlashCommand = Extension.create({
	name: 'slash-command',

	addOptions() {
		return {
			suggestion: {
				char: '/',
				command: ({
					editor,
					range,
					props,
				}: {
					editor: Editor;
					range: Range;
					props: SlashCommandItem;
				}) => {
					props.command({ editor, range });
				},
			},
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion,
			}),
		];
	},
});

export const slashCommandExtension = SlashCommand.configure({
	suggestion: {
		items: ({ query }: { query: string }) => {
			return items.filter((item) =>
				item.title.toLowerCase().startsWith(query.toLowerCase()),
			);
		},
		render: () => {
			let component: ReactRenderer<
				CommandListHandle,
				SlashSuggestionProps
			> | null = null;
			let popup: Instance[] | null = null;

			return {
				onStart: (props: SlashSuggestionProps) => {
					component = new ReactRenderer(CommandList, {
						props,
						editor: props.editor,
					});
					if (!props.clientRect) return;

					popup = [
						tippy(document.body as Element, {
							getReferenceClientRect: () => {
								const rect = props.clientRect?.();
								return rect ?? new DOMRect();
							},
							appendTo: () => document.body,
							content: component.element,
							showOnCreate: true,
							interactive: true,
							trigger: 'manual',
							placement: 'bottom-start',
							popperOptions: {
								modifiers: [
									{
										name: 'flip',
										enabled: false,
									},
								],
							},
						}),
					];
				},
				onUpdate: (props: SlashSuggestionProps) => {
					component?.updateProps(props);
					if (!props.clientRect) return;
					popup?.[0]?.hide();
					return true;
				},
				onKeyDown: (props: SuggestionKeyDownProps) => {
					return component?.ref?.onKeyDown(props) ?? false;
				},
				onExit: () => {
					popup?.[0]?.destroy();
					component?.destroy();
				},
			};
		},
	},
});
