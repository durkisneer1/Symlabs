import { Link } from '@inertiajs/react';
import { BrandWordmark } from '@/components/brand-images';
import { cn } from '@/lib/utils';

export function SiteFooter({
  className,
  innerClassName,
}: {
  className?: string;
  innerClassName?: string;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'w-full border-t border-border px-6 py-8 lg:px-8',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto grid w-full max-w-6xl gap-8 text-sm text-muted-foreground md:grid-cols-[1fr_1.25fr]',
          innerClassName,
        )}
      >
        <div className="space-y-3">
          <Link href="/" aria-label="Symlabs home" className="inline-flex">
            <BrandWordmark className="h-7 w-auto max-w-36" />
          </Link>
          <p className="max-w-md">
            Free programming courseware for self-study and classroom
            accountability.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
            Notes
          </h2>
          <p>
            Symlabs is independently built. Institutional names are used only as
            creator background and do not imply endorsement.
          </p>
          <p>
            Source code, course content, media, and external resources remain
            subject to their respective licenses and attribution requirements.
          </p>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-muted-foreground">
        &copy; {currentYear} Symlabs. All rights reserved.
      </p>
    </footer>
  );
}
