import { StylixProvider } from "@stylix/core";
import { RenderServerStyles } from "@stylix/core";
import tinyProps from "@stylix/tinyprops";
import React from "react";

export default function Root({ children }) {
  return (
    <StylixProvider devMode plugins={[tinyProps]}>
      {children}
      <RenderServerStyles />
    </StylixProvider>
  );
}
