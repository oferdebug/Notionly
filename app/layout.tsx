import type {Metadata} from "next";
import "./globals.css";
import {Geist} from "next/font/google";
import {ClerkProvider} from '@clerk/nextjs'
import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import ThemeProvider from "@/components/DarkMode/ThemeProvider";

const geist = Geist({subsets: ['latin'], variable: '--font-sans'});

export const metadata: Metadata = {
    title: "Collaborative Document Editor",
    description: "A real-time collaborative document editing application",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
            <body className={geist.variable}>
            <ThemeProvider>
                <Header/>
                <div className={'flex min-h-screen'}>
                    <Sidebar/>
                    <div className={'flex-1 p-6 bg-background overflow-y-auto scrollbar-hide'}>
                        {children}
                    </div>
                </div>
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    )
}