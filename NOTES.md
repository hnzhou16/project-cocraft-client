## Getting Started
- npx create-next-app@latest project-cocraft-client
- npm install @reduxjs/toolkit react-redux
- npm install axios
- npm install date-fns

## Server Components vs Client Components
- Server Components -> rendered only on the server side.
- Client Components -> prerender on the server side to create a static shell, then hydrated on the client side;
everything doesn't require interaction or isn't dependent from browser(eg. console.log) is still rendered on the server, while others will be placeholder at the server side.


## TypeScript
### Generic Type <>
- unlike 'any', it can capture the type in the argument 
function identity<Type>(arg: Type): Type {
return arg;
}

## Redux
### Thunk
- Wraps async function, dispatch action, and works with Redux store via dispatch/getState...

## Nest.js
### RootLayout({children})
'children' is the entire content in page.tsx passed into 'RootLayout', eg, define header/sidebar in 'RootLayout', 'children' is the main home page.

## TODO
- route group, 35:50
- error file, 36;50 (only show the closest error file)
- loading file, 39:30
- revalidate data, 50:45
- route file 54:30
- metadata, 58:00

## start
npm run dev
yarn dev


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.