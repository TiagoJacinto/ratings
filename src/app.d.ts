import type localforage from 'localforage';
declare module 'sql.js/dist/sql-wasm.wasm?url' {
  const url: string;
  export default url;
}

declare global {
  interface Window {
    localforage?: typeof localforage;
  }
}
