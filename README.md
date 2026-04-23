# Odoo Security CSV → XML

Convierte archivos CSV de seguridad de Odoo a XML listo para importar.

## ¿Qué hace?

Pega tu CSV en el recuadro izquierdo y el XML se genera automáticamente en el derecho.
El tipo de CSV se detecta solo por las columnas, no hace falta configurar nada.

Soporta:
- `ir.model.access` — reglas de acceso a modelos
- `res.groups` — grupos y permisos
- `res.users` — usuarios y sus grupos asignados


## Formatos CSV esperados

### ir.model.access
```csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_sale_order,sale.order,model_sale_order,sales_team.group_sale_salesman,1,1,1,0
```

### res.groups
```csv
id,name,category_id:id,implied_ids:id,comment
group_library_user,Library User,base.module_category_hidden,,
group_library_manager,Library Manager,base.module_category_hidden,group_library_user,Full access to library
```

### res.users
```csv
id,name,login,email,groups_id:id
user_library_1,Usuario Biblioteca,user1,user1@example.com,group_library_user
```

## Licencia

MIT