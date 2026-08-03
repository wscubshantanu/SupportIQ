function Dashboard(){

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold">
        AI Support Dashboard
      </h1>


      <div className="grid grid-cols-3 gap-5 mt-6">


        <div className="bg-blue-500 text-white p-5 rounded-xl">
          <h2 className="text-xl">
            Total Tickets
          </h2>

          <p className="text-3xl font-bold">
            120
          </p>

        </div>


        <div className="bg-green-500 text-white p-5 rounded-xl">

          <h2 className="text-xl">
            Resolved
          </h2>

          <p className="text-3xl font-bold">
            95
          </p>

        </div>


        <div className="bg-red-500 text-white p-5 rounded-xl">

          <h2 className="text-xl">
            Pending
          </h2>

          <p className="text-3xl font-bold">
            25
          </p>

        </div>


      </div>

    </div>

  )

}

export default Dashboard