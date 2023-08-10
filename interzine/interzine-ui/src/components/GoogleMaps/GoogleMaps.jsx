import { useMemo, useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import "./GoogleMaps.css";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxButton,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import apiClient from "../../services/apiClient";

//**IMPORATANT** Call a request to get the addresses of the providers and place a marker for each address
const myLibraries = ["places"]

export default function GoogleMaps() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: myLibraries,
  });
  if (!isLoaded) return <div className="loading">Loading...</div>;
  return <Map />;
}

function getUserLocation({ setUserLocation }) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    setUserLocation({ lat: latitude, lng: longitude });
  });
}

function Map() {
  const center = useMemo(() => ({ lat: 37.789744, lng: -122.397234 }), []);
  const [selected, setSelected] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState();
  const [providersAddresses, setProvidersAddresses] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [destination, setDestination] = useState({
    lat: 38.13741,
    lng: -120.463965,
  });
  const [userLocation, setUserLocation] = useState(null);

  getUserLocation({ setUserLocation });
  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete
          setProvidersAddresses={setProvidersAddresses}
          setSelected={setSelected}
          setDirectionsResponse={setDirectionsResponse}
          setDistance={setDistance}
          setDuration={setDuration}
          setDestination={setDestination}
          destination={destination}
          userLocation={userLocation}
        />
      </div>
      <GoogleMap
        zoom={17}
        center={selected ? selected : center}
        mapContainerClassName="map-container"
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          mapId: "c74a40fc22fa6d03",
        }}
      >
        {userLocation ? (
          <Marker position={userLocation} />
        ) : (
          selected && <Marker position={selected} />
        )}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
        {providersAddresses &&
          providersAddresses?.map((pro) => {
            return <Marker position={pro} />;
          })}
      </GoogleMap>
    </>
  );
}

function PlacesAutocomplete({
  setProvidersAddresses,
  setSelected,
  setDirectionsResponse,
  setDistance,
  setDuration,
  setDestination,
  destination,
  userLocation
}) {
  const orgRef = useRef();

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });

    getProvidersGeoCode({
      setProvidersAddresses,
    });
  };

  return (
    <div className="address-searchbar">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          name="user"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search an Address"
          ref={orgRef}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
        {/*<ComboboxButton className="buttonmap"
          onClick={() =>
            calculateRoute({
              setDirectionsResponse,
              setDuration,
              setDistance,
              orgRef,
              destination,
              userLocation,
            })
          }
        >
          Search

          
        </ComboboxButton>
        <ComboboxButton
          onClick={() =>
            clearRoute({
              setDirectionsResponse,
              setDistance,
              setDuration,
              orgRef,
              setDestination,
            })
          }
        >
          Clear
        </ComboboxButton> */}
      </Combobox>
    </div>
  );
}

async function fetchProviders() {
  const pro = await apiClient.fetchServicesByZip();
  const providersAddresses = pro.data.providers.map((pro) => {
    if (
      pro.address?.length > 0 &&
      pro.address?.charAt(pro.address.length - 1) === " "
    )
      pro.address = pro.address.substring(0, pro.address.length - 1);
    const address = pro.address + ", USA";
    return address;
  });
  return providersAddresses;
}

async function getProvidersGeoCode({
  setProvidersAddresses,
}) {
  const addresses = await fetchProviders();
  Promise.all(
    addresses.map(async (address) => {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);

      setProvidersAddresses((oldResults) => [...oldResults, { lat, lng }]);
    })
  );
}

async function calculateRoute({
  setDirectionsResponse,
  setDistance,
  setDuration,
  orgRef,
  destination,
  userLocation,
}) {
  if (
    (userLocation === "" && orgRef.current.value === "") ||
    destination === ""
  )
    return;
  const directionsService = new google.maps.DirectionsService();
  const results = await directionsService.route({
    origin: userLocation ? userLocation : orgRef.current.value,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  });
  setDirectionsResponse(results);
  setDistance(results.routes[0].legs[0].distance.text);
  setDuration(results.routes[0].legs[0].duration.text);
}

function clearRoute({
  setDirectionsResponse,
  setDistance,
  setDuration,
  orgRef,
  setDestination,
}) {
  setDestination({});
  setDirectionsResponse(null);
  setDistance("");
  setDuration("");
  orgRef.current.value = "";
}
