import { Html } from './Html';
import { createElement } from './createElement';

export function createHtml(options?: {
  title?: string;
  /**
   * @default en
   */
  lang?: string;
  /**
   * @default true
   */
  mobileMeta?: boolean;
  /**
   * @default utf-8
   */
  charset?: string;
  base?: {
    url?: string;
    target?: string;
  };
}): Html {
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
