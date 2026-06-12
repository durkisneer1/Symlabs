import AppLogoIcon from '@/components/app-logo-icon';
import { BrandWordmark } from '@/components/brand-images';

export default function AppLogo() {
  return (
    <>
      <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden">
        <AppLogoIcon className="size-8 object-contain" />
      </div>
      <div className="ml-1 grid min-w-0 flex-1">
        <span className="block min-w-0 truncate">
          <BrandWordmark className="h-5 w-auto max-w-28" />
        </span>
      </div>
    </>
  );
}
