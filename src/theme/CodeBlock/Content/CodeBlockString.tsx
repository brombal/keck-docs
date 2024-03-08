import { usePrismTheme, useThemeConfig } from "@docusaurus/theme-common";
import { parseLines, useCodeWordWrap } from "@docusaurus/theme-common/internal";
import $ from "@stylix/core";
import clsx from "clsx";
import { Highlight } from "prism-react-renderer";
import React, { useState } from "react";

import CopyButton from "../CopyButton";
import Line from "../Line";

interface CodeBlockStringProps {
  code: string;
  onCodeChange?: (newCode: string) => void;
  showLineNumbers?: boolean;
  language?: string;
  className?: string;
}

export default function CodeBlockString(props: CodeBlockStringProps) {
  const { code, onCodeChange = null, showLineNumbers = false, language, className } = props;

  const {
    prism: { magicComments },
  } = useThemeConfig();

  const prismTheme = usePrismTheme();

  const wordWrap = useCodeWordWrap();

  // get the whitespace characters from end of 'code'
  const trailingWhitespace = code?.match(/\s*$/)?.[0] || "";

  let { lineClassNames, code: parsedCode } = parseLines(code, {
    metastring: undefined,
    language,
    magicComments,
  });

  // Add the whitespace back to parsedCode
  parsedCode = parsedCode.trimEnd() + trailingWhitespace;

  return (
    <$.div
      className={className}
      position="relative"
      z-index={0}
      $css={{
        "&:hover button": {
          opacity: 0.4,
        },
      }}
    >
      <$.div position="relative" overflow="auto" zIndex={0} height="100%">
        <Highlight theme={prismTheme} code={parsedCode} language={language ?? "text"}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <$.pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              ref={wordWrap.codeBlockRef}
              className={clsx(className, "thin-scrollbar")}
              style={style}
              overflow="auto"
              margin={0}
              padding={0}
              float="left"
              position="relative"
              min-width="100%"
              height="100%"
              $css={{
                "--ifm-pre-background": "var(--prism-background-color)",
              }}
            >
              <$.code
                // todo print styles?
                font="inherit"
                display="block"
                padding="var(--ifm-pre-padding)"
                zIndex={1}
                position="relative"
                pointer-events="none"
                border-radius={0}
                height="100%"
                $css={[
                  showLineNumbers && {
                    display: "table",
                    padding: "var(--ifm-pre-padding) 0",
                  },
                ]}
              >
                {tokens.map((line, i) => (
                  <Line
                    key={i}
                    line={line}
                    getLineProps={getLineProps}
                    getTokenProps={getTokenProps}
                    classNames={lineClassNames[i]}
                    showLineNumbers={showLineNumbers}
                  />
                ))}
              </$.code>

              {onCodeChange && (
                <$.textarea
                  value={parsedCode}
                  onChange={(e) => onCodeChange(e.target.value)}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  autoSave="off"
                  font="inherit"
                  position="absolute"
                  z-index={0}
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  border={0}
                  background="transparent"
                  padding="var(--ifm-pre-padding)"
                  margin={0}
                  resize="none"
                  $css={{
                    "-webkit-text-fill-color": "#0000",
                  }}
                />
              )}
            </$.pre>
          )}
        </Highlight>
      </$.div>

      {/* button group */}
      <$.div
        //   /* rtl:ignore */
        display="flex"
        column-gap="0.2rem"
        position="absolute"
        right="calc(var(--ifm-pre-padding) / 2)"
        top="calc(var(--ifm-pre-padding) / 2)"
        $css={{
          button: {
            display: "flex",
            alignItems: "center",
            background: "var(--prism-background-color)",
            color: "var(--prism-color)",
            border: "1px solid var(--ifm-color-emphasis-300)",
            borderRadius: "var(--ifm-global-radius)",
            padding: "0.4rem",
            lineHeight: 0,
            transition: "opacity var(--ifm-transition-fast) ease-in-out",
            opacity: 0,
          },
          "button:focus-visible, button:hover": {
            opacity: 1,
          },
        }}
      >
        <CopyButton code={parsedCode} />
      </$.div>
    </$.div>
  );
}
