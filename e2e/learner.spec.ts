import {test,expect} from '@playwright/test';

test('new learner cannot skip lessons or nine learning checkpoints',async({page})=>{
 await page.goto('/lesson/py-02');
 await expect(page.getByRole('heading',{name:'Mission locked'})).toBeVisible();
 await page.goto('/lesson/sql-01');
 await expect(page.getByRole('heading',{name:'Mission locked'})).toBeVisible();
 await page.goto('/lesson/py-01');
 await expect(page.getByRole('heading',{name:'Variables.'})).toBeVisible();
 await expect(page.getByRole('tab',{name:/2 Definitions/})).toBeDisabled();
 await page.getByRole('button',{name:/Complete & continue/}).click();
 await expect(page.getByRole('heading',{name:'Definitions'})).toBeVisible();
 await expect(page.getByRole('tab',{name:/3 Explanation/})).toBeDisabled();
 await page.reload();
 await expect(page.getByRole('heading',{name:'Definitions'})).toBeVisible();
 await expect(page.getByText('1/9 checkpoints completed')).toBeVisible();
});

test('workshop correctly accepts inline comments in Python calculations',async({page})=>{
 await page.goto('/workshop');
 await expect(page.getByRole('button',{name:'Run project checks'})).toBeVisible();
 const editor=page.locator('.cm-content[contenteditable="true"]');
 await editor.click();
 await page.keyboard.press('ControlOrMeta+A');
 await page.keyboard.insertText('name = "Derrick"\nuniversity = "DeKUT"\ncourse = "Computer Science"\nyear = 1\ncompleted = 7\npending = 3\ntotal = completed + pending # comment\npercentage = 100 * completed / total # percentage\nprint(name)\nprint(university)\nprint(course)\nprint(percentage)');
 await page.getByRole('button',{name:'Run project checks'}).click();
 await expect(page.getByText(/Correct: required variables/)).toBeVisible();
 await page.reload();
 await expect(page.locator('.cm-content')).toContainText('total = completed + pending');
});

test('five world maps exist and SQL stage is sequentially locked',async({page})=>{
 await page.goto('/atlas');
 for(const name of ['Python City','SQL Underground','Pandas Analytics Lab','NumPy Matrix Dimension','Machine Learning Nexus'])await expect(page.getByRole('heading',{name})).toBeVisible();
 await page.goto('/world/sql');
 await expect(page.getByText(/0\/24 mastered/)).toBeVisible();
 await expect(page.locator('[aria-label="SELECT locked"]')).toBeVisible();
 await page.goto('/progress');
 await expect(page.getByRole('button',{name:'Export JSON'})).toBeVisible();
});


test('passing the workshop milestone returns to the next unlocked learning step',async({page})=>{
 await page.goto('/workshop');
 const editor=page.locator('.cm-content[contenteditable="true"]');
 await editor.click();
 await page.keyboard.press('ControlOrMeta+A');
 await page.keyboard.insertText('name = "Derrick"\nuniversity = "DeKUT"\ncourse = "Computer Science"\nyear = 1\ncompleted = 7\npending = 3\ntotal = completed + pending # inline comment\npercentage = 100 * completed / total\nprint(name)\nprint(university)\nprint(course)\nprint(percentage)');
 await page.getByRole('button',{name:'Run project checks'}).click();
 await expect(page).toHaveURL(/\/lesson\/py-01\?step=1&milestone=complete/);
 await expect(page.getByText(/Milestone validated! Welcome back/)).toBeVisible();
});

test('mastered lessons permit exploration without changing stored progress',async({page})=>{
 await page.goto('/lesson/py-01');
 const before=await page.evaluate(async()=>{
  const nine=Array.from({length:9},(_,i)=>i+1);
  const p={visited:nine,completedSteps:nine,simulationPassed:true,quizPassed:true,predictPassed:true,repairPassed:true,buildPassed:true,projectDone:true,mainDone:true,attempts:2,bestScore:100,lastScore:100,hintsUsed:0,savedCode:'x = 10\nprint(x)',projectCode:'baseline',updatedAt:new Date().toISOString()};
  await new Promise<void>((resolve,reject)=>{const request=indexedDB.open('CODEVERSE_DB',1);request.onsuccess=()=>{const db=request.result;const tx=db.transaction('settings','readwrite');tx.objectStore('settings').put({'py-01':p},'codeverse-progress-v2');tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)};request.onerror=()=>reject(request.error)});
  return p;
 });
 await page.reload();
 await expect(page.getByText(/Review mode · this lesson is already mastered/)).toBeVisible();
 await expect(page.getByRole('tab',{name:/9 Study Intelligence/})).toBeEnabled();
 await page.getByRole('button',{name:/Review next step/}).click();
 await page.goto('/workshop');
 await expect(page.getByText(/Review mode · project checks still work/)).toBeVisible();
 await page.getByRole('button',{name:'Restore starter'}).click();
 const after=await page.evaluate(async()=>{return await new Promise<any>((resolve,reject)=>{const request=indexedDB.open('CODEVERSE_DB',1);request.onsuccess=()=>{const db=request.result;const tx=db.transaction('settings','readonly');const get=tx.objectStore('settings').get('codeverse-progress-v2');get.onsuccess=()=>resolve(get.result['py-01']);get.onerror=()=>reject(get.error)};request.onerror=()=>reject(request.error)})});
 expect(after).toEqual(before);
});

test('challenge hints scaffold without disclosing the correct multiple choice text',async({page})=>{
 await page.goto('/challenge/py-01');
 await page.getByRole('button',{name:'Request a hint'}).click();
 await expect(page.getByText(/Hint 1\/3 · No answers revealed/)).toBeVisible();
 await page.getByRole('button',{name:'Another hint'}).click();
 await expect(page.getByText(/Hint 2\/3 · No answers revealed/)).toBeVisible();
});
