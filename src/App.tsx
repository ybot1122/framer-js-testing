import "./App.css";
import { ReactFullpageSlideshow } from "@ybot1122/react-fullpage-slideshow";

export default function App() {
  return (
    <main>

<ReactFullpageSlideshow


    items={[
      ({goToSlide, goToNextSlide}) => <Slide goToSlide={goToSlide} goToNextSlide={goToNextSlide} label="slide one" />,
      ({goToSlide, goToNextSlide}) => <Slide goToSlide={goToSlide} goToNextSlide={goToNextSlide} label="slide two" />,
      ({goToSlide, goToNextSlide}) => <Slide goToSlide={goToSlide} goToNextSlide={goToNextSlide} label="slide three" />,
      ({goToSlide, goToNextSlide}) => <Slide goToSlide={goToSlide} goToNextSlide={goToNextSlide} label="slide four" />,
      (api) => <Slide {...api} label="slide five" />,
    ]}
></ReactFullpageSlideshow>

    </main>
  );
}

const Slide = ({goToSlide, goToNextSlide, label, goToPreviousSlide}: any) => {

  return (

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h1>{label}</h1>
      <button onClick={() => goToSlide(0)}>Go to Slide 0</button>
      <button onClick={() => goToNextSlide()}>Next Slide</button>
      <button onClick={() => goToPreviousSlide()}>Prev Slide</button>

    </div>

  )
}