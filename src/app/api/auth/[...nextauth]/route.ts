import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../../lib/mongodb'
import User from '../../../../models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        await dbConnect()

        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required')
        }

        const user = await User.findOne({ email: credentials.email })
        
        if (!user) {
          throw new Error('Invalid email or password')
        }

        if (user.status !== 'Active') {
          throw new Error('User is not active. Please verify your email.')
        }

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            token
          }
        } else {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.token = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.userId as string,
          token: token.token as string,
        }
      }
      return session
    }
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
