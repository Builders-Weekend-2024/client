import "./App.css";
import React from "react";

import LocalUpload from "./components/LocalUpload";

function App() {
  return (
    <main className="flex flex-col items-center justify-center h-100 w-100 gap-6">
      <LocalUpload />
    </main>
  );
}

export default App;
