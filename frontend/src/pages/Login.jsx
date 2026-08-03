import { useState } from "react";

import axios from "axios";


function Login() {


    // Store email
    const [email, setEmail] = useState("");


    // Store password
    const [password, setPassword] = useState("");


    // Login function
    const loginUser = async () => {


        // Send login request
        const response = await axios.post(

            "http://127.0.0.1:8000/auth/login",

            {

                email: email,

                password: password

            }

        );


        // Save token
        localStorage.setItem(

            "token",

            response.data.access_token

        );


        alert("Login successful");

    };


    return (

        <div>

            <h1>SupportIQ Login</h1>


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

                onClick={loginUser}

            >

                Login

            </button>


        </div>

    );

}


export default Login;