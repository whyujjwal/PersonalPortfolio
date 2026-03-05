"use client";

import { useState, type ReactNode, Children, isValidElement } from "react";

export function Tab({ children }: { label: string; children: ReactNode }) {
  return <div>{children}</div>;
}

export function Tabs({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const tabs = Children.toArray(children).filter(isValidElement) as React.ReactElement<{ label: string }>[];

  return (
    <div className="mdx-tabs">
      <div className="mdx-tabs-bar" role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            className={`mdx-tab-btn${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="mdx-tab-panel" role="tabpanel">
        {tabs[active]}
      </div>
    </div>
  );
}
