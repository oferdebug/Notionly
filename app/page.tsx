'use client';
import { useUser } from '@clerk/nextjs';
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { FileText, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import NewDocumentButton from '@/components/newDocumentButton';
import { db } from '@/lib/firebase';
import { templates } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
interface Document {
	id: string;
	title: string;
	emooji?: string;
	createdAt: { seconds: number };
	sharedWith?: string[];
	trashedAt?: { seconds: number } | null;
	favorite?: boolean;
}

export default function Home() {
	const { user } = useUser();
	const [myDocs, setMyDocs] = useState<Document[]>([]);
	const [shareDocs, setShareDocs] = useState<Document[]>([]);
	const router = useRouter();
	useEffect(() => {
		if (!user?.id) return;

		const myQuery = query(
			collection(db, 'documents'),
			where('userId', '==', user.id),
		);

		const unsubMy = onSnapshot(myQuery, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Document[];
			setMyDocs(docs.filter((d) => !d.trashedAt));
		});

		const email = user.primaryEmailAddress?.emailAddress;
		let unsubShared = () => {};
		if (email) {
			const sharedQuery = query(
				collection(db, 'documents'),
				where('sharedWith', 'array-contains', email),
			);
			unsubShared = onSnapshot(sharedQuery, (snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Document[];
				setShareDocs(docs.filter((d) => !d.trashedAt));
			});
		}

		return () => {
			unsubMy();
			unsubShared();
		};
	}, [user?.id, user?.primaryEmailAddress?.emailAddress]);

	const formatDate = (timestamp: { seconds: number }) => {
		if (!timestamp) return '';
		return new Date(timestamp.seconds * 1000).toLocaleDateString();
	};

	const handleToggleFavorite = async (
		e: React.MouseEvent,
		id: string,
		currentFav: boolean,
	) => {
		e.preventDefault();
		e.stopPropagation();
		await updateDoc(doc(db, 'documents', id), {
			favorite: !currentFav,
		});
		toast.success(currentFav ? 'Removed from favorites' : 'Added to favorites');
	};

	const favorites = myDocs.filter((d) => d.favorite);
	const nonFavorites = myDocs.filter((d) => !d.favorite);
	async function handleCreateTemplate(
		content: string,
		title: string,
		emoji: string,
	): Promise<void> {
		const collectionRef = collection(db, 'documents');
		const docRef = await addDoc(collectionRef, {
			title: title,
			content: content,
			emoji: emoji,
			createdAt: new Date(),
			userId: user?.id,
			parentId: null,
		});
		router.push(`/doc/${docRef.id}`);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-3">
					{user?.firstName
						? `Welcome back, ${user.firstName}`
						: 'Welcome To The Space'}
				</h1>
				<p className="text-muted-foreground">Pick Up Where You Left Off</p>
			</div>
			<div className="mb-8">
				<NewDocumentButton />
			</div>

			<div className="mb-8">
				<h3 className="text-lg font-semibold mb-4">Templates</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{templates.map((t) => (
						<Button
							onClick={() => handleCreateTemplate(t.content, t.title, t.emoji)}
							key={t.title}
						>
							{t.emoji}
							{t.title}
						</Button>
					))}
				</div>
			</div>
			{favorites.length > 0 && (
				<section className="mb-8">
					<h3 className="text-lg font-semibold mb-4">Favorites</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{favorites.map((d) => (
							<Link
								key={d.id}
								href={`/doc/${d.id}`}
								className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted group relative"
							>
								<div className="text-2xl shrink-0">
									{d.emooji || (
										<FileText size={24} className="text-muted-foreground" />
									)}
								</div>
								<div className="min-w-0">
									<p className="text-sm font-medium truncate">
										{d.title || 'Untitled'}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatDate(d.createdAt)}
									</p>
								</div>
								<button
									type="button"
									onClick={(e) => handleToggleFavorite(e, d.id, true)}
									className="absolute top-2 right-2 text-yellow-500"
									aria-label="Remove from favorites"
								>
									<Star size={16} fill="currentColor" />
								</button>
							</Link>
						))}
					</div>
				</section>
			)}

			<section className="mb-8">
				<h3 className="text-lg font-semibold mb-4">My Documents</h3>
				{nonFavorites.length === 0 && favorites.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						No documents yet. Create your first document to get started.
					</p>
				) : nonFavorites.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						All documents are in favorites.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{nonFavorites.map((d) => (
							<Link
								key={d.id}
								href={`/doc/${d.id}`}
								className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted group relative"
							>
								<div className="text-2xl shrink-0">
									{d.emooji || (
										<FileText size={24} className="text-muted-foreground" />
									)}
								</div>
								<div className="min-w-0">
									<p className="text-sm font-medium truncate">
										{d.title || 'Untitled'}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatDate(d.createdAt)}
									</p>
								</div>
								<button
									type="button"
									onClick={(e) => handleToggleFavorite(e, d.id, false)}
									className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-yellow-500"
									aria-label="Add to favorites"
								>
									<Star size={16} />
								</button>
							</Link>
						))}
					</div>
				)}
			</section>

			{shareDocs.length > 0 && (
				<section>
					<h3 className="text-lg font-semibold mb-4">Shared with me</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{shareDocs.map((d) => (
							<Link
								key={d.id}
								href={`/doc/${d.id}`}
								className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted"
							>
								<div className="text-2xl shrink-0">
									{d.emooji || (
										<FileText size={24} className="text-muted-foreground" />
									)}
								</div>
								<div className="min-w-0">
									<p className="font-medium truncate">
										{d.title || 'Untitled'}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatDate(d.createdAt)}
									</p>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
