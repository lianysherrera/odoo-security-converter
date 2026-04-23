
const REQUIRED = {
  'ir.model.access': ['id', 'name', 'model_id:id', 'group_id:id', 'perm_read', 'perm_write', 'perm_create', 'perm_unlink'],
  'res.groups':      ['id', 'name', 'category_id:id'],
  'res.users':       ['id', 'name', 'login', 'email', 'groups_id:id']
};

function detectType(headers) {
  if (headers.includes('perm_read'))        return 'ir.model.access';
  if (headers.includes('login'))            return 'res.users';
  if (headers.includes('category_id:id'))   return 'res.groups';
  throw new Error('No se reconoce el tipo de CSV. Comprueba las columnas.');
}

function parseCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (!lines.length) return null;

  const headers = lines[0].split(',').map(h => h.trim());
  const type    = detectType(headers);

  const missing = REQUIRED[type].filter(r => !headers.includes(r));
  if (missing.length) throw new Error(`Columnas faltantes en ${type}: ${missing.join(', ')}`);

  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });

  return { type, rows };
}


function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function convertModelAccess(rows) {
  let xml = '';
  for (const r of rows) {
    xml += `\n    <record id="${esc(r['id'])}" model="ir.model.access">\n`;
    xml += `      <field name="name">${esc(r['name'])}</field>\n`;
    xml += `      <field name="model_id" ref="${esc(r['model_id:id'])}"/>\n`;

    const grp = r['group_id:id'];
    xml += grp
      ? `      <field name="group_id" ref="${esc(grp)}"/>\n`
      : `      <field name="group_id" eval="False"/>\n`;

    for (const perm of ['perm_read', 'perm_write', 'perm_create', 'perm_unlink']) {
      xml += `      <field name="${perm}" eval="${r[perm] === '1' ? 'True' : 'False'}"/>\n`;
    }

    xml += `    </record>\n`;
  }
  return xml;
}

function convertGroups(rows) {
  let xml = '';
  for (const r of rows) {
    xml += `\n    <record id="${esc(r['id'])}" model="res.groups">\n`;
    xml += `      <field name="name">${esc(r['name'])}</field>\n`;

    if (r['category_id:id']) {
      xml += `      <field name="category_id" ref="${esc(r['category_id:id'])}"/>\n`;
    }

    if (r['implied_ids:id']) {
      xml += `      <field name="implied_ids" eval="[(4, ref('${esc(r['implied_ids:id'])}'))]"/>\n`;
    }

    if (r['comment']) {
      xml += `      <field name="comment">${esc(r['comment'])}</field>\n`;
    }

    xml += `    </record>\n`;
  }
  return xml;
}

function convertUsers(rows) {
  let xml = '';
  for (const r of rows) {
    xml += `\n    <record id="${esc(r['id'])}" model="res.users">\n`;
    xml += `      <field name="name">${esc(r['name'])}</field>\n`;
    xml += `      <field name="login">${esc(r['login'])}</field>\n`;
    xml += `      <field name="email">${esc(r['email'])}</field>\n`;

    if (r['groups_id:id']) {
      xml += `      <field name="groups_id" eval="[(4, ref('${esc(r['groups_id:id'])}'))]"/>\n`;
    }

    xml += `    </record>\n`;
  }
  return xml;
}

// Función principal 

function toXML(type, rows) {
  const converters = {
    'ir.model.access': convertModelAccess,
    'res.groups':      convertGroups,
    'res.users':       convertUsers
  };

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<odoo>\n  <data noupdate="1">\n`;
  xml += converters[type](rows);
  xml += `\n  </data>\n</odoo>`;
  return xml;
}
