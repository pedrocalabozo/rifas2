'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SignInButton from '@/components/auth/SignInButton';
import SignOutButton from '@/components/auth/SignOutButton';
import NavMenu from './NavMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogIn, UserCircle } from 'lucide-react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Rifa Facil
        </Link>
        <div className="flex items-center gap-4">
          <NavMenu />
          {status === 'loading' ? (
            <div className="h-10 w-24 bg-muted rounded-md animate-pulse"></div>
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" passHref>
                <Avatar className="cursor-pointer h-9 w-9">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? 'Usuario'} />
                  <AvatarFallback>
                    {session.user.name ? session.user.name.charAt(0).toUpperCase() : <UserCircle size={20}/>}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  );
}
