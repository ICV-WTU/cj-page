// 两种语言分别写在静态 HTML 中；本脚本只处理主题和视频播放。
(() => {
  // 基础配置：获取主题面板相关元素，并确定当前页面语言。
  const themeButton = document.getElementById('theme-button');
  const themePicker = document.getElementById('theme-picker');
  const themePanel = document.getElementById('theme-panel');
  const themeStatus = document.getElementById('theme-status');
  const themeOptions = document.querySelectorAll('[data-theme-option]');
  const customControls = document.getElementById('theme-custom-controls');
  const resetButton = document.getElementById('theme-reset');
  const colorInputs = document.querySelectorAll('[data-custom-color]');
  const language = document.documentElement.lang === 'en' ? 'en' : 'zh';

  if (themeButton && themePanel && window.homepageTheme) {
    // 面板控制：打开或关闭主题面板，同时更新展开状态和键盘焦点。
    const closePanel = (returnFocus = false) => {
      themePanel.hidden = true;
      themeButton.setAttribute('aria-expanded', 'false');
      if (returnFocus) themeButton.focus();
    };
    const openPanel = () => {
      themePanel.hidden = false;
      themeButton.setAttribute('aria-expanded', 'true');
      Array.from(themeOptions).find((option) => option.checked)?.focus();
    };

    // 界面同步：根据当前主题更新选中项、自定义颜色控件和中英文状态文字。
    const syncTheme = () => {
      const mode = window.homepageTheme.preference;
      const dark = document.documentElement.dataset.theme === 'dark';
      themeOptions.forEach((option) => { option.checked = option.value === mode; });
      const names = language === 'zh'
        ? { system: '跟随系统', light: '浅色', dark: '深色', blue: '蓝色', teal: '青色', green: '绿色', purple: '紫色', orange: '橙色', custom: '自定义' }
        : { system: 'System', light: 'Light', dark: 'Dark', blue: 'Blue', teal: 'Teal', green: 'Green', purple: 'Purple', orange: 'Orange', custom: 'Custom' };
      if (customControls) customControls.hidden = mode !== 'custom';
      if (resetButton) resetButton.hidden = mode !== 'custom';
      const colors = window.homepageTheme.customColors;
      colorInputs.forEach((input) => {
        const key = input.dataset.customColor;
        input.value = colors[key];
        const output = document.getElementById(`theme-color-${key}-value`);
        if (output) output.textContent = colors[key].toUpperCase();
      });
      if (themeStatus) themeStatus.textContent = language === 'zh'
        ? `当前主题：${names[mode]}${mode === 'system' ? `（${dark ? '深色' : '浅色'}）` : ''}`
        : `Theme: ${names[mode]}${mode === 'system' ? ` (${dark ? 'dark' : 'light'})` : ''}`;
    };

    // 主题入口：启用主题按钮，支持点击切换面板及按向下箭头打开面板。
    themeButton.disabled = false;
    themeButton.addEventListener('click', () => {
      if (themePanel.hidden) openPanel();
      else closePanel();
    });
    themeButton.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        openPanel();
      }
    });

    // 设置修改：将主题选择、颜色调整和重置操作交给 homepageTheme 处理。
    themeOptions.forEach((option) => option.addEventListener('change', () => {
      if (option.checked) window.homepageTheme.setPreference(option.value);
    }));
    colorInputs.forEach((input) => input.addEventListener('input', () => {
      window.homepageTheme.setCustomColors({ [input.dataset.customColor]: input.value });
    }));
    resetButton?.addEventListener('click', () => window.homepageTheme.resetCustomColors());

    // 关闭交互：通过关闭或完成按钮、Esc、点击外部或焦点移出收起面板。
    ['theme-close', 'theme-done'].forEach((id) => {
      document.getElementById(id)?.addEventListener('click', () => closePanel(true));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !event.defaultPrevented && !themePanel.hidden) {
        event.preventDefault();
        closePanel(true);
      }
    });
    document.addEventListener('click', (event) => {
      if (!themePanel.hidden && !themePicker.contains(event.target)) closePanel();
    });
    themePicker?.addEventListener('focusout', (event) => {
      if (event.relatedTarget && !themePicker.contains(event.relatedTarget)) closePanel();
    });

    // 同步初始化：监听主题变化，并在页面加载时同步一次面板内容。
    document.addEventListener('homepage-theme-change', syncTheme);
    syncTheme();
  }

  // 视频预览：匹配内嵌视频数据并尝试静音自动播放，播放失败时提供控件或错误提示。
  // 内嵌数据通过普通 JS 文件读取，不依赖本地 file:// 视频流请求。
  document.querySelectorAll('.publication-media video').forEach((video) => {
    const placeholder = video.parentElement.querySelector('.publication-video-placeholder');
    const sourcePaths = [video.getAttribute('src'), ...Array.from(video.querySelectorAll('source[src]'), (source) => source.getAttribute('src'))].filter(Boolean);
    if (sourcePaths.length === 0) return;
    const embeddedVideos = window.teacherPreviewVideos || {};
    const embeddedName = Object.keys(embeddedVideos).find((name) => sourcePaths.some((url) => url.split('?')[0].endsWith(`/${name}`)));
    if (embeddedName && video.canPlayType('video/webm; codecs="vp8"')) {
      video.src = embeddedVideos[embeddedName];
      video.dataset.embeddedPreview = 'true';
    }
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.hidden = false;
    placeholder.hidden = true;
    video.addEventListener('error', () => {
      video.hidden = true;
      placeholder.hidden = false;
      const message = video.error?.code === 4
        ? '此预览器不支持该视频，请用浏览器打开'
        : video.error?.code === 2
          ? '视频读取失败，请用 Live Server 打开'
          : '视频解码失败，请用浏览器打开';
      placeholder.querySelector('.publication-video-message').textContent = message;
    });
    const startPlayback = () => {
      const attempt = video.play();
      if (attempt) attempt.catch(() => { video.controls = true; });
    };
    video.addEventListener('loadeddata', startPlayback, { once: true });
    video.load();
    startPlayback();
  });
})();
