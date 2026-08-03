import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"


function App(){

  return (

    <div>

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 bg-gray-100 min-h-screen">

          <Dashboard />

        </main>

      </div>


    </div>

  )

}


export default App