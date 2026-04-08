'use client';
import {SignInButton, UserButton, useUser} from "@clerk/nextjs";

function Header() {
    const { user } = useUser();

    return (
        <div className={'flex items-center  justify-between p-5'}>
            {user ? (
                <h1 className={'text-2xl font-bold'}>Welcome to {user.firstName}&apos;s Space</h1>
            ) : (
                <h1>Welcome to the Space</h1>
            )}

            <div>
                {user ? <UserButton /> : <SignInButton />}
            </div>
        </div>
    );
}
export default Header;