import { type NextPage } from "next";

const App: NextPage = () => {
  return (
    <main>
      {Array.from({ length: 10 }).map((_, i) => (
        <input key={i} className="w-20 border-2 border-black"></input>
      ))}
    </main>
  );
};

export default App;
