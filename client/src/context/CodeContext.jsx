import { createContext, useContext, useState } from "react";

const CodeContext = createContext(null);

export function CodeProvider({ children }) {
  const [ctx, setCtx] = useState({ code: "", language: "" });
  return (
    <CodeContext.Provider value={{ ...ctx, setCodeContext: setCtx }}>
      {children}
    </CodeContext.Provider>
  );
}

export const useCodeContext = () => useContext(CodeContext);
