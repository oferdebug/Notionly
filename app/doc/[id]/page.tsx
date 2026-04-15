import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Editor from '@/components/Editor/Editor';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { title } from 'process';
async function Page({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const docRef = doc(db, 'documents', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        <Breadcrumbs title={title} />
        return <div>Document not found</div>
    }
    const data = docSnap.data();

    return <Editor id={id} initialContent={data.content} initialTitle={data.title}/>
}
export default Page;