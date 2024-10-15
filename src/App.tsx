import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";

import { Lethargy } from "lethargy-ts";
import { isMouseEvent, isPointerEvent } from "./typeguard";

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
  goToSlide,
}: {
  index: number;
  total: number;
  activeInd: number;
  yOffset: number;
  goToSlide: (ind: number) => void;
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
      className={yOffset === 0 ? "animated" : ""}
    >
      <h2>{`#00${index}`}</h2>
      <div>
        <button onClick={() => goToSlide(0)}>Go to slide 1</button>
      </div>
      <div>
        <button onClick={() => goToSlide(5)}>Go to slide 6</button>
      </div>
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

  const goToSlide = useCallback(
    (ind: number) => {
      setActiveInd(ind);
      activeIndRef.current = ind;
      setYOffset(0);
      yOffsetRef.current = 0;
    },
    [setActiveInd, setYOffset],
  );

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

  const pointerDownCb = useCallback(
    (event: PointerEvent | TouchEvent | MouseEvent) => {
      let y = 0;

      if (isPointerEvent(event) || isMouseEvent(event)) {
        y = event.y;
      } else {
        y = event.touches[0].clientY;
      }

      pointerStartData.current = {
        timestamp: Date.now(),
        y,
      };

      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    [],
  );

  const pointerCancelCb = useCallback(() => {
    setYOffset(0);
    yOffsetRef.current = 0;
    pointerStartData.current = undefined;
}, [setYOffset]);

  const pointerUpCb = useCallback(
    (event: PointerEvent | TouchEvent | MouseEvent) => {
      setYOffset(0);

      let y = 0;
      if (isPointerEvent(event) || isMouseEvent(event)) {
        y = event.y;
      } else {
        y = event.touches[0].clientY;
      }

      if (!pointerStartData.current) return;
      const currentTs = Date.now();
      const isSwipe =
        currentTs - pointerStartData.current?.timestamp <
          SWIPE_MAX_THRESHOLD_MS &&
        currentTs - pointerStartData.current?.timestamp >
          SWIPE_MIN_THRESHOLD_MS;
      const isDragged =
        Math.abs(yOffsetRef.current) >=
        document.documentElement.clientHeight / 2;
      if (isSwipe || isDragged) {
        if (y < pointerStartData.current.y) {
          goNext();
        } else {
          goPrevious();
        }
      }

      yOffsetRef.current = 0;
      pointerStartData.current = undefined;

      event.preventDefault();
      event.stopPropagation();
      return false;  
    },
    [goNext, goPrevious, setYOffset],
  );

  const pointerMoveCb = useCallback(
    (event: PointerEvent | TouchEvent | MouseEvent) => {
      if (!pointerStartData.current) return;

      let y = 0;
      if (isPointerEvent(event) || isMouseEvent(event)) {
        y = event.y;
      } else {
        y = event.touches[0].clientY;
      }

      setYOffset(y - pointerStartData.current.y);
      yOffsetRef.current = y - pointerStartData.current.y;

      event.preventDefault();
      event.stopPropagation();
      return false;  
    },
    [setYOffset],
  );

  useEffect(() => {
    addEventListener("wheel", wheelCb);

    // feature detect

    if (window.PointerEvent) {
      addEventListener("pointerdown", pointerDownCb);
      addEventListener("pointerup", pointerUpCb);
      addEventListener("pointermove", pointerMoveCb);
      addEventListener("pointercancel", pointerCancelCb);
    } else {
      addEventListener("touchstart", pointerDownCb);
      addEventListener("touchcancel", pointerCancelCb);
      addEventListener("touchmove", pointerMoveCb);
      addEventListener("touchend", pointerUpCb);
      addEventListener("mousedown", pointerDownCb);
      addEventListener("mousecancel", pointerCancelCb);
      addEventListener("mousemove", pointerMoveCb);
      addEventListener("mouseup", pointerUpCb);
    }

    return () => {
      removeEventListener("wheel", wheelCb);

      if (window.PointerEvent) {
        removeEventListener("pointerdown", pointerDownCb);
        removeEventListener("pointerup", pointerUpCb);
        removeEventListener("pointermove", pointerMoveCb);
        removeEventListener("pointercancel", pointerCancelCb);
      } else {
        removeEventListener("touchstart", pointerDownCb);
        removeEventListener("touchcancel", pointerCancelCb);
        removeEventListener("touchmove", pointerMoveCb);
        removeEventListener("touchend", pointerUpCb);
        removeEventListener("mousedown", pointerDownCb);
        removeEventListener("mousecancel", pointerCancelCb);
        removeEventListener("mousemove", pointerMoveCb);
        removeEventListener("mouseup", pointerUpCb);
      }
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
            goToSlide={goToSlide}
          />
        );
      })}
    </>
  );
}
