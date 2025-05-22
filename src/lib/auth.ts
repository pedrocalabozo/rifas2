
import type { NextAuthOptions, User as NextAuthUser, Account, Profile, Session as NextAuthSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
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
            
            let needsUpdate = false;
            const updateQueryParts = [];
            const updateValues = [];

            if (name && dbUser.nombre !== name) {
                updateQueryParts.push('nombre = ?');
                updateValues.push(name);
                needsUpdate = true;
            }
            if (image && dbUser.imagen_perfil !== image) {
                updateQueryParts.push('imagen_perfil = ?');
                updateValues.push(image);
                needsUpdate = true;
            }

            if (needsUpdate) {
                updateValues.push(googleId);
                console.log('Auth.ts: Updating user name/image in DB.');
                await query(`UPDATE Usuarios SET ${updateQueryParts.join(', ')} WHERE google_id = ?`, updateValues);
                if (name) dbUser.nombre = name;
                if (image) dbUser.imagen_perfil = image;
                console.log('Auth.ts: User name/image updated.');
            }
          } else {
            console.log('Auth.ts: New user. Inserting into DB.');
            const result = await query(
              'INSERT INTO Usuarios (google_id, email, nombre, imagen_perfil) VALUES (?, ?, ?, ?)',
              [googleId, email, name, image]
            );

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
                return false; 
            }
          }
          
          (user as any).dbUser = dbUser; 
          console.log('Auth.ts: dbUser attached to NextAuth user object. Allowing sign-in.');
          return true;
        } catch (error) {
          console.error('Auth.ts: Error during signIn callback (DB operations or other):', error);
          return false; 
        }
      }
      console.log('Auth.ts: Not a Google provider sign-in or profile missing. Proceeding with default behavior.');
      if (account?.provider === 'google' && !profile) {
        console.error('Auth.ts: Google sign-in attempt but profile is missing. Denying sign-in.');
        return false;
      }
      return true; 
    },
    async jwt({ token, user, account, profile, trigger, session: sessionDataFromUpdate }: { token: JWT, user?: NextAuthUser, account?: Account | null, profile?: Profile, trigger?: "signIn" | "signUp" | "update" | "jwt", session?: any }) {
      // console.log(`Auth.ts: JWT callback triggered. Trigger: ${trigger}, Token ID Usuario: ${token.id_usuario}`);
      
      // Initial sign-in
      if (user && account && (user as any).dbUser) {
        const dbUser = (user as any).dbUser as DbUser;
        token.id_usuario = dbUser.id_usuario;
        token.google_id = dbUser.google_id;
        token.email = dbUser.email; 
        token.name = dbUser.nombre; 
        token.apellido = dbUser.apellido;
        token.telefono = dbUser.telefono;
        token.numero_id = dbUser.numero_id;
        token.picture = dbUser.imagen_perfil; 
        // console.log('Auth.ts: JWT populated from initial signIn:', JSON.stringify(token));
      }

      // This block handles session updates, e.g., when client calls `update()`
      // It re-fetches user data from DB to ensure token has the latest info.
      if (trigger === "update" && token.id_usuario) {
        console.log(`Auth.ts: JWT callback - Trigger is 'update'. Re-fetching user data for id_usuario: ${token.id_usuario}`);
        try {
          const dbUsers = await query(
            'SELECT id_usuario, google_id, email, nombre, apellido, telefono, numero_id, imagen_perfil FROM Usuarios WHERE id_usuario = ?',
            [token.id_usuario]
          ) as DbUser[];

          if (dbUsers.length > 0) {
            const latestDbUser = dbUsers[0];
            token.email = latestDbUser.email;
            token.name = latestDbUser.nombre;
            token.apellido = latestDbUser.apellido;
            token.telefono = latestDbUser.telefono;
            token.numero_id = latestDbUser.numero_id;
            token.picture = latestDbUser.imagen_perfil;
            console.log('Auth.ts: JWT updated with fresh DB data:', JSON.stringify(token));
          } else {
            console.warn(`Auth.ts: JWT callback - User with id_usuario ${token.id_usuario} not found in DB during re-fetch for update. Clearing token.`);
            // User not found, potentially an issue or deleted user. Clear the token to sign out.
            return {}; // Return empty object to invalidate session
          }
        } catch (error) {
          console.error("Auth.ts: Error re-fetching user data in JWT callback during update:", error);
          // If DB fetch fails, keep existing token to avoid logging out, but it might be stale.
          // Or, to be safe, one might choose to invalidate the session here too. For now, keep.
        }
      }
      
      // If sessionDataFromUpdate is passed (e.g. update({ name: "New Name" })), merge it.
      // Our current profile form doesn't pass data to update(), it relies on DB re-fetch.
      if (trigger === "update" && sessionDataFromUpdate) {
        console.log('Auth.ts: JWT callback - Merging sessionDataFromUpdate into token:', sessionDataFromUpdate);
        token = { ...token, ...sessionDataFromUpdate };
      }

      // console.log('Auth.ts: JWT callback, returning token:', JSON.stringify(token));
      return token;
    },
    async session({ session, token }: { session: NextAuthSession, token: JWT }) {
      // console.log('Auth.ts: Session callback triggered. Token received:', JSON.stringify(token));
      if (session.user) {
        // Standard NextAuth fields
        session.user.id = token.sub || token.google_id as string; // `sub` is the standard JWT subject, often the user ID. Fallback to google_id.
        session.user.email = token.email as string;
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
        
        // Custom fields
        (session.user as any).id_usuario = token.id_usuario as number;
        (session.user as any).apellido = token.apellido as string | null | undefined;
        (session.user as any).telefono = token.telefono as string | null | undefined;
        (session.user as any).numero_id = token.numero_id as string | null | undefined;
      }
      // console.log("Auth.ts: Session callback, final session object:", JSON.stringify(session));
      return session;
    },
  },
  pages: {
    signIn: '/', 
  },
  secret: process.env.NEXTAUTH_SECRET,
};

    