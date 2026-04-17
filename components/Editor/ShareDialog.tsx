'use client';

import { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, X, UserPlus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';



interface ShareDialogProps {
    id:string;
    initialSharedWith:string[];
}


export default function ShareDialog({id,initialSharedWith}:ShareDialogProps) {
    const [email,setEmail]=useState('');
    const [sharedWith,setSharedWith]=useState<string[]>(initialSharedWith||[]);

    const handleShare=async()=>{
      if(!email.trim()) return;
      const trimmed=email.trim().toLowerCase();
      if(sharedWith.includes(trimmed)) return;

      await updateDoc(doc(db,'documents',id),{
        sharedWith:arrayUnion(trimmed),
      });
      setSharedWith([...sharedWith,trimmed]);
      setEmail('');
      toast.success(`${trimmed} has been added to the document`);
    };

    const handleRemove=async(emailToRemove:string)=>{
      await updateDoc(doc(db,'documents',id),{
        sharedWith:arrayRemove(emailToRemove),
      });
      setSharedWith(sharedWith.filter((e)=>e!==emailToRemove));
      toast.success(`${emailToRemove} has been removed from the document`);
    };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' size='icon' aria-label='Share Document'>
            <Share2 size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Document with others</DialogTitle>
            <DialogDescription>
              Add people to your document by entering their email addresses below.
            </DialogDescription>
          </DialogHeader>
          <div className='flex gap-3'>
             <Input value={email} onChange={(e)=>setEmail(e.target.value)}
             placeholder='Enter Email Address'
             onKeyDown={(e)=>e.key==='Enter'&&handleShare()}
             />
             <Button onClick={handleShare} disabled={!email.trim()}>Share Document With User</Button>
          </div>
          {sharedWith.length>0&&(
            <div className='mt-5'>
              <p className='text-sm text-muted-foreground mb-3'>Shared With:{sharedWith.join(',')}</p>
              <div className='flex flex-col gap-3'>
                {sharedWith.map((email)=>(
                  <div key={email} className='flex items-center justify-between p-3 rounded bg-muted'>
                    <span className='text-sm'>{email}</span>
                    <button onClick={()=>handleRemove(email)} className='hover:text-destructive' aria-label='Remove Access'>
                      <X size={18} />
                    </button>
                    </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
