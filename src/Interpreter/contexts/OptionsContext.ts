import React from "react";
import Options from "../types/OptionsType";

const defaultOptions: Options = {
  theme: "light",
};

const OptionsContext = React.createContext<Options | undefined>(defaultOptions);

export default OptionsContext;
