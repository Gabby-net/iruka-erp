export default function UnauthorizedPage() {

  return (

    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">

      <h1 className="text-6xl font-black text-red-500 mb-4">

        ACCESS DENIED

      </h1>

      <p className="text-gray-600 text-lg">

        You are not authorized to access this module.

      </p>

    </div>
  );
}