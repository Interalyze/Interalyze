export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to Interalyze</h1>
      <p className="mt-4">
        Analyze interviews effectively with AI-powered insights for stress and
        personality analysis.
      </p>
      <a
        href="/dashboard"
        className="mt-4 inline-block p-2 bg-blue-500 text-white rounded"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
