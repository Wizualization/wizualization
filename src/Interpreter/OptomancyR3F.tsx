import "@react-three/fiber";
import { OptomancyV2 } from "optomancy";
import { Workspaces } from "./components";
import { Providers } from "./contexts";
import { OptionsType } from "./types";

interface IOptomancyR3F {
  options?: OptionsType;
  [props: string]: any;
}

export const OptomancyR3F = ({ config, options, ...rest }: IOptomancyR3F) => {
  const optomancy = new OptomancyV2(config);

  console.log("OptomancyR3F -> userConfig", optomancy.userConfig);
  console.log("OptomancyR3F -> config", optomancy.config);
  console.log("OptomancyR3F -> scales", optomancy.scales);
  console.log("OptomancyR3F -> datasets", optomancy.datasets);

  return (
    <Providers options={options} optomancy={optomancy}>
      <Workspaces {...rest} />
    </Providers>
  );
};
