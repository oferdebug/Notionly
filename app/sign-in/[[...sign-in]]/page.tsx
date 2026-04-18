import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-2">Notionly</h1>
				<p className="text-muted-foreground mb-8">Your workspace, your way</p>
				<SignIn
					appearance={{
						elements: {
							rootBox: 'mx-auto',
							card: 'bg-card border border-border shadow-lg',
						},
					}}
				/>
			</div>
		</div>
	);
}
