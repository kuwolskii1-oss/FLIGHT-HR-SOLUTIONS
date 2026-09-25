import { useRouterState } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  children: ReactNode;
  activeClassName?: string;
};

/**
 * Every internal link is a plain anchor on purpose: pages load as full documents so the
 * scroll engine mounts once per page, and the browser's cross-document view transition
 * (declared in site.css) carries the header across. External links open in a new tab.
 */
export function SmartLink({ href, children, activeClassName, className, ...rest }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const internal = href.startsWith("/") && !href.startsWith("//");
  const external = /^https?:/i.test(href);
  const path = href.split("#")[0].replace(/\/$/, "") || "/";
  const current = internal && (path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/"));
  const cls = [className, current && activeClassName ? activeClassName : ""].filter(Boolean).join(" ") || undefined;
  return (
    <a
      href={href}
      className={cls}
      aria-current={current && href.indexOf("#") === -1 ? "page" : undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
