import $ from "@stylix/core";
import k from "keck";
import { useObserver } from "keck/react";
import { isValidElement, useEffect, useRef, useState } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { JsxEmit, ModuleKind, transpile } from "typescript";

import { LogOutput } from "../LogOutput/LogOutput";

interface CodeBlockResultProps {
  code: string;
  className?: string;
}

export function CodeBlockResult(props: CodeBlockResultProps) {
  const { code, className } = props;

  const [error, setError] = useState<Error | null>(null);

  const logOutput = useObserver([]);

  useEffect(() => {
    logOutput.length = 0;
    try {
      Object.assign(window as any, {
        React,
        useObserver,
      });

      const compiled = transpile(code.replace(/\bimport.*?(;|\n|$)/g, ""), {
        module: ModuleKind.ESNext,
        jsx: JsxEmit.React,
      });
      let result: any;
      {
        const console = {
          log: (...args) => {
            logOutput.push({ type: "info", args });
          },
          warn: (...args) => {
            logOutput.push({ type: "warning", args });
          },
          error: (...args) => {
            logOutput.push({ type: "error", args });
          },
        };
        result = eval(compiled);
      }

      const evalResult = isValidElement(result) ? result : undefined;

      setError(null);

      if (!rootRef.current) rootRef.current = createRoot(renderRef.current);

      // @ts-ignore
      rootRef.current!.render(
        <ErrorBoundary
          key={Math.random().toString()}
          fallbackRender={(props) => (
            <LogOutput logOutput={[{ type: "error", args: [props.error] }]} />
          )}
        >
          {evalResult}
          <div style={{ marginTop: evalResult ? 20 : 0 }}>
            {!!logOutput.length && <LogOutput logOutput={k.unwrap(logOutput)} />}
          </div>
        </ErrorBoundary>,
      );
    } catch (e) {
      // @ts-ignore
      rootRef.current?.render(null);
      setError(e);
    }
  }, [code]);

  const renderRef = useRef();
  const rootRef = useRef();

  return (
    <$.div p="var(--ifm-pre-padding)">
      <div ref={renderRef} />
      {error ? <LogOutput logOutput={[{ type: "error", args: [error] }]} /> : null}
    </$.div>
  );
}
