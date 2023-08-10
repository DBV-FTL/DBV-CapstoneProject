import React, { useState } from "react";
import ServiceHero from "../../components/ServiceHero/ServiceHero";
import AddNewItem from "../AddNewItem/AddNewItem";
import Menu from "../../components/Menu/Menu";
import "./Store.css";

function Store({ appState, updateMenu }) {
  const [addNewItem, setAddNewItem] = useState(false);
  const [inactive, setInactive] = useState(false);

  return (
    <div className="store">
      <ServiceHero
        provider={appState?.providerObject}
        client={"provider"}
        setInactive={setInactive}
      />
      {addNewItem ? (
        <div>
          <AddNewItem
            appState={appState}
            updateMenu={updateMenu}
            setAddNewItem={setAddNewItem}
          />
        </div>
      ) : inactive ? (
        <div className="inactive-store-items">
          <div className="button-container">
            <button className="add-button" onClick={() => setAddNewItem(true)}>
              Add to menu
            </button>
          </div>
          <Menu
            menu={appState?.menuItems}
            provider={appState?.providerObject}
          />
        </div>
      ) : (
        <div className="store-items">
          <div className="button-container">
            <button className="add-button" onClick={() => setAddNewItem(true)}>
              Add to menu
            </button>
          </div>
          <Menu
            menu={appState?.menuItems}
            provider={appState?.providerObject}
          />
        </div>
      )}
    </div>
  );
}

export default Store;
