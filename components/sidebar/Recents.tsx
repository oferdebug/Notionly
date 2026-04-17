'use client';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
	collection,
	doc,
	onSnapshot,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ChevronRight, FileText, Plus, Trash2 } from 'lucide-react';
import { addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import router from 'next/router';

interface Document {
	id: string;
	title: string;
	userId: string;
	createdAt: { seconds: number };
	emoji?: string;
	trashedAt?: { seconds: number } | null;
	parentId?: string | null;
}

function DocItem({
	doc: docItem,
	allDocs,
	onTrash,
	formatDate,
}: {
	doc: Document;
	allDocs: Document[];
	onTrash: (e: React.MouseEvent, id: string) => void;
	formatDate: (t: { seconds: number }) => string;
}) {
	const [expanded, setExpanded] = useState(false);
	const children = allDocs.filter((d) => d.parentId === docItem.id);
	const hasChildren = children.length > 0;

	return (
		<div>
			<div className="flex items-center group">
				{hasChildren ? (
					<button
						type="button"
						onClick={() => setExpanded(!expanded)}
						className="p-1 shrink-0"
						aria-label="Toggle children"
					>
						<ChevronRight
							size={14}
							className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
						/>
					</button>
				) : (
					<span className="w-6" />
				)}
				<Link
					href={`/doc/${docItem.id}`}
					className="flex items-center justify-between flex-1 p-2 rounded hover:bg-muted"
				>
					<div className="flex items-center gap-2 min-w-0">
						<div className="shrink-0 w-4 text-center">
							{docItem.emoji || (
								<FileText size={16} className="text-muted-foreground" />
							)}
						</div>
						<div className="min-w-0">
							<span className="block truncate text-sm">{docItem.title}</span>
							<span className="block text-xs text-muted-foreground">
								{formatDate(docItem.createdAt)}
							</span>
						</div>
					</div>
					<button
						type="button"
						onClick={(e) => onTrash(e, docItem.id)}
						className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive shrink-0"
					>
						<Trash2 size={16} />
					</button>
					<button
						type="button"
						onClick={async (e) => {
							e.preventDefault();
							e.stopPropagation();
							const collectionRef = collection(db, 'documents');
							const newDoc = await addDoc(collectionRef, {
								title: 'Untitled',
								createdAt: new Date(),
								userId: docItem.userId,
								parentId: docItem.id,
							});
							router.push(`/doc/${newDoc.id}`);
						}}
						className="opacity-0 group-hover:opacity-100 p-1 hover:text-foreground shrink-0"
						aria-label="Create sub-document"
					>
						<Plus size={16} />
					</button>
				</Link>
			</div>
			{expanded && hasChildren && (
				<div className="ml-4">
					{children.map((child) => (
						<DocItem
							key={child.id}
							doc={child}
							allDocs={allDocs}
							onTrash={onTrash}
							formatDate={formatDate}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function Recents() {
	const { user } = useUser();
	const [recents, setRecents] = useState<Document[]>([]);

	useEffect(() => {
		if (!user?.id) {
			setRecents([]);
			return;
		}
		const q = query(
			collection(db, 'documents'),
			where('userId', '==', user?.id),
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const docs = snapshot.docs.map((d) => ({
				id: d.id,
				...d.data(),
			})) as Document[];
			setRecents(docs.filter((d) => !d.trashedAt));
		});
		return () => unsubscribe();
	}, [user?.id]);

	const handleTrash = async (e: React.MouseEvent, id: string) => {
		e.preventDefault();
		e.stopPropagation();
		const confirmed = window.confirm('Move this document to trash?');
		if (!confirmed) return;
		await updateDoc(doc(db, 'documents', id), {
			trashedAt: new Date(),
		});
	};

	const formatDate = (timestamp: { seconds: number }) => {
		if (!timestamp) return '';
		return new Date(timestamp.seconds * 1000).toLocaleDateString();
	};

	const topLevel = recents.filter((d) => !d.parentId);

	return (
		<div className="w-full mt-4">
			<h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
				{user?.firstName ? `Recents for ${user.firstName}` : 'Recents'}
			</h3>
			<div className="flex flex-col gap-0.5">
				{topLevel.map((doc) => (
					<DocItem
						key={doc.id}
						doc={doc}
						allDocs={recents}
						onTrash={handleTrash}
						formatDate={formatDate}
					/>
				))}
			</div>
		</div>
	);
}

export default Recents;
