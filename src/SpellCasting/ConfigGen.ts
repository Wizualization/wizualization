import { Config, Root, Data, Workspace, View, Layer, Mark, Encoding, Tooltip, Channel, Scale, Axis, Legend } from 'optomancy';
import { ConfigType } from 'optomancy/dist/types';

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
export default function ConfigGen(props: any){
    //console.log(props)
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
    let sessionViews : ViewConfig[] = [{
        title: "The Iris Flower Dataset",
        mark: "point",
        encoding: {},
        width: 0.25,
        height: 0.25,
        depth: 0.25,
        x: 1,
        y: 5, 
        z: 1
    }];

    let optoClasses = props.matchedSpells.map((s : any) => s.optoClass)
    //console.log(optoClasses)
    
    let markPrimitives = ["line", "point", "bar", "column"]

    // "color"

    let axes = ['x', 'y', 'z']
    let axisVars = ['petalWidth', 'petalLength', 'sepalWidth']
    // "axis"
  
    let axisCount = 0;
    let workspace_idx = 0;
    let view_idx = 0;
    for(let i=0; i<optoClasses.length; i++){
        let o = optoClasses[i]
        if(markPrimitives.includes(o)){
            sessionViews[view_idx]['mark'] = o
        }

        if(o === 'color'){
            sessionViews[view_idx]['encoding']['color'] = {
                field: "species",
                type: "nominal",
            }    
        }

        if(o === 'axis'){
            sessionViews[view_idx]['encoding'][axes[axisCount % 3]] = {
                field: axisVars[axisCount % 3],
                type: "quantitative",
            }
            axisCount++;
        }

        if(o === 'view'){
            //logiiiic. we will probably need to add a list of views in this script.
            // We should be able to extract as unique sorted array of view indices prefixed with 'view_' given our naming scheme.
            // Then, use the indexOf instead of 0 in sessionViews[i]
            // Finally, in this condition check block here, we add another view. 
            // Also need to do this with workspaces.'
            // But for now, we just add to view_idx and push another sessionView.
            sessionViews = [...sessionViews, {
                title: "The Iris Flower Dataset",
                mark: "point",
                encoding: {},
                width: 0.25,
                height: 0.25,
                depth: 0.25,
                x: 1,
                y: 5, 
                z: 1
            }];
            view_idx++;
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

    let configRespose : ConfigType = Object(sessionRoot);
        
    //now we will have to "let varname : ConfigStructType[] = [props.etc]" and return
    // this will just be called as a simple function to return a dataset shaped appropriately.
    // the conversion into r3f happens in the interpreter. 
    //We want to use the cast spells returned from reducer to give us our config
    return configRespose;
}
