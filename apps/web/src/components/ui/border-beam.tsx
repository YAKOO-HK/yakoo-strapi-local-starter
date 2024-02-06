// reference: https://magicui.design/components/border-beam
function BorderBeam({
  size = 250,
  duration = 12,
  delay = -9,
  borderWidth = 2,
  anchor = 90,
  colorFrom = 'hsl(var(--primary))',
  colorTo = 'hsl(var(--secondary))',
}: {
  size?: number;
  duration?: number;
  delay?: number;
  from?: string;
  to?: string;
  anchor?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}) {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': duration,
          '--delay': `${delay}s`,
          '--border-width': borderWidth,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--anchor': anchor,
        } as React.CSSProperties
      }
      className="after:animate-border-beam absolute inset-[0] rounded-[inherit] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [border:calc(var(--border-width)*1px)_solid_transparent] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]"
    />
  );
}

export { BorderBeam };
