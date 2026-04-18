import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
	return (
		<div className="text-center">
			<h1 className="text-4xl font-bold mb-2">Notionly</h1>
			<p className="text-muted-foreground mb-8">Your workspace, your way</p>
			<SignUp />
		</div>
	);
}
