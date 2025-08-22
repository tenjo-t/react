export type valueof<T> = T[keyof T];
export type Awaitable<T> = T | Promise<T>;

export const IS_CLIENT: boolean = typeof window !== "undefined";
