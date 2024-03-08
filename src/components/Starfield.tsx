import KeckStarSvg from "@site/static/img/keck-star.svg";
import $, { StylixProps, useKeyframes } from "@stylix/core";
import { useObserver } from "keck/react";
import { random, throttle } from "lodash-es";
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";

function Star(props: StylixProps & { star: StarData; style: any }) {
  const { star, ...other } = props;

  const rotateAnimation = useKeyframes({
    "0%": { transform: "rotate(0deg) scale(1)" },
    "50%": { transform: "rotate(180deg) scale(1.3)" },
    "100%": { transform: "rotate(360deg) scale(1)" },
  });

  const fallAnimation = useKeyframes({
    from: { opacity: 1, transform: 'translate(0, 0)' },
    to: { opacity: 0, transform: 'translate(-50px, 100px)' },
  });

  const fadeInAnimation = useKeyframes({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  const randomValues = useRef({
    size: random(1, 3),
    rotSpeed: random(5, 15),
    rotReverse: !!Math.round(Math.random()) ? "reverse" : "",
    xOffset: random(-10, 10),
    yOffset: random(-10, 10),
  }).current;

  return (
    // outermost wrapper has "shooting star"/fade out animation
    <$.div
      absolute
      width={10}
      height={10}
      animation={`4s ${fallAnimation} linear forwards`}
      {...other}
    >
      {/* 1st inner wrapper has random x/y offset */}
      <div style={{ transform: `translate(${randomValues.xOffset}px, ${randomValues.yOffset}px)` }}>
        {/* 2nd inner wrapper has rotation animation */}
        <div
          style={{
            animation: `${randomValues.rotSpeed}s ${rotateAnimation} linear infinite ${randomValues.rotReverse}`,
          }}
        >
          {/* star svg has random scale and fade in */}
          <$
            $el={KeckStarSvg}
            width="100%"
            height="100%"
            display="block"
            transform={`scale(${randomValues.size})`}
            animation={`100ms ${fadeInAnimation} linear forwards`}
          />
        </div>
      </div>
    </$.div>
  );
}

let starCount = 0;

function SkyBackground(props: StylixProps & { onMouseMove(e: React.MouseEvent): void }) {
  return (
    <$.div relative overflow="hidden" {...props}>
      {Array(10)
        .fill(null)
        .map((_, i) => (
          <div
            style={{
              height: 18 * 0.65 ** i + "%",
              marginTop: 3 * 1.2 ** i + "px",
              background: "hsla(200, 80%, 50%, 0.08)",
            }}
          />
        ))}
    </$.div>
  );
}

export function StarField(props: StylixProps) {
  const state = useStars();

  const createStarThrottled = useMemo(
    () =>
      throttle(function (x: number, y: number) {
        const star = { x, y, id: (starCount++).toString() };
        state.stars.add(star);
        setTimeout(() => {
          state.stars.delete(star);
        }, 4000);
      }, 50),
    [],
  );

  return (
    <$.div relative {...props}>
      <SkyBackground
        absolute
        top={0}
        left={0}
        width="100%"
        height="100%"
        onMouseMove={(e) => {
          const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
          const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
          createStarThrottled(x, y);
        }}
      />
      {[...state.stars].map((star) => (
        <Star key={star.id} star={star} style={{ left: star.x, top: star.y }} />
      ))}
    </$.div>
  );
}

interface StarData {
  id: string;
  x: number;
  y: number;
}

const starsProvider = createContext({
  stars: new Set<StarData>(),
  reset() {
    this.stars = new Set();
  },
});

export const StarsProvider = starsProvider.Provider;

export function useStars() {
  return useObserver(useContext(starsProvider));
}
