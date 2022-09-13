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
        y: 0, 
        z: 1
    }];

    let optoClasses = props.matchedSpells.map((s : any) => s.optoClass)
    //console.log(optoClasses)
    
    let markPrimitives = ["line", "point", "bar", "column"]

    // "color"

    let axes = ['x', 'y', 'z']
    //let axisVars = ['petalWidth', 'petalLength', 'sepalWidth']
    let axisVars = props.datasets.map(function(dataset : any){
        const unique = [...new Set(...dataset.values.map((d: any)=>Array(Object.keys(d))))][0];
        return(unique);
    });
    // "axis"
    let axisVarTypes = [];
    for(let i = 0; i < axisVars.length; i++){
        let types = axisVars[i].map(function(varname: string){
            return isNaN(parseFloat(props.datasets[i].values[0][varname])) ? 'nominal' : 'quantitative'
        })
        axisVarTypes.push(types);
    }
    //for now, this is just going to stay zero. 
    let workspace_idx = 0;

    let axisCount = 0;
    let view_idx = 0;

    for(let i=0; i<optoClasses.length; i++){
        let o = optoClasses[i]
        if(markPrimitives.includes(o)){
            sessionViews[view_idx]['mark'] = o
        }

        if(o === 'color'){
            sessionViews[view_idx]['encoding']['color'] = {
                field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
            }    
            axisCount++;
        }

        if(o === 'axis'){
            if(axisCount > 0 && (axisCount % 3 === 0)){
                sessionViews = [...sessionViews, {
                    title: "The Iris Flower Dataset",
                    mark: "point",
                    encoding: {
                        x: {
                            field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                            type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                        }
                    },
                    width: 0.25,
                    height: 0.25,
                    depth: 0.25,
                    x: 1+(0.375*view_idx),
                    y: 0-(1.5*view_idx), 
                    z: 1-(0.375*workspace_idx)
                }];
                view_idx++;
    
            } else {
                sessionViews[view_idx]['encoding'][axes[axisCount % 3]] = {
                    field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                    type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                }
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
                encoding: {
                    x: {
                        field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                        type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                    }
                },
                width: 0.25,
                height: 0.25,
                depth: 0.25,
                x: 1+(0.375*view_idx),
                y: 4-(1.5*view_idx), 
                z: 1-(0.375*workspace_idx)
            }];
            axisCount++;                    
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
