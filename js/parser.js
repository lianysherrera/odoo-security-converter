const REQUIRED = [
  'id',
  'name',
  'model_id:id',
  'group_id:id',
  'perm_read',
  'perm_write',
  'perm_create',
  'perm_unlink'
];

function parseCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (!lines.length) return null;

  const headers = lines[0].split(',').map(h => h.trim());
  const missing = REQUIRED.filter(r => !headers.includes(r));
  if (missing.length) throw new Error(`Columnas faltantes: ${missing.join(', ')}`);

  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
}

function toXML(rows) {
  const esc = s => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<odoo>\n  <data noupdate="1">\n`;

  for (const r of rows) {
    xml += `\n    <record id="${esc(r['id'])}" model="ir.model.access">\n`;
    xml += `      <field name="name">${esc(r['name'])}</field>\n`;
    xml += `      <field name="model_id" ref="${esc(r['model_id:id'])}"/>\n`;

    const grp = r['group_id:id'];
    if (grp) {
      xml += `      <field name="group_id" ref="${esc(grp)}"/>\n`;
    } else {
      xml += `      <field name="group_id" eval="False"/>\n`;
    }

    for (const perm of ['perm_read', 'perm_write', 'perm_create', 'perm_unlink']) {
      xml += `      <field name="${perm}" eval="${r[perm] === '1' ? 'True' : 'False'}"/>\n`;
    }

    xml += `    </record>\n`;
  }

  xml += `\n  </data>\n</odoo>`;
  return xml;
}
