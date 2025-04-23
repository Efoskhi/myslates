/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_FIREBASE_REGION: string;
    VITE_PROJECT_ID: string;
    VITE_OPENAI_API_KEY: string;
    // add any other variables you want to access here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
