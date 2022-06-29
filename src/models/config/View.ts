import { Layer } from './Layer';
import { Mark } from './Mark';
import { Encoding } from './Encoding';

export interface View {
    title: string;
    titlePadding?: number;
    layers?: Layer[]; // REQUIRED if not using mark + encoding
    mark?: Mark; // REQUIRED if not using layers
    encoding?: Encoding; // REQUIRED if not using layers
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