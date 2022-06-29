import { Channel } from "./Channel";

export interface Encoding {
    //AT LEAST ONE REQUIRED
    x?: Channel;
    y?: Channel;
    z?: Channel;
    xoffset?: Channel;
    yoffset?: Channel;
    zoffset?: Channel;
    xrot?: Channel;
    yrot?: Channel;
    zrot?: Channel;
    width?: Channel;
    height?: Channel;
    depth?: Channel;
    size?: Channel;
    color?: Channel;
    opacity?: Channel;
    length?: Channel;
    shape?: Channel;
}