export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Stránka ve výstavbě</h1>
      <p className="text-lg text-gray-400 mb-10">
        Tato část aplikace je momentálně ve vývoji. Děkujeme za pochopení.
      </p>
      <div className="text-sm text-gray-500 mt-20">
        © {new Date().getFullYear()} SolutionBox Corp s.r.o.
      </div>
    </div>
  );
}
