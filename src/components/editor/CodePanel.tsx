import CodeMirror from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
export function CodePanel({code,onChange,readOnly=false}:{code:string;onChange:(value:string)=>void;readOnly?:boolean}){
 return <div className="code-surface"><div className="panel-title"><span className="pill-dot"/> main.py <span className="muted">{readOnly?'guided reference':'editable · Python subset'}</span></div>
 <CodeMirror value={code} extensions={[python()]} theme="dark" editable={!readOnly} onChange={onChange} basicSetup={{lineNumbers:true,foldGutter:false,highlightActiveLine:true}} height="220px" />
 </div>;
}
