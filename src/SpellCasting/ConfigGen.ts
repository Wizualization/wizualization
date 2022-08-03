import { Root, Workspace } from 'optomancy';

declare type root = typeof Root;

interface RootConfig {
    root : root
}

let newroot : RootConfig = {root:{
    //data:
}}

/*
export class ConfigGen {
    public root = typeof Root;
    //public root : Root; 
    public workspace : Workspace;
    testRoot() : Root {
        
    }
}
*/



