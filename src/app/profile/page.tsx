'use client';

import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProfileForm from '@/components/profile/ProfileForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExtendedUser } from '@/types'; // Ensure ExtendedUser includes id_usuario, apellido, etc.

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/'); // Redirect to home if not logged in
    } else if (status === 'authenticated') {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading || status === 'loading') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session?.user) {
     return <p>Error al cargar el perfil. Intenta recargar la página.</p>;
  }

  const user = session.user as ExtendedUser; // Cast to your extended user type

  const profileComplete = user.apellido && user.telefono && user.numero_id;

  const handleProfileUpdate = async () => {
    // This function will be called by ProfileForm on successful update.
    // We need to trigger a session update to refresh the data.
    await update(); //This refreshes the session
    // Potentially refetch session on server side if critical using await getSession()
    // but client-side update() should be enough for most cases.
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Tu Perfil</h1>
        <p className="text-muted-foreground">
          {profileComplete ? 'Administra tu información personal y actividades.' : 'Completa tu perfil para participar en las rifas.'}
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{profileComplete ? 'Actualizar Información' : 'Completar Perfil'}</CardTitle>
          {!profileComplete && (
            <CardDescription>
              Necesitamos algunos datos adicionales para que puedas participar en las rifas.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} onProfileUpdate={handleProfileUpdate} />
        </CardContent>
      </Card>

      {profileComplete && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Aquí verás tus participaciones y premios.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Aún no tienes actividad registrada.</p>
            {/* Later, list user's tickets, winnings, etc. */}
          </CardContent>
        </Card>
      )}
       <Button variant="link" onClick={() => router.push('/')} className="mt-4">
        Volver a las Rifas
      </Button>
    </div>
  );
}
