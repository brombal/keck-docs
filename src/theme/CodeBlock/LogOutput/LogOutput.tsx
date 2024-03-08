import { faExclamationCircle, faInfoCircle } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import styles from "./styles.module.css";

export interface LogEntry {
  type: "info" | "error" | "warning";
  args: any[];
}

function formatArgs(args?: any[]) {
  return args
    ?.map((arg) => {
      if (arg instanceof Error) return arg.name + ": " + arg.message;
      if (typeof arg === "object") return JSON.stringify(arg, null, 2);
      return arg;
    })
    .join("\n");
}

export function LogOutput(props: { logOutput: LogEntry[] }) {
  return (
    <div className={styles.LogOutput}>
      <div className={styles.LogOutputTitle}>LOG OUTPUT</div>

      <div className={styles.LogOutputEntries}>
        {props.logOutput?.map((log, i) => (
          <div
            key={i}
            className={styles.LogOutputEntry}
            style={{
              background: {
                info: "transparent",
                warning: "hsla(50, 80%, 50%, 0.1)",
                error: "hsla(10, 80%, 50%, 0.1)",
              }[log.type],
            }}
          >
            <FontAwesomeIcon
              icon={
                {
                  info: faInfoCircle,
                  warning: faExclamationCircle,
                  error: faExclamationCircle,
                }[log.type]
              }
              color={
                {
                  info: "hsla(200, 80%, 50%, 1)",
                  warning: "hsla(50, 80%, 50%, 1)",
                  error: "hsla(10, 80%, 50%, 1)",
                }[log.type]
              }
              className={styles.LogOutputEntryIcon}
            />
            <div className={styles.LogOutputEntryContent}>{formatArgs(log.args)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
