import { WorkspaceType } from "optomancy/dist/types";
import { ReactNode } from "react";
import * as THREE from "three";
import { IndexContext } from "../contexts";
import View from "./View";

function getWorkspaceDimensions(workspace: WorkspaceType): {
  width: number;
  height: number;
  depth: number;
} {
  return {
    width: workspace.views.map((view) => view.width).reduce((a, b) => a! + b!)!,
    height: workspace.views
      .map((view) => view.height)
      .reduce((a, b) => a! + b!)!,
    depth: workspace.views.map((view) => view.depth).reduce((a, b) => a! + b!)!,
  };
}

function getWorkspacePosition(workspace: WorkspaceType, index: number) {
  const workspaceMargin = 0.2;
  return new THREE.Vector3(
    index *
      (getWorkspaceDimensions(workspace).width +
        workspaceMargin * workspace.views.length),
    0,
    0
  );
}

interface IWorkspace {
  children?: ReactNode;
  workspace: WorkspaceType;
  workspaceIndex: number;
  [props: string]: any;
}

const Workspace = ({
  children,
  workspace,
  workspaceIndex,
  ...rest
}: IWorkspace) => {
  return (
    <mesh {...rest} position={getWorkspacePosition(workspace, workspaceIndex)}>
      {workspace.views.map((view, viewIndex) => (
        // TODO: This provider assumes no layers, update the location of this provider to be within View once layers are supported
        <IndexContext.Provider
          value={{ workspace: workspaceIndex, view: viewIndex, layer: 0 }}
          key={`workspace_${workspaceIndex}-view_${viewIndex}`}
        >
          <View view={view} />
        </IndexContext.Provider>
      ))}
      {children}
    </mesh>
  );
};

export default Workspace;
