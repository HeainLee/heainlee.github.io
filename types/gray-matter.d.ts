declare module 'gray-matter' {
  interface GrayMatterFile<I extends object> {
    data: I
    content: string
    excerpt?: string
    orig: Buffer | string
    language: string
    matter: string
    stringify: (lang: string) => string
  }

  interface GrayMatterOption<I, O> {
    excerpt?: boolean | ((file: GrayMatterFile<I>, options: GrayMatterOption<I, O>) => string)
    excerpt_separator?: string
    engines?: {
      [index: string]: (input: string) => object
    }
    language?: string
    delimiters?: string | [string, string]
  }

  function matter<I extends object = any, O = any>(
    input: string | Buffer,
    options?: GrayMatterOption<I, O>
  ): GrayMatterFile<I>

  export = matter
}
