import { useState } from "react";

import axios from "axios";


function CreateTicket() {


    const [title, setTitle] = useState("");

    const [description, setDescription] =
        useState("");


    const createTicket = async () => {


        const response = await axios.post(

            "http://127.0.0.1:8000/tickets/",

            {

                title,

                description

            }

        );


        console.log(
            response.data
        );


        alert(
            "Ticket created successfully"
        );

    };


    return (

        <div>

            <h1>Create Support Ticket</h1>


            <input

                placeholder="Ticket title"

                onChange={(event) =>

                    setTitle(
                        event.target.value
                    )

                }

            />


            <textarea

                placeholder="Describe your problem"

                onChange={(event) =>

                    setDescription(

                        event.target.value

                    )

                }

            />


            <button

                onClick={createTicket}

            >

                Submit Ticket

            </button>

        </div>

    );

}


export default CreateTicket;