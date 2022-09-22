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
    let axis_dim_count = 0;
    //let axisVars = ['petalWidth', 'petalLength', 'sepalWidth']
    let axisVars = props.datasets.map(function(dataset : any){
        const unique = [...new Set(...dataset.values.map((d: any)=>Array(Object.keys(d))))][0];
        return(unique);
    });
    // "axis"
    let axisVarTypes = [];
    for(let i = 0; i < axisVars.length; i++){
        let types = axisVars[i].map(function(varname: string){
            return isNaN(Number(props.datasets[i].values[0][varname])) ? 'nominal' : 'quantitative'
        })
        axisVarTypes.push(types);
    }

    let nominalAxisVars:any[] = [];
    let quantitativeAxisVars:any[] = [];

    for(let i = 0; i < axisVars.length; i++){
        nominalAxisVars[i] = [];
        quantitativeAxisVars[i] = [];
        for(let j = 0; j < axisVars[i].length; j++){
            if(axisVarTypes[i][j] === 'nominal'){
                nominalAxisVars[i].push(axisVars[i][j]);
            } else {
                quantitativeAxisVars[i].push(axisVars[i][j]);
            }
    
        }
    }

    //for now, this is just going to stay zero. 
    let workspace_idx = 0;

    let axisCount = 0;
    let view_idx = 0;
    let nominalAxisCount = 0;
    let quantitativeAxisCount = 0;
    
    let barChartCheck = false;

    for(let i=0; i<optoClasses.length; i++){
        let o = optoClasses[i]
        if(markPrimitives.includes(o)){
            config_steps.push({'CLASS': o, 'BLOCK':{
                'workspaces': [{
                    'views': [{
                        'mark': o
                    }]
                }]
            }})
            if(o === 'bar' || o === 'column'){
                barChartCheck = true;
            } else {
                barChartCheck = false;
            }

        }

        if(o === 'color'){
            config_steps.push({'CLASS': o, 'BLOCK':{
                'workspaces': [{
                    'views': [{
                        'encoding': {
                            'color': {
                                field: nominalAxisVars[workspace_idx % props.datasets.length][nominalAxisCount % nominalAxisVars[workspace_idx].length],
                                type: 'nominal'
                                //may someday want to change these back
                                //field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                                //type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                            }
                        }
                    }]
                }]
            }})
            nominalAxisCount++;
        }

        /*
        if(o === 'axis'){
            const axis_encoding = {
                'workspaces': [{
                        'views': [{
                        'encoding': {}
                    }]
                }]
            }


            axis_encoding['workspaces'][0]['views'][0]['encoding'][axes[axis_dim_count % 3]] = {
                field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
            }
            if(axisCount > 0 && (axisCount % 3 === 0)){
                axis_dim_count=1;
            } else {
                axis_dim_count++;
            }                    
            config_steps.push({'CLASS': o, 'BLOCK':axis_encoding})
            axisCount++;
        }
        }
        */
        if(o === 'view'){
            config_steps.push({'CLASS': o, 'BLOCK':{
                'views': [{
                    'mark': 'point',
                    'encoding': {
                        'x': {
                            field: axisVars[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                            type: axisVarTypes[workspace_idx % props.datasets.length][axisCount % axisVars[workspace_idx].length],
                        }    
                    }
                }]
            }})
            axis_dim_count=1;            
            axisCount++;
            view_idx++;
        }
        

        if(o === 'axis' && barChartCheck){
            const axis_encoding = {
                'workspaces': [{
                        'views': [{
                        'encoding': {}
                    }]
                }]
            }


            axis_encoding['workspaces'][0]['views'][0]['encoding'][axes[axis_dim_count % 3]] = {
                field: nominalAxisVars[workspace_idx % props.datasets.length][nominalAxisCount % nominalAxisVars[workspace_idx].length],
                type: 'nominal',
            }
            if(axisCount > 0 && (axisCount % 3 === 0)){
                axis_dim_count=1;
            } else {
                axis_dim_count++;
            }                    
            config_steps.push({'CLASS': o, 'BLOCK':axis_encoding})
            nominalAxisCount++;
            barChartCheck = false;
            continue;
        }

        if(o === 'axis' && !barChartCheck){
            const axis_encoding = {
                'workspaces': [{
                        'views': [{
                        'encoding': {}
                    }]
                }]
            }


            axis_encoding['workspaces'][0]['views'][0]['encoding'][axes[axis_dim_count % 3]] = {
                field: quantitativeAxisVars[workspace_idx % props.datasets.length][quantitativeAxisCount % quantitativeAxisVars[workspace_idx].length],
                type: 'quantitative',
            }
            if(quantitativeAxisCount > 0 && (quantitativeAxisCount % 3 === 0)){
                axis_dim_count=1;
            } else {
                axis_dim_count++;
            }                    
            config_steps.push({'CLASS': o, 'BLOCK':axis_encoding})
            quantitativeAxisCount++;
            continue;
        }

    }


    const spell_page_steps = config_steps.map((page : any) => ({
        'code': JSON.stringify(page.BLOCK, null, " "), //, null, "  "
        'language': 'javascript',
        'optoClass': page.CLASS
    }))
    return spell_page_steps;
}
