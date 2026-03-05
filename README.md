# Content Management System (CMS)
- this is a CMS demo built using [Next.js](https://nextjs.org), tailwindcss, shadcn UI, Zod, Drizzle ORM, react-hook-form
- I'm building this as a training for upcoming projects
- project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features
- [X] sign up (create account)
- [X] sign in
- [X] sign in with OAuth Providers
- [X] sign out
- [ ] welcome email
- [X] send verification email
- [X] verify email page
- [X] send reset password email
- [X] reset password page
- [X] redirect to reset password from sign in form
- [X] profile management
- [X] change password tab in profile page (for users using a credentials)
- [X] redirect to set password from profile page (for users using an OAuth provider)
- [X] session management
- [X] linked accounts management
- [X] delete account functionality
- [X] two-factor authentication (2FA)
- [ ] passkeys better-auth plugin (has an Error 🔴)
- [X] Admin better-auth plugin + admin page
- [ ] create multiple roles using admin plugin
- [ ] organization better-auth plugin
    - [ ] organizations invitations inbox
    - [X] organizations invite email
- [ ] website skeleton loading 
- [ ] navbar to be able to return to home from anywhere
- [ ] profile page: show verification status (turn `requireEmailVerification` off first) 
- [ ] using react email templates
- [ ] add google to the "supported OAuth providers"
- [ ] verify form schemas in this application
- [ ] next.js redirect VS next/navigation/router.push ??
- [ ] in case the user has no organizations, instead of showing nothing but the create organization button, why not show some description about organizations and how they work

## Errors 🔴
- [ ] listing passkeys
- [X] impersonation button always visible
- [ ] loading indicator from 2fa form stays visible for a very long time
- [ ] messages/prerender-errors error in reset-password.tsx page
- [ ] send verification email page countdown