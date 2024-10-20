import { ReactFullpageSlideshow } from "@ybot1122/react-fullpage-slideshow";
import "./App.css";

export default function App() {
  return (
    <main>
      <ReactFullpageSlideshow items={[
        <Section label="slide1" />,
        <Section label="slide2" />,
        <Section label="slide3" />
      ]} />
    </main>
  );
}

const Section = ({label}: {label: string}) => {

  return <div>{label}</div>
}