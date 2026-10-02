---
tags:
  - pillar/knowledge
  - dashboard
  - type/index
---

# 🧠 Second Brain — Dashboard

> Atualiza sozinho via Dataview. Cada nota tem exatamente 1 tag `project/*`.

## 📊 Projetos

```dataviewjs
const pages = dv.pages('#project');
const map = {};
for (const p of pages) {
  const t = (p.file.tags || []).find(t => t.startsWith('#project/'));
  if (!t) continue;
  const proj = t.slice('#project/'.length);
  (map[proj] = map[proj] || []).push(p);
}
const rows = Object.entries(map)
  .sort((a, b) => b[1].length - a[1].length)
  .map(([k, v]) => {
    const recent = v.filter(p => !p.file.path.startsWith('50-sistema/56-boards/') && !p.file.path.includes('templates/')).sort((a,b)=>b.file.mtime.ts-a.file.mtime.ts)[0];
    return [k, v.length, recent ? recent.file.link : '-'];
  });
dv.table(['Projeto', 'Notas', 'Última nota'], rows);
```

## ✅ Próximas ações (tasks em aberto)

```dataviewjs
const boards = dv.pages('"50-sistema/56-boards"').where(p => p.file.name.includes('Kanban') && !p.file.name.startsWith('Project'));
const rows = [];
for (const b of boards) {
  const proj = b.file.name.replace(' Kanban', '');
  const open = (b.file.content.match(/^- \[ \]/gm) || []).length;
  const done = (b.file.content.match(/^- \[x\]/gm) || []).length;
  if (open > 0) rows.push([proj, open, done, b.file.link]);
}
rows.sort((a, b) => b[1] - a[1]);
dv.table(['Projeto', 'Abertas', 'Feitas', 'Board'], rows);
```

## 🕓 Notas recentes

```dataview
TABLE file.tags AS Tags, file.mtime AS Modificado
FROM #project
WHERE !startsWith(file.folder, "50-sistema/56-boards") AND !contains(file.path, "templates/")
SORT file.mtime DESC
LIMIT 15
```

## 🗺️ Navegação
- [[Mapa]] — hub de projetos
- [[projects-dashboard]] — painel de comando (homepage)
- [[Project Board|Project Board]] — board mestre por status
- [[32.30-release-readiness-portfolio]] — score de lançamento por projeto (🟢🟡🟠🔴)
- [[tasks-dashboard]] — painel de tarefas (Dataview)
