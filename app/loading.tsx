export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we load your content.</p>
      </div>
    </div>
  );
}
