# Odoo Security CSV → XML

Convierte archivos CSV de seguridad de Odoo a XML listo para importar.

## ¿Qué hace?

Pega tu CSV en el recuadro izquierdo y el XML se genera automáticamente en el derecho.

Soporta:
- `ir.model.access` — reglas de acceso a modelos

## Uso

No necesita instalación. Abre `index.html` en el navegador y listo.

## Formato CSV esperado

```csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_sale_order,sale.order,model_sale_order,sales_team.group_sale_salesman,1,1,1,0
```