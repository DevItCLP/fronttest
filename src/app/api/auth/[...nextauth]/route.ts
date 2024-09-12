import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

//---------------------------------------------------------------------

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const datos = {
          usser: credentials?.username,
          password: credentials?.password,
        };
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth`, datos, { auth: authCredentials });
        const user = response.data.object;
        if (response.data.status === "success") {
          const userSession = {
            id: user[0].idUser.toString(),
            name: `${user[0].nombresUser} ${user[0].apellidosUser}`,
            email: user[0].emailUser,
            telefono: user[0].telefonoUser,
            rol: user[0].nombreRol,
          };
          return userSession;
        }
        if (response.data.status === "warning") {
          throw response.data;
        }
        if (response.data.status === "incorrect") {
          throw response.data;
        }
        return null;
      },
    }),
  ],
  session: {
    maxAge: 20 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    //Cuando se cierra la seción se va a la raiz
    signIn: "/",
  },
});
export { handler as GET, handler as POST };
