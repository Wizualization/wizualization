import { ReactNode } from "react";
import OptionsType from "../types/OptionsType";
import OptomancyContext from "./OptomancyContext";
import OptionsContext from "./OptionsContext";
import { OptomancyV2 } from "optomancy";

interface IProviders {
  children: ReactNode;
  optomancy: OptomancyV2;
  options?: OptionsType;
}

const Providers = ({ children, optomancy, options }: IProviders) => {
  return (
    <OptionsContext.Provider value={options}>
      <OptomancyContext.Provider value={optomancy}>
        {children}
      </OptomancyContext.Provider>
    </OptionsContext.Provider>
  );
};

export default Providers;
