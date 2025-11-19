import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="w-full px-2 pt-4 md:pt-24">
        <h1 className="mb-6 text-3xl font-semibold">Clothing Store Homepage</h1>

        <p className="mb-4 text-gray-700">
          No left/right space now. Everything edge-to-edge.
        </p>

        <div className="space-y-4">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="h-16 rounded-md bg-white border border-gray-200 shadow-sm" />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
