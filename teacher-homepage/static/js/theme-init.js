// 提前应用主题，避免页面加载时闪现白色。
(() => {
  // 基础配置：指定页面根元素、可选主题和默认自定义颜色。
  const root = document.documentElement;
  const modes = ['system', 'light', 'dark', 'blue', 'teal', 'green', 'purple', 'orange', 'custom'];
  const defaults = { background: '#e6effa', text: '#3f454f', link: '#205fa5' };

  // 颜色处理：校验和解析颜色，完成 RGB 拆分、颜色混合及亮度计算。
  const normalizeColors = (value, fallback = defaults) => Object.fromEntries(
    Object.keys(defaults).map((key) => [key,
      typeof value?.[key] === 'string' && /^#[0-9a-f]{6}$/i.test(value[key])
        ? value[key].toLowerCase() : fallback[key],
    ]),
  );
  const readColors = (value) => {
    try { return normalizeColors(JSON.parse(value)); } catch { return { ...defaults }; }
  };
  const channels = (hex) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  const mix = (base, tint, amount) => {
    const a = channels(base), b = channels(tint);
    return '#' + a.map((value, index) => Math.round(value * (1 - amount) + b[index] * amount).toString(16).padStart(2, '0')).join('');
  };
  const luminance = (hex) => channels(hex).map((value) => {
    const s = value / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);

  // 设置恢复：检测系统深浅色，并读取浏览器中保存的主题和自定义颜色。
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let preference = 'system';
  let customColors = { ...defaults };
  try {
    const saved = localStorage.getItem('teacher-homepage-theme');
    if (modes.includes(saved)) preference = saved;
    customColors = readColors(localStorage.getItem('teacher-homepage-custom-colors'));
  } catch {}

  // 主题应用：生成配色变量，设置页面实际主题，并通知主题面板更新。
  const applyColors = () => {
    const { background, text, link } = customColors;
    const properties = {
      background, ink: text, link,
      nav: mix(background, text, 0.04),
      line: mix(background, text, 0.2),
      muted: mix(text, background, 0.22),
      scheme: luminance(background) < 0.179 ? 'dark' : 'light',
      'on-accent': luminance(link) > 0.179 ? '#000000' : '#ffffff',
    };
    Object.entries(properties).forEach(([name, value]) => root.style.setProperty(`--custom-${name}`, value));
  };
  const apply = (value) => {
    preference = modes.includes(value) ? value : 'system';
    root.dataset.themePreference = preference;
    root.dataset.theme = preference === 'system' ? (media?.matches ? 'dark' : 'light') : preference;
    document.dispatchEvent(new Event('homepage-theme-change'));
  };

  // 对外接口：供 main.js 读取、修改、重置和保存主题设置。
  window.homepageTheme = {
    get preference() { return preference; },
    get customColors() { return { ...customColors }; },
    setCustomColors(value) {
      customColors = normalizeColors(value, customColors);
      applyColors();
      try { localStorage.setItem('teacher-homepage-custom-colors', JSON.stringify(customColors)); } catch {}
      document.dispatchEvent(new Event('homepage-theme-change'));
    },
    resetCustomColors() { this.setCustomColors(defaults); },
    setPreference(value) {
      apply(value);
      try { localStorage.setItem('teacher-homepage-theme', preference); } catch {}
    },
  };

  // 初始化与系统监听：首次加载时应用主题，选择“跟随系统”时随系统切换。
  applyColors();
  apply(preference);
  const followSystem = () => { if (preference === 'system') apply('system'); };
  if (media?.addEventListener) media.addEventListener('change', followSystem);
  else if (media?.addListener) media.addListener(followSystem);

  // 多标签页同步：其他标签页更改或清空主题设置时，同步当前页面。
  window.addEventListener('storage', (event) => {
    if (event.key === 'teacher-homepage-custom-colors' || event.key === null) {
      customColors = readColors(event.newValue);
      applyColors();
      document.dispatchEvent(new Event('homepage-theme-change'));
    }
    if (event.key === 'teacher-homepage-theme' || event.key === null) apply(event.newValue);
  });
})();
