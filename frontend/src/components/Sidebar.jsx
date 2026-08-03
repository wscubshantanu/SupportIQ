import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  Users,
  Settings
} from "lucide-react"


function Sidebar(){

  return (

    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">


      <h2 className="text-2xl font-bold mb-8">
        SupportIQ
      </h2>


      <ul className="space-y-5">


        <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">

          <LayoutDashboard size={20}/>

          Dashboard

        </li>



        <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">

          <Ticket size={20}/>

          Tickets

        </li>



        <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">

          <BarChart3 size={20}/>

          Analytics

        </li>



        <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">

          <Users size={20}/>

          Users

        </li>



        <li className="flex items-center gap-3 hover:text-blue-400 cursor-pointer">

          <Settings size={20}/>

          Settings

        </li>


      </ul>


    </aside>

  )

}


export default Sidebar