import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    '/',
    '/events/:id',
    '/api/webhook/clerk',
    '/api/webhook/chargily',
    '/api/uploadthing',
    '/api/comments' // Ajoutez cette ligne pour rendre la route publique
  ],
  ignoredRoutes: [
    '/api/webhook/clerk',
    '/api/webhook/chargily',
    '/api/uploadthing'
  ]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
