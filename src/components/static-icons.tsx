type IconProps = {
  size?: number;
  className?: string;
};

export function ArrowLeftIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ChartIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 3 5-7" />
    </svg>
  );
}

export function CheckIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.8 7.4-5.6 5.9a1.1 1.1 0 0 1-1.6 0l-2.4-2.5a1.1 1.1 0 0 1 1.6-1.5l1.6 1.7 4.8-5a1.1 1.1 0 1 1 1.6 1.4Z" />
    </svg>
  );
}

export function ClockIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7v5l3 2" />
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}

export function LightningIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.3 2 4 13.1h6.4L9 22l10-12.2h-6.1L13.3 2Z" />
    </svg>
  );
}

export function PlayCircleIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.7 6.7 5.5 3.3-5.5 3.3V8.7Z" />
    </svg>
  );
}

export function ShieldIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2 5 5v5.5c0 4.8 3 9.2 7 10.9 4-1.7 7-6.1 7-10.9V5l-7-3Zm3.8 7.4-4.7 5a1 1 0 0 1-1.5 0l-2-2.1a1 1 0 1 1 1.5-1.4l1.3 1.4 3.9-4.2a1 1 0 1 1 1.5 1.3Z" />
    </svg>
  );
}

export function SparkleIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2.5 14.5 9l7 3-7 3L12 21.5 9.5 15l-7-3 7-3L12 2.5Z" />
    </svg>
  );
}

export function TrendIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 16 6-6 4 4 6-8" />
      <path d="M15 6h5v5" />
    </svg>
  );
}
