import "./App.css";
import LocalUpload from "./components/LocalUpload";
import RebaseUpload from "./components/RebaseUpload";

function App() {
  return (
    <main className="flex flex-col items-center justify-center h-100 w-100 gap-6">
      <RebaseUpload />
      <LocalUpload />
    </main>
  );
}

export default App;
