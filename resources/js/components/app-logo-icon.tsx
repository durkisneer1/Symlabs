import type { ImgHTMLAttributes } from 'react';
import { BrandIcon } from '@/components/brand-images';

export default function AppLogoIcon(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  return <BrandIcon {...props} />;
}
