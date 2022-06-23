import { Suspense } from 'react';
import { VRHtml } from './VRHtml'
import Prism from "prismjs";
import './prism.min.css';

const SpellCode = ({ code, language } : any) => {
  const hidden = false;

  const highlightedText = Prism.highlight(code, Prism.languages[language], language);
  return (
    <Suspense fallback={<></>}>
    <VRHtml width={2} height={2}
    style={{
      transition: 'all 0.2s',
      opacity: hidden ? 0 : 1,
      transform: `scale(${hidden ? 2 : 1})`
    }}
    distanceFactor={1.5}
    position={[0, 0, 0.51]}
    transform
    occlude
  >

    <div className="Code"        
      style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "100px",
          margin: "1px",
          backgroundColor: 'white',
        }}
    >
      <div dangerouslySetInnerHTML={{__html: highlightedText}}></div>
    </div>
    </VRHtml>
    </Suspense>
  );
}

export default SpellCode;