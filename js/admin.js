/**
 * ==============================================================================
 * MRosecuador - Producción y Calidad
 * CONTROLADOR DEL PANEL DE ADMINISTRACIÓN
 * (Gestión de Usuarios, Control de Accesos y Gestor de Módulos Futuros)
 * ==============================================================================
 */

const Admin = (function () {

  // --- RENDERIZADO: GESTIÓN DE USUARIOS ---
  function renderUsersView(container) {
    const users = Store.getUsers();
    const modules = Store.getModules();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 800; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Módulo de Accesos • Plataformas & Usuarios
            </span>
          </div>
          <h1 style="color: #065f46;">Control de Accesos y Usuarios</h1>
          <p class="view-subtitle" style="color: #047857;">Crea nuevos usuarios, administra sus credenciales y configura sus accesos autorizados a las plataformas de MRosecuador.</p>
        </div>
        <div class="view-actions" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="App.navigateTo('accesos-permisos')" style="display: flex; align-items: center; gap: 0.4rem;" title="Ver matriz completa de permisos">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Matriz de Permisos
          </button>
          <button class="btn btn-emerald" onclick="Admin.openUserModal()" style="display: flex; align-items: center; gap: 0.4rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Crear Nuevo Usuario
          </button>
        </div>
      </div>

      <!-- Métricas Rápidas de Usuarios -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Total Usuarios</span>
            <span class="kpi-value">${users.length}</span>
            <span class="kpi-trend positive">Cuentas registradas</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Usuarios Activos</span>
            <span class="kpi-value">${users.filter(u => u.status === 'active').length}</span>
            <span class="kpi-trend positive">Acceso habilitado</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Administradores</span>
            <span class="kpi-value">${users.filter(u => u.role === 'admin').length}</span>
            <span class="kpi-trend alert">Control Total</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-rose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Módulos en Sistema</span>
            <span class="kpi-value">${modules.length}</span>
            <span class="kpi-trend positive">Disponibles</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
        </div>
      </div>

      <!-- Tabla de Usuarios -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            Listado General de Usuarios
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <input type="text" id="user-search-input" placeholder="Buscar por nombre, usuario o email..." class="form-control" style="padding: 0.45rem 0.85rem; width: 280px; font-size: 0.82rem;" oninput="Admin.filterUsersTable()">
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table" id="users-table">
              <thead>
                <tr>
                  <th>Usuario / Colaborador</th>
                  <th>Usuario (Login)</th>
                  <th>Rol</th>
                  <th>Módulos Asignados</th>
                  <th>Estado</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody id="users-table-body">
                ${renderUsersTableRows(users)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderUsersTableRows(users) {
    if (!users || users.length === 0) {
      return `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No se encontraron usuarios</td></tr>`;
    }

    return users.map(user => {
      const isSuperAdmin = user.username === 'admin';
      const statusBadge = user.status === 'active' 
        ? `<span class="badge badge-success"><span style="width:6px;height:6px;background:var(--emerald-main);border-radius:50%;display:inline-block;"></span> Activo</span>`
        : `<span class="badge badge-danger">Inactivo</span>`;
      
      const roleBadge = user.role === 'admin'
        ? `<span class="badge badge-admin">Administrador</span>`
        : `<span class="badge badge-neutral">${user.roleName || user.role}</span>`;

      // Módulos que tiene permitidos
      let permsLabel = '';
      if (user.role === 'admin' || (user.permissions && user.permissions.includes('*'))) {
        permsLabel = `<span class="badge badge-success" style="background:var(--primary-50); color:var(--emerald-dark); border:1px solid var(--primary-200);">Acceso Total (*)</span>`;
      } else {
        const count = Array.isArray(user.permissions) ? user.permissions.length : 0;
        permsLabel = `<span class="badge badge-neutral">${count} módulo(s) asignado(s)</span>`;
      }

      return `
        <tr data-user-id="${user.id}">
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="user-avatar" style="width: 34px; height: 34px; font-size: 0.78rem;">${user.avatar || 'US'}</div>
              <div>
                <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(user.name)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(user.email)}</div>
              </div>
            </div>
          </td>
          <td><code style="background: var(--bg-subtle); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.82rem; font-weight: 600;">@${escapeHtml(user.username)}</code></td>
          <td>${roleBadge}</td>
          <td>${permsLabel}</td>
          <td>${statusBadge}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.35rem;">
              <button class="btn btn-secondary btn-icon-only" title="Editar Usuario" onclick="Admin.openUserModal('${user.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button class="btn btn-secondary btn-icon-only" title="Configurar Accesos" onclick="App.navigateTo('admin-permissions', { targetUserId: '${user.id}' })">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </button>
              ${!isSuperAdmin ? `
                <button class="btn btn-secondary btn-icon-only ${user.status === 'active' ? '' : 'btn-icon-danger'}" title="${user.status === 'active' ? 'Desactivar cuenta' : 'Activar cuenta'}" onclick="Admin.toggleUserStatus('${user.id}')">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                </button>
                <button class="btn btn-secondary btn-icon-only btn-icon-danger" title="Eliminar Usuario" onclick="Admin.deleteUser('${user.id}')">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              ` : `
                <span style="font-size: 0.75rem; color: var(--text-light); padding: 0.4rem;">(Principal)</span>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterUsersTable() {
    const input = document.getElementById('user-search-input');
    if (!input) return;
    const term = input.value.toLowerCase().trim();
    const users = Store.getUsers();
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(term) ||
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.roleName && u.roleName.toLowerCase().includes(term))
    );
    const tbody = document.getElementById('users-table-body');
    if (tbody) tbody.innerHTML = renderUsersTableRows(filtered);
  }

  // --- MODAL DE USUARIO (CREAR / EDITAR) ---
  function openUserModal(userId = null) {
    const isEdit = !!userId;
    const user = isEdit ? Store.getUser(userId) : null;
    const modules = Store.getModules();

    const title = isEdit ? `Editar Usuario: ${user.name}` : 'Crear Nuevo Usuario en MRosecuador';

    const bodyHtml = `
      <form id="form-user-edit" onsubmit="event.preventDefault(); Admin.saveUserFromForm('${userId || ''}');">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Nombre Completo del Colaborador</label>
            <div class="input-container">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <input type="text" id="usr-modal-name" class="form-control" required placeholder="Ej: Ing. Rosa María Tapia" value="${user ? escapeHtml(user.name) : ''}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nombre de Usuario (Login)</label>
            <div class="input-container">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
              </span>
              <input type="text" id="usr-modal-username" class="form-control" required placeholder="Ej: rtapia" value="${user ? escapeHtml(user.username) : ''}" ${user && user.username === 'admin' ? 'readonly' : ''}>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <div class="input-container">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <input type="email" id="usr-modal-email" class="form-control" required placeholder="correo@mrosecuador.com" value="${user ? escapeHtml(user.email) : ''}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Rol Operativo</label>
            <div class="input-container">
              <select id="usr-modal-role" class="form-control" style="padding-left: 1rem;" onchange="Admin.handleRoleChangeInModal(this.value)">
                <option value="admin" ${user && user.role === 'admin' ? 'selected' : ''}>👑 Administrador General (Control Total)</option>
                <option value="supervisor" ${user && user.role === 'supervisor' ? 'selected' : (!user ? 'selected' : '')}>🌿 Supervisor de Producción</option>
                <option value="inspector" ${user && user.role === 'inspector' ? 'selected' : ''}>🔍 Inspector de Calidad Postcosecha</option>
                <option value="operador" ${user && user.role === 'operador' ? 'selected' : ''}>🌾 Operador de Cosecha / Campo</option>
                <option value="general" ${user && user.role === 'general' ? 'selected' : ''}>📋 Usuario General / Administrativo</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">${isEdit ? 'Nueva Contraseña (Opcional)' : 'Contraseña de Acceso'}</label>
            <div class="input-container">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input type="text" id="usr-modal-password" class="form-control" ${!isEdit ? 'required' : ''} placeholder="${isEdit ? 'Dejar en blanco para conservar actual' : 'Mínimo 3 caracteres'}" value="">
            </div>
          </div>

          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Estado de la Cuenta</label>
            <div style="display: flex; gap: 1.5rem; align-items: center; margin-top: 0.25rem;">
              <label class="checkbox-label">
                <input type="radio" name="usr-status" value="active" ${!user || user.status === 'active' ? 'checked' : ''}>
                <span style="font-weight: 600; color: var(--emerald-dark);">Activo (Permite iniciar sesión)</span>
              </label>
              <label class="checkbox-label" ${user && user.username === 'admin' ? 'style="display:none;"' : ''}>
                <input type="radio" name="usr-status" value="inactive" ${user && user.status === 'inactive' ? 'checked' : ''}>
                <span style="font-weight: 600; color: var(--rose-600);">Inactivo (Bloqueado)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Módulos con Acceso Marcado Inicialmente -->
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px dashed var(--border-light);">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
            <span>Accesos a Plataformas y Módulos</span>
            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn btn-sm btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="document.querySelectorAll('.modal-module-check').forEach(c => c.checked = true)">✓ Marcar Todas</button>
              <button type="button" class="btn btn-sm btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="document.querySelectorAll('.modal-module-check').forEach(c => c.checked = false)">✕ Desmarcar</button>
            </div>
          </div>
          <div id="modal-modules-checkboxes" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; max-height: 190px; overflow-y: auto; padding: 0.35rem; border: 1px solid var(--border-light); border-radius: 6px; background: var(--bg-card);">
            ${modules.map(m => {
              const userPerms = (user && Array.isArray(user.permissions)) ? user.permissions : [];
              const checked = (user && (userPerms.includes('*') || userPerms.includes(m.key))) || 
                              (!user && ['dashboard-gerencial', 'dashboard-produccion', 'config-finca-planos', 'config-finca-catalogo', 'etiquetas-codigos', 'riego-control', 'produccion-cosecha', 'proyecciones-pinch', 'proceso-postcosecha', 'calidad-checklists', 'ventas-stock'].includes(m.key));
              return `
                <label style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.78rem; padding: 0.35rem 0.5rem; background: var(--bg-subtle); border-radius: 5px; cursor: pointer;">
                  <input type="checkbox" class="modal-module-check" value="${m.key}" ${checked ? 'checked' : ''} style="width: 15px; height: 15px; accent-color: var(--emerald-main);">
                  <span style="font-weight: 600; color: var(--text-main);">${escapeHtml(m.name)}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      </form>
    `;

    App.showModal(title, bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-user-edit').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        ${isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
      </button>
    `);
  }

  function handleRoleChangeInModal(role) {
    const checks = document.querySelectorAll('.modal-module-check');
    if (role === 'admin') {
      checks.forEach(c => c.checked = true);
    } else if (role === 'supervisor') {
      checks.forEach(c => c.checked = ['dashboard-gerencial', 'dashboard-produccion', 'config-finca-planos', 'config-finca-catalogo', 'etiquetas-codigos', 'riego-control', 'produccion-cosecha', 'proyecciones-pinch', 'proceso-postcosecha', 'calidad-checklists', 'ventas-stock'].includes(c.value));
    } else if (role === 'inspector') {
      checks.forEach(c => c.checked = ['dashboard-gerencial', 'calidad-checklists', 'proceso-postcosecha', 'config-finca-catalogo'].includes(c.value));
    } else if (role === 'operador') {
      checks.forEach(c => c.checked = ['dashboard-produccion', 'produccion-cosecha', 'riego-control', 'etiquetas-codigos', 'config-finca-planos'].includes(c.value));
    } else {
      checks.forEach(c => c.checked = ['dashboard-gerencial'].includes(c.value));
    }
  }

  function saveUserFromForm(userId) {
    const name = document.getElementById('usr-modal-name').value.trim();
    const username = document.getElementById('usr-modal-username').value.trim().toLowerCase();
    const email = document.getElementById('usr-modal-email').value.trim().toLowerCase();
    const role = document.getElementById('usr-modal-role').value;
    const password = document.getElementById('usr-modal-password').value;
    const status = document.querySelector('input[name="usr-status"]:checked').value;

    const roleNames = {
      'admin': 'Administrador General',
      'supervisor': 'Supervisor de Producción',
      'inspector': 'Inspector de Calidad',
      'operador': 'Operador de Cosecha',
      'general': 'Usuario General'
    };

    // Módulos seleccionados
    const checkedModules = Array.from(document.querySelectorAll('.modal-module-check:checked')).map(c => c.value);
    const permissions = (role === 'admin') ? ['*'] : checkedModules;

    // Validación de username repetido
    const users = Store.getUsers();
    const existing = users.find(u => u.username === username && u.id !== userId);
    if (existing) {
      App.showToast('El nombre de usuario @' + username + ' ya está en uso', 'danger');
      return;
    }

    const payload = {
      name,
      username,
      email,
      role,
      roleName: roleNames[role] || 'Colaborador',
      status,
      permissions
    };

    if (userId) {
      payload.id = userId;
      if (password && password.trim() !== '') {
        payload.password = password.trim();
      }
    } else {
      payload.password = password || '123';
    }

    try {
      const savedUser = Store.saveUser(payload);

      // Sincronizar sesión si es el usuario actual
      const cur = Auth.getCurrentUser();
      if (cur && (cur.id === savedUser.id || cur.username === savedUser.username)) {
        cur.name = savedUser.name;
        cur.role = savedUser.role;
        cur.roleName = savedUser.roleName;
        cur.permissions = savedUser.permissions;
        localStorage.setItem('mrose_session_v1', JSON.stringify(cur));
        App.updateUserProfileDisplay();
        App.updateSidebar();
      }

      App.closeModal();
      App.showToast(userId ? 'Usuario actualizado con éxito' : 'Usuario creado exitosamente', 'success');
      renderUsersView(document.getElementById('view-container'));
    } catch (err) {
      App.showToast(err.message, 'danger');
    }
  }

  function deleteUser(userId) {
    const user = Store.getUser(userId);
    if (!user) return;

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario ${user.name} (@${user.username})?`)) {
      try {
        Store.deleteUser(userId);
        App.showToast('Usuario eliminado correctamente', 'success');
        renderUsersView(document.getElementById('view-container'));
      } catch (e) {
        App.showToast(e.message, 'danger');
      }
    }
  }

  function toggleUserStatus(userId) {
    try {
      const updated = Store.toggleUserStatus(userId);
      App.showToast(`Estado de usuario actualizado a: ${updated.status}`, 'success');
      renderUsersView(document.getElementById('view-container'));
    } catch (e) {
      App.showToast(e.message, 'danger');
    }
  }


  // --- RENDERIZADO: MATRIZ DE CONTROL DE ACCESOS Y PERMISOS REDUCIDA (USUARIOS EN FILAS, MODULOS EN COLUMNAS) ---
  const MODULE_SHORT_NAMES = {
    'dashboard-gerencial': 'Gerencial',
    'dashboard-produccion': 'Producción',
    'dashboard-calidad-campo': 'Cal. Campo',
    'dashboard-calidad-proceso': 'Cal. Proceso',
    'dashboard-calidad': 'Calidad Global',
    'config-finca-datos': 'Datos Finca',
    'config-finca-catalogo': 'Catálogo',
    'config-finca-planos': 'Planos',
    'etiquetas-codigos': 'Etiquetas',
    'riego-control': 'Riego',
    'produccion-cosecha': 'Cosecha',
    'proyecciones-pinch': 'Pinch',
    'proyeccion-retornos': 'Retornos',
    'proceso-postcosecha': 'Poscosecha',
    'calidad-campo': 'Calidad Campo',
    'calidad-proceso': 'Calidad Proceso',
    'ventas-stock': 'Ventas',
    'accesos-usuarios': 'Usuarios',
    'accesos-permisos': 'Permisos'
  };

  const CATEGORY_META = {
    gerencia: { title: 'Gerencia', bg: '#e0e7ff', color: '#3730a3' },
    finca: { title: 'Finca', bg: '#ecfdf5', color: '#065f46' },
    trazabilidad: { title: 'Trazabilidad', bg: '#fef3c7', color: '#92400e' },
    campo: { title: 'Campo', bg: '#dcfce7', color: '#166534' },
    planificacion: { title: 'Planificación', bg: '#f3e8ff', color: '#6b21a8' },
    proyeccion: { title: 'Proyección', bg: '#e0f2fe', color: '#075985' },
    poscosecha: { title: 'Poscosecha', bg: '#ffedd5', color: '#9a3412' },
    calidad: { title: 'Calidad', bg: '#d1fae5', color: '#047857' },
    ventas: { title: 'Ventas', bg: '#e0f2fe', color: '#0369a1' },
    accesos: { title: 'Accesos', bg: '#f1f5f9', color: '#334155' }
  };

  function renderPermissionsView(container, options = {}) {
    if (!container) container = document.getElementById('view-container');
    if (!container) return;

    const users = Store.getUsers();
    const modules = Store.getModules().filter(m => m.status === 'active');

    // Agrupar módulos por categoría ordenada
    const categoryOrder = ['gerencia', 'finca', 'trazabilidad', 'campo', 'planificacion', 'proyeccion', 'poscosecha', 'calidad', 'ventas', 'accesos'];
    const categoriesWithModules = [];
    const orderedModules = [];

    categoryOrder.forEach(catKey => {
      const catMods = modules.filter(m => (m.category || 'gerencia') === catKey);
      if (catMods.length > 0) {
        categoriesWithModules.push({
          key: catKey,
          meta: CATEGORY_META[catKey] || { title: catKey.toUpperCase(), bg: '#f1f5f9', color: '#334155' },
          modules: catMods
        });
        orderedModules.push(...catMods);
      }
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Matriz de Control de Accesos y Permisos</h1>
          <p class="view-subtitle">Configura qué colaboradores tienen acceso a cada página y módulo del software MRosecuador en una tabla reducida y compacta.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Admin.renderPermissionsView(document.getElementById('view-container'))">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Recargar
          </button>
          <button class="btn btn-emerald" onclick="Admin.saveAllPermissionsMatrix()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Guardar Cambios de Permisos
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem; padding: 0.75rem 1rem;">
          <div class="card-title" style="font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>Matriz de Accesos (Usuarios en Filas • Módulos en Columnas)</span>
          </div>
          <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
            <input type="text" id="perm-matrix-search" placeholder="🔍 Filtrar colaboradores por nombre o rol..." class="form-control" style="width: 260px; padding: 0.3rem 0.65rem; font-size: 0.78rem;" oninput="Admin.filterPermissionsMatrix(this.value)">
            <span id="perm-visible-user-count" style="font-size: 0.75rem; color: var(--emerald-dark); font-weight: 700; background: var(--primary-50); padding: 0.25rem 0.65rem; border-radius: 99px; white-space: nowrap; border: 1px solid #a7f3d0;">
              ${users.length} Colaboradores
            </span>
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive" style="max-height: 75vh; overflow: auto;">
            <table class="data-table permissions-matrix">
              <thead>
                <!-- Fila 1 de Encabezado: Categorías agrupadas con Colspan -->
                <tr>
                  <th rowspan="2" class="sticky-user-col" style="min-width: 190px; max-width: 220px; vertical-align: middle; padding: 0.5rem 0.75rem; border-right: 2px solid var(--border-medium); z-index: 5;">
                    <div style="font-weight: 800; font-size: 0.82rem; color: #065f46;">Colaborador / Usuario</div>
                    <div style="font-size: 0.68rem; color: #64748b; font-weight: normal; margin-top: 2px;">Rol y accesos habilitados</div>
                  </th>
                  ${categoriesWithModules.map(cat => `
                    <th colspan="${cat.modules.length}" class="perm-cat-group-th" style="background: ${cat.meta.bg}; color: ${cat.meta.color}; border-bottom-color: ${cat.meta.color};">
                      ${cat.meta.title} (${cat.modules.length})
                    </th>
                  `).join('')}
                  <th rowspan="2" style="min-width: 58px; width: 58px; text-align: center; vertical-align: middle; font-size: 0.72rem; font-weight: 800; background: #f8fafc; border-left: 2px solid var(--border-medium); z-index: 4;">
                    Total
                  </th>
                </tr>

                <!-- Fila 2 de Encabezado: Módulos Individuales Reducidos con Texto Vertical -->
                <tr>
                  ${orderedModules.map(m => `
                    <th class="perm-col-mod-th" title="${escapeHtml(m.name)}: ${escapeHtml(m.description || '')}">
                      <div class="perm-col-mod-header">
                        <span class="perm-col-mod-title" title="${escapeHtml(m.name)}">${escapeHtml(MODULE_SHORT_NAMES[m.key] || m.name)}</span>
                        <div class="matrix-module-icon" style="width: 20px; height: 20px; font-size: 0.68rem; margin: 0 auto; flex-shrink: 0;" title="${escapeHtml(m.name)}">
                          ${App.getModuleIconSvg ? App.getModuleIconSvg(m.icon) : '●'}
                        </div>
                      </div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody id="permissions-matrix-tbody">
                ${users.map(u => {
                  const isSuperAdmin = u.username === 'admin';
                  const hasAll = isSuperAdmin || (Array.isArray(u.permissions) && u.permissions.includes('*'));
                  const totalAllowed = hasAll 
                    ? orderedModules.length 
                    : (Array.isArray(u.permissions) ? u.permissions.filter(k => orderedModules.some(m => m.key === k)).length : 0);

                  return `
                    <tr data-user-row="${u.id}" data-search-text="${escapeHtml((u.name + ' ' + u.username + ' ' + (u.roleName || u.role)).toLowerCase())}">
                      <td class="sticky-user-col" style="padding: 0.45rem 0.75rem; border-right: 2px solid var(--border-medium);">
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem;">
                          <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
                            <div class="user-avatar" style="width: 28px; height: 28px; font-size: 0.72rem; flex-shrink: 0; border: 1.5px solid #059669;">
                              ${u.avatar || 'US'}
                            </div>
                            <div style="overflow: hidden;">
                              <div style="font-weight: 700; font-size: 0.8rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(u.name)}">
                                ${escapeHtml(u.name)}
                              </div>
                              <div style="font-size: 0.67rem; color: #64748b; display: flex; align-items: center; gap: 0.35rem;">
                                <span>@${escapeHtml(u.username)}</span>
                                <span class="badge ${isSuperAdmin ? 'badge-admin' : 'badge-neutral'}" style="font-size: 0.62rem; padding: 0.05rem 0.35rem;">
                                  ${escapeHtml(u.roleName || u.role)}
                                </span>
                              </div>
                            </div>
                          </div>
                          ${isSuperAdmin ? `
                            <span class="badge badge-success" style="font-size: 0.6rem; padding: 0.1rem 0.35rem; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; white-space: nowrap;">Total (*)</span>
                          ` : ''}
                        </div>
                      </td>
                      ${orderedModules.map(m => {
                        const isChecked = hasAll || (Array.isArray(u.permissions) && u.permissions.includes(m.key));
                        return `
                          <td class="matrix-checkbox-cell" style="width: 44px; text-align: center; vertical-align: middle; padding: 0.35rem 0.15rem;">
                            <input type="checkbox" 
                                   class="matrix-perm-check matrix-perm-toggle" 
                                   data-user-id="${u.id}" 
                                   data-module-key="${m.key}" 
                                   ${isChecked ? 'checked' : ''} 
                                   ${isSuperAdmin ? 'disabled title="Superadministrador: acceso total inmutable"' : ''} 
                                   onchange="Admin.handlePermissionToggleChange('${u.id}', '${m.key}', this.checked)" 
                                   title="${escapeHtml(u.name)} -> ${escapeHtml(m.name)}: ${isChecked ? 'Habilitado' : 'Bloqueado'}">
                          </td>
                        `;
                      }).join('')}
                      <td style="text-align: center; vertical-align: middle; border-left: 2px solid var(--border-medium);">
                        <span id="user-perm-counter-${u.id}" class="badge ${totalAllowed === orderedModules.length ? 'badge-success' : 'badge-neutral'}" style="font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.45rem;">
                          ${totalAllowed} / ${orderedModules.length}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function filterPermissionsMatrix(query) {
    const q = (query || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#permissions-matrix-tbody tr[data-user-row]');
    let visibleCount = 0;

    rows.forEach(r => {
      const text = r.getAttribute('data-search-text') || '';
      if (!q || text.includes(q)) {
        r.style.display = '';
        visibleCount++;
      } else {
        r.style.display = 'none';
      }
    });

    const countEl = document.getElementById('perm-visible-user-count');
    if (countEl) {
      countEl.textContent = `${visibleCount} Colaboradores`;
    }
  }

  function updateUserPermCountBadge(userId) {
    const badge = document.getElementById(`user-perm-counter-${userId}`);
    if (!badge) return;
    const user = Store.getUser(userId);
    if (!user) return;
    const modules = Store.getModules().filter(m => m.status === 'active');
    const isSuper = user.username === 'admin' || (Array.isArray(user.permissions) && user.permissions.includes('*'));
    const total = isSuper 
      ? modules.length 
      : (Array.isArray(user.permissions) ? user.permissions.filter(k => modules.some(m => m.key === k)).length : 0);

    badge.textContent = `${total} / ${modules.length}`;
    if (total === modules.length) {
      badge.className = 'badge badge-success';
    } else {
      badge.className = 'badge badge-neutral';
    }
  }

  function handlePermissionToggleChange(userId, moduleKey, isChecked) {
    const user = Store.getUser(userId);
    if (!user || user.username === 'admin') return;

    let perms = Array.isArray(user.permissions) ? [...user.permissions] : [];
    if (isChecked) {
      if (!perms.includes(moduleKey)) perms.push(moduleKey);
    } else {
      perms = perms.filter(p => p !== moduleKey && p !== '*');
    }
    user.permissions = perms;
    Store.saveUser(user);
    updateUserPermCountBadge(userId);

    // Si es el usuario actual, actualizar sesión en localStorage y UI
    const cur = Auth.getCurrentUser();
    if (cur && (cur.id === user.id || cur.username === user.username)) {
      cur.permissions = user.permissions;
      localStorage.setItem('mrose_session_v1', JSON.stringify(cur));
      App.updateSidebar();

      // Si el usuario perdió acceso al módulo actualmente abierto, redirigir al primer módulo disponible
      const currentActive = localStorage.getItem('mrose_active_module_v1') || 'dashboard-gerencial';
      if (!Auth.hasAccess(currentActive)) {
        const allowed = Auth.getAllowedModules();
        if (allowed.length > 0) {
          App.navigateTo(allowed[0].key);
        } else {
          App.navigateTo('dashboard-gerencial');
        }
      }
    }

    App.showToast(`Acceso '${moduleKey}' ${isChecked ? 'habilitado' : 'retirado'} para ${user.name}`, 'info', 1600);
  }

  function setUserRowPermissions(userId, selectAll) {
    const user = Store.getUser(userId);
    if (!user || user.username === 'admin') return;

    const modules = Store.getModules().filter(m => m.status === 'active');
    const newPerms = selectAll ? modules.map(m => m.key) : [];

    user.permissions = newPerms;
    Store.saveUser(user);

    // Actualizar visualmente todos los checkboxes de la fila de ese usuario
    document.querySelectorAll(`.matrix-perm-toggle[data-user-id="${userId}"]`).forEach(cb => {
      cb.checked = selectAll;
    });

    updateUserPermCountBadge(userId);

    // Si es el usuario actual, sincronizar sesión
    const cur = Auth.getCurrentUser();
    if (cur && (cur.id === user.id || cur.username === user.username)) {
      cur.permissions = user.permissions;
      localStorage.setItem('mrose_session_v1', JSON.stringify(cur));
      App.updateSidebar();

      if (!selectAll) {
        const allowed = Auth.getAllowedModules();
        if (allowed.length > 0) {
          App.navigateTo(allowed[0].key);
        }
      }
    }

    App.showToast(`${selectAll ? 'Todos los accesos concedidos' : 'Todos los accesos desmarcados'} para ${user.name}`, 'success', 2000);
  }

  // Alias para compatibilidad de invocaciones
  function setUserColumnPermissions(userId, selectAll) {
    setUserRowPermissions(userId, selectAll);
  }

  function setRowPermissions(userId, selectAll) {
    setUserRowPermissions(userId, selectAll);
  }

  function setModuleColumnPermissions(moduleKey, selectAll) {
    const users = Store.getUsers();
    users.forEach(u => {
      if (u.username === 'admin') return;
      let perms = Array.isArray(u.permissions) ? [...u.permissions] : [];
      if (selectAll) {
        if (!perms.includes(moduleKey)) perms.push(moduleKey);
      } else {
        perms = perms.filter(p => p !== moduleKey && p !== '*');
      }
      u.permissions = perms;
      Store.saveUser(u);
      updateUserPermCountBadge(u.id);
    });

    // Actualizar visualmente los checkboxes de esa columna de módulo
    document.querySelectorAll(`.matrix-perm-toggle[data-module-key="${moduleKey}"]:not(:disabled)`).forEach(cb => {
      cb.checked = selectAll;
    });

    const cur = Auth.getCurrentUser();
    if (cur) {
      const fresh = Store.getUser(cur.id || cur.username);
      if (fresh) {
        cur.permissions = fresh.permissions;
        localStorage.setItem('mrose_session_v1', JSON.stringify(cur));
        App.updateSidebar();
      }
    }

    App.showToast(`Módulo '${moduleKey}' ${selectAll ? 'marcado' : 'desmarcado'} para todos los colaboradores`, 'success');
  }

  function setModuleRowPermissions(moduleKey, selectAll) {
    setModuleColumnPermissions(moduleKey, selectAll);
  }

  function saveAllPermissionsMatrix() {
    const users = Store.getUsers();
    const toggles = document.querySelectorAll('.matrix-perm-toggle');
    const userPermsMap = {};

    users.forEach(u => {
      userPermsMap[u.id] = [];
    });

    toggles.forEach(toggle => {
      const userId = toggle.getAttribute('data-user-id');
      const moduleKey = toggle.getAttribute('data-module-key');
      if (toggle.checked) {
        if (!userPermsMap[userId]) userPermsMap[userId] = [];
        userPermsMap[userId].push(moduleKey);
      }
    });

    users.forEach(u => {
      if (u.username === 'admin') {
        u.permissions = ['*'];
      } else {
        u.permissions = userPermsMap[u.id] || [];
      }
      Store.saveUser(u);
      updateUserPermCountBadge(u.id);
    });

    // Actualizar sesión actual si está activa
    const cur = Auth.getCurrentUser();
    if (cur) {
      const fresh = Store.getUser(cur.id || cur.username);
      if (fresh) {
        cur.permissions = fresh.permissions;
        localStorage.setItem('mrose_session_v1', JSON.stringify(cur));
      }
    }

    App.showToast('Matriz de accesos y permisos guardada correctamente', 'success');
    App.updateSidebar();
  }


  // --- RENDERIZADO: GESTOR DE NUEVAS PÁGINAS Y MÓDULOS FUTUROS ---
  function renderModulesView(container) {
    const modules = Store.getModules();
    const users = Store.getUsers();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Gestor de Nuevas Páginas y Módulos</h1>
          <p class="view-subtitle">Registra nuevas secciones del software que se acoplarán automáticamente al menú de navegación con control de accesos.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Admin.renderModulesView(document.getElementById('view-container'))">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Refrescar
          </button>
          <button class="btn btn-emerald" onclick="Admin.openNewModuleModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Crear Nueva Página / Módulo
          </button>
        </div>
      </div>

      <!-- Tarjeta Explicativa -->
      <div class="card" style="background: linear-gradient(135deg, var(--primary-50) 0%, #ffffff 100%); border-left: 5px solid var(--emerald-main);">
        <div class="card-body" style="padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="max-width: 800px;">
            <div style="font-weight: 800; font-size: 1.05rem; color: var(--emerald-dark); margin-bottom: 0.25rem;">
              🧩 Arquitectura Modular Escalable de MRosecuador
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
              Cualquier módulo que agregues aquí (por ejemplo: <em>"Exportaciones y Despachos"</em>, <em>"Bodega de Químicos"</em> o <em>"Riego y Clima"</em>) generará instantáneamente una interfaz de trabajo con métricas, tabla de registros y formulario de carga de datos, integrada en el menú para los usuarios autorizados.
            </div>
          </div>
          <button class="btn btn-emerald" onclick="Admin.openNewModuleModal()">
            + Nuevo Módulo
          </button>
        </div>
      </div>

      <!-- Listado de Módulos Registrados -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Catálogo de Módulos del Sistema
          </div>
          <span class="badge badge-success">${modules.length} Módulos Totales</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Módulo / Página</th>
                  <th>Identificador (Ruta)</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th>Usuarios Autorizados</th>
                  <th>Estado</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${modules.map(mod => {
                  const isSystem = mod.isSystem;
                  // Contar usuarios autorizados
                  const usersCount = users.filter(u => 
                    u.role === 'admin' || (Array.isArray(u.permissions) && (u.permissions.includes('*') || u.permissions.includes(mod.key)))
                  ).length;

                  return `
                    <tr>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                          <div class="matrix-module-icon">
                            ${App.getModuleIconSvg(mod.icon)}
                          </div>
                          <div>
                            <div style="font-weight: 700; color: var(--primary-900); font-size: 0.9rem;">${escapeHtml(mod.name)}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(mod.description || '')}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style="background: var(--bg-subtle); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">#/${escapeHtml(mod.key)}</code>
                      </td>
                      <td>
                        <span class="badge badge-neutral" style="text-transform: capitalize;">${escapeHtml(mod.category || 'Operaciones')}</span>
                      </td>
                      <td>
                        ${isSystem 
                          ? `<span class="badge badge-neutral" style="background:#e0f2fe; color:#0369a1;">Core del Sistema</span>`
                          : `<span class="badge badge-success" style="background:var(--primary-100); color:var(--emerald-dark);">Dinámico / Creado</span>`}
                      </td>
                      <td>
                        <span class="badge badge-neutral">${usersCount} de ${users.length} usuarios</span>
                      </td>
                      <td>
                        <span class="badge ${mod.status === 'active' ? 'badge-success' : 'badge-danger'}">
                          ${mod.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style="text-align: right;">
                        <div style="display: inline-flex; gap: 0.35rem;">
                          <button class="btn btn-secondary btn-icon-only" title="Ir y Probar Módulo" onclick="App.navigateTo('${mod.key}')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          </button>
                          ${!isSystem ? `
                            <button class="btn btn-secondary btn-icon-only btn-icon-danger" title="Eliminar Módulo" onclick="Admin.deleteCustomModule('${mod.id}')">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                          ` : ''}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function openNewModuleModal() {
    const roles = [
      { key: 'admin', label: '👑 Administradores' },
      { key: 'supervisor', label: '🌿 Supervisores de Producción' },
      { key: 'inspector', label: '🔍 Inspectores de Calidad' },
      { key: 'operador', label: '🌾 Operadores de Cosecha' }
    ];

    const icons = [
      { id: 'truck', label: 'Transporte / Despacho' },
      { id: 'box', label: 'Bodega / Inventario' },
      { id: 'dollar', label: 'Ventas / Finanzas' },
      { id: 'drop', label: 'Riego / Fertirriego' },
      { id: 'cloud', label: 'Clima / Invernadero' },
      { id: 'shield', label: 'Sanidad Vegetal' },
      { id: 'chart', label: 'Estadísticas / KPIs' },
      { id: 'puzzle', label: 'Genérico' }
    ];

    const bodyHtml = `
      <form id="form-new-module" onsubmit="event.preventDefault(); Admin.saveNewModuleFromForm();">
        <div style="display: flex; flex-direction: column; gap: 1.15rem;">
          
          <div class="form-group">
            <label class="form-label">Nombre del Nuevo Módulo o Página</label>
            <input type="text" id="mod-modal-name" class="form-control" required placeholder="Ej: Exportaciones y Despachos" oninput="Admin.autoGenerateSlug(this.value)">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Identificador de Ruta (Slug)</label>
              <div class="input-container">
                <span style="position: absolute; left: 0.85rem; color: var(--text-light); font-weight: 700; font-size: 0.9rem;">#/</span>
                <input type="text" id="mod-modal-key" class="form-control" style="padding-left: 2.2rem;" required placeholder="exportaciones-despachos">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Categoría en el Menú</label>
              <select id="mod-modal-category" class="form-control" style="padding-left: 0.85rem;">
                <option value="operaciones">Operaciones Florícolas</option>
                <option value="logistica">Logística y Exportación</option>
                <option value="insumos">Bodega y Químicos</option>
                <option value="administracion">Administración y Finanzas</option>
                <option value="otros">Otros Módulos</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Icono Representativo</label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
              ${icons.map((ic, idx) => `
                <label style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem; background: var(--bg-subtle); border: 1.5px solid var(--border-light); border-radius: 8px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">
                  <input type="radio" name="mod-modal-icon" value="${ic.id}" ${idx === 0 ? 'checked' : ''} style="accent-color: var(--emerald-main);">
                  <span>${ic.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Descripción del Objetivo del Módulo</label>
            <textarea id="mod-modal-desc" class="form-control" rows="2" style="padding-left: 0.85rem; resize: vertical;" placeholder="Ej: Control de cajas empacadas, destinos aéreos y clientes internacionales."></textarea>
          </div>

          <!-- Asignación Rápida de Accesos Iniciales -->
          <div style="padding: 1rem; background: var(--primary-50); border: 1px solid var(--primary-200); border-radius: var(--radius-md);">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--emerald-dark); margin-bottom: 0.5rem;">
              🔑 ¿Qué roles tendrán acceso inmediato a este módulo?
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              ${roles.map(r => `
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 600; color: var(--text-main); cursor: pointer;">
                  <input type="checkbox" class="mod-role-access" value="${r.key}" checked style="accent-color: var(--emerald-main);">
                  <span>${r.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

        </div>
      </form>
    `;

    App.showModal('Registrar Nueva Página / Módulo', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-new-module').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        Crear y Habilitar Módulo
      </button>
    `);
  }

  function autoGenerateSlug(name) {
    const slugInput = document.getElementById('mod-modal-key');
    if (!slugInput) return;
    const slug = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    slugInput.value = slug;
  }

  function saveNewModuleFromForm() {
    const name = document.getElementById('mod-modal-name').value.trim();
    const key = document.getElementById('mod-modal-key').value.trim();
    const category = document.getElementById('mod-modal-category').value;
    const icon = document.querySelector('input[name="mod-modal-icon"]:checked').value;
    const desc = document.getElementById('mod-modal-desc').value.trim();

    const selectedRoles = Array.from(document.querySelectorAll('.mod-role-access:checked')).map(c => c.value);

    try {
      const created = Store.saveModule({
        name,
        key,
        category,
        icon,
        description: desc,
        defaultRoles: selectedRoles
      });

      App.closeModal();
      App.showToast(`Módulo '${created.name}' creado y listo en el sistema`, 'success');
      App.updateSidebar();
      renderModulesView(document.getElementById('view-container'));
    } catch (err) {
      App.showToast(err.message, 'danger');
    }
  }

  function deleteCustomModule(moduleId) {
    if (confirm('¿Deseas eliminar este módulo personalizado? Los accesos asignados a los usuarios serán revocados.')) {
      try {
        Store.deleteModule(moduleId);
        App.showToast('Módulo eliminado del sistema', 'success');
        App.updateSidebar();
        renderModulesView(document.getElementById('view-container'));
      } catch (err) {
        App.showToast(err.message, 'danger');
      }
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return {
    renderUsersView,
    filterUsersTable,
    openUserModal,
    handleRoleChangeInModal,
    saveUserFromForm,
    deleteUser,
    toggleUserStatus,
    renderPermissionsView,
    filterPermissionsMatrix,
    saveAllPermissionsMatrix,
    handlePermissionToggleChange,
    setUserRowPermissions,
    setUserColumnPermissions,
    setRowPermissions,
    setModuleColumnPermissions,
    updateUserPermCountBadge,
    setRowPermissions,
    setModuleRowPermissions,
    renderModulesView,
    openNewModuleModal,
    autoGenerateSlug,
    saveNewModuleFromForm,
    deleteCustomModule
  };
})();

// Garantizar disponibilidad global
if (typeof window !== 'undefined') {
  window.Admin = Admin;
}

