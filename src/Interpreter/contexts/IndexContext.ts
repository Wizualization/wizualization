import React from "react";
import IndexType from "../types/IndexType";

const defaultIndex: IndexType = {
  workspace: 0,
  view: 0,
  layer: 0,
};

const IndexContext = React.createContext<IndexType>(defaultIndex);

export default IndexContext;
