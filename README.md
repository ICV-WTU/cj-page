# Jun Cheng's Academic Homepage

[中文](#中文) | [English](#english)

<a id="中文"></a>

## 项目简介

这是程君的个人学术主页，使用原生 HTML、CSS 和 JavaScript 构建，无需安装依赖或构建工具。

主页支持中文/英文切换、浅色/深色模式，并展示个人简介、教育与工作经历、代表性论文、科研项目和社会兼职。

**在线访问：** <https://icv-wtu.github.io/cj-page/>

## 本地预览

直接在浏览器中打开 `index.html` 即可预览。头像文件 `photo.jpg` 与 HTML 文件放在同一目录。

## 更新主页内容

- 页面结构、样式、双语文本和论文链接均维护在 `index.html` 中。
- 语言文本位于文件底部 JavaScript 中的 `translations.zh` 和 `translations.en` 对象。
- 添加论文时，更新论文列表中的条目及对应的中英文翻译；将文章链接占位地址 `#` 替换为论文网页地址。
- 替换头像时，使用同名文件 `photo.jpg` 覆盖原头像。

## GitHub Pages 部署

网站从仓库的 `gh-pages` 分支根目录发布。更新页面后，将 `index.html` 和 `photo.jpg` 推送到 `gh-pages` 分支；README 等项目说明文件放在 `main` 分支。

---

<a id="english"></a>

## Overview

This is Jun Cheng's academic homepage, built with plain HTML, CSS, and JavaScript. No dependencies or build tools are required.

The site supports Chinese/English language switching and light/dark themes. It presents a biography, education and experience, selected publications, research projects, and professional service.

**Live site:** <https://icv-wtu.github.io/cj-page/>

## Preview locally

Open `index.html` in a web browser. Keep the profile image, `photo.jpg`, in the same directory as the HTML file.

## Updating the site

- The page structure, styles, bilingual content, and publication links are maintained in `index.html`.
- Translation strings are in the `translations.zh` and `translations.en` objects near the bottom of the file.
- When adding a publication, update the list item and both language entries. Replace the `#` link placeholder with the publication URL.
- To replace the profile image, overwrite `photo.jpg` with the new image using the same filename.

## GitHub Pages deployment

The website is published from the root of the repository's `gh-pages` branch. Push `index.html` and `photo.jpg` to that branch to update the site; keep project documentation such as this README on the `main` branch.
