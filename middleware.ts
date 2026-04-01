import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // matcher for middleware to run on, except public api routes, static files, and images
  matcher: ['/((?!api/auth|_next/static|_next/image|.*\\.svg$).*)'],
};
