function Interpreter(props:any) {
        console.log(props);
      //useFrame((state) => {      })
  
      return (
        <p>{props.gesture +' '+ props.words}</p>
      )
  }
  
  export default Interpreter;
  