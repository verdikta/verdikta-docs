# Contributing to Verdikta Documentation

This guide explains how to add and maintain documentation for the Verdikta ecosystem hosted at [docs.verdikta.org](https://docs.verdikta.org).

## Architecture Overview

```
verdikta-docs/                    ← This repository (hosts docs.verdikta.org)
├── docs/                         ← Native documentation (overview, changelog)
├── mkdocs.yml                    ← Main navigation config
└── sources/                      ← Git submodules (private repos)
    ├── arbiter/installer/docs/   → Node Operators section
    ├── apps/docs/                → Developers section
    ├── common/docs/              → Common Library section
    └── dispatcher/docs/          → Smart Contracts section
```

## Two Types of Documentation

| Type | Location | When to Use |
|------|----------|-------------|
| **Native Docs** | `docs/` folder in verdikta-docs | High-level overview, changelog, cross-cutting content |
| **Submodule Docs** | `docs/` folder in source repos | Component-specific guides, APIs, tutorials |

## Adding Native Documentation

For content that belongs to the main docs site (overview pages, changelog):

1. **Add your markdown file** to the appropriate `docs/` subfolder
2. **Update navigation** in `mkdocs.yml`:
   ```yaml
   nav:
     - Home: index.md
     - Overview:
       - overview/index.md
       - Your New Page: overview/your-page.md  # Add here
   ```
3. **Test locally**: `mkdocs serve`
4. **Commit and push** to main branch

## Adding Submodule Documentation

For component-specific documentation (in arbiter, apps, common, dispatcher repos):

### Step 1: Create Documentation in Source Repo

In your source repository, create/update files in the `docs/` folder:

```
your-repo/
└── docs/
    ├── mkdocs.yml      ← Required: defines nav for this section
    ├── index.md        ← Section homepage
    └── your-guide.md   ← Your documentation
```

### Step 2: Ensure mkdocs.yml Exists

Every submodule's docs folder needs a `mkdocs.yml` with `site_name` and `nav`:

```yaml
site_name: Your Section Name
docs_dir: .

nav:
  - Home: index.md
  - Your Guide: your-guide.md

# Minimal required config
theme:
  name: material

markdown_extensions:
  - admonition
  - pymdownx.superfences
  - toc:
      permalink: true
```

### Step 3: Connect to Main Site (if new section)

If adding a completely new section, update `mkdocs.yml` in verdikta-docs:

```yaml
nav:
  - Home: index.md
  - Your New Section: '!include sources/your-repo/docs/mkdocs.yml'
```

### Step 4: Commit to Source Repo

```bash
# In the source repository
git add docs/
git commit -m "Add documentation for feature X"
git push
```

The documentation will automatically appear on docs.verdikta.org within 6 hours (or trigger manually).

## Deployment Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  Source Repo (arbiter, apps, etc.)                              │
│  └── Push docs changes                                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions (every 6 hours or on push to verdikta-docs)     │
│  1. Update submodules                                           │
│  2. Build MkDocs site                                           │
│  3. Deploy to Vercel via CLI                                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  docs.verdikta.org (Vercel)                                     │
│  └── Live documentation site                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Local Development

### Setup

```bash
# Clone with submodules
git clone --recursive git@github.com:verdikta/verdikta-docs.git
cd verdikta-docs

# Install dependencies
pip install -r requirements.txt

# Serve locally
mkdocs serve
```

### Testing Changes

```bash
# Test build (catches broken links)
mkdocs build --strict

# Serve and preview
mkdocs serve --dev-addr 127.0.0.1:8000
```

## Manual Submodule Update

To immediately pull latest docs from source repos:

```bash
git submodule update --remote --recursive
git add sources/
git commit -m "Update documentation submodules"
git push
```

## Current Sections

| Section | Source Path | Content |
|---------|-------------|---------|
| **Node Operators** | `sources/arbiter/installer/docs/` | Installation, management, troubleshooting |
| **Developers** | `sources/apps/docs/` | SDK, API, example applications |
| **Common Library** | `sources/common/docs/` | Shared utilities, ClassID |
| **Smart Contracts** | `sources/dispatcher/docs/` | Contract integration, API reference |

## Best Practices

1. **Test locally** before pushing
2. **Use relative links** for internal navigation
3. **Include code examples** with proper syntax highlighting
4. **Keep pages focused** - one topic per page
5. **Update nav** in mkdocs.yml when adding new pages

## Troubleshooting

### Documentation not appearing?
- Verify `mkdocs.yml` exists in docs folder with `site_name` and `nav`
- Check GitHub Actions logs for build errors
- Ensure submodule is up to date

### Build failing?
- Run `mkdocs build --strict` locally to see errors
- Check for broken links or missing files

### Need immediate update?
- Push directly to verdikta-docs main branch, or
- Manually trigger the GitHub Actions workflow

