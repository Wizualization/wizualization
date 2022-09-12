import React from "react";
import { OptomancyV2 } from "optomancy";

const OptomancyContext = React.createContext<OptomancyV2 | null>(null);

export default OptomancyContext;
