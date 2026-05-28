# Security Policy

## Supported versions

This is a personal demo project. Only the `main` branch is supported.

## Scope

Wraith ships as a self-contained client-side demo. By default it:

- Does **not** collect, transmit, or store any user data on a hosted backend
- Stores demo state in `localStorage` only (`wraith:state:v1`)
- Does **not** include billing, authentication providers, or any third-party data integration
- Does **not** include real platform scraping or API access

If you fork it and wire up real auth or a real database, the security posture is on you.

## Reporting a vulnerability

If you find a security issue in the demo (XSS, prototype pollution, dependency CVE, etc.), please **don't** open a public issue.

Email **vineet.sista@gmail.com** with:

- A short description
- Steps to reproduce
- The version / commit SHA you tested
- Your contact info if you'd like credit

You'll get an acknowledgement within a few days. Fixes for confirmed issues will land on `main` and be noted in the commit log.

## Dependencies

This project uses Dependabot via GitHub. Critical dependency updates are typically merged within 48 hours.
