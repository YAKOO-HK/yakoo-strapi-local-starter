import { htmlToText } from 'html-to-text';
import { Document } from 'langchain/document';
import { PostsResponse } from '@/strapi/posts';
import { UnwrapArray } from '@/types/helpers';
import { PageComponent } from './components';
import { PagesResponse } from './pages';

function blocksToText(json: unknown): string {
  if (!json) {
    return '';
  }
  if (typeof json === 'string') {
    return json;
  }
  if (json instanceof Date) {
    return json.toLocaleDateString();
  }
  if (Array.isArray(json)) {
    return json.map(blocksToText).join(' ');
  }
  if (typeof json === 'object') {
    return Object.entries(json)
      .map(([key, value]) => {
        if (key === 'type') {
          // do not index "type"
          return null;
        }
        return blocksToText(value);
      })
      .filter((x) => !!x) // remove nulls
      .join(' ');
  }
  return '';
}

export function pageComponentToText(sections?: PageComponent[]) {
  return (
    sections
      ?.map((section) => {
        switch (section.__component) {
          case 'page-components.rich-text':
            // console.log('sections', section.content, blocksToText(section.content));
            return blocksToText(section.content);
          case 'page-components.hero-section':
            return section.title + ' ' + section.tagline + ' ';
          case 'page-components.page-title':
            return section.title;
          case 'page-components.html':
            return htmlToText(section.content);
          // case 'page-components.contact-form':
          // case 'page-components.gallery':
          // case 'page-components.embed-youtube':
          // case 'page-components.carousel':
          // case 'page-components.feature-image':
          default:
            return '';
        }
      })
      .join('\n\n') ?? ''
  );
}

export function postToDocument(
  post: Pick<UnwrapArray<PostsResponse['data']>['attributes'], 'title' | 'abstract' | 'sections' | 'slug' | 'locale'>
) {
  const text = post.title + '\n\n' + post.abstract + '\n\n' + pageComponentToText(post.sections);
  return new Document({
    pageContent: text,
    metadata: {
      type: 'post',
      title: post.title,
      slug: post.slug,
      locale: post.locale,
    },
  });
}

export function pageToDocument(
  page: Pick<UnwrapArray<PagesResponse['data']>['attributes'], 'title' | 'sections' | 'slug' | 'locale'>
) {
  const text = page.title + '\n\n' + pageComponentToText(page.sections);
  return new Document({
    pageContent: text,
    metadata: {
      type: 'page',
      title: page.title,
      slug: page.slug,
      locale: page.locale,
    },
  });
}
