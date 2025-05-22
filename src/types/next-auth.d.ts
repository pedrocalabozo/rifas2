import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id_usuario?: number;
      apellido?: string | null;
      telefono?: string | null;
      numero_id?: string | null; // Cedula
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id_usuario?: number;
    apellido?: string | null;
    telefono?: string | null;
    numero_id?: string | null;
     // This property is added temporarily by the signIn callback
    dbUser?: { 
      id_usuario: number;
      google_id: string;
      email: string;
      nombre?: string | null;
      apellido?: string | null;
      telefono?: string | null;
      numero_id?: string | null;
      imagen_perfil?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id_usuario?: number;
    google_id?: string;
    apellido?: string | null;
    telefono?: string | null;
    numero_id?: string | null;
    // name, email, picture are part of default JWT
  }
}
