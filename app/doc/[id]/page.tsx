import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Editor from '@/components/Editor/Editor';
import { LiveblocksWrapper } from '@/components/LiveBlocks/LiveBlocksProvider';

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const docRef = doc(db, 'documents', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return <div>Document not found</div>;
    }
    const data = docSnap.data();

    return (
        <LiveblocksWrapper roomId={id}>
            <Editor
                id={id}
                initialTitle={data.title}
                initialEmoji={data.emoji}
                initialCover={data.cover}
            />
        </LiveblocksWrapper>
    );
}
export default Page;
