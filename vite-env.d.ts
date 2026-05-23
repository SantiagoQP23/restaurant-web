interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
