import React, { createContext, useContext, useState } from "react";

const CursorContext = createContext({
  cursorType: "default",
  setCursorType: () => {},
});

export function CursorProvider({ children }) {
  const [cursorType, setCursorType] = useState("default");

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
