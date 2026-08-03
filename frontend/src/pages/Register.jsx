import { useState } from "react";

import axios from "axios";


function Register() {


    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    const registerUser = async () => {


        await axios.post(

            "http://127.0.0.1:8000/auth/register",

            {

                name,

                email,

                password

            }

        );


        alert(
            "Registration successful"
        );

    };


    return (

        <div>

            <h1>Create Account</h1>


            <input

                placeholder="Name"

                onChange={(event) =>

                    setName(
                        event.target.value
                    )

                }

            />


            <input

                placeholder="Email"

                onChange={(event) =>

                    setEmail(
                        event.target.value
                    )

                }

            />


            <input

                type="password"

                placeholder="Password"

                onChange={(event) =>

                    setPassword(
                        event.target.value
                    )

                }

            />


            <button

                onClick={registerUser}

            >

                Register

            </button>

        </div>

    );

}


export default Register;