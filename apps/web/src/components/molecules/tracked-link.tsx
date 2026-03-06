"use client";

import type { AppLocale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { trackLiteEvent } from "@/lib/analytics-lite";

type TrackedLinkProps = {
  href: string;
  label: string;
  eventName: string;
  payload?: Record<string, string | number | boolean>;
  className?: string;
  external?: boolean;
  locale?: AppLocale;
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export function TrackedLink({
  href,
  label,
  eventName,
  payload,
  className,
  external = false,
  locale,
  onClick,
  icon,
  children,
}: TrackedLinkProps): React.JSX.Element {
  const handleClick = () => {
    trackLiteEvent(eventName, payload);
    onClick?.();
  };

  if (external || href.startsWith("#")) {
    return (
      <a
        href={href}
        className={className}
        onClick={handleClick}
        target="_blank"
        rel="noreferrer noopener"
      >
        {children ?? (
          <>
            {icon ? <span className="mr-1.5 inline-flex items-center">{icon}</span> : null}
            {label}
          </>
        )}
      </a>
    );
  }

  return (
    <Link href={href} locale={locale} className={className} onClick={handleClick}>
      {children ?? (
        <>
          {icon ? <span className="mr-1.5 inline-flex items-center">{icon}</span> : null}
          {label}
        </>
      )}
    </Link>
  );
}
