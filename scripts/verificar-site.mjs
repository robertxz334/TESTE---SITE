import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import assert from "node:assert/strict";

const root = resolve(import.meta.dirname, "..");
const pages = [
  "index.html",
  "psicologia-clinica.html",
  "psicologia-do-esporte.html",
  "supervisao.html",
  "politica-de-privacidade.html",
];
let checked = 0;
for (const page of pages) {
  const content = readFileSync(resolve(root, page), "utf8");
  assert.match(content, /<html\b/i, page + " sem elemento html");
  assert.match(content, /<\/html>/i, page + " sem encerramento html");
  assert.match(content, /noindex/i, page + " deve continuar como demonstração não indexável");
  const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, page + " contém IDs repetidos");
  for (const match of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(?:#|https?:|data:|mailto:|tel:|javascript:)/i.test(url)) continue;
    const file = url.split(/[?#]/, 1)[0];
    if (!file) continue;
    assert.ok(existsSync(resolve(root, dirname(page), file)), page + " referencia arquivo ausente: " + url);
    checked++;
  }
}
const index = readFileSync(resolve(root, "index.html"), "utf8");
const supervision = readFileSync(resolve(root, "supervisao.html"), "utf8");
for (const slug of [
  "psicologia-clinica",
  "psicologia-do-esporte",
  "supervisao",
  "supervisao-individual",
  "supervisao-grupo-ouvinte",
  "supervisao-grupo-supervisionando",
]) {
  assert.ok(index.includes('data-service="' + slug + '"'), "Falta modalidade: " + slug);
}
for (const fragment of ['id="modalidades"', 'id="grupo"', "Participar como Ouvinte", "Participar como Supervisionando"]) {
  assert.ok(supervision.includes(fragment), "Página de supervisão incompleta: " + fragment);
}
assert.ok(index.includes("demo-modal-backdrop"), "A simulação de contato deve ser mantida");
assert.ok(index.includes("supervision-spotlight"), "Seção de supervisão da home ausente");
const css = readFileSync(resolve(root, "assets/paginas-servicos.css"), "utf8");
assert.ok(css.includes("@media(max-width:760px)"), "CSS responsivo ausente");
assert.ok(css.includes("prefers-reduced-motion"), "CSS acessível reduzido ausente");
console.log("✓ " + pages.length + " páginas HTML verificadas; " + checked + " referências internas resolvidas.");
console.log("✓ Modalidades, navegação, proteção de demonstração e estilos verificados.");
