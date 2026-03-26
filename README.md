# feedbag 

> Pack your project files into AI-ready context — in seconds.

You know exactly which files you need. Getting them into an AI chat shouldn't take five minutes of copy-pasting.

Feedbag lets you drag in a project, pick the files you care about, and copy everything as a clean, structured context — ready to paste into Claude, ChatGPT, or any AI tool.

---

## What it does

- **Drag in any folder** — feedbag reads your project structure instantly
- **Browse & select** — check the files you want, skip the ones you don't
- **See the directory tree** — so the AI understands how your project is organized
- **One-click copy** — outputs a clean, AI-friendly format to your clipboard
- **Token estimate** — know how much context you're sending before you send it
- **Read-only** — feedbag never modifies your files

---

## Who it's for

**Developers** who use Cursor or VS Code and want to ask an AI about their code without copy-pasting file by file.

**Anyone** who works with text files and wants to give an AI a clear picture of their project — writers, researchers, designers.

---

## Output format

```
Project structure:
src/
  api/
    auth.ts
  components/
    Modal.tsx

===== file: src/api/auth.ts =====
```typescript
// your code here
```

===== file: src/components/Modal.tsx =====
```typescript
// your code here
```
```

Paste this directly into any AI chat. The AI immediately understands your project layout and the relevant code.

---

## Status

🚧 In active development. First release coming soon.

Built as a pure client-side Web app (React + Vite). Local-only: reads files in your browser and never uploads.

---

## License

See `LICENSE` for the full license text.