import Header from '@/components/Header';
import Sidebar from '@/components/sidebar/Sidebar';

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />
			<div className="flex min-h-screen">
				<Sidebar />
				<main className="flex-1 p-6 bg-background overflow-y-auto scrollbar-hide">
					{children}
				</main>
			</div>
		</>
	);
}
