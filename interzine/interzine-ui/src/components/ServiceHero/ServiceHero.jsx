import React, { useState } from "react";
import "./ServiceHero.css";
import apiClient from "../../services/apiClient";

function ServiceHero({ provider, client, setInactive }) {
  const [openForm, setOpenForm] = useState(false);
  const [formInput, setFormInput] = useState({});

  function handleDisplay(display) {
    setInactive(display);
    setOpenForm(display);
  }

  const handleFileChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.files[0] });
  };

  function handleFormInput(e) {
    const name = e.target.name;
    setFormInput({ ...formInput, [name]: value });
  }
  //the description isn't even updating because I don't think that the appState form is not updating!
  async function handleSubmit() {
    const updates = await apiClient.updateProviderProfile(formInput);
    setFormInput({});
    handleDisplay(false);
  }

  return (
    <div className="service-hero-section">
      <img
        className="hero-image"
        src={
          provider?.service_provider_hero
            ? provider?.service_provider_hero
            : "https://cms-b-assets.familysearch.org/dims4/default/bf2d93e/2147483647/strip/true/crop/800x500+0+0/resize/2480x1550!/format/webp/quality/90/?url=https%3A%2F%2Ffamilysearch-brightspot.s3.amazonaws.com%2F89%2F3f%2F1a23c4a6fe52a96d2a6d2586cb90%2Fworld-cuisine.jpg"
        }
      />
      <div className="details-edit">
        <div className="img-details">
          <div>
            <img
              className="provider_profile_picture"
              src={provider?.profile_picture}
            />
          </div>
          <div className="provider-details">
            <h1> {provider?.name} </h1>
            <p className="cuisine-name"> {provider?.cuisine} </p>
            <p className="blurb">
              {provider?.service_provider_blurb
                ? provider?.service_provider_blurb
                : `Explore ${provider?.cuisine} cuisine from Sineer ${provider?.name}!`}
            </p>
          </div>
        </div>
        {client === "provider" && (
          <div
            className="edit"
            onClick={() => {
              setInactive(true);
              setOpenForm(true);
            }}
          >
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
            />
            <span class="material-symbols-outlined pen">pen_size_4</span>
          </div>
        )}
      </div>
      {openForm && (
        <div className="blurb-hero-container">
          <div
            className="exit-editor"
            onClick={() => {
              setInactive(false);
              setOpenForm(false);
            }}
          >
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
            />
            <span class="material-symbols-outlined close-editor">close</span>
          </div>
          <form>
            <h2> Edit Intersinee Store Front</h2>

            <label> Banner Image </label>
            <input
              onChange={handleFileChange}
              name="image"
              className="hero-selector"
              type="file"
              accpept="image/png, image/jpg, image/jpeg"
              id="myFile"
            />

            <label> Description </label>
            <input
              className="blurb-input"
              onChange={(e) => handleFormInput(e)}
              name="name"
              placeholder="Description"
              required
            />
          </form>
          <button
            style={{
              width: "29rem",
              backgroundColor: "orange",
              fontWeight: "bold",
              borderWidth: "2px",
              cursor: "pointer",
              height: " 2rem",
              fontFamily: "didot,serif",
              fontSize: "14pt",
              borderRadius: "10px",
              marginTop: "1%",
            }}
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default ServiceHero;
