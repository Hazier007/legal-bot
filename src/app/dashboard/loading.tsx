export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-grow p-8">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Dashboard laden...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
