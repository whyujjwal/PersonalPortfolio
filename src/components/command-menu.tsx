"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { posts, projects } from "@/lib/content";

type Action = {
  id: string;
  label: string;
  group: "navigation" | "actions" | "writing" | "proof";
  icon: string;
  meta?: string;
  keywords?: string;
  external?: boolean;
  run: () => void;
};

const groupOrder: Action["group"][] = ["navigation", "actions", "writing", "proof"];

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copyMeta, setCopyMeta] = useState("copy email");

  const actions = useMemo<Action[]>(() => {
    const core: Action[] = [
      {
        id: "go-proof",
        label: "Navigate to Proof",
        group: "navigation",
        icon: "PR",
        meta: "section",
        keywords: "projects built proof",
        run: () => router.push("/#proof"),
      },
      {
        id: "go-writing",
        label: "Search Writing...",
        group: "navigation",
        icon: "WR",
        meta: "section",
        keywords: "blog thoughts writing",
        run: () => router.push("/writing"),
      },
      {
        id: "go-building",
        label: "Go to Building",
        group: "navigation",
        icon: "BL",
        meta: "section",
        keywords: "current build now",
        run: () => router.push("/#building"),
      },
      {
        id: "go-about",
        label: "Go to About",
        group: "navigation",
        icon: "AB",
        meta: "page",
        keywords: "bio stack",
        run: () => router.push("/about"),
      },
      {
        id: "go-talk",
        label: "Go to Let's Talk",
        group: "navigation",
        icon: "LT",
        meta: "section",
        keywords: "contact hire",
        run: () => router.push("/#lets-talk"),
      },
      {
        id: "copy-email",
        label: "Copy Email",
        group: "actions",
        icon: "CP",
        meta: copyMeta,
        keywords: "mail contact",
        run: async () => {
          try {
            await navigator.clipboard.writeText("tiwari.rajujjwal@gmail.com");
            setCopyMeta("copied");
            setTimeout(() => setCopyMeta("copy email"), 1500);
          } catch {
            setCopyMeta("copy failed");
            setTimeout(() => setCopyMeta("copy email"), 1500);
          }
        },
      },
      {
        id: "open-twitter",
        label: "Jump to Twitter",
        group: "actions",
        icon: "TW",
        meta: "external",
        external: true,
        keywords: "x social",
        run: () => window.open("https://x.com/whyujjwal", "_blank", "noopener,noreferrer"),
      },
      {
        id: "open-github",
        label: "Open GitHub",
        group: "actions",
        icon: "GH",
        meta: "external",
        external: true,
        keywords: "source code repo",
        run: () => window.open("https://github.com/whyujjwal", "_blank", "noopener,noreferrer"),
      },
      {
        id: "open-linkedin",
        label: "Open LinkedIn",
        group: "actions",
        icon: "LI",
        meta: "external",
        external: true,
        keywords: "linkedin profile",
        run: () =>
          window.open(
            "https://www.linkedin.com/in/ujjwal-raj-tiwari-2019b5181/",
            "_blank",
            "noopener,noreferrer",
          ),
      },
    ];

    const postActions = posts.map<Action>((post) => ({
      id: `post-${post.slug}`,
      label: post.title,
      group: "writing",
      icon: "WR",
      meta: `${post.minutes} min`,
      keywords: `${post.tags.join(" ")} ${post.excerpt}`,
      run: () => router.push(`/writing/${post.slug}`),
    }));

    const projectActions = projects.map<Action>((project) => ({
      id: `project-${project.slug}`,
      label: project.name,
      group: "proof",
      icon: "PF",
      meta: project.metricValue,
      keywords: `${project.tags.join(" ")} ${project.summary}`,
      run: () => router.push(`/proof/${project.slug}`),
    }));

    return [...core, ...postActions, ...projectActions];
  }, [copyMeta, router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const grouped = useMemo(() => {
    const map = actions.reduce<Record<string, Action[]>>((acc, action) => {
      if (!acc[action.group]) {
        acc[action.group] = [];
      }
      acc[action.group].push(action);
      return acc;
    }, {});

    return groupOrder
      .filter((group) => map[group]?.length)
      .map((group) => ({
        group,
        items: map[group],
      }));
  }, [actions]);

  if (!open) {
    return (
      <button type="button" className="command-trigger" onClick={() => setOpen(true)}>
        cmd+k
      </button>
    );
  }

  return (
    <div className="command-overlay" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
      <Command className="command-root" onClick={(event) => event.stopPropagation()} loop>
        <div className="command-head">
          <span className="command-head-icon" aria-hidden="true">
            &gt;_
          </span>
          <Command.Input className="command-input" placeholder="Type a command or search..." />
        </div>

        <Command.List className="command-list">
          <Command.Empty className="command-empty">No results found.</Command.Empty>
          {grouped.map(({ group, items }) => (
            <Command.Group key={group} heading={group}>
              {items.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} ${item.keywords ?? ""}`}
                  className="command-item"
                  onSelect={() => {
                    item.run();
                    setOpen(false);
                  }}
                >
                  <span className="command-item-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="command-item-body">
                    <span className="command-item-label">{item.label}</span>
                    {item.meta ? <span className="command-item-meta">{item.meta}</span> : null}
                  </span>
                  {item.external ? (
                    <span className="command-item-external" aria-hidden="true">
                      ext
                    </span>
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="command-footer">
          <span>up/down navigate</span>
          <span>enter select</span>
          <span>esc close</span>
          <span className="command-version">v2.1.0</span>
        </div>
      </Command>
    </div>
  );
}
