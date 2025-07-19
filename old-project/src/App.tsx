import React from "react";
import Header from "./components/Header";
import SectionMain from "./components/SectionMain";

function App(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <SectionMain />
    </div>
  );
}

export default App;
