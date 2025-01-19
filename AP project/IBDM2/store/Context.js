import React, { createContext, useState, useEffect } from "react";

export const FavoriteContext = createContext(null);

export default function FavoriteProvider({ children }){
  
  const [clicked, setClicked] = useState(false);

  return (
    <FavoriteContext.Provider value={{ setClicked ,  clicked }}>
      {children}
    </FavoriteContext.Provider>
  );
};
