import Animations from "./components/Animations/Animations";
import CloudV1 from "./components/Clouds/CloudV1";
// import { Dividers } from "./components/Dividers/Dividers";
import Illustrations from "./components/Illustrations/Illustrations";
import LandingPage from "./components/LandingPage/LandingPage";
import Metronome from "./components/Metronome/Metronome";
import Mountains from "./components/Mountains/Mountains";

function App() {

  return (
    <>
      <LandingPage />
      <Metronome />
      <CloudV1 />
      {/* <Dividers /> */}
      <Animations />
      <Mountains />
      <Illustrations />
    </>
  )
}

export default App

