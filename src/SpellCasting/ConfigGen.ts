import { Config, Root, Data, Workspace, View, Layer, Mark, Encoding, Tooltip, Channel, Scale, Axis, Legend } from 'optomancy';

/** Type declarations */
declare type ConfigMain = typeof Config; // NEW!! 
declare type RootConfig = typeof Root;
declare type WorkspaceConfig = typeof Workspace;
declare type DataConfig = typeof Data;
declare type LayerConfig = typeof Layer;
declare type MarkConfig = typeof Mark;
declare type ViewConfig = typeof View;
declare type EncodingConfig = typeof Encoding;
declare type TooltipConfig = typeof Tooltip;
declare type ChannelConfig = typeof Channel;
declare type ScaleConfig = typeof Scale;
declare type AxisConfig = typeof Axis;
declare type LegendConfig = typeof Legend;

/** Interfaces for config elements */
/*interface DataConfig {
    data : data
}

interface LayerConfig {
    layer : layer
}


interface MarkConfig {
    mark : mark
}

interface EncodingConfig {
    encoding : encoding
}

interface TooltipConfig {
    tooltip : tooltip
}

interface ChannelConfig {
    channel : channel
}

interface ScaleConfig {
    scale : scale
}

interface AxisConfig {
    axis : axis
}

interface LegendConfig {
    legend : legend
}


interface ViewConfig {
    title: string;
    titlePadding?: number;
    data?: DataConfig | string;
    //transform?: TransformConfig[];
    layer?: LayerConfig[];
    mark?: MarkConfig | string;
    encoding?: EncodingConfig;
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

interface WorkspaceConfig {
    title?: string;
    data: DataConfig | string;
    views: ViewConfig[];
    //transform?: TransformConfig[];
}

interface RootConfig {
    datasets: DataConfig[];
    workspaces: WorkspaceConfig[];
}

interface Config {
    config : config
}
*/

export default function ConfigGen(props: any){
    console.log(props)
    let sessionData : DataConfig[] = props.datasets.map(function(dataset : any){
        let d : DataConfig = {
            values: dataset.values,
            name: dataset.name
        };
        return d;
    });

    //TODO: Correct the way we generate views. 
    //Creating a single view, then looping through the cast spells looking for optoclasses 
    // and then updating that single view is a little rough lol
    let sessionViews : ViewConfig = [
        {
            title: "The Iris Flower Dataset",
            mark: "point",
            encoding: {}
        }
    ];

    let optoClasses = props.matchedSpells.map((s : any) => s.optoClass)
    console.log(optoClasses)
    
    let markPrimitives = ["line", "point", "bar", "column"]

    // "color"

    let axes = ['x', 'y', 'z']
    let axisVars = ['petalWidth', 'petalLength', 'sepalWidth']
    // "axis"
  
    let axisCount = 0;

    for(let i=0; i<optoClasses.length; i++){
        let o = optoClasses[i]
        if(markPrimitives.includes(o)){
            sessionViews[0]['mark'] = o
        }

        if(o === 'color'){
            sessionViews[0]['encoding']['color'] = {
                field: "species",
                type: "nominal",
            }    
        }

        if(o === 'axis'){
            sessionViews[0]['encoding'][axes[axisCount % 3]] = {
                field: axisVars[axisCount % 3],
                type: "quantitative",
            }
            axisCount++;
        }
    }

    //let workspaceNames = props
    //TODO: Correct the way we generate the workspaces. 
    //Currently disconnected from dynamic user session, just defaults to first dataset
    let sessionWorkspaces : WorkspaceConfig[] = props.workspaces.map(function(workspace: any){
        let w : WorkspaceConfig = {
                title: workspace,
                data: props.datasets[0].name,
                views: sessionViews
        };
        return w
    })

    let sessionRoot : RootConfig = {
        datasets: sessionData,
        workspaces: sessionWorkspaces
    }
    //now we will have to "let varname : ConfigStructType[] = [props.etc]" and return
    // this will just be called as a simple function to return a dataset shaped appropriately.
    // the conversion into r3f happens in the interpreter. 
    //We want to use the cast spells returned from reducer to give us our config
    return sessionRoot;
}
