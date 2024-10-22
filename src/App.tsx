import { ReactFullpageSlideshow } from "@ybot1122/react-fullpage-slideshow";
import "./App.css";

export default function App() {
  return (
    <main>
      <ReactFullpageSlideshow items={[
        (goToSlide) => <Section label="slide1" goToSlide={goToSlide} />,
        (goToSlide) => <Section label="slide2" goToSlide={goToSlide} />,
        (goToSlide) => <Section label="slide3" goToSlide={goToSlide} />,
        (goToSlide) => <Section label="slide4" goToSlide={goToSlide} />,

        (goToSlide) => <Section label="slide5" goToSlide={goToSlide} />,
]} />
    </main>
  );
}

const Section = ({label, goToSlide}: {label: string, goToSlide: any}) => {

  return <div>{label}<button onClick={() => goToSlide(2)}>go to slide 2</button></div>
}