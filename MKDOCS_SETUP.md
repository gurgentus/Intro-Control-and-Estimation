# MkDocs Setup Guide

## What Was Set Up

Your Jekyll-based lecture notes have been migrated to MkDocs with Material theme. Here's what was configured:

### ✅ Completed

1. **MkDocs Configuration** (`mkdocs.yml`)
   - Material theme with clean, academic styling
   - Math rendering with MathJax
   - Search functionality
   - Navigation structure for all 4 modules
   - Git revision date plugin

2. **GitHub Actions Workflow** (`.github/workflows/deploy-mkdocs.yml`)
   - Auto-deploys to GitHub Pages on push to `master`
   - Just `git push` and it deploys automatically

3. **Documentation Structure** (`docs/` directory)
   - `index.md` - Homepage (from README.md)
   - `module1/simulating-the-world.md` - Example converted lecture
   - Placeholder files for all other lectures
   - Custom CSS for academic styling
   - MathJax configuration for LaTeX equations

4. **Dependencies** (`requirements.txt`)
   - mkdocs
   - mkdocs-material
   - mkdocs-git-revision-date-localized-plugin

## How to Use

### Local Development

**First time setup:**

1. **Install uv (if not already installed):**
   ```bash
   # On macOS/Linux
   curl -LsSf https://astral.sh/uv/install.sh | sh

   # On Windows
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. **Install dependencies:**
   ```bash
   uv sync
   ```

**Working with the site:**

1. **Preview your site locally:**
   ```bash
   uv run mkdocs serve
   ```
   Then open http://127.0.0.1:8000/ in your browser

2. **Edit content:**
   - All markdown files are in the `docs/` directory
   - Edit `.md` files, save, and see changes instantly in the browser

3. **Build the site:**
   ```bash
   uv run mkdocs build
   ```
   Output goes to the `site/` directory

### Deployment to GitHub Pages

**Automatic (Recommended):**
```bash
git add .
git commit -m "Update lecture notes"
git push
```
GitHub Actions will automatically build and deploy to GitHub Pages.

**Manual (Alternative):**
```bash
mkdocs gh-deploy
```
This builds and pushes directly to the `gh-pages` branch.

## Converting HTML Files to Markdown

I've converted `Extra-Simulating-The-World.html` as an example. To convert other HTML files:

### Manual Conversion Steps:

1. Copy the content between `<div class='content'>` tags
2. Remove HTML tags (`<p>`, `<br />`, etc.)
3. Keep LaTeX equations as-is (between `$$` or `\begin{equation}`)
4. Use `<div class="bordered">` for highlighted formula boxes
5. Save to appropriate `docs/moduleX/` directory

### Example Conversion:

**Before (HTML):**
```html
<p>Recall that our system is described by...<br />
$$
\dot{x}(t) = F(t) x(t)
$$
</p>
```

**After (Markdown):**
```markdown
Recall that our system is described by...

$$
\dot{x}(t) = F(t) x(t)
$$
```

### Special Elements:

**Bordered boxes (important formulas):**
```markdown
<div class="bordered">

$$
x(t_k) = e^{F(\Delta t)} x(t_{k-1})
$$

</div>
```

**Mathematical connections (green text):**
```markdown
<p class="math-connection"><em>Mathematical connections: numerical analysis, differential equations</em></p>
```

**Admonitions (info boxes):**
```markdown
!!! warning "Work in Progress"
    This section is under construction.

!!! info "Note"
    Important information here.
```

## File Structure

```
Intro-Control-and-Estimation/
├── mkdocs.yml                    # MkDocs configuration
├── requirements.txt              # Python dependencies
├── .github/
│   └── workflows/
│       └── deploy-mkdocs.yml    # GitHub Actions workflow
├── docs/                        # All markdown content here
│   ├── index.md                 # Homepage
│   ├── cloud-control-toolbox.md
│   ├── javascripts/
│   │   └── mathjax.js          # MathJax config
│   ├── stylesheets/
│   │   └── extra.css           # Custom styling
│   ├── module1/
│   │   ├── introduction.md
│   │   ├── frequency-domain-analysis.md
│   │   ├── controller-design-basics.md
│   │   ├── root-locus-analysis.md
│   │   ├── our-first-controller.md
│   │   ├── simulating-the-world.md  # ✓ Converted example
│   │   └── project.md
│   ├── module2/
│   ├── module3/
│   └── module4/
└── site/                        # Build output (gitignored)
```

## Theme Customization

The Material theme is configured to be clean and minimal, similar to your old Jekyll theme:

- **Colors:** White primary, orange accent
- **Light/dark mode toggle**
- **Navigation tabs** for modules
- **Search** with highlighting
- **Custom CSS** in `docs/stylesheets/extra.css`

To customize further, edit `mkdocs.yml` and see [Material for MkDocs documentation](https://squidfunk.github.io/mkdocs-material/).

## Next Steps

1. **Convert remaining HTML files** to Markdown (use `simulating-the-world.md` as reference)
2. **Add images** - Copy `.png`/`.jpeg` files to `docs/` and reference them:
   ```markdown
   ![Lane Change Trajectory](../lane_change_traj.png)
   ```
3. **Test locally** with `mkdocs serve` as you convert files
4. **Push to GitHub** - Automatic deployment will handle the rest

## Troubleshooting

**Build fails:**
```bash
mkdocs build --verbose
```

**Math not rendering:**
- Ensure equations are between `$$` (display) or `$` (inline)
- Check `docs/javascripts/mathjax.js` is present

**Images not showing:**
- Put images in `docs/` directory
- Use relative paths in markdown

## Getting Help

- MkDocs docs: https://www.mkdocs.org/
- Material theme: https://squidfunk.github.io/mkdocs-material/
- MathJax with MkDocs: https://squidfunk.github.io/mkdocs-material/reference/math/

---

**Your site will be live at:** `https://gurgentus.github.io/Intro-Control-and-Estimation/`

Just push to GitHub and the GitHub Actions workflow will deploy automatically! 🚀
