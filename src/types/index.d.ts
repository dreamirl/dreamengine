export {};
declare global {
  interface Window {
    leavePage: boolean;
  }

  type ResizeMode = 'stretch-ratio' | 'ratio-stretch' | 'stretch' | 'full' | 'ratio' | '';
}
