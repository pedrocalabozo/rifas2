'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function SignInButton() {
  return (
    <Button onClick={() => signIn('google', { callbackUrl: '/profile' })} variant="outline">
      <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
    </Button>
  );
}
