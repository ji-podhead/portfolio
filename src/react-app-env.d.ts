/// <reference types="react-scripts" />

declare module '*.vert' {
  const content: string;
  export default content;
}

declare module '*.frag' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'three/addons/loaders/FontLoader.js' {
  export class FontLoader {
    load(
      url: string,
      onLoad: (font: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(json: any): any;
  }
}

declare module 'three/examples/jsm/loaders/FontLoader' {
  export class FontLoader {
    load(
      url: string,
      onLoad: (font: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(json: any): any;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
