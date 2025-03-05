import { Route, Routes } from "react-router-dom";
import HomePage from "@pages/HomePage";
import LayoutTest from "@components/Layout/LayoutTest";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/layout" element={<LayoutTest />} />
    </Routes>
  );
}

export default App;
