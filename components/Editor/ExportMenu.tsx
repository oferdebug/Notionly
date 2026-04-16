'use client';
import {Editor} from '@tiptap/react';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {Download,FileText,FileType} from 'lucide-react';
import TurndownService from 'turndown';


interface ExportMenuProps {
    editor:Editor|null;
    title:string;
}


export default function ExportMenu({editor,title}:ExportMenuProps) {
    if(!editor) return null;

    const fileName=title||`${title||'united'}`;

    const handleExportMarkdown=()=>{
        const html=editor.getHTML();
        const turndown=new TurndownService();
        const markdown=turndown.turndown(html);


        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };


    const handleExportPDF=()=>{
        window.print();
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={'icon'} aria-label={'Export'}>
                    <Download size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'end'}>
                <DropdownMenuItem onClick={handleExportMarkdown}>
                    <FileText size={20} className={'mr-2'} />
                    Export As Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                    <FileType size={20} className={'mr-2'} />
                    Export As PDF
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
