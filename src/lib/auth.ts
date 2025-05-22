import type { NextAuthOptions, User as NextAuthUser, Account, Profile } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { query } from './db'; // Conceptual database query function

interface DbUser {
  id_usuario: number;
  google_id: string;
  email: string;
  nombre?: string | null;
  apellido?: string | null;
  telefono?: string | null;
  numero_id?: string | null; // Cedula
  imagen_perfil?: string | null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }: { user: NextAuthUser, account: Account | null, profile?: Profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          const googleId = profile.sub ?? user.id; // profile.sub is preferred for Google
          const email = profile.email ?? user.email;
          const name = profile.name ?? user.name;
          const image = profile.picture ?? user.image;

          if (!googleId || !email) {
            console.error("Google profile missing id or email");
            return false; // Deny sign-in
          }
          
          const existingUsers = await query('SELECT id_usuario, google_id, email, nombre, apellido, telefono, numero_id, imagen_perfil FROM Usuarios WHERE google_id = ?', [googleId]) as DbUser[];
          let dbUser: DbUser;

          if (existingUsers.length > 0) {
            dbUser = existingUsers[0];
            // Optionally update name/image if changed in Google
            if ((name && dbUser.nombre !== name) || (image && dbUser.imagen_perfil !== image)) {
              await query('UPDATE Usuarios SET nombre = ?, imagen_perfil = ? WHERE google_id = ?', [name, image, googleId]);
              dbUser.nombre = name;
              dbUser.imagen_perfil = image;
            }
          } else {
            // Create new user
            const result = await query(
              'INSERT INTO Usuarios (google_id, email, nombre, imagen_perfil) VALUES (?, ?, ?, ?)',
              [googleId, email, name, image]
            );
            dbUser = {
              id_usuario: result.insertId,
              google_id: googleId,
              email: email,
              nombre: name,
              imagen_perfil: image,
              apellido: null,
              telefono: null,
              numero_id: null,
            };
          }
          // Attach our internal user representation to the NextAuth user object for the JWT callback
          (user as any).dbUser = dbUser;
          return true;
        } catch (error) {
          console.error('Error during signIn callback:', error);
          return false; // Deny sign-in on error
        }
      }
      return true; // Allow other sign-in methods if any
    },
    async jwt({ token, user, account, profile }) {
      // The `user` object here is the one from the provider or the `signIn` callback
      // if we attached `dbUser` to it.
      if (user && (user as any).dbUser) {
        const dbUser = (user as any).dbUser as DbUser;
        token.id_usuario = dbUser.id_usuario;
        token.google_id = dbUser.google_id;
        token.email = dbUser.email; // Ensure email is from our DB record if needed, or from Google
        token.name = dbUser.nombre; // Use nombre from DB as primary name
        token.apellido = dbUser.apellido;
        token.telefono = dbUser.telefono;
        token.numero_id = dbUser.numero_id;
        token.picture = dbUser.imagen_perfil; // Use imagen_perfil from DB
      }
      return token;
    },
    async session({ session, token }) {
      // Token contains all the fields we added in the jwt callback
      if (session.user) {
        session.user.id = token.google_id as string; // Keep Google ID as next-auth's default user.id
        session.user.email = token.email as string;
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
        
        // Add custom fields from our database
        (session.user as any).id_usuario = token.id_usuario as number;
        (session.user as any).apellido = token.apellido as string | null | undefined;
        (session.user as any).telefono = token.telefono as string | null | undefined;
        (session.user as any).numero_id = token.numero_id as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // Redirect to home for login, login button will be there
    // error: '/auth/error', // Custom error page
  },
  secret: process.env.NEXTAUTH_SECRET,
};
