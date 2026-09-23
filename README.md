# Yuhe Cui portfolio

This is the source for Yuhe Cui's portfolio at `https://rubycuiii.github.io/yuhe.github.io/`.

To update project descriptions and case studies, edit `src/data/projects.js`. The page layout and About text are in `src/App.jsx`; colors and spacing are in `src/styles.css`. Images and videos are in `public/`.

Publishing is automatic after changes are committed to `main`, once **Settings → Pages → Build and deployment → Source** is set to **GitHub Actions**. A successful workflow publishes the website at the URL above.

For a local preview, install Node.js and pnpm, then run `pnpm install` and `pnpm dev`. Run `pnpm build` to check the production version.
