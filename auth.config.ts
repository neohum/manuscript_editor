import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isTeacherDashboard = nextUrl.pathname.startsWith('/teacher');
      const isStudentDashboard = nextUrl.pathname.startsWith('/student');
      const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

      if (isTeacherDashboard) {
        // Only teachers can access teacher dashboard
        if (isLoggedIn && auth.user.role === 'teacher') return true;
        return false; 
      }

      if (isStudentDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl)); // Redirect logged in users away from auth pages
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Add providers in auth.ts to avoid Edge runtime issues
} satisfies NextAuthConfig;
