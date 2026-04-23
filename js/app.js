
const inputEl  = document.getElementById('input');
const outputEl = document.getElementById('output');
const statusEl = document.getElementById('status');
const errorEl  = document.getElementById('error-box');
const typeEl   = document.getElementById('csv-type');


const EXAMPLES = {
  'ir.model.access': `id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_sale_order_user,sale.order.user,model_sale_order,sales_team.group_sale_salesman,1,1,1,0
access_sale_order_manager,sale.order.manager,model_sale_order,sales_team.group_sale_manager,1,1,1,1`,

  'res.groups': `id,name,category_id:id,implied_ids:id,comment
group_library_user,Library User,base.module_category_hidden,,
group_library_manager,Library Manager,base.module_category_hidden,group_library_user,Full access to library`,

  'res.users': `id,name,login,email,groups_id:id
user_library_1,Usuario Biblioteca,user1,user1@example.com,group_library_user
user_library_manager,Manager Biblioteca,manager,manager@example.com,group_library_manager`
};


function convert() {
  const raw = inputEl.value.trim();
  errorEl.classList.remove('visible');
  if (typeEl) typeEl.textContent = '';

  if (!raw) {
    outputEl.value = '';
    setStatus('esperando input...', '');
    return;
  }

  try {
    const result = parseCSV(raw);
    if (!result || !result.rows.length) {
      outputEl.value = '';
      setStatus('sin datos', '');
      return;
    }

    const { type, rows } = result;
    outputEl.value = toXML(type, rows);

    if (typeEl) typeEl.textContent = type;
    setStatus(`${rows.length} registro${rows.length > 1 ? 's' : ''} convertido${rows.length > 1 ? 's' : ''} ✓`, 'ok');
  } catch (e) {
    outputEl.value = '';
    errorEl.textContent = '⚠ ' + e.message;
    errorEl.classList.add('visible');
    setStatus('error en el CSV', 'err');
  }
}

function setStatus(msg, cls) {
  statusEl.textContent = msg;
  statusEl.className = 'status ' + cls;
}

function copyXml() {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value).then(() => {
    const btn = event.target;
    btn.textContent = '¡copiado!';
    setTimeout(() => btn.textContent = 'copiar XML', 1500);
  });
}

function loadExample() {
  const select = document.getElementById('example-select');
  const type   = select ? select.value : 'ir.model.access';
  inputEl.value = EXAMPLES[type];
  convert();
}

inputEl.addEventListener('input', convert);