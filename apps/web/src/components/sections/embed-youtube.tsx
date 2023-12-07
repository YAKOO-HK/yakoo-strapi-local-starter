import { cn } from '@/lib/utils';
import { ComponentEmbedYoutube } from '@/strapi/components';

export function EmbedYoutubeSection({
  as,
  layout,
  url,
}: Omit<ComponentEmbedYoutube, 'id' | '__component'> & { as: 'section' | 'div' }) {
  const Component = as;
  return (
    <Component
      className={cn({
        container: layout === 'container',
        'prose mx-auto': layout === 'prose',
      })}
    >
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          loading="lazy"
          width={1920}
          height={1080}
          src={url}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </Component>
  );
}
