import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";

import { Lethargy } from "lethargy-ts";

const SLIDE_THROTTLE_MS = 500;
const SWIPE_MIN_THRESHOLD_MS = 50;
const SWIPE_MAX_THRESHOLD_MS = 300;

const lethargy = new Lethargy({
  delay: 50,
  sensitivity: 40,
});

function Section({
  index,
  total,
  activeInd,
  yOffset,
}: {
  index: number;
  total: number;
  activeInd: number;
  yOffset: number;
}) {
  let top = 0 + "px";
  if (index < activeInd) {
    top = (activeInd - index) * -100 + 0 + "vh";
  } else if (index > activeInd) {
    top = (index - activeInd) * 100 - 0 + "vh";
  }

  return (
    <section
      style={{
        background: index % 2 === 0 ? "blue" : "red",
        zIndex: total - index,
        top,
        marginTop: yOffset,
      }}
      className={yOffset === 0 ? 'animated' : ''}
    >
      <h2>{`#00${index}`}</h2>
    </section>
  );
}

export default function App() {
  const pointerStartData = useRef<
    undefined | { timestamp: number; y: number }
  >();
  const activeIndRef = useRef(0);
  const throttledRef = useRef(false);
  const yOffsetRef = useRef(0);
  const [activeInd, setActiveInd] = useState(activeIndRef.current);
  const [yOffset, setYOffset] = useState(0);

  const goNext = useCallback(() => {
    if (activeIndRef.current === 5) return;
    if (throttledRef.current) {
      return;
    }

    throttledRef.current = true;
    activeIndRef.current += 1;
    setActiveInd(activeIndRef.current);
    setTimeout(() => (throttledRef.current = false), SLIDE_THROTTLE_MS);
  }, [setActiveInd]);

  const goPrevious = useCallback(() => {
    if (activeIndRef.current === 0) return;
    if (throttledRef.current) {
      return;
    }

    throttledRef.current = true;
    activeIndRef.current -= 1;
    setActiveInd(activeIndRef.current);
    setTimeout(() => (throttledRef.current = false), SLIDE_THROTTLE_MS);
  }, [setActiveInd]);

  const wheelCb = useCallback(
    (event: WheelEvent) => {
      const isIntentional = lethargy.check(event);
      if (isIntentional) {
        if (event.deltaY < 0 && activeIndRef.current > 0) {
          goPrevious();
        } else if (event.deltaY > 0 && activeIndRef.current < 5) {
          goNext();
        }
      }
    },
    [goNext, goPrevious],
  );

  const pointerDownCb = useCallback((event: PointerEvent) => {
    pointerStartData.current = {
      timestamp: Date.now(),
      y: event.clientY,
    };
  }, []);

  const pointerCancelCb = useCallback(() => {
    setYOffset(0);
    yOffsetRef.current = 0;
    pointerStartData.current = undefined;
  }, [setYOffset]);

  const pointerUpCb = useCallback(
    (event: PointerEvent) => {
      setYOffset(0);

      if (!pointerStartData.current) return;
      const currentTs = Date.now();
      const isSwipe = currentTs - pointerStartData.current?.timestamp <
      SWIPE_MAX_THRESHOLD_MS && currentTs - pointerStartData.current?.timestamp >
      SWIPE_MIN_THRESHOLD_MS;
      const isDragged = Math.abs(yOffsetRef.current) >= (document.documentElement.clientHeight / 2)
      if (isSwipe || isDragged) {
        if (event.y < pointerStartData.current.y) {
          goNext();
        } else {
          goPrevious();
        }
      }

      yOffsetRef.current = 0;
      pointerStartData.current = undefined;
    },
    [goNext, goPrevious, setYOffset],
  );

  const pointerMoveCb = useCallback(
    (event: PointerEvent) => {
      if (!pointerStartData.current) return;

      setYOffset(event.clientY - pointerStartData.current.y);
      yOffsetRef.current = event.clientY - pointerStartData.current.y;
    },
    [setYOffset],
  );

  useEffect(() => {
    addEventListener("wheel", wheelCb);
    addEventListener("pointerdown", pointerDownCb);
    addEventListener("pointerup", pointerUpCb);
    addEventListener("pointermove", pointerMoveCb);
    addEventListener("pointercancel", pointerCancelCb);
    return () => {
      removeEventListener("wheel", wheelCb);
      removeEventListener("pointerdown", pointerDownCb);
      removeEventListener("pointerup", pointerUpCb);
      removeEventListener("pointermove", pointerMoveCb);
      removeEventListener("pointercancel", pointerCancelCb);
    };
  }, [wheelCb, pointerDownCb, pointerUpCb]);

  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((ind) => {
        return (
          <Section
            index={ind}
            total={6}
            key={ind}
            activeInd={activeInd}
            yOffset={yOffset}
          />
        );
      })}
    </>
  );
}
