/// <reference types="vite/client" />

declare module '*&as=picture' {
  const picture: import('./lib/images').Picture
  export default picture
}

declare module '*.jpg?format=webp' {
  const src: string
  export default src
}
