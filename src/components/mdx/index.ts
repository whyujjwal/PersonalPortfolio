import type { MDXComponents } from "mdx/types";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { MdxImage } from "./mdx-image";
import { LinkCard } from "./link-card";
import { Steps, Step } from "./steps";
import { Tabs, Tab } from "./tabs";
import { FileTree } from "./file-tree";
import { Terminal } from "./terminal";
import { Comparison, ComparisonSide } from "./comparison";
import { StatHighlight, StatRow } from "./stat-highlight";

export const mdxComponents: MDXComponents = {
  pre: CodeBlock,
  img: MdxImage as MDXComponents["img"],
  Callout,
  LinkCard,
  Steps,
  Step,
  Tabs,
  Tab,
  FileTree,
  Terminal,
  Comparison,
  ComparisonSide,
  StatHighlight,
  StatRow,
};
