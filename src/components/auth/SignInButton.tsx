
'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function SignInButton() {
  const handleSignIn = () => {
    console.log('SignInButton clicked, attempting to call signIn("google")...');
    signIn('google', { callbackUrl: '/profile' }).catch(error => {
      console.error('Error calling signIn:', error);
    });
  };

  return (
    <Button onClick={handleSignIn} variant="outline">
      <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
    </Button>
  );
}
