import React, { useState, useEffect } from "react";
import "./machineLocation.css";

const MachinePartsPage = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedView, setSelectedView] = useState("inventory");

  // Fetch Cities on Component Mount
  useEffect(() => {
    const fetchCities = async () => {
      const res = await fetch("http://localhost:5000/api/cities");
      const data = await res.json();
      setCities(data);
    };
    fetchCities();
  }, []);

  // Fetch Addresses when a City is selected
  useEffect(() => {
    if (selectedCity) {
      const fetchAddresses = async () => {
        const res = await fetch(`http://localhost:5000/api/addresses/${selectedCity}`);
        const data = await res.json();
        setAddresses(data);
        setSelectedAddress(""); // Reset address selection
        setMachines([]); // Clear machine list
      };
      fetchAddresses();
    }
  }, [selectedCity]);

  // Fetch Machines when an Address is selected
  useEffect(() => {
    if (selectedAddress) {
      const fetchMachines = async () => {
        const res = await fetch(`http://localhost:5000/api/machines/${selectedAddress}`);
        const data = await res.json();
        setMachines(data);
      };
      fetchMachines();
    }
  }, [selectedAddress]);

  return (
    <div>
      <h1>Machine Parts & Details</h1>

      {/* City Dropdown */}
      <label>City:</label>
      <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.location_name} value={city.location_name}>
            {city.location_name}
          </option>
        ))}
      </select>

      {/* Address Dropdown (Appears after selecting City) */}
      {selectedCity && (
        <>
          <label>Address:</label>
          <select onChange={(e) => setSelectedAddress(e.target.value)} value={selectedAddress}>
            <option value="">Select Address</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.address}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Machines Dropdown (Appears after selecting Address) */}
      {selectedAddress && (
        <div>
          <label>Machines:</label>
          <select onChange={(e) => setSelectedMachine(e.target.value)} value={selectedMachine}>
            <option value="">Select Machine</option>
            {machines.map((machine) => (
              <option key={machine.machine_id} value={machine.machine_id}>
                Machine {machine.machine_id} - {machine.status}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Buttons for different views */}
      {selectedMachine && (
        <div>
          <button onClick={() => setSelectedView("refiller")}>Refiller Details</button>
          <button onClick={() => setSelectedView("inventory")}>Inventory</button>
          <button onClick={() => setSelectedView("buyer")}>Admin Details</button>

          {/* Display selected view */}
          {machines
            .filter((machine) => machine.machine_id === parseInt(selectedMachine))
            .map((machine) => (
              <div key={machine.machine_id}>
                {/* Refiller Details */}
                {selectedView === "refiller" && (
                  <div>
                    <h3>Refiller Details</h3>
                    <p>Name: {machine.refiller_name}</p>
                    <p>Email: {machine.refiller_email}</p>
                    <p>Phone Number: {machine.refiller_phn}</p>
                  </div>
                )}

                {/* Inventory (Machine Parts) */}
                {selectedView === "inventory" && (
                  <div>
                    <h3>Machine Parts</h3>
                    <ul>
                      {machine.parts.map((part, index) => (
                        <li key={index}>
                          {part.part_name} - {part.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Buyer Details */}
                {selectedView === "buyer" && (
                  <div>
                    <h3>Admin Details</h3>
                    <p>Name: {machine.buyer_name}</p>
                    <p>Email: {machine.buyer_email}</p>
                    <p>Phone Number: {machine.buyer_phn}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MachinePartsPage;
