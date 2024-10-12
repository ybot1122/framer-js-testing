import './App.css'
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

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
      <motion.h2>{`#00${index}`}</motion.h2>
    </section>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();

  const activeIndRef = useRef(0);
  const throttledRef = useRef(false);
  const [activeInd, setActiveInd] = useState(activeIndRef.current);

  const goNext = useCallback(() => {
    if (activeIndRef.current === 5 || throttledRef.current) return;

    activeIndRef.current += 1;
    setActiveInd(activeIndRef.current);
  }, [setActiveInd])

  const goPrevious = useCallback(() => {
    if (activeIndRef.current === 0 || throttledRef.current) return;

    activeIndRef.current -= 1;
    setActiveInd(activeIndRef.current);
  }, [setActiveInd])


  const wheelCb = useCallback((ind: number) => (event: WheelEvent) => {

      if (ind !== activeIndRef.current || throttledRef.current) return;

      if (event.deltaY < 0 && activeIndRef.current > 0) {
        goPrevious();
      } else if (event.deltaY > 0 && activeIndRef.current < 5) {
        goNext();
      }

  }, [goNext, goPrevious])

  useEffect(() => {
    const cb = wheelCb(activeInd)
    addEventListener("wheel", cb);
    return () => removeEventListener('wheel', cb)
  }, [wheelCb, activeInd])
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("Page scroll: ", latest)
  })

  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((ind) => {
          return <Section index={ind} total={6} key={ind} activeInd={activeInd} />
      }
      )}
    </>
  );
}
