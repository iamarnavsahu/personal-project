declare module "jszip" {
  export default class JSZip {
    file(name: string, data: Blob | ArrayBuffer | Uint8Array | string): JSZip;
    generateAsync(options: { type: "blob"; compression?: string }): Promise<Blob>;
  }
}
