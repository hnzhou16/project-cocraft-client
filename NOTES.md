## Getting Started
- npx create-next-app@latest project-cocraft-client
- npm install @reduxjs/toolkit react-redux
- npm install axios
- npm install date-fns


## Resources
- Heroicons -> svg icons


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

### Literal vs Non-Literal Types
- A literal type means a type whose value is exactly a fixed string, number, or boolean value.
type Direction = "up" | "down" | "left" | "right";
- A non-literal type is more general.
let dir: string;

### export type vs export interface
#### export type
export const FEED_FILTER_KEYS = {
  MENTIONED: 'mentioned',
  FOLLOWING: 'following',
} as const;

typeof FEED_FILTER_KEYS === {
  readonly MENTIONED: "mentioned";
  readonly FOLLOWING: "following";
}

export type FeedFilterKey = keyof typeof FEED_FILTER_KEYS;
// => "MENTIONED" | "FOLLOWING"

#### export type
export enum FeedFilterKey {
  Mentioned = "mentioned",
  Following = "following",
}

export const INITIAL_FEED_FILTER_STATE: Record<FeedFilterKey, boolean> = {
  [FeedFilterKey.Mentioned]: false,
  [FeedFilterKey.Following]: false,
}


## Redux
### Thunk
- Wraps async function, dispatch action, and works with Redux store via dispatch/getState...


## Nest.js
### RootLayout({children})
'children' is the entire content wrapped inside <RootLayout> (app/page.tsx);


## Tailwind
- 1 rem = 4 spaces = 16px
- 1 space = 4px (w-2, p-4)


## start
npm run dev
yarn dev

