/// <reference types="vite/client" />

// CSS Modules type declaration
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
