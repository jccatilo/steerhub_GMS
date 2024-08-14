import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "../../../api/axios";
import "/src/app/globals.css";
import AdminCard from "./admincard";

const LeafletMap = ({ adminToken }) => {
  const [locations, setLocations] = useState([]);
  const [notifiedLocations, setNotifiedLocations] = useState(() => {
    const savedNotifiedLocations = localStorage.getItem("notifiedLocations");
    return new Set(
      savedNotifiedLocations ? JSON.parse(savedNotifiedLocations) : []
    );
  });
  const mapRef = useRef(null);

  useEffect(() => {
    // Customizing default Leaflet marker icons
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });

    // Fetch location and image data
    fetchData();
  }, []);

  useEffect(() => {
    // Save notifiedLocations to local storage whenever it changes
    localStorage.setItem(
      "notifiedLocations",
      JSON.stringify([...notifiedLocations])
    );

    // Ensure map updates size after initial render
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }

    // Adjust map bounds to fit all markers
    if (locations.length && mapRef.current) {
      const bounds = locations.map((location) => [
        parseFloat(location.latitude),
        parseFloat(location.longitude),
      ]);
      mapRef.current.fitBounds(bounds);
    }
  }, [locations, notifiedLocations]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/location-data", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [adminToken]);

  const handleSendHelp = useCallback(
    async (locationId) => {
      try {
        const response = await axios.post(
          `/api/send-help/${locationId}`,
          {},
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        setNotifiedLocations((prev) => new Set(prev).add(locationId));
      } catch (error) {
        console.error("Error sending help:", error);
      }
    },
    [adminToken]
  );

  const handleDeleteMarker = useCallback(
    async (locationId) => {
      try {
        const response = await axios.delete(
          `/api/delete-marker/${locationId}`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        setLocations((prevLocations) =>
          prevLocations.filter((location) => location.id !== locationId)
        );
      } catch (error) {
        console.error("Error deleting marker:", error);
      }
    },
    [adminToken]
  );

  return (
    <>
      <div className="my-4 hidden md:block">
        <AdminCard totalMarkers={locations.length} />
      </div>
      <MapContainer
        center={[13.75, 121.05]}
        zoom={13}
        style={{ height: "480px", width: "100%" }}
        className="map-container"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[
              parseFloat(location.latitude),
              parseFloat(location.longitude),
            ]}
          >
            <Popup>
              <div className="text-center">
                <img
                  src={`https://api-ligtas.parallaxed.ph${location.image}`}
                  alt="Popup Image"
                  className="w-full text-white mb-2 rounded-lg place-self-center"
                />
                <p className="text-white text-xs">
                  Location uploaded by {location.userName}
                </p>
                <button
                  onClick={() => handleSendHelp(location.id)}
                  className={`${
                    notifiedLocations.has(location.id)
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-800"
                  } text-white font-bold py-2 px-3 rounded`}
                  disabled={notifiedLocations.has(location.id)}
                >
                  {notifiedLocations.has(location.id)
                    ? "Help sent"
                    : "Send Help"}
                </button>
                {notifiedLocations.has(location.id) && (
                  <button
                    onClick={() => handleDeleteMarker(location.id)}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded ml-3"
                  >
                    Delete Marker
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default LeafletMap;
