"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewDocumentButton from "@/components/newDocumentButton";
import { toast } from "sonner";

interface Document {
	id: string;
	title: string;
	emooji?: string;
	createdAt: { seconds: number };
	sharedWith?: string[];
	trashedAt?: { seconds: number } | null;
}
export default function Home() {
	const { user } = useUser();
	const [myDocs, setMyDocs] = useState<Document[]>([]);
	const [shareDocs, setShareDocs] = useState<Document[]>([]);

	useEffect(() => {
		if (!user?.id) return;

		const myQuery = query(
			collection(db, "documents"),
			where("userId", "==", user.id),
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
				collection(db, "documents"),
				where("sharedWith", "array-contains", email),
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
		if (!timestamp) return "";
		return new Date(timestamp.seconds * 1000).toLocaleDateString();
	};

	const handleTrash = (e: React.MouseEvent, id: string) => {
		e.preventDefault();
		e.stopPropagation();
		const confirmed = window.confirm("Move this document to trash?");
		if (!confirmed) return;
		updateDoc(doc(db, "documents", id), {
			trashedAt: new Date(),
		});
		toast.success("Document moved to trash");
		setMyDocs(myDocs.filter((d) => d.id !== id));
		setShareDocs(shareDocs.filter((d) => d.id !== id));
	};

	const handleRestore = (id: string) => {
		updateDoc(doc(db, "documents", id), {
			trashedAt: null,
		});
		toast.success("Document restored");
		setMyDocs(myDocs.filter((d) => d.id !== id));
		setShareDocs(shareDocs.filter((d) => d.id !== id));
	};

	const handleDeleteForever = (id: string) => {
		deleteDoc(doc(db, "documents", id));
		toast.success("Document deleted forever");
		setMyDocs(myDocs.filter((d) => d.id !== id));
		setShareDocs(shareDocs.filter((d) => d.id !== id));
	};

	const allDocs = myDocs.concat(shareDocs);
	const sortedDocs = allDocs.sort(
		(a, b) => b.createdAt.seconds - a.createdAt.seconds,
	);
	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-3">
					{user?.firstName
						? `Welcome back,${user.firstName}`
						: `Welcome To The Space`}
				</h1>
				<p className="text-muted-foreground">Pick Up Where You Left Off</p>
			</div>
			<div className="mb-8">
				<NewDocumentButton />
			</div>

			<section className="mb-8">
				<h3 className="text-lg font-semibold mb-6">My Documents</h3>
				{myDocs.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						No documents yet. Create your first document to get started.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grdic-cols-2 lg:grid-cols-3 gap-4">
						{myDocs.map((doc) => (
							<Link
								key={doc.id}
								href={`/doc/${doc.id}`}
								className="flex items-start gap-3 p-6 rounded-lg border hover:bg-muted"
							>
								<div className="text-2xl shrink-0">
									{doc.emooji || (
										<FileText size={24} className="text-muted-foreground" />
									)}
								</div>
								<div className="min-w-0">
									<p className="text-sm font-medium truncate">
										{doc.title || "Untitled"}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatDate(doc.createdAt)}
									</p>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>

			{shareDocs.length > 0 && (
				<section>
					<h3 className="text-lg font-semibold mb-4">Shared with me</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{shareDocs.map((doc) => (
							<Link
								key={doc.id}
								href={`/doc/${doc.id}`}
								className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted"
							>
								<div className="text-2xl shrink-0">
									{doc.emooji || (
										<FileText size={24} className="text-muted-foreground" />
									)}
								</div>
								<div className="min-w-0">
									<p className="font-medium truncate">
										{doc.title || "Untitled"}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatDate(doc.createdAt)}
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
