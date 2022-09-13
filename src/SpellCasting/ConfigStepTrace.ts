import { Config, Root, Data, Workspace, View, Layer, Mark, Encoding, Tooltip, Channel, Scale, Axis, Legend } from 'optomancy';
//This doesn't really use the type declarations, but it's useful to have them here as reference. 
//What this actually does is replicate JUST the addition each cast spell makes to the config.
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
export default function ConfigStepTrace(props: any){
    let config_steps : any[] = [];

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

    /*
    let axisVars = props.datasets.map(function(dataset : any){
        const unique = [...new Set(dataset.values.map((d: any)=>Array(Object.keys(d))))];
        return(unique);
    })
    // "axis"
    let axisVarTypes = props.datasets.map(function(dataset : any){
        let axisTypes = axisVars.map((varname: string) => isNaN(parseFloat(dataset.values[0][varname])) ? 'nominal' : 'quantitative');
        return(axisTypes);
    })
    */
    //for now, this is just going to stay zero. 
    let workspace_idx = 0;

    let axisCount = 0;
    let view_idx = 0;

    for(let i=0; i<optoClasses.length; i++){
        let o = optoClasses[i]
        if(markPrimitives.includes(o)){
            config_steps.push({
                'workspaces': [{
                    'views': [{
                        'mark': o
                    }]
                }]
            })
        }

        if(o === 'color'){
            config_steps.push({
                'workspaces': [{
                    'encoding': {
                        'color': {
                            field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                            type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                        }
                    }
                }]
            })
            axisCount++;
        }

        if(o === 'axis'){
            const axis_encoding = {
                'workspaces': [{'views': [{
                    'encoding': {}
                }]}]
            }


            axis_encoding['workspaces'][0]['views'][0]['encoding'][axes[axisCount % 3]] = {
                field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
            }
                    
            config_steps.push(axis_encoding)
            axisCount++;
        }

        if(o === 'view'){
            config_steps.push({
                'views': [{
                    'mark': 'point',
                    'encoding': {
                        'x': {
                            field: "species",
                            type: "nominal",
                        }    
                    }
                }]
            })

        }
    }
    const spell_page_steps = config_steps.map((page : any) => ({
        'code': JSON.stringify(page), //, null, "  "
        'language': 'javascript'
    }))
    return spell_page_steps;
}
