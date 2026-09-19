import { Link, type LinkProps } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  children: ReactNode;
  activeClassName?: string;
};

/** Internal paths route through TanStack Link (with hash support); everything else is a plain anchor. */
export function SmartLink({ href, children, activeClassName, ...rest }: Props) {
  const internal = href.startsWith("/") && !href.startsWith("//");
  if (!internal) {
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  const [path, hash] = href.split("#");
  return (
    <Link
      to={path as LinkProps["to"]}
      hash={hash || undefined}
      activeProps={activeClassName ? { className: `${rest.className ?? ""} ${activeClassName}`.trim() } : undefined}
      activeOptions={{ exact: path === "/" }}
      {...rest}
    >
      {children}
    </Link>
  );
}
