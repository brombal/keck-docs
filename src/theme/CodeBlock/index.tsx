import BrowserOnly from "@docusaurus/BrowserOnly";
import { ThemeClassNames, usePrismTheme, useThemeConfig } from "@docusaurus/theme-common";
import { getPrismCssVariables, parseLanguage } from "@docusaurus/theme-common/internal";
import clsx from "clsx";
import React, { useState } from "react";

import { CodeBlockResult } from "./CodeBlockResult/CodeBlockResult";
import CodeBlockString from "./Content/CodeBlockString";
import styles from "./styles.module.css";

interface CodeBlockProps {
  children: string;
  className?: string;
  metastring?: string;
  language?: string;
  title?: string;
  live?: boolean;
}

export default function CodeBlock(props: CodeBlockProps) {
  const {
    children,
    metastring,
    language: languageProp,
    title,
    live = false,
    className = "",
  } = props;

  const {
    prism: { defaultLanguage, magicComments },
  } = useThemeConfig();

  const [code, setCode] = useState(children);

  const language = (languageProp ?? parseLanguage(className) ?? defaultLanguage).toLowerCase();

  const prismTheme = usePrismTheme();
  const prismCssVariables = getPrismCssVariables(prismTheme);

  return (
    <div
      style={prismCssVariables}
      className={clsx(
        className,
        !className.includes(`language-${language}`) && `language-${language}`,
        styles.codeBlock,
        ThemeClassNames.common.codeBlock,
      )}
    >
      {title && <div className={styles.codeBlockTitle}>{title}</div>}
      <div style={{ display: "flex", minHeight: "200px", alignItems: "stretch" }}>
        <CodeBlockString
          code={code}
          language={language}
          onCodeChange={live && setCode}
          className={styles.codeBlockString}
        />
        {live && (
          <BrowserOnly>
            {() => (
              <div className={styles.codeBlockResult}>
                <div className={styles.codeBlockTitle}>Result</div>
                <CodeBlockResult code={code} />
              </div>
            )}
          </BrowserOnly>
        )}
      </div>
    </div>
  );
}
