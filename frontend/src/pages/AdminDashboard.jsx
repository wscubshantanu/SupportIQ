import { useEffect, useState } from "react";

import axios from "axios";


function AdminDashboard() {


    const [data, setData] =
        useState({});


    useEffect(() => {


        loadAnalytics();


    }, []);


    const loadAnalytics = async () => {


        const response = await axios.get(

            "http://127.0.0.1:8000/analytics/overview"

        );


        setData(
            response.data
        );

    };


    return (

        <div>

            <h1>Admin Dashboard</h1>


            <h2>

                Total Tickets:
                {data.total_tickets}

            </h2>


            <h2>

                Open Tickets:
                {data.open_tickets}

            </h2>


            <h2>

                High Priority:
                {data.high_priority_tickets}

            </h2>

        </div>

    );

}


export default AdminDashboard;