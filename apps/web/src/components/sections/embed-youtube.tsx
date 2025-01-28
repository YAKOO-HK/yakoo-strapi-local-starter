import { cn } from '@/lib/utils';
import { ComponentEmbedYoutube, DynamicZoneSectionProps } from '@/strapi/components';

export function EmbedYoutubeSection({
  as,
  layout,
  url,
}: Omit<ComponentEmbedYoutube, 'id' | '__component'> & DynamicZoneSectionProps) {
  const Component = as;
  return (
    <Component
      className={cn({
        container: layout === 'container',
        'mx-auto max-w-prose': layout === 'prose',
      })}
    >
      <div className="aspect-video">
        <iframe
          className="size-full"
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
