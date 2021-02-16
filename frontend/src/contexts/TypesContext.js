import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../requests/api";

const TypesContext = createContext({});

export default function TypesProvider({ children }) {
  const [types, setTypes] = useState({});

  useEffect(() => {
    async function fetchTypes() {
      let fetchedTypes = types;
      try {
        fetchedTypes = await api.getTypes();
      } catch (err) {
        console.log(err);
        return fetchedTypes;
      }

      return fetchedTypes;
    }

    const fetchedTypes = fetchTypes();
    setTypes(fetchedTypes);
  }, []);

  return (
    <TypesContext.Provider value={types}>{children}</TypesContext.Provider>
  );
}

export function useTypes() {
  return useContext(TypesContext);
}
