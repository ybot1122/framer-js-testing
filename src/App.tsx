import './App.css'
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";

enum SlideState {
  Past = 'past',
  Current = 'current',
  Future = 'future',
}

function Section({ index, total, state }: { index: number, total: number, state: SlideState }) {
  const { scrollYProgress } = useScroll();
  const myStart = (1 / total) * index;
  const myEnd = myStart + (1 / total);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {

    if (latest >= myStart && latest < myEnd) {
      console.log("Container " + index + " in view")
    }
  })


  let className = '';
  if (state === SlideState.Past) {
    className = 'past'
  } else if (state === SlideState.Future) {
    className = 'future'
  }

  return (
    <section 
    className={className}
    style={{background: index % 2 === 0 ? 'blue' : 'red', zIndex: total - index}}>
      <motion.h2>{`#00${index}`}</motion.h2>
    </section>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const activeIndRef = useRef(0);
  const [activeInd, setActiveInd] = useState(activeIndRef.current);

  const wheelCb = useCallback((event: WheelEvent) => {
      console.log(event.deltaY, activeInd, activeIndRef.current)

      if (event.deltaY < 0 && activeIndRef.current > 0) {
        activeIndRef.current -= 1;
        setActiveInd(activeIndRef.current)
      } else if (event.deltaY > 0 && activeIndRef.current < 5) {
        activeIndRef.current += 1;
        setActiveInd(activeIndRef.current)
      }

      console.log(activeInd, activeIndRef.current)

  }, [setActiveInd])

  useEffect(() => {
    addEventListener("wheel", wheelCb);
    return () => removeEventListener('wheel', wheelCb)
  }, [wheelCb])
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("Page scroll: ", latest)
  })

  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((ind) => {
        let state = SlideState.Current;
        if (ind < activeInd) {
          state = SlideState.Past
        } else if (ind > activeInd) {
          state = SlideState.Future
        }
          return <Section index={ind} total={6} key={ind} state={state} />
      }
      )}
    </>
  );
}
