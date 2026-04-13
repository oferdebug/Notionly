import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Editor from '@/components/Editor/Editor';

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const docRef = doc(db, 'documents', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return <div>Document not found</div>
    }
    const data = docSnap.data();

    return <Editor id={id} initialContent={data.content} initialTitle={data.title}/>
}
export default Page;