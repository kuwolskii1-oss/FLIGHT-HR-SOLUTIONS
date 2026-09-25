const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
const { chromium } = require('playwright');
const [,, base] = process.argv;
const isOpen = () => { const m = document.querySelector('.c-menu'); return !!m && getComputedStyle(m).visibility !== 'hidden' && getComputedStyle(m).display !== 'none'; };
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  // split lines present after fonts
  console.log('split lines:', await page.evaluate(() => document.querySelectorAll('.split-line').length), 'data-split:', await page.evaluate(() => document.querySelectorAll('[data-split]').length));
  // tab order at mobile width
  const order = [];
  for (let i = 0; i < 5; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => { const a = document.activeElement; return `${a.tagName.toLowerCase()}.${String(a.className).split(' ')[0]}[${(a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 16)}]`; })); }
  console.log('mobile tab order:', order.join(' > '));
  // skip link focuses main
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  console.log('skip link ->', await page.evaluate(() => `${document.activeElement.tagName.toLowerCase()}#${document.activeElement.id}`));
  // open menu via keyboard
  await page.focus('.c-header__burger'); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  const m1 = await page.evaluate((src) => { const isOpen = eval(src); const m = document.querySelector('.c-menu'); const b = document.querySelector('.c-header__burger'); return { open: isOpen(), role: m.getAttribute('role'), modal: m.getAttribute('aria-modal'), labelled: m.getAttribute('aria-labelledby') || m.getAttribute('aria-label'), expanded: b.getAttribute('aria-expanded'), focusIn: m.contains(document.activeElement), active: document.activeElement.tagName + ' ' + (document.activeElement.textContent || document.activeElement.getAttribute('aria-label') || '').trim().slice(0, 20), scrollLocked: getComputedStyle(document.documentElement).overflow + '/' + getComputedStyle(document.body).overflow, mainHidden: document.querySelector('main').getAttribute('aria-hidden') || document.querySelector('main').hasAttribute('inert') }; }, isOpen.toString());
  console.log('menu open (kbd):', JSON.stringify(m1));
  const inside = []; for (let i = 0; i < 22; i++) { await page.keyboard.press('Tab'); inside.push(await page.evaluate(() => document.querySelector('.c-menu').contains(document.activeElement) || document.activeElement === document.querySelector('.c-header__burger') || document.activeElement.closest('.c-header') !== null)); }
  console.log('focus stays in header/menu while open:', inside.every(Boolean), inside.filter(x => !x).length, 'escapes');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  console.log('after Escape:', await page.evaluate((src) => { const isOpen = eval(src); return JSON.stringify({ open: isOpen(), expanded: document.querySelector('.c-header__burger').getAttribute('aria-expanded'), focusOnBurger: document.activeElement === document.querySelector('.c-header__burger') }); }, isOpen.toString()));
  // open with tap, close by tapping the close button
  await page.tap('.c-header__burger'); await page.waitForTimeout(500);
  const closeBtn = await page.$('.c-menu__close, .c-header__burger[aria-expanded="true"]');
  console.log('open by tap:', await page.evaluate(isOpen), 'close control found:', !!closeBtn);
  if (closeBtn) { await closeBtn.tap(); await page.waitForTimeout(500); console.log('closed by tap:', !(await page.evaluate(isOpen))); }
  await page.screenshot({ path: __dirname + '/out/home-390-after-menu.png' });
  await ctx.close(); await browser.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
