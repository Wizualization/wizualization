import { useContext } from "react";
import { OptomancyContext } from "../contexts";
import Workspace from "./Workspace";

const Workspaces = ({ ...rest }) => {
  const optomancy = useContext(OptomancyContext);

  return (
    <mesh {...rest}>
      {optomancy &&
        optomancy.config.workspaces.map((workspace, i) => (
          <Workspace
            workspace={workspace}
            workspaceIndex={i}
            key={`workspace_${i}`}
          />
        ))}
    </mesh>
  );
};

export default Workspaces;
