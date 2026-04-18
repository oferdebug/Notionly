import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import ThemeProvider from '@/components/DarkMode/ThemeProvider';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
	title: 'Notionly',
	description: 'A Real Time Collaborative Document Editor',
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={geist.variable}>
				<ClerkProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
