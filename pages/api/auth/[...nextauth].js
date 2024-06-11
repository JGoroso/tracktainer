
import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { getUsuarios } from "../../../src/app/firebase/firestore/firestore";


export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (!session) {
        return null;
      } else {
        const usersFromFirestore = await getUsuarios();
        const allowedEmails = new Set(usersFromFirestore.map(user => user.email));
        const isUserAllowed = allowedEmails.has(session?.user?.email);
        if (!isUserAllowed) {
          session.user = {
            userAllowed: false
          }
          return Promise.resolve(session)
        } else {
          console.log("usuario permitido, iniciando sesión");
          const userRole = usersFromFirestore.find(user => user.email === session?.user.email)?.role;
          // Establecer el rol del usuario en la sesión
          session.user.email = token.email
          session.user.userAllowed = true
          session.user.role = userRole

          return Promise.resolve(session);
        }
      }
    }
  }
}

export default NextAuth(authOptions)