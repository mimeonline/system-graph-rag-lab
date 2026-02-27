"use client";

import Link from "next/link";
import { trackLiteEvent } from "@/lib/analytics-lite";

type TrackedLinkProps = {
  href: string;
  label: string;
  eventName: string;
  payload?: Record<string, string | number | boolean>;
  className?: string;
  external?: boolean;
};

export function TrackedLink({
  href,
  label,
  eventName,
  payload,
  className,
  external = false,
}: TrackedLinkProps): React.JSX.Element {
  const handleClick = () => {
    trackLiteEvent(eventName, payload);
  };

  if (external) {
    return (
      <a
        href={href}
        className={className}
        onClick={handleClick}
        target="_blank"
        rel="noreferrer noopener"
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {label}
    </Link>
  );
}
