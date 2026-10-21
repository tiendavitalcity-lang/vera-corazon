const STORE_KEY = "vera-heart-v1";
const initial = { messages: [], memories: [], canon: "" };
let data = loadData();

function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? {...initial, ...JSON.parse(raw)} : structuredClone(initial);
  } catch (_) { return {...initial}; }
}
function saveData() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    return true;
  } catch (_) {
    setStatus("No se pudo guardar. Exportá una copia y liberá espacio del navegador.");
    return false;
  }
}
function setStatus(message) { document.getElementById("status").textContent = message; }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function renderMessages() {
  const el = document.getElementById("messages");
  if (!data.messages.length) {
    el.innerHTML = '<div class="empty">Tu historia empieza acá.<br>Escribí la primera escena de Alejandro.</div>';
    return;
  }
  el.innerHTML = data.messages.map(m => `<article class="message"><div class="meta">${esc(m.role)} · ${esc(new Date(m.time).toLocaleString())}</div><p>${esc(m.text)}</p></article>`).join("");
}
function renderMemories() {
  const el = document.getElementById("memoryList");
  if (!data.memories.length) {
    el.innerHTML = '<div class="empty">Todavía no hay recuerdos propuestos.</div>';
    return;
  }
  el.innerHTML = data.memories.map((m,i) => `<article class="memory-item"><div class="memory-status">${m.approved ? "Recuerdo aprobado" : "Pendiente de aprobación"}</div><p>${esc(m.text)}</p>${m.approved ? "" : `<div class="memory-actions"><button class="approve" data-approve="${i}">Aprobar</button><button data-delete="${i}">Eliminar</button></div>`}</article>`).join("");
  el.querySelectorAll("[data-approve]").forEach(b => b.addEventListener("click", () => { data.memories[+b.dataset.approve].approved = true; saveData(); renderMemories(); }));
  el.querySelectorAll("[data-delete]").forEach(b => b.addEventListener("click", () => { data.memories.splice(+b.dataset.delete,1); saveData(); renderMemories(); }));
}
document.getElementById("saveBtn").addEventListener("click", () => {
  const input = document.getElementById("sceneInput");
  const text = input.value.trim();
  if (!text) { setStatus("Escribí una escena antes de guardarla."); return; }
  data.messages.push({role:"ALEJANDRO · TU NARRACIÓN", text, time:Date.now()});
  if (saveData()) { input.value = ""; renderMessages(); setStatus("Escena guardada en este navegador. Todavía no se genera una respuesta de IA."); }
});
document.getElementById("clearInputBtn").addEventListener("click", () => { document.getElementById("sceneInput").value = ""; });
document.getElementById("proposeMemoryBtn").addEventListener("click", () => {
  const input = document.getElementById("memoryInput"), text = input.value.trim();
  if (!text) { setStatus("Escribí qué recuerdo querés proponer."); return; }
  data.memories.push({text, approved:false, time:Date.now()});
  if (saveData()) { input.value = ""; renderMemories(); setStatus("Recuerdo propuesto. Aprobalo para incorporarlo al canon."); }
});
document.getElementById("saveCanonBtn").addEventListener("click", () => {
  data.canon = document.getElementById("canonInput").value;
  if (saveData()) setStatus("Notas del canon guardadas.");
});
document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({...data, exportedAt:new Date().toISOString()},null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = "vera-respaldo.json"; a.click(); URL.revokeObjectURL(url);
  setStatus("Copia de seguridad exportada. Guardala en un lugar seguro.");
});
document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", async e => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported.messages) || !Array.isArray(imported.memories)) throw new Error("formato");
    data = {...initial, ...imported}; saveData();
    document.getElementById("canonInput").value = data.canon || "";
    renderMessages(); renderMemories(); setStatus("Copia importada correctamente.");
  } catch (_) { setStatus("No se pudo importar. Elegí un respaldo JSON de VÉRA."); }
  e.target.value = "";
});
document.getElementById("canonInput").value = data.canon || "";
renderMessages(); renderMemories();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
