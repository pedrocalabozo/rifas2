
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
      console.log('Auth.ts: signIn callback triggered.');
      // Be cautious logging entire objects in production, especially if they contain sensitive data.
      // For debugging, this is fine.
      // console.log('Auth.ts: Account:', JSON.stringify(account, null, 2)); 
      // console.log('Auth.ts: Profile:', JSON.stringify(profile, null, 2));
      // console.log('Auth.ts: User from provider:', JSON.stringify(user, null, 2));


      if (account?.provider === 'google' && profile) {
        console.log('Auth.ts: Processing Google sign-in.');
        try {
          const googleId = profile.sub ?? user.id; 
          const email = profile.email ?? user.email;
          const name = profile.name ?? user.name;
          const image = profile.picture ?? user.image;

          console.log(`Auth.ts: Google User Info - ID: ${googleId}, Email: ${email}, Name: ${name}`);

          if (!googleId || !email) {
            console.error("Auth.ts: Google profile missing id or email. Denying sign-in.");
            return false; 
          }
          
          console.log(`Auth.ts: Querying database for user with google_id: ${googleId}`);
          const existingUsers = await query('SELECT id_usuario, google_id, email, nombre, apellido, telefono, numero_id, imagen_perfil FROM Usuarios WHERE google_id = ?', [googleId]) as DbUser[];
          let dbUser: DbUser;

          if (existingUsers.length > 0) {
            dbUser = existingUsers[0];
            console.log('Auth.ts: Existing user found in DB:', dbUser.id_usuario, dbUser.email);
            
            if ((name && dbUser.nombre !== name) || (image && dbUser.imagen_perfil !== image)) {
              console.log('Auth.ts: Updating user name/image in DB.');
              await query('UPDATE Usuarios SET nombre = ?, imagen_perfil = ? WHERE google_id = ?', [name, image, googleId]);
              dbUser.nombre = name;
              dbUser.imagen_perfil = image;
              console.log('Auth.ts: User name/image updated.');
            }
          } else {
            console.log('Auth.ts: New user. Inserting into DB.');
            const result = await query(
              'INSERT INTO Usuarios (google_id, email, nombre, imagen_perfil) VALUES (?, ?, ?, ?)',
              [googleId, email, name, image]
            );

            // Check if insert was successful and we got an ID
            if (result.affectedRows === 1 && result.insertId) {
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
                console.log('Auth.ts: New user inserted into DB:', dbUser.id_usuario, dbUser.email);
            } else {
                console.error('Auth.ts: Failed to insert new user into DB. Result:', result);
                return false; // Deny sign-in if user creation failed
            }
          }
          
          (user as any).dbUser = dbUser; // Attach our DB user object to the NextAuth user
          console.log('Auth.ts: dbUser attached to NextAuth user object. Allowing sign-in.');
          return true;
        } catch (error) {
          console.error('Auth.ts: Error during signIn callback (DB operations or other):', error);
          return false; 
        }
      }
      console.log('Auth.ts: Not a Google provider sign-in or profile missing. Proceeding with default behavior.');
      // If not Google or profile is missing, and it's not an error yet, return true to allow (or false if it's a failed attempt)
      // For now, if it's not Google, we'll allow it, assuming other providers might be added or it's not an error.
      // If it IS a Google attempt but 'profile' was missing, it might indicate a problem with Google's response.
      if (account?.provider === 'google' && !profile) {
        console.error('Auth.ts: Google sign-in attempt but profile is missing. Denying sign-in.');
        return false;
      }
      return true; 
    },
    async jwt({ token, user, account, profile }) {
      // The `user` object here is the one from the provider or the `signIn` callback (if dbUser was attached)
      if (user && (user as any).dbUser) {
        const dbUser = (user as any).dbUser as DbUser;
        token.id_usuario = dbUser.id_usuario;
        token.google_id = dbUser.google_id;
        token.email = dbUser.email; 
        token.name = dbUser.nombre; 
        token.apellido = dbUser.apellido;
        token.telefono = dbUser.telefono;
        token.numero_id = dbUser.numero_id;
        token.picture = dbUser.imagen_perfil; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.google_id as string; 
        session.user.email = token.email as string;
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
        
        (session.user as any).id_usuario = token.id_usuario as number;
        (session.user as any).apellido = token.apellido as string | null | undefined;
        (session.user as any).telefono = token.telefono as string | null | undefined;
        (session.user as any).numero_id = token.numero_id as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', 
    // error: '/auth/error', // Puedes crear una página de error personalizada
  },
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate que esta variable se llame NEXTAUTH_SECRET en tu .env.local
};

