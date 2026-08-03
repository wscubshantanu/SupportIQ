function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold">
        SupportIQ
      </h1>

      <div>
        <button className="bg-blue-600 px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>

    </nav>
  )
}

export default Navbar