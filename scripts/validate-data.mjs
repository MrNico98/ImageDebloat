import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entries = JSON.parse(await readFile(path.join(root, "ImmaginiDebloat.json"), "utf8"));
const associations = JSON.parse(await readFile(path.join(root, "AssociazioniDebloat.json"), "utf8"));

if (!Array.isArray(entries) || entries.length === 0) throw new Error("ImmaginiDebloat.json must be a non-empty array");
if (!associations || Array.isArray(associations) || typeof associations !== "object") throw new Error("AssociazioniDebloat.json must be an object");

const ids = new Set();
for (const [index, entry] of entries.entries()) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error(`Entry ${index} must be an object`);
  if (Object.keys(entry).sort().join(",") !== "ID,ImmagineUrl,Nome") throw new Error(`Entry ${index} has missing or unexpected fields`);
  for (const field of ["Nome", "ID", "ImmagineUrl"]) {
    if (typeof entry[field] !== "string" || entry[field].trim() === "") throw new Error(`Entry ${index}: ${field} must be a non-empty string`);
  }
  if (ids.has(entry.ID)) throw new Error(`Duplicate image ID: ${entry.ID}`);
  ids.add(entry.ID);

  const url = new URL(entry.ImmagineUrl);
  if (url.protocol !== "https:" || url.hostname !== "raw.githubusercontent.com") throw new Error(`Entry ${index}: image URL must use HTTPS on raw.githubusercontent.com`);
  const prefix = "/MrNico98/ImageDebloat/refs/heads/main/Immagini/";
  if (!url.pathname.startsWith(prefix) || url.pathname.slice(prefix.length).includes("/")) throw new Error(`Entry ${index}: image URL points outside the expected asset folder`);
  const filename = decodeURIComponent(url.pathname.slice(prefix.length));
  if (!filename || filename === "." || filename === "..") throw new Error(`Entry ${index}: invalid image filename`);
  await access(path.join(root, "Immagini", filename));
}

for (const [packageName, label] of Object.entries(associations)) {
  if (!/^Microsoft\.[A-Za-z0-9._-]+$/.test(packageName)) throw new Error(`Invalid package identity: ${packageName}`);
  if (typeof label !== "string" || label.trim() === "") throw new Error(`Invalid display label for ${packageName}`);
}

console.log(`Validated ${entries.length} unique image entries and ${Object.keys(associations).length} package associations.`);
