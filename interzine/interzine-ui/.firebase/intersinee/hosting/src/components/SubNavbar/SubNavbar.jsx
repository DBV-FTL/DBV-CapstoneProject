import "./SubNavbar.css";
import { useState } from "react";

export default function SubNavbar({ services, setServices }) {
  const [value, setValue] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [filter, setFilter] = useState();

  function handleFilter(c) {
    setCuisine(c);
    setServices(
      services?.filter((provider) => {
        if (c === "") return provider;
        return provider.cuisine.toLowerCase() === c;
      })
    );
  }

  function handleOnChange(e) {
    setValue(e.target.value);
    cuisine
      ? setServices(
          services
            ?.filter((provider) => provider.cuisine === cuisine)
            .filter((provider) =>
              provider.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
        )
      : setServices(
          services?.filter((provider) => {
            if (e.target.value === "") return provider;
            return (
              provider.cuisine
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              provider.name.toLowerCase().includes(e.target.value.toLowerCase())
            );
          })
        );
  }
  //10 random cuisines
  return (
    <nav className="subnavbar">
      <div className="content">
        <div className="search">
          <input
            name="search-bar"
            type="text"
            placeholder=" Search for Cuisine"
            value={value}
            onChange={handleOnChange}
          />
          <div className="search-icon">
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
            />
            <span class="material-symbols-outlined search">search</span>
          </div>
        </div>
        <div className="category-buttons">
          <button
            onClick={() => {
              handleFilter("");
            }}
          >
            All Cuisines
          </button>
          <button
            onClick={() => {
              handleFilter("ethiopian");
            }}
          >
            Ethiopian
          </button>
          <button
            onClick={() => {
              handleFilter("nigerian");
            }}
          >
            Nigerian
          </button>
          <button
            onClick={() => {
              handleFilter("jamaican");
            }}
          >
            Jamaican
          </button>
          <button
            onClick={() => {
              handleFilter("italian");
            }}
          >
            Italian
          </button>
          <button
            onClick={() => {
              handleFilter("indian");
            }}
          >
            Indian
          </button>
          <button
            onClick={() => {
              handleFilter("dominican");
            }}
          >
            Dominican
          </button>
          <button
            onClick={() => {
              handleFilter("japanese");
            }}
          >
            Japanese
          </button>
          <button
            onClick={() => {
              handleFilter("brazilian");
            }}
          >
            Brazilian
          </button>
          <button
            onClick={() => {
              handleFilter("Greek");
            }}
          >
            Greek
          </button>
        </div>
      </div>
    </nav>
  );
}
