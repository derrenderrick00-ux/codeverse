import CodeMirror from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
export function CodePanel({code,onChange,readOnly=false,language='python'}:{code:string;onChange:(value:string)=>void;readOnly?:boolean;language?:'python'|'shell'}){
 return <div className="code-surface"><div className="panel-title"><span className="pill-dot"/> {language==='shell'?'setup.sh':'main.py'} <span className="muted">{readOnly?'guided reference':language==='shell'?'editable · Ubuntu shell instructions':'editable · Python subset'}</span></div>
 <CodeMirror value={code} extensions={language==='python'?[python()]:[]} theme="dark" editable={!readOnly} onChange={onChange} basicSetup={{lineNumbers:true,foldGutter:false,highlightActiveLine:true}} height="220px" />
 </div>;
}
