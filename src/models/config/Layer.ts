import { Mark } from './Mark';
import { Encoding } from './Encoding';

export interface Layer {
    mark: Mark;
    encoding: Encoding;
    width?: number;
    height?: number;
    depth?: number;
    x?: number;
    y?: number;
    z?: number;
    xrot?: number;
    yrot?: number;
    zrot?: number;
}