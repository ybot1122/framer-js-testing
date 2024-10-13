import './App.css'
import { useCallback, useEffect, useRef, useState } from "react";

import { Lethargy } from "lethargy-ts";

const SLIDE_THROTTLE_MS = 500;
const SWIPE_THRESHOLD_MS = 200;

const lethargy = new Lethargy({
  delay: 50,
  sensitivity: 40
});

function Section({ index, total, activeInd }: { index: number, total: number, activeInd: number }) {
  let top = '0';
  if (index < activeInd) {
    top = ((activeInd - index) * -100) + 'vh';
  } else if (index > activeInd) {
    top = ((index - activeInd) * 100) + 'vh';
  }

  return (
    <section 
    style={{background: index % 2 === 0 ? 'blue' : 'red', zIndex: total - index, top}}>
      <h2>{`#00${index}`}</h2>
    </section>
  );
}

export default function App() {
  const pointerStartData = useRef<undefined | {timestamp: number, y: number}>();
  const activeIndRef = useRef(0);
  const throttledRef = useRef(false);
  const [activeInd, setActiveInd] = useState(activeIndRef.current);

  const goNext = useCallback(() => {
    if (activeIndRef.current === 5) return;
    if (throttledRef.current) {
      console.log('throttled');
      return;
    }

    throttledRef.current = true;
    activeIndRef.current += 1;
    setActiveInd(activeIndRef.current);
    setTimeout(() => throttledRef.current = false, SLIDE_THROTTLE_MS);
  }, [setActiveInd])

  const goPrevious = useCallback(() => {
    if (activeIndRef.current === 0) return;
    if (throttledRef.current) {
      console.log('throttled');
      return;
    }

    throttledRef.current = true;
    activeIndRef.current -= 1;
    setActiveInd(activeIndRef.current);
    setTimeout(() => throttledRef.current = false, SLIDE_THROTTLE_MS);
  }, [setActiveInd])


  const wheelCb = useCallback((event: WheelEvent) => {
    const isIntentional = lethargy.check(event);
    if (isIntentional) {
        if (event.deltaY < 0 && activeIndRef.current > 0) {
          goPrevious();
        } else if (event.deltaY > 0 && activeIndRef.current < 5) {
          goNext();
        }        
    }
  }, [goNext, goPrevious])

  const pointerDownCb = useCallback((event: PointerEvent) => {
    pointerStartData.current = {
      timestamp: Date.now(),
      y: event.clientY
    }
  }, [])

  const pointerUpCb = useCallback((event: PointerEvent) => {

    if (!pointerStartData.current) return;
    if (Date.now() - pointerStartData.current?.timestamp > SWIPE_THRESHOLD_MS) return;
    if (event.y < pointerStartData.current.y) {
      goNext();
    } else {
      goPrevious();
    }

    pointerStartData.current = undefined;
  }, [goNext, goPrevious])


  useEffect(() => {
    addEventListener("wheel", wheelCb);
    addEventListener("pointerdown", pointerDownCb);
    addEventListener("pointerup", pointerUpCb);
    return () => {
      removeEventListener('wheel', wheelCb)
      removeEventListener("pointerdown", pointerDownCb)
      removeEventListener("pointerup", pointerUpCb)
    }
  }, [wheelCb, pointerDownCb, pointerUpCb])
  
  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((ind) => {
          return <Section index={ind} total={6} key={ind} activeInd={activeInd} />
      }
      )}
    </>
  );
}
