import type { Lesson, World, WorldId } from '../types';
import pythonJSON from './pythonLessons.json';
export const pythonLessons:Lesson[] = pythonJSON as Lesson[];
export const worlds:World[] = [
  {id:'python',name:'Python City',tagline:'The language of computation',color:'#37b8ff',icon:'⌘',count:21},
  {id:'sql',name:'SQL Underground',tagline:'Relationships beneath the surface',color:'#c08bff',icon:'▤',count:24},
  {id:'pandas',name:'Pandas Analytics Lab',tagline:'Turn disorder into insight',color:'#ffce70',icon:'▦',count:25},
  {id:'numpy',name:'NumPy Matrix Dimension',tagline:'Explore the shape of numbers',color:'#63e0c5',icon:'⧉',count:24},
  {id:'ml',name:'Machine Learning Nexus',tagline:'Learn from patterns in data',color:'#ff88ac',icon:'✳',count:0},
];
export const getWorld=(id:WorldId)=>worlds.find(w=>w.id===id);
export const getLesson=(id:string)=>pythonLessons.find(l=>l.id===id);
export const guidedSteps=(lesson:Lesson):string[] => [
  `Input: inspect the ${lesson.title.toLowerCase()} example and predict its outcome.`,
  ...lesson.explanation,
  `Expected output: ${lesson.expected.replace(/\n/g,' / ')}.`,
  'Guided illustration only. For authentic execution, run this example in local Python 3.'
];
