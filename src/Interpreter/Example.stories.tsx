import React from "react";
import { Story } from "@ladle/react";
import { OptomancyR3F } from "./OptomancyR3F";
import { ARCanvas } from "@react-three/xr";
import "./optomancyr3f.css";
import { iris, populations } from "./examples/datasets";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";

const testViewConfig = {
  data: { name: "iris", values: iris },
  title: "The Iris Flower Dataset",
  mark: "point",
  encoding: {
    x: {
      field: "petalWidth",
      type: "quantitative",
    },
    y: {
      field: "petalLength",
      type: "quantitative",
    },
    z: {
      field: "sepalWidth",
      type: "quantitative",
    },
    color: {
      field: "species",
      type: "nominal",
    },
  },
};

const testCompiledViewConfig = {
  datasets: [{ name: "iris", values: iris }],
  workspaces: [
    {
      data: "iris",
      views: [
        {
          title: "The Iris Flower Dataset",
          mark: "point",
          encoding: {
            x: {
              field: "petalWidth",
              type: "quantitative",
            },
            y: {
              field: "petalLength",
              type: "quantitative",
            },
            z: {
              field: "sepalWidth",
              type: "quantitative",
            },
            color: {
              field: "species",
              type: "nominal",
            },
          },
        },
      ],
    },
  ],
};

const testWorkspaceConfig = {
  title: "The Iris Flower Dataset",
  data: { name: "iris", values: iris },
  views: [
    {
      title: "View One",
      mark: "point",
      encoding: {
        x: {
          field: "petalWidth",
          type: "quantitative",
        },
        y: {
          field: "petalLength",
          type: "quantitative",
        },
        z: {
          field: "sepalWidth",
          type: "quantitative",
        },
        color: {
          field: "species",
          type: "nominal",
        },
      },
    },
    {
      title: "View Two",
      mark: "point",
      encoding: {
        x: {
          field: "sepalLength",
          type: "quantitative",
        },
        y: {
          field: "sepalWidth",
          type: "quantitative",
        },
        z: {
          field: "petalLength",
          type: "quantitative",
        },
        color: {
          field: "species",
          type: "nominal",
        },
      },
    },
  ],
};

const testRootConfig = {
  datasets: [
    { name: "iris", values: iris },
    { name: "populations", values: populations },
  ],
  workspaces: [
    {
      data: "iris",
      views: [
        {
          title: "View One",
          mark: "point",
          encoding: {
            x: {
              field: "petalWidth",
              type: "quantitative",
            },
            y: {
              field: "petalLength",
              type: "quantitative",
            },
            z: {
              field: "sepalWidth",
              type: "quantitative",
            },
            color: {
              field: "species",
              type: "nominal",
            },
          },
        },
        {
          title: "View Two",
          mark: "point",
          encoding: {
            x: {
              field: "sepalLength",
              type: "quantitative",
            },
            y: {
              field: "sepalWidth",
              type: "quantitative",
            },
            z: {
              field: "petalLength",
              type: "quantitative",
            },
            color: {
              field: "species",
              type: "nominal",
            },
          },
        },
      ],
    },
    {
      data: "iris",
      views: [
        {
          title: "View One",
          mark: "point",
          encoding: {
            x: {
              field: "petalWidth",
              type: "quantitative",
            },
            y: {
              field: "petalLength",
              type: "quantitative",
            },
            color: {
              field: "species",
              type: "nominal",
            },
          },
        },
        {
          title: "View Two",
          mark: "point",
          encoding: {
            x: {
              field: "sepalLength",
              type: "quantitative",
            },
            y: {
              field: "sepalWidth",
              type: "quantitative",
            },
            color: {
              field: "species",
              type: "nominal",
            },
          },
        },
      ],
    },
    {
      data: "populations",
      views: [
        {
          title: "View Three",
          mark: "point",
          encoding: {
            x: {
              timeUnit: "year",
              field: "Year",
              type: "temporal",
            },
            y: {
              field: "Population (Thousands)",
              type: "quantitative",
              axis: {
                face: "back",
                filter: true,
              },
              numberFormat: ",.2r",
            },
            z: {
              field: "Country",
              type: "nominal",
            },
            color: {
              field: "Population (Thousands)",
              type: "quantitative",
              scale: {
                scheme: "interpolatePlasma",
              },
              legend: {
                orient: "left",
              },
              numberFormat: ",.2r",
            },
          },
        },
        {
          title: "View Four",
          mark: "point",
          encoding: {
            x: {
              timeUnit: "year",
              field: "Year",
              type: "temporal",
            },
            y: {
              field: "Population (Thousands)",
              type: "quantitative",
              axis: {
                face: "back",
                filter: true,
              },
              numberFormat: ",.2r",
            },
            z: {
              field: "Country",
              type: "nominal",
            },
            color: {
              field: "Population (Thousands)",
              type: "quantitative",
              scale: {
                scheme: "interpolatePlasma",
              },
              legend: {
                orient: "left",
              },
              numberFormat: ",.2r",
            },
          },
        },
      ],
    },
  ],
};

const andrea_config = {
  datasets: [
    {
      values: iris,
      name: "Iris",
    },
    {
      values: populations,
      name: "Populations",
    },
  ],
  workspaces: [
    {
      title: "workspace_0",
      data: "Iris",
      views: [
        {
          title: "The Iris Flower Dataset",
          mark: "line",
          encoding: {
            x: {
              field: "petalWidth",
              type: "quantitative",
            },
            y: {
              field: "petalLength",
              type: "quantitative",
            },
          },
        },
      ],
    },
  ],
};

export const Example: Story = () => (
  <ARCanvas>
    <OrbitControls />
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <OptomancyR3F config={testRootConfig} options={{ theme: "light" }} />
  </ARCanvas>
);

Example.storyName = "Example Config";
