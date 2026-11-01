import { cn } from '@/lib/utils';
import type { Course } from '@/data';

// Рисованные SVG-иконки курсов (без эмодзи и внешних библиотек иконок для логотипов курсов)
export function CourseIcon({
  icon,
  accent,
  className,
}: {
  icon: Course['icon'];
  accent: string;
  className?: string;
}) {
  const common = 'shrink-0';
  const cls = cn(common, className);
  switch (icon) {
    case 'flask':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <path
            d="M19 13h10M21 13v8.2l-6.1 10.3A3.4 3.4 0 0 0 17.9 37h12.2a3.4 3.4 0 0 0 3-5.5L27 21.2V13"
            fill="none"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M18.5 27.5h11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g fill="#fff">
            <rect x="12" y="20" width="5" height="5" rx="1" />
            <rect x="18.5" y="20" width="5" height="5" rx="1" />
            <rect x="25" y="20" width="5" height="5" rx="1" />
            <rect x="18.5" y="13.5" width="5" height="5" rx="1" />
            <rect x="25" y="13.5" width="5" height="5" rx="1" />
          </g>
          <path
            d="M9 28.5c.6 4.5 3.2 8 8.4 8h10.2c5.4 0 9-3.4 10.4-8.5l-2.6.2c-1.9 0-3.1-.9-3.7-2.3-.9.4-2.3.4-3.2.1H9.5l-.5 2.5Z"
            fill="#fff"
            opacity="0.92"
          />
        </svg>
      );
    case 'helm':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round">
            <circle cx="24" cy="25" r="9.5" />
            <circle cx="24" cy="25" r="2.4" fill="#fff" stroke="none" />
            <path d="M24 11v4.5M24 34.5v4.5M10.5 25H15M33 25h4.5M14.5 15.5l3.2 3.2M30.3 31.3l3.2 3.2M33.5 15.5l-3.2 3.2M17.7 31.3l-3.2 3.2" />
          </g>
        </svg>
      );
    case 'bot':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="13" y="17" width="22" height="16" rx="4" />
            <path d="M24 17v-4M18 10l3 3M30 10l-3 3" />
            <circle cx="19.5" cy="24" r="1.4" fill="#fff" stroke="none" />
            <circle cx="28.5" cy="24" r="1.4" fill="#fff" stroke="none" />
            <path d="M20 29h8" />
            <path d="M13 23h-3v6h3M35 23h3v6h-3" />
          </g>
        </svg>
      );
	case 'python':
		return (
			<svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
				<rect x="4" y="4" width="40" height="40" rx="10" fill="#3776ab" />
				<path d="M23.5 12c-4 0-6.5 1.7-6.5 5v3h10v1.5h-13c-3 0-5 2.2-5 6s2 6.5 5 6.5h2.5V30c0-3.3 2.5-5 6-5h6c3 0 5-2 5-5v-3c0-3-2.3-5-6-5h-4zm-2.5 2.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z" fill="#ffd43b"/>
				<path d="M24.5 36c4 0 6.5-1.7 6.5-5v-3H21v-1.5h13c3 0 5-2.2 5-6s-2-6.5-5-6.5h-2.5V18c0 3.3-2.5 5-6 5h-6c-3 0-5 2-5 5v3c0 3 2.3 5 6 5h4zm2.5-2.5a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z" fill="#3776ab"/>
			</svg>
  );
      case 'git':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="14" r="3" />
            <circle cx="16" cy="34" r="3" />
            <circle cx="34" cy="20" r="3" />
            <path d="M16 17v14" />
            <path d="M19 20c0 6 12 6 12-3" />
          </g>
        </svg>
      );
        case 'linux':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g fill="#1a1a1a">
            <ellipse cx="24" cy="30" rx="11" ry="9" />
            <ellipse cx="24" cy="18" rx="7" ry="7" />
            <circle cx="21" cy="17" r="1.4" fill="#fff" />
            <circle cx="27" cy="17" r="1.4" fill="#fff" />
            <circle cx="21.4" cy="17.3" r="0.6" fill="#1a1a1a" />
            <circle cx="27.4" cy="17.3" r="0.6" fill="#1a1a1a" />
            <ellipse cx="24" cy="20.5" rx="1.6" ry="1.2" fill="#f5a623" />
            <path d="M17 37 L14 42 L19 40 Z" />
            <path d="M31 37 L34 42 L29 40 Z" />
          </g>
        </svg>
      );
          case 'network':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round">
            <circle cx="24" cy="12" r="3.5" fill="#fff" />
            <circle cx="12" cy="34" r="3.5" fill="#fff" />
            <circle cx="36" cy="34" r="3.5" fill="#fff" />
            <circle cx="24" cy="24" r="2.5" fill="#fff" />
            <path d="M24 15.5v5.5M22 26l-8 6M26 26l8 6" />
          </g>
        </svg>
      );
          case 'cicd':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="12" r="3" />
            <circle cx="14" cy="36" r="3" />
            <circle cx="34" cy="24" r="3" />
            <path d="M14 15v18" />
            <path d="M17 12h10a4 4 0 0 1 4 4v5" />
            <path d="M17 36h10a4 4 0 0 0 4-4v-5" />
            <path d="M31 19l3 2-3 2M31 29l3-2-3-2" />
          </g>
        </svg>
      );
          case 'sql':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinejoin="round">
            <ellipse cx="24" cy="14" rx="9" ry="3.5" />
            <path d="M15 14v20c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5V14" />
            <path d="M15 24c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5" />
          </g>
        </svg>
      );
          case 'design':
      return (
        <svg viewBox="0 0 48 48" className={cls} aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="10" fill={accent} />
          <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinejoin="round">
            <rect x="11" y="11" width="12" height="12" rx="2" />
            <rect x="25" y="11" width="12" height="12" rx="2" />
            <rect x="11" y="25" width="12" height="12" rx="2" />
            <rect x="25" y="25" width="12" height="12" rx="2" />
            <path d="M23 17h2M23 31h2M17 23v2M31 23v2" />
          </g>
        </svg>
      );  
  }
}
