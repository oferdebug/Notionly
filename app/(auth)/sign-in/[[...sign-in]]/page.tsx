import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
	return (
		<div className="text-center">
			<h1 className="text-4xl font-bold mb-2">Notionly</h1>
			<p className="text-muted-foreground mb-8">Your workspace, your way</p>
			<SignIn />
		</div>
	);
}
