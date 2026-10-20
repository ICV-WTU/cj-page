# Jun Cheng's Academic Homepage

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
