// export const FEED_FILTER_KEYS = {
//   MENTIONED: 'mentioned',
//   FOLLOWING: 'following',
// } as const; // let ts make it read-only and treat 'mentioned'/'following' as types instead of string

// export type FeedFilterKey = keyof typeof FEED_FILTER_KEYS;
// typeof FEED_FILTER_KEYS =>
// {
//   readonly MENTIONED: "mentioned";
//   readonly FOLLOWING: "following";
// }
// keyof: This extracts the keys of the object type ("MENTIONED" and "FOLLOWING")

// export const ROLES = ['contractor', 'manufacturer', 'designer', 'homeowner'] as const;

// export type Role = typeof ROLES[number];