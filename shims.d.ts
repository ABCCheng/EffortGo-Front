interface Window {
    gtag: (...args: any[]) => void;
}

declare module 'virtual:pwa-register' {
    export function registerSW(): void;
}