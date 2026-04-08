    'use client';
import {Button} from "@/components/ui/button";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

function NewDocumentButton() {
    const {user} = useUser();
    const router = useRouter();

    const handleCreateDocument = async () => {
        if (!user) return;

        try {
            const collectionRef = collection(db, 'documents');
            const docRef = await addDoc(collectionRef, {
                title: 'Untitled Document',
                createdAt: new Date(),
                userId: user.id,
            });
            router.push(`/doc/${docRef.id}`);
        } catch (error) {
            console.error('Error creating document:', error);
        }
    };

    return (
        <Button onClick={handleCreateDocument}>New Document</Button>
    );
}

export default NewDocumentButton
