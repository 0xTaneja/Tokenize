# Tokenize 🏗️🎉

A Solana **token-launchpad** that lets creators mint SPL tokens from their browser. Built with React + Vite, TailwindCSS, and `@solana/web3.js`.

---

## Quick start

```bash
git clone https://github.com/<you>/token-launchpad.git
cd token-launchpad/Tokenize

# Install all dependencies (includes Husky + lint-staged, Prettier, Vitest)
npm install

# Start Vite dev server
npm run dev     # http://localhost:5173
```

### With Docker (optional)

Spin up a local Solana validator **and** the React app:

```bash
docker compose up   # validator on :8899, web on :5173
```

The web container is hot-reloaded; changes to `src/` trigger an automatic rebuild.

---

## Scripts

| command          | purpose                                    |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Vite dev server                            |
| `npm run build`  | Production build (static files in `dist/`) |
| `npm test`       | Unit tests via Vitest + RTL                |
| `npm run lint`   | ESLint sanity check                        |
| `npm run format` | Prettier write-format                      |

Git hooks: a pre-commit hook (Husky) runs `lint-staged` to auto-fix & format staged files.

---

## Features

- Wallet adapter support (Phantom, Solflare, Backpack, …)
- Form to create an SPL token: name, symbol, decimals, initial supply
- Mints token via `@solana/spl-token` & shows explorer link
- Tailwind-powered responsive UI
- Ready for Vercel/Netlify deployment

---

## Folder structure

```text
Tokenize/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md (← you are here)
```

---

## Roadmap status

| task                         | status      |
| ---------------------------- | ----------- |
| Codebase audit               | ✅ done     |
| README overhaul              | ✅ done     |
| `.env.example`               | ✅ done     |
| Wallet integration           | ✅ done     |
| Token launch form & feedback | ✅ done     |
| Tailwind theming             | ✅ done     |
| Unit tests (Vitest)          | ✅ done     |
| ESLint + Prettier            | ✅ done     |
| CI pipeline (GitHub Actions) | ✅ done     |
| Docker / local validator     | ✅ done     |
| PWA enhancements             | ⏳ optional |
| Deployment workflow          | ⏳ upcoming |

Pull requests are welcome – see `CONTRIBUTING.md` soon.

---

## License

MIT © 2025 Your Name
