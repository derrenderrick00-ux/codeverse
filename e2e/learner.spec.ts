import {test,expect} from '@playwright/test';
test('navigate all eight screens, inspect and run variables',async({page})=>{
 await page.goto('/');await expect(page.getByText('Watch it become reality.')).toBeVisible();
 await page.getByRole('link',{name:/Enter Mission Control/i}).click();await expect(page.getByText('Your journey starts')).toBeVisible();
 await page.getByRole('link',{name:'World Atlas'}).click();await expect(page.getByText('Choose your')).toBeVisible();
 await page.getByRole('link',{name:/Python City/}).last().click();await expect(page.getByText('Variables').first()).toBeVisible();
 await page.getByRole('link',{name:/Variables/}).first().click();await expect(page.getByText('EXECUTION LABORATORY')).toBeVisible();
 await page.getByRole('button',{name:'Next step'}).click();await page.getByRole('button',{name:'Next step'}).click();
 await page.getByRole('button',{name:'Next step'}).click();await page.getByRole('button',{name:'Next step'}).click();
 await page.getByRole('button',{name:'Run subset'}).click();await page.getByRole('button',{name:'Next step',exact:false}).last().click();
 await page.goto('/challenge/py-01');await expect(page.getByText('Prove your')).toBeVisible();
 await page.goto('/workshop');await expect(page.getByRole('button',{name:'Run project checks'})).toBeVisible();
 await page.goto('/progress');await expect(page.getByRole('button',{name:'Export JSON'})).toBeVisible();
});
