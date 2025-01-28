import { Document } from '@langchain/core/documents';
import type { BlocksContent } from '@strapi/blocks-react-renderer';
import { htmlToText } from 'html-to-text';
import type { PostsResponse } from '@/strapi/posts';
import type { UnwrapArray } from '@/types/helpers';
import type { PageComponent } from './components';
import type { PagesResponse } from './pages';

function rootNodeToText(node: UnwrapArray<BlocksContent>): string | null {
  switch (node.type) {
    case 'heading':
      return `${'#'.repeat(node.level)} ${node.children
        .map((x) => {
          switch (x.type) {
            case 'text':
              return x.text;
            case 'link':
              return `[${x.children.map((x) => x.text).join(' ')}](${x.url})`;
          }
        })
        .join(' ')}`;
    case 'paragraph':
    case 'code':
    case 'quote':
      return `${node.children
        .map((x) => {
          switch (x.type) {
            case 'text':
              return x.text;
            case 'link':
              return `[${x.children.map((x) => x.text).join(' ')}](${x.url})`;
          }
        })
        .join(' ')}  `;
    case 'list':
      return node.children
        .map((x, index) => {
          const prefix = node.format === 'ordered' ? `${index + 1}.` : '-';
          switch (x.type) {
            case 'list-item':
              return `${prefix} ${x.children
                .map((x) => {
                  switch (x.type) {
                    case 'text':
                      return x.text;
                    case 'link':
                      return `[${x.children.map((x) => x.text).join(' ')}](${x.url})`;
                  }
                })
                .join('')}`;
            case 'list':
              return rootNodeToText(x);
          }
        })
        .join('\n');
    case 'image':
    default:
      return null;
  }
}

function blocksToText(content: BlocksContent): string {
  if (!content || !content.length) {
    return '';
  }
  const results = [] as (string | null)[];
  for (const block of content) {
    // console.log({ text: rootNodeToText(block) });
    results.push(rootNodeToText(block));
  }
  return results
    .filter((x) => !!x) // remove nulls
    .join('\n');
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
            return `${section.title}: ${section.tagline}`;
          case 'page-components.page-title':
            return `# ${section.title}`;
          case 'page-components.html':
            return htmlToText(section.content);
          // case 'page-components.contact-form':
          // case 'page-components.gallery':
          // case 'page-components.embed-youtube':
          // case 'page-components.carousel':
          // case 'page-components.feature-image':
          default:
            return null;
        }
      })
      .filter((x) => !!x) // remove nulls
      .join('\n') ?? ''
  );
}

export function postToDocument(
  post: Pick<UnwrapArray<PostsResponse['data']>, 'title' | 'abstract' | 'sections' | 'slug' | 'locale'>
) {
  const text = `# ${post.title}\n${post.abstract}\n${pageComponentToText(post.sections)}`;
  // console.log(text);
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
  page: Pick<UnwrapArray<PagesResponse['data']>, 'title' | 'sections' | 'slug' | 'locale'>
) {
  const text = `# ${page.title}\n${pageComponentToText(page.sections)}`;
  // console.log(text);
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
