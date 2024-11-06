import { rfsApi } from "../../react-fullpage-slideshow/dist/types";
import "./App.css";
import { ReactFullpageSlideshow } from "@ybot1122/react-fullpage-slideshow";

export default function App() {
  return (
    <main>

<ReactFullpageSlideshow


    items={[
      (api: rfsApi) => <Slide {...api} label="slide 1" />,
      (api: rfsApi) => <Slide {...api} label="slide 2" />,
      (api: rfsApi) => <Slide {...api} label="slide 3" />,
      (api: rfsApi) => <Slide {...api} label="slide 4" />,
      (api: rfsApi) => <Slide {...api} label="slide five" />,
    ]}
    itemClassName="odd:bg-blue-500 even:bg-green-500"
    slideAnimationMs={3000}
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