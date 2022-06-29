import { Data } from './Data'
import { Workspace } from './Workspace'

export interface Root {
    datasets: {
        data: Data[];
        name: string;
    }
    workspaces: Workspace[];
}