import React, { useState } from "react";
import "./AddNewItem.css";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import "./AddNewItem.css";

function AddNewItem({ appState, updateMenu }) {
  const [formInput, setFormInput] = useState({
    name: "",
    cost: "",
    rating: "",
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormInput({ ...formInput, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await apiClient.addNewItem(formInput);
    updateMenu({ ...appState, menuItems: [...appState.menuItems, formInput] });
    setFormInput({ name: "", cost: "", rating: "" });
    navigate("/");
  }

  const handleFileChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.files[0] });
  };

  return (
    <div className="new">
      <form>
        <label> Name </label>
        <input
          value={formInput.name}
          onChange={(e) => handleChange(e)}
          name="name"
          placeholder="name"
          required
        />
        <label> Image </label>
        <input name="image" type="file" onChange={handleFileChange} />
        <label> Cost </label>
        <input
          value={formInput.cost}
          type="number"
          onChange={(e) => handleChange(e)}
          name="cost"
          placeholder="cost"
          required
        />
        <label> Rating </label>
        <input
          value={formInput.rating}
          type="number"
          onChange={(e) => handleChange(e)}
          name="rating"
          placeholder="rating"
          required
        />
        <button onClick={(e) => handleSubmit(e)} className="submit-form">
          {" "}
          Submit{" "}
        </button>
      </form>
    </div>
  );
}

export default AddNewItem;
