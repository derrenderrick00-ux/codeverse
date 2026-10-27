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
