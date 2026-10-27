/** Records the structure of a local engineering report. It cannot authenticate external execution. */
export function evaluateArtifact(text:string,topic:string):{pass:boolean;message:string}{
 const valid=text.trim().length>=90 && /\binput\b[\s\S]*\boutput\b[\s\S]*\bvalidation\b/i.test(text) && text.toLowerCase().includes(topic.toLowerCase());
 return valid?{pass:true,message:'The engineering journal has the required input, output, validation and topic. Its factual claims are self-reported, not independently code-executed.'}:{pass:false,message:`Write at least 90 characters. Include the topic “${topic}” and sections in order: input, output, validation.`};
}
