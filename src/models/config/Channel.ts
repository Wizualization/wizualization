import { Scale } from './Scale';
import { Axis } from './Axis';
import { Legend } from './Legend';

export interface Channel {
    field?: string; // REQUIRED if value not specified
    type?: string; // REQUIRED if value not specified
    value?: number; // REQUIRED if field+type not specified
    timeunit?: string; // REQUIRED if using temporal field type
    numberformat: string;
    scale?: Scale;
    axis?: Axis;
    legend?: Legend;
}