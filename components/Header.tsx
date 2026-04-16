'use client';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

function Header() {
    const { user } = useUser();

    return (
        <div className="flex items-center justify-between p-3 md:p-5">
            {user ? (
                <h1 className="text-base md:text-2xl font-bold truncate">
                    <span className="md:hidden">Hi, {user.firstName}</span>
                    <span className="hidden md:inline">
                        Welcome to {user.firstName}&apos;s Space
                    </span>
                </h1>
            ) : (
                <h1 className="text-base md:text-2xl font-bold">
                    Welcome to the Space
                </h1>
            )}
            <div>{user ? <UserButton /> : <SignInButton />}</div>
        </div>
    );
}

export default Header;
