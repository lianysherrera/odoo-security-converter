const inputEl  = document.getElementById('input');
const outputEl = document.getElementById('output');
const statusEl = document.getElementById('status');
const errorEl  = document.getElementById('error-box');

function convert() {
  const raw = inputEl.value.trim();
  errorEl.classList.remove('visible');

  if (!raw) {
    outputEl.value = '';
    setStatus('esperando input...', '');
    return;
  }

  try {
    const rows = parseCSV(raw);
    if (!rows || !rows.length) {
      outputEl.value = '';
      setStatus('sin datos', '');
      return;
    }
    outputEl.value = toXML(rows);
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
  inputEl.value = `id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_sale_order_user,sale.order.user,model_sale_order,sales_team.group_sale_salesman,1,1,1,0
access_sale_order_manager,sale.order.manager,model_sale_order,sales_team.group_sale_manager,1,1,1,1
access_product_template_user,product.template.user,model_product_template,base.group_user,1,0,0,0`;
  convert();
}

inputEl.addEventListener('input', convert);
