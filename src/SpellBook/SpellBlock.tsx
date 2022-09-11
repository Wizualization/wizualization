//This is really just a mesh wrapper that is necessary for grabbing, scaling.
import SpellCode from './SpellCode';
//pass block position, code, and language params as props
const SpellBlock = (props : any) => {
    //console.log(props)
    const size = 0.1;
return (
      <mesh scale={size}>
          <SpellCode code={props.code} language={props.language} />
      </mesh>
    )
  }

export { SpellBlock };
