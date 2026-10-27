import type {Lesson,World,WorldId} from '../types';
import pythonJSON from './pythonLessons.json';
import sqlJSON from '../worlds/sql/lessons.json';
import pandasJSON from '../worlds/pandas/lessons.json';
import numpyJSON from '../worlds/numpy/lessons.json';
import mlJSON from '../worlds/machine-learning/lessons.json';
export const pythonLessons:Lesson[]=pythonJSON as Lesson[];
export const sqlLessons:Lesson[]=sqlJSON as Lesson[];
export const pandasLessons:Lesson[]=pandasJSON as Lesson[];
export const numpyLessons:Lesson[]=numpyJSON as Lesson[];
export const mlLessons:Lesson[]=mlJSON as Lesson[];
export const worldOrder:WorldId[]=['python','sql','pandas','numpy','ml'];
export const lessonsByWorld:Record<WorldId,Lesson[]>={python:pythonLessons,sql:sqlLessons,pandas:pandasLessons,numpy:numpyLessons,ml:mlLessons};
export const allLessons:Lesson[]=worldOrder.flatMap(w=>lessonsByWorld[w]);
export const worlds:World[]=[
 {id:'python',name:'Python City',tagline:'The language of computation',color:'#37b8ff',icon:'⌘',count:pythonLessons.length},
 {id:'sql',name:'SQL Underground',tagline:'Relationships beneath the surface',color:'#c08bff',icon:'▤',count:sqlLessons.length},
 {id:'pandas',name:'Pandas Analytics Lab',tagline:'Turn disorder into insight',color:'#ffce70',icon:'▦',count:pandasLessons.length},
 {id:'numpy',name:'NumPy Matrix Dimension',tagline:'Explore the shape of numbers',color:'#63e0c5',icon:'⧉',count:numpyLessons.length},
 {id:'ml',name:'Machine Learning Nexus',tagline:'Learn from patterns in data',color:'#ff88ac',icon:'✳',count:mlLessons.length},
];
export const getWorld=(id:WorldId)=>worlds.find(w=>w.id===id);
export const getLesson=(id:string)=>allLessons.find(l=>l.id===id);
export const guidedSteps=(lesson:Lesson):string[]=>[
 `Inspect the ${lesson.title.toLowerCase()} example, then predict its outcome.`,
 ...lesson.explanation,
 `Expected concept: ${lesson.expected.replace(/\n/g,' / ')}.`,
 'Guided illustration only; execute complete examples in your local environment for independent confirmation.'
];
