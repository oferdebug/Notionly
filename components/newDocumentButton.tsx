'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FilePlusCorner } from 'lucide-react';

function NewDocumentButton() {
	const { user } = useUser();
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);

	const handleCreateDocument = async () => {
		if (!user || isCreating) return;

		setIsCreating(true);

		try {
			const collectionRef = collection(db, 'documents');
			const docRef = await addDoc(collectionRef, {
				title: 'Untitled Document',
				createdAt: new Date(),
				userId: user.id,
				parentId: null,
			});
			router.push(`/doc/${docRef.id}`);
		} catch (error) {
			console.error('Error creating document:', error);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<>
			<Button
				onClick={handleCreateDocument}
				disabled={isCreating}
				className={'md:hidden'}
				variant="ghost"
				size="icon"
				aria-label="Create new document"
			>
				<FilePlusCorner />
			</Button>
			<Button
				onClick={handleCreateDocument}
				disabled={isCreating}
				className={'hidden md:flex'}
			>
				New Document
			</Button>
		</>
	);
}

export default NewDocumentButton;
