namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    MONGO_URI: string;
  }
}

declare interface ObjectIdLike {
  id: string | Uint8Array;
  __id?: string;
  toHexString(): string;
}
