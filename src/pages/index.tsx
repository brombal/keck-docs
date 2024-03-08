import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { StarField, useStars } from "@site/src/components/Starfield";
import CodeBlock from "@site/src/theme/CodeBlock";
import KeckSvg from "@site/static/img/keck-graphic.svg";
import $ from "@stylix/core";
import Layout from "@theme/Layout";
import React from "react";

const codeExample = `
import { useObserver } from 'keck/react';

function StarField() {
  // highlight-next-line
  // Create an observable state object:
  const state = useObserver({ 
    stars: [],

    // highlight-next-line
    // it can even have methods!
    reset() {
      this.stars.length = 0;
    }
  });
  
  // highlight-next-line
  // Treat your state object like a normal JS object...

  return (
    <>
      <Sky 
        onMouseMove={(e) => {
          // highlight-next-line
          // ...modify it:
          state.stars.unshift({ x: e.clientX, y: e.clientY });
        }} 
      >
        // highlight-next-line
        {/* ...read from it: */}
        {state.stars.map((star, i) => (
          <Star key={i} x={star.x} y={star.y} />
        )}
      </Sky>

      // highlight-next-line
      {/* ...call methods on it: */}
      <button onClick={() => state.reset()}>
        Clear stars
      </button>
    </>
  )
}
`.trim();

export default function Home() {
  const { siteConfig, ...ctx } = useDocusaurusContext();

  const $stars = useStars();

  return (
    <Layout title={`${siteConfig.tagline}`} wrapperClassName="homepage">
      <$.div relative z-index={0}>
        <StarField height={400} />

        <$.div flexbox m="0 auto 0" max-width={1100} gap={50} relative z-index={1}>
          <$.div flex="0 0 500px">
            <$ $el={KeckSvg} block width={450} mt={-200} pointer-events="none" />

            <$.div mt={100}>
              <p>
                Keck is a <strong>state observation</strong> library for React and vanilla
                JavaScript.
              </p>
              <p>
                Its minimal but powerful API allows you to react to changes in your data structures,
                while still treating them like regular JavaScript objects.
              </p>
              <p>
                It supports nested objects, arrays, Maps, Sets, and user-defined classes. It's
                extensible to support custom data structures and plugins, allowing for features like
                rewindable state and debugging.
              </p>
              <$.div mt={40}>
                <$.a
                  className="button button--primary"
                  $css={{ "--ifm-button-size-multiplier": "1.4" }}
                >
                  Get Started
                </$.a>
              </$.div>
            </$.div>
          </$.div>
          <$.div flex="1 1 auto" overflow="hidden" mt={-80}>
            <$.div text-align="right" mb={50}>
              <button className="button button--primary" onClick={() => $stars.reset()}>
                Clear
              </button>
            </$.div>

            <CodeBlock metastring="foo bar" language="tsx">
              {codeExample}
            </CodeBlock>
          </$.div>
        </$.div>
      </$.div>
    </Layout>
  );
}
