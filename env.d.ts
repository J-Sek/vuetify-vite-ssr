/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module 'vuetify/styles';
declare module 'vuetify/styles/core';
declare module 'vuetify/styles/colors';
declare module 'vuetify/styles/utilities';
