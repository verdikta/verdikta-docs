# Verdikta Documentation

This repository hosts the unified documentation site for the Verdikta ecosystem at [docs.verdikta.org](https://docs.verdikta.org).

## Backlog and contribution workflow

Verdikta coordinates work across repositories through the
[Verdikta Master Backlog](https://github.com/orgs/verdikta/projects/1).
Humans and automated agents contributing here must read [AGENTS.md](AGENTS.md)
and the canonical [backlog and issue workflow](docs/backlog-workflow.md) before
creating, selecting, or changing work items.

## 🏗️ Architecture

```
verdikta-docs/
├── mkdocs.yml            ← Main configuration & navigation
├── docs/                 ← Native documentation (overview, changelog)
├── assets/               ← Shared images and stylesheets
└── sources/              ← Git submodules (private repos)
    ├── arbiter/          ← verdikta-arbiter → Node Operators docs
    ├── apps/             ← verdikta-applications → Developers docs
    ├── common/           ← verdikta-common → Common Library docs
    └── dispatcher/       ← verdikta-dispatcher → Smart Contracts docs
```

## 🚀 Quick Start

### Local Development

```bash
# Clone with submodules
git clone --recursive git@github.com:verdikta/verdikta-docs.git
cd verdikta-docs

# Install dependencies
pip install -r requirements.txt

# Serve locally
mkdocs serve
```

View at [http://localhost:8000](http://localhost:8000)

### Build for Production

```bash
mkdocs build
```

## 🔄 How It Works

1. **Source repositories** contain component-specific documentation in their `docs/` folders
2. **Git submodules** link those docs into this repository
3. **GitHub Actions** automatically updates submodules every 6 hours
4. **MkDocs monorepo plugin** combines all docs into a single site
5. **Vercel** hosts the built site at docs.verdikta.org

## 📝 Contributing Documentation

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed instructions on:
- Adding native documentation to this repo
- Adding documentation in submodule repositories
- Connecting new docs to the main site
- Local development and testing

## 📚 Documentation Sections

| Section | Source | Description |
|---------|--------|-------------|
| **Node Operators** | `sources/arbiter/installer/docs/` | Installation, management, troubleshooting |
| **Developers** | `sources/apps/docs/` | SDK, API, example applications |
| **Common Library** | `sources/common/docs/` | Shared utilities, manifest specification |
| **Smart Contracts** | `sources/dispatcher/docs/` | Contract integration, API reference |
| **Overview** | `docs/overview/` | Architecture, whitepaper |
| **Changelog** | `docs/changelog/` | Release notes |

## 🔗 Related Repositories

- [verdikta-arbiter](https://github.com/verdikta/verdikta-arbiter) - Arbiter node software
- [verdikta-dispatcher](https://github.com/verdikta/verdikta-dispatcher) - Smart contracts
- [verdikta-applications](https://github.com/verdikta/verdikta-applications) - Example applications
- [verdikta-common](https://github.com/verdikta/verdikta-common) - Shared utilities

## 📞 Support

- **Documentation Issues**: [GitHub Issues](https://github.com/verdikta/verdikta-docs/issues)
- **General Questions**: [Discord Community](https://discord.gg/verdikta)
- **Email**: [support@verdikta.org](mailto:support@verdikta.org)

---

Built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
