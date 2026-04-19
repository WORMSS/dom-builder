import { Html } from './Html';
import { createElement } from './createElement';

/**
 * Options for configuring a new HTML document.
 */
export interface CreateHtmlOptions {
  /**
   * The text for the <title> tag.
   */
  title?: string;
  /**
   * The value for the lang attribute of the <html> tag.
   * @default en
   */
  lang?: string;
  /**
   * Whether to include a default viewport meta tag for mobile responsiveness.
   * @default true
   */
  mobileMeta?: boolean;
  /**
   * The value for the charset meta tag in the <head>.
   * @default utf-8
   */
  charset?: string;
  /**
   * Configuration for the <base> tag.
   */
  base?: {
    /**
     * The base URL for all relative URLs in the document.
     */
    url?: string;
    /**
     * The default target for all hyperlinks and forms in the document.
     */
    target?: string;
  };
}

/**
 * Factory function to create and configure a new Html document instance.
 * @param options The options for the document.
 * @returns A new, configured Html instance.
 */
export function createHtml(options?: CreateHtmlOptions): Html {
  const html = new Html();
  const lang = options?.lang ?? 'en';
  if (lang) {
    html.attribute('lang', lang);
  }
  const charset = options?.charset ?? 'utf-8';
  if (charset) {
    const meta = createElement('meta').attribute('charset', charset);
    html.head((h) => h.append(meta));
  }
  if (options?.mobileMeta ?? true) {
    const meta = createElement('meta')
      .attribute('name', 'viewport')
      .attribute('content', 'width=device-width, initial-scale=1.0');
    html.head((h) => h.append(meta));
  }
  if (options?.title) {
    const title = createElement('title').append(options.title);
    html.head((h) => h.append(title));
  }
  if (options?.base?.target || options?.base?.url) {
    const base = createElement('base')
      .attribute('target', options.base.target)
      .attribute('url', options.base.url);
    html.head((h) => h.append(base));
  }
  return html;
}
