import React, { useState } from "react";
import "./Register.css";
import apiClient from "../../services/apiClient";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Register({ client, setClient, register, appState }) {
  const [formInput, setFormInput] = useState({});
  const navigate = useNavigate();

  function handleFormInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormInput({ ...formInput, [name]: value });
  }

  async function handleRegister(e) {
    e.preventDefault();

    try {
      let response;
      let menu;
      let services;
      if (client === "user") {
        response = await apiClient.signupUser(formInput);
        services = await apiClient.fetchServicesByZip();
      } else if (client === "provider") {
        response = await apiClient.signupProvider(formInput);
        menu = await apiClient.fetchMenuItems(response?.data?.provider?.id);
      }
      const data = response.data;

      if (response.status === 201) {
        const { token } = data;
        localStorage.setItem("interzine_token", token);
        apiClient.setToken(token);
        const decodedToken = jwtDecode(token); //a way to get username from token

        if (client === "user") {
          register({
            ...appState,
            user: decodedToken,
            isAuthenticated: true,
            services: services?.data?.providers,
          });
        } else if (client === "provider") {
          if (menu) {
            register({
              ...appState,
              provider: decodedToken,
              isAuthenticated: true,
              menuItems: menu?.data?.menuItems,
            });
          } else {
            register({
              ...appState,
              provider: decodedToken,
              isAuthenticated: true,
              menuItems: [],
            });
          }
        }

        navigate("/");
      } else {
        //   //Login failed
        //   setLoginError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setFormInput({});
  }

  function changeClient(client) {
    if (client === "user") {
      setClient("provider");
    } else if (client === "provider") {
      setClient("user");
    }
  }

  let optionMessage;
  if (client === "user") {
    optionMessage = "Sign up to be a Sineer here!";
  } else if (client === "provider") {
    optionMessage = "Sign up to order here!";
  }

  const handleFileChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.files[0] });
  };

  return (
    <div className="register">
      {client === "user" ? (
        <div className="register-user">
          <p className="register-hdr"> Sign in </p>
          <form className="register-btn">
            <input
              onChange={(e) => handleFormInput(e)}
              name="firstName"
              placeholder="First Name"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="lastName"
              placeholder="Last Name"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="username"
              placeholder=" Username"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="email"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="password"
              placeholder="Password"
              type="password"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="password"
              placeholder="Confirm Password"
              type="password"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="address"
              placeholder="Address"
              type="text"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="zip_code"
              placeholder="Zip Code"
              type="number"
              required
            />
          </form>
          <button onClick={async (e) => await handleRegister(e)}>
            {" "}
            Sign up!{" "}
          </button>
          <button className="optional" onClick={() => changeClient(client)}>
            {" "}
            {optionMessage}{" "}
          </button>
        </div>
      ) : (
        <div className="register-provider">
          <p className="register-hdr"> Sign in Síneer! </p>
          <form className="register-ziner">
            <input
              onChange={(e) => handleFormInput(e)}
              name="name"
              placeholder="Full Name"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="cuisine"
              placeholder="Cuisine"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="email"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="password"
              placeholder="Password"
              type="password"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="password"
              placeholder="Confirm Password"
              type="password"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="address"
              placeholder="Address"
              type="text"
              required
            />
            <input
              onChange={(e) => handleFormInput(e)}
              name="zip_code"
              placeholder="Zip Code"
              type="number"
              required
            />
            <label> Profile Picture </label>
            <input
              onChange={handleFileChange}
              name="image"
              className="profile-picture"
              type="file"
              accpept="image/png, image/jpg, image/jpeg"
              id="myFile"
            />
            {/* <label> Provider Hero </label> */}
            {/* <input onChange={handleFileChange} name="image" className='provider-hero' type="file" id="myFile" />
                        <input onChange={(e) => handleFormInput(e)} name='provider_blurb' placeholder='Description' required/> */}
          </form>
          <button onClick={async (e) => await handleRegister(e)}>
            {" "}
            Sign up!{" "}
          </button>
          <button className="optional2" onClick={() => changeClient(client)}>
            {" "}
            {optionMessage}{" "}
          </button>
        </div>
      )}
    </div>
  );
}

export default Register;
