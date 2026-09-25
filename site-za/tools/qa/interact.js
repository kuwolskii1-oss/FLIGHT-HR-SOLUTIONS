// Header and menu with the keyboard and by tap: dropdowns (open, Escape, outside click), the mobile
// panel (focus trap, Escape, close), skip link, accordion in the menu. Usage: node interact.js <base>
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
const { chromium } = require('playwright');
const [,, base] = process.argv;
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  // Desktop dropdowns
  let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
  console.log('skip link ->', await page.evaluate(() => `${document.activeElement.tagName.toLowerCase()}#${document.activeElement.id}`));
  await page.focus('.c-navgroup__toggle'); await page.keyboard.press('Enter'); await page.waitForTimeout(350);
  const dd = await page.evaluate(() => { const b = document.querySelector('.c-navgroup__toggle'); const d = document.querySelector('.c-dropdown'); return { expanded: b.getAttribute('aria-expanded'), open: d.classList.contains('is-open'), opacity: getComputedStyle(d).opacity, links: d.querySelectorAll('a').length, tabbable: [...d.querySelectorAll('a')].filter(a => a.tabIndex >= 0).length }; });
  console.log('dropdown open (kbd):', JSON.stringify(dd));
  await page.keyboard.press('Tab'); await page.waitForTimeout(100);
  console.log('tab into dropdown ->', await page.evaluate(() => document.activeElement.textContent.trim().slice(0, 40)));
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  console.log('after Escape:', await page.evaluate(() => ({ open: document.querySelector('.c-dropdown').classList.contains('is-open'), focus: document.activeElement.className })));
  await page.hover('.c-navgroup:nth-child(2) .c-navlink'); await page.waitForTimeout(400);
  console.log('hover opens second:', await page.evaluate(() => document.querySelectorAll('.c-dropdown.is-open').length));
  await page.mouse.click(700, 600); await page.waitForTimeout(300);
  console.log('outside click closes:', await page.evaluate(() => document.querySelectorAll('.c-dropdown.is-open').length === 0));
  await page.screenshot({ path: __dirname + '/out/header-1440.png' });
  await ctx.close();
  // Mobile panel
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  const order = [];
  for (let i = 0; i < 5; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => { const a = document.activeElement; return `${a.tagName.toLowerCase()}.${String(a.className).split(' ')[0]}[${(a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 16)}]`; })); }
  console.log('mobile tab order:', order.join(' > '));
  await page.focus('.c-header__burger'); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  const isOpen = () => { const m = document.querySelector('.c-menu'); return !!m && !m.hidden && getComputedStyle(m).opacity === '1'; };
  const m1 = await page.evaluate((src) => { const isOpen = eval(src); const m = document.querySelector('.c-menu'); const b = document.querySelector('.c-header__burger'); return { open: isOpen(), role: m.getAttribute('role'), modal: m.getAttribute('aria-modal'), label: m.getAttribute('aria-label'), expanded: b.getAttribute('aria-expanded'), focusIn: m.contains(document.activeElement), active: (document.activeElement.textContent || document.activeElement.getAttribute('aria-label') || '').trim().slice(0, 20), scrollLocked: getComputedStyle(document.documentElement).overflow }; }, isOpen.toString());
  console.log('menu open (kbd):', JSON.stringify(m1));
  const inside = []; for (let i = 0; i < 30; i++) { await page.keyboard.press('Tab'); inside.push(await page.evaluate(() => document.querySelector('.c-menu').contains(document.activeElement) || document.activeElement.closest('.c-header') !== null)); }
  console.log('focus stays in header/menu while open:', inside.every(Boolean), inside.filter(x => !x).length, 'escapes');
  // accordion in the menu
  await page.click('.c-menu__toggle'); await page.waitForTimeout(350);
  console.log('menu accordion:', await page.evaluate(() => { const li = document.querySelector('.c-menu__item'); const sub = li.querySelector('.c-menu__sub a'); return { open: li.getAttribute('data-open'), subVisible: sub.getBoundingClientRect().height > 0 && getComputedStyle(li.querySelector('.t-acc-panel-inner')).opacity === '1', tabbable: sub.tabIndex >= 0 }; }));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  console.log('after Escape:', await page.evaluate((src) => { const isOpen = eval(src); return JSON.stringify({ open: isOpen(), expanded: document.querySelector('.c-header__burger').getAttribute('aria-expanded'), focusOnBurger: document.activeElement === document.querySelector('.c-header__burger') }); }, isOpen.toString()));
  await page.tap('.c-header__burger'); await page.waitForTimeout(500);
  console.log('open by tap:', await page.evaluate(isOpen));
  await page.screenshot({ path: __dirname + '/out/menu-390.png' });
  await page.tap('.c-header__burger'); await page.waitForTimeout(500);
  console.log('closed by tap:', !(await page.evaluate(isOpen)));
  await ctx.close(); await browser.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
