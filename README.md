# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://github.com/oxc-projects/oxc)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on build and dev performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate React and TypeScript.

## Render Static Site routing

ELMS uses React Router browser paths such as `/register`. For a Render Static
Site deployment, add this rule in the service's **Redirects/Rewrites** settings:

| Source | Destination | Action |
| --- | --- | --- |
| `/*` | `/index.html` | Rewrite |

This lets Render serve the SPA entry point when a user opens or refreshes
`/register`, `/dashboard`, or `/manager` directly. Do not add a rewrite for the
backend API: API calls use `VITE_API_BASE_URL` and go to the backend service.

Set `VITE_API_BASE_URL` to the backend's public URL ending in `/api` before
building the static site. For example:

```text
https://your-backend.example.com/api
```
