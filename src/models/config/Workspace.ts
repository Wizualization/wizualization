import { Data } from './Data'
import { View } from './View'
import { Transform } from './Transform'

export interface Workspace {
    data: Data;
    views: View[];
    transforms?: Transform[];
}