import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../requests/api";

const TypesContext = createContext({});

export default function TypesProvider({ children }) {
  const [types, setTypes] = useState({});

  useEffect(() => {
    async function fetchTypes() {
      let res = null;
      try {
        res = await api.getTypes();
      } catch (err) {
        console.log(err);
        return;
      }

      const fetchedTypes = await res.data;
      setTypes(fetchedTypes);
    }

    fetchTypes();
  }, []);

  return (
    <TypesContext.Provider value={types}>{children}</TypesContext.Provider>
  );
}

export function useTypes() {
  return useContext(TypesContext);
}
