/**
 * ==============================================================================
 * MRosecuador - Producción y Calidad
 * CONTROLADOR PRINCIPAL DE LA APLICACIÓN (Router, UI, Modales y Eventos)
 * ==============================================================================
 */

const App = (function () {
  let currentModuleKey = 'config-finca-planos';

  // Inicialización de la aplicación
  // Inicialización de la aplicación
  function init() {
    setupEventListeners();
    updateBrandDisplay();

    if (Auth.isAuthenticated()) {
      showAppScreen();
      const allowed = Auth.getAllowedModules();
      const lastModule = localStorage.getItem('mrose_active_module_v1');

      if (lastModule && Auth.hasAccess(lastModule)) {
        navigateTo(lastModule);
      } else if (Auth.isAdmin()) {
        navigateTo('dashboard-gerencial');
      } else if (allowed && allowed.length > 0) {
        navigateTo(allowed[0].key);
      } else {
        navigateTo('dashboard-gerencial');
      }
    } else {
      showAuthScreen();
    }
  }

  // --- CONTROL DE PANTALLAS (AUTH VS APP) ---
  function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app-screen').style.display = 'none';
  }

  function showAppScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'flex';
    updateUserProfileDisplay();
    updateBrandDisplay();
    updateSidebar();
  }

  // --- NAVEGACIÓN Y ENRUTAMIENTO ---
  function navigateTo(moduleKey, options = {}) {
    closeMobileMenu();

    const user = Auth.getCurrentUser();
    if (!user) {
      showAuthScreen();
      return;
    }

    // Normalización de rutas y retrocompatibilidad
    if (moduleKey === 'dashboard') {
      moduleKey = 'dashboard-gerencial';
    } else if (moduleKey === 'produccion') {
      moduleKey = 'dashboard-produccion';
    } else if (moduleKey === 'poscosecha' || moduleKey === 'postcosecha') {
      moduleKey = 'proceso-postcosecha';
    } else if (moduleKey === 'calidad' || moduleKey === 'calidad-checklists' || moduleKey === 'calidad-campo') {
      moduleKey = 'calidad-campo';
    } else if (moduleKey === 'calidad-proceso' || moduleKey === 'calidad-bunch' || moduleKey === 'calidad-bonche' || moduleKey === 'calidad-bonches') {
      moduleKey = 'calidad-proceso';
    } else if (moduleKey === 'trazabilidad' || moduleKey === 'etiquetas') {
      moduleKey = 'etiquetas-codigos';
    } else if (moduleKey === 'campo' || moduleKey === 'riego') {
      moduleKey = 'riego-control';
    } else if (moduleKey === 'planificacion' || moduleKey === 'pinch' || moduleKey === 'proyecciones-pinch') {
      moduleKey = 'proyecciones-pinch';
    } else if (moduleKey === 'proyeccion' || moduleKey === 'proyecciones' || moduleKey === 'retornos' || moduleKey === 'retorno' || moduleKey === 'proyeccion-retornos') {
      moduleKey = 'proyeccion-retornos';
    } else if (moduleKey === 'accesos' || moduleKey === 'usuarios' || moduleKey === 'admin-users') {
      moduleKey = 'accesos-usuarios';
    } else if (moduleKey === 'permisos' || moduleKey === 'admin-permissions') {
      moduleKey = 'accesos-permisos';
    } else if (moduleKey.startsWith('admin-')) {
      moduleKey = 'accesos-usuarios';
    }

    // Validación de permisos de acceso por usuario
    if (!Auth.hasAccess(moduleKey)) {
      renderAccessDenied(moduleKey);
      return;
    }

    currentModuleKey = moduleKey;
    localStorage.setItem('mrose_active_module_v1', currentModuleKey);

    // Asegurar que la categoría que contiene el módulo activo esté desplegada para que siempre sea visible
    if (typeof getNavSections === 'function') {
      getNavSections().forEach(sec => {
        if (sec.modules.some(m => m.key === moduleKey)) {
          collapsedNavSections.delete(sec.id);
        }
      });
      updateSidebar();
    }

    // Actualizar enlaces activos en la barra lateral
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-module') === moduleKey) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const container = document.getElementById('view-container');
    const allModules = Store.getModules();
    const mod = allModules.find(m => m.key === moduleKey) || { name: 'Dashboard Gerencial' };

    // Actualizar migas de pan (Breadcrumbs)
    const breadcrumbCurrent = document.getElementById('header-breadcrumb-title');
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = mod.name;
    }

    // Enrutador de vistas
    switch (moduleKey) {
      case 'dashboard':
      case 'dashboard-gerencial':
        Modules.renderGerencialDashboard(container);
        break;
      case 'dashboard-produccion':
        Modules.renderProductionDashboard(container);
        break;
      case 'dashboard-calidad-campo':
        Modules.renderQualityFieldDashboard(container);
        break;
      case 'dashboard-calidad-proceso':
        Modules.renderQualityProcessDashboard(container);
        break;
      case 'dashboard-calidad':
        Modules.renderQualityDashboard(container);
        break;
      case 'config-finca-datos':
        Modules.renderFarmInfo(container);
        break;
      case 'config-finca-catalogo':
        Modules.renderVarietiesCatalog(container);
        break;
      case 'config-finca-planos':
        Modules.renderFarmPlans(container);
        break;
      case 'etiquetas-codigos':
        Modules.renderBarcodeLabels(container);
        break;
      case 'riego-control':
        Modules.renderIrrigationControl(container);
        break;
      case 'produccion-cosecha':
        Modules.renderHarvestProduction(container);
        break;
      case 'proyecciones-pinch':
        Modules.renderProjectionsModule(container);
        break;
      case 'proyeccion-retornos':
        Modules.renderReturnProjectionsModule(container);
        break;
      case 'proceso-postcosecha':
        Modules.renderProcessModule(container);
        break;
      case 'calidad-campo':
        Modules.renderQualityFieldModule(container);
        break;
      case 'calidad-proceso':
        Modules.renderQualityProcessModule(container);
        break;
      case 'calidad-checklists':
        Modules.renderQualityFieldModule(container);
        break;
      case 'ventas-stock':
        Modules.renderSalesModule(container);
        break;
      case 'accesos-usuarios':
        Admin.renderUsersView(container);
        break;
      case 'accesos-permisos':
        Admin.renderPermissionsView(container, options);
        break;
      default:
        currentModuleKey = 'dashboard-gerencial';
        Modules.renderGerencialDashboard(container);
        break;
    }

    // Scroll suave arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderAccessDenied(moduleKey) {
    const container = document.getElementById('view-container');
    container.innerHTML = `
      <div style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--rose-100); color: var(--rose-600); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: var(--shadow-rose);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h2 style="font-size: 1.75rem; color: var(--primary-900); margin-bottom: 0.5rem;">Acceso Restringido</h2>
        <p style="max-width: 500px; color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
          No tienes permisos autorizados para acceder a esta sección.
        </p>
        <button class="btn btn-emerald" onclick="App.navigateTo('config-finca-catalogo')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5 1.2.7 2 2 2 3.5a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-1.5.8-2.8 2-3.5-1.2-.7-2-2-2-3.5a4 4 0 0 1 4-4z"></path></svg>
          Volver al Catálogo de Variedades
        </button>
      </div>
    `;
  }

  function renderNotFound() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
      <div style="min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
        <h2 style="font-size: 1.6rem; color: var(--primary-900);">Módulo no encontrado</h2>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem;">La página solicitada no está configurada en este momento.</p>
        <button class="btn btn-emerald" onclick="App.navigateTo('config-finca-catalogo')">Regresar al Catálogo</button>
      </div>
    `;
  }

  let fincaSubmenuOpen = true;

  function toggleNavSubmenu(subgroupId) {
    const el = document.getElementById(subgroupId);
    if (el) {
      el.classList.toggle('open');
      fincaSubmenuOpen = el.classList.contains('open');
    }
  }

  // --- ACTUALIZACIÓN DE BARRA LATERAL (ORGANIZACIÓN POR SECCIONES COMPACTAS) ---
  const ALL_SECTION_IDS = [
    'sec-ejecutivo', 
    'sec-config', 
    'sec-trazabilidad',
    'sec-campo', 
    'sec-planificacion',
    'sec-proyeccion', 
    'sec-poscosecha', 
    'sec-calidad', 
    'sec-comercial', 
    'sec-accesos'
  ];
  // El Panel Ejecutivo (Dashboard Gerencial) se mantiene desplegado por defecto para máxima visibilidad
  const collapsedNavSections = new Set([
    'sec-config', 
    'sec-trazabilidad',
    'sec-campo', 
    'sec-planificacion',
    'sec-proyeccion', 
    'sec-poscosecha', 
    'sec-calidad', 
    'sec-comercial', 
    'sec-accesos'
  ]);

  function getNavSections() {
    return [
      {
        id: 'sec-ejecutivo',
        title: 'Panel Ejecutivo',
        modules: [
          { key: 'dashboard-gerencial', name: 'Dashboard Gerencial', icon: 'trending-up' },
          { key: 'dashboard-produccion', name: 'Dashboard de Producción', icon: 'chart' },
          { key: 'dashboard-calidad-campo', name: 'Dashboard Calidad Campo', icon: 'clipboard' },
          { key: 'dashboard-calidad-proceso', name: 'Dashboard Calidad Proceso', icon: 'award' }
        ]
      },
      {
        id: 'sec-config',
        title: 'Configuración Finca',
        modules: [
          { key: 'config-finca-datos', name: 'Datos Finca', icon: 'building' },
          { key: 'config-finca-catalogo', name: 'Catálogo de Variedades', icon: 'flower' },
          { key: 'config-finca-planos', name: 'Plano de Finca', icon: 'map' }
        ]
      },
      {
        id: 'sec-trazabilidad',
        title: 'Trazabilidad',
        modules: [
          { key: 'etiquetas-codigos', name: 'Códigos y Etiquetas', icon: 'barcode' }
        ]
      },
      {
        id: 'sec-campo',
        title: 'Campo',
        modules: [
          { key: 'riego-control', name: 'Control de Riego (pH / CE)', icon: 'drop' },
          { key: 'produccion-cosecha', name: 'Registro de Producción', icon: 'sprout' }
        ]
      },
      {
        id: 'sec-planificacion',
        title: 'Planificación',
        modules: [
          { key: 'proyecciones-pinch', name: 'Planificación de Pinch', icon: 'calendar' }
        ]
      },
      {
        id: 'sec-proyeccion',
        title: 'Proyección',
        modules: [
          { key: 'proyeccion-retornos', name: 'Proyección de Retornos', icon: 'trending-up' }
        ]
      },
      {
        id: 'sec-poscosecha',
        title: 'Poscosecha',
        modules: [
          { key: 'proceso-postcosecha', name: 'Proceso y Clasificación', icon: 'process' }
        ]
      },
      {
        id: 'sec-calidad',
        title: 'Calidad',
        modules: [
          { key: 'calidad-campo', name: 'Calidad Campo', icon: 'sprout' },
          { key: 'calidad-proceso', name: 'Calidad Proceso', icon: 'award' }
        ]
      },
      {
        id: 'sec-comercial',
        title: 'Comercialización',
        modules: [
          { key: 'ventas-stock', name: 'Ventas y Stock', icon: 'cart' }
        ]
      },
      {
        id: 'sec-accesos',
        title: 'Accesos',
        modules: [
          { key: 'accesos-usuarios', name: 'Usuarios & Plataformas', icon: 'shield' },
          { key: 'accesos-permisos', name: 'Matriz de Permisos', icon: 'check' }
        ]
      }
    ];
  }

  function toggleNavSection(secId) {
    if (collapsedNavSections.has(secId)) {
      collapsedNavSections.delete(secId);
    } else {
      collapsedNavSections.add(secId);
    }
    const secEl = document.getElementById('nav-sec-' + secId);
    if (secEl) {
      if (collapsedNavSections.has(secId)) {
        secEl.classList.add('collapsed');
      } else {
        secEl.classList.remove('collapsed');
      }
    }
  }

  function updateBrandDisplay() {
    try {
      const info = Store.getFarmInfo ? Store.getFarmInfo() : null;
      if (!info) return;

      document.querySelectorAll('.brand-name').forEach(el => {
        el.textContent = info.name || 'MRosecuador';
      });
      document.querySelectorAll('.brand-sub').forEach(el => {
        el.textContent = info.location ? (info.canton || info.location) : 'Configuración de Finca';
      });
      document.querySelectorAll('.sidebar-logo').forEach(el => {
        if (info.logo) el.src = info.logo;
      });

      // Permitir hacer clic en la marca del sidebar para ir de inmediato al Dashboard Gerencial
      const brandBox = document.querySelector('.sidebar-brand');
      if (brandBox) {
        brandBox.style.cursor = 'pointer';
        brandBox.onclick = () => navigateTo('dashboard-gerencial');
        brandBox.title = 'Ir al Dashboard Gerencial';
      }
    } catch (e) {
      console.warn('Error al actualizar datos de marca en pantalla:', e);
    }
  }

  function updateSidebar() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const navContainer = document.getElementById('sidebar-nav-container');
    if (!navContainer) return;

    const sections = getNavSections();

    const navHtml = sections.map(sec => {
      // Filtrar módulos para los que el usuario tiene acceso
      const allowedModules = sec.modules.filter(mod => Auth.hasAccess(mod.key));
      if (allowedModules.length === 0) return ''; // No mostrar secciones vacías sin permisos

      const isCollapsed = collapsedNavSections.has(sec.id);

      return `
        <div class="nav-section ${isCollapsed ? 'collapsed' : ''}" id="nav-sec-${sec.id}" style="margin-bottom: 0.35rem;">
          <button type="button" class="nav-section-header" onclick="App.toggleNavSection('${sec.id}')" title="Desplegar / Colapsar ${escapeHtml(sec.title)}">
            <span class="nav-section-title">
              ${escapeHtml(sec.title)}
            </span>
            <svg class="nav-section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <ul class="nav-list">
            ${allowedModules.map(mod => `
              <li class="nav-item">
                <button class="nav-link ${mod.key === currentModuleKey ? 'active' : ''}" data-module="${mod.key}" onclick="App.navigateTo('${mod.key}')">
                  ${getModuleIconSvg(mod.icon)}
                  <span>${escapeHtml(mod.name)}</span>
                </button>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }).join('');

    navContainer.innerHTML = navHtml;
  }

  function updateUserProfileDisplay() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const avatarEl = document.getElementById('user-avatar-badge');
    const nameEl = document.getElementById('user-name-display');
    const roleEl = document.getElementById('user-role-display');

    if (avatarEl) avatarEl.textContent = user.avatar || 'US';
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.roleName || user.role;
  }

  // --- CONTROL DEL MENÚ MÓVIL (DRAWER) ---
  function toggleMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
    }
  }

  function closeMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    }
  }

  // --- CONTROL DE MODALES ---
  function showModal(title, bodyHtml, footerHtml = '') {
    const modal = document.getElementById('app-modal');
    const titleEl = document.getElementById('modal-title-text');
    const bodyEl = document.getElementById('modal-body-content');
    const footerEl = document.getElementById('modal-footer-content');

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = bodyHtml;
    if (footerEl) footerEl.innerHTML = footerHtml;

    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal) modal.classList.remove('active');
  }

  // --- NOTIFICACIONES TOAST ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-main)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--rose-600)" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span style="flex:1;">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Formulario de Login
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userInput = document.getElementById('login-username').value;
        const passInput = document.getElementById('login-password').value;
        const remember = document.getElementById('login-remember')?.checked;

        try {
          const session = Auth.login(userInput, passInput, remember);
          showToast(`¡Bienvenido(a), ${session.name}!`, 'success');
          showAppScreen();
          const allowed = Auth.getAllowedModules();
          if (Auth.isAdmin()) {
            navigateTo('dashboard-gerencial');
          } else if (allowed && allowed.length > 0) {
            navigateTo(allowed[0].key);
          } else {
            navigateTo('dashboard-gerencial');
          }
        } catch (err) {
          showToast(err.message, 'danger');
        }
      });
    }

    // Alternar visibilidad de contraseña
    const togglePassBtn = document.getElementById('btn-toggle-password');
    if (togglePassBtn) {
      togglePassBtn.addEventListener('click', function () {
        const passField = document.getElementById('login-password');
        if (passField) {
          const isPass = passField.type === 'password';
          passField.type = isPass ? 'text' : 'password';
          togglePassBtn.innerHTML = isPass 
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        }
      });
    }

    // Cerrar modal al presionar Escape o clic fuera
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    const modalBackdrop = document.getElementById('app-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) closeModal();
      });
    }
  }

  // Carga rápida con cuentas de prueba (llena los campos sin ingresar automáticamente)
  function fillDemoAccount(username, password) {
    const userField = document.getElementById('login-username');
    const passField = document.getElementById('login-password');
    if (userField && passField) {
      userField.value = username;
      passField.value = password;
      showToast(`Datos de @${username} cargados. Haz clic en "Ingresar al Sistema" para acceder.`, 'info');
      const submitBtn = document.getElementById('btn-submit-login');
      if (submitBtn) {
        submitBtn.focus();
        submitBtn.classList.add('btn-pulse-glow');
        setTimeout(() => submitBtn.classList.remove('btn-pulse-glow'), 1800);
      }
    }
  }

  function handleLogout() {
    if (confirm('¿Deseas cerrar tu sesión en MRosecuador?')) {
      Auth.logout();
      showToast('Sesión cerrada con éxito', 'success');
      showAuthScreen();
    }
  }

  // Iconos SVG reutilizables
  function getModuleIconSvg(iconName) {
    const icons = {
      'dashboard': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
      'building': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line><line x1="9" y1="14" x2="9" y2="14.01"></line><line x1="15" y1="14" x2="15" y2="14.01"></line><line x1="9" y1="18" x2="9" y2="18.01"></line><line x1="15" y1="18" x2="15" y2="18.01"></line></svg>`,
      'sprout': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20h10"></path><path d="M10 20c5.5-2.5.8-6.4 3-10"></path><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"></path><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4.3 1.1-4.9 2z"></path></svg>`,
      'award': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
      'map': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`,
      'flower': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5 1.2.7 2 2 2 3.5a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-1.5.8-2.8 2-3.5-1.2-.7-2-2-2-3.5a4 4 0 0 1 4-4z"></path></svg>`,
      'barcode': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5v14M6 5v14M10 5v14M13 5v14M16 5v14M18 5v14M21 5v14"/></svg>`,
      'users': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      'shield': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
      'puzzle': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.439 7.85c-.049-.322-.059-.649-.03-.972.1-.968.618-1.785 1.4-2.279.78-.493 1.191-1.397 1.07-2.32-.121-.923-.762-1.688-1.65-1.968-.888-.28-1.859-.029-2.49.646-.632.675-1.57.994-2.529.855-.959-.14-1.763-.699-2.17-1.511-.408-.813-1.246-1.3-2.155-1.251-.91.05-1.693.633-2.012 1.49-.32.857-.14 1.82.46 2.474.6.654.834 1.583.626 2.506-.208.922-.843 1.66-1.71 1.989-.868.328-1.458 1.104-1.517 2.014-.06.91.42 1.75 1.232 2.158.812.408 1.371 1.212 1.511 2.171.139.959-.18 1.897-.855 2.529-.675.631-.926 1.602-.646 2.49.28.888 1.045 1.529 1.968 1.65.923.121 1.827-.29 2.32-1.07.494-.782 1.311-1.3 2.279-1.4.968-.1 1.898.24 2.51.91.611.67 1.545.989 2.464.83.92-.16 1.636-.85 1.84-1.77.204-.92-.115-1.85-.828-2.46-.713-.61-1.053-1.54-.91-2.5.143-.96.7-1.76 1.51-2.17.81-.41 1.3-1.25 1.25-2.16-.05-.91-.63-1.69-1.49-2.01z"></path></svg>`,
      'truck': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
      'box': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
      'dollar': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
      'drop': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
      'cloud': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
      'chart': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
      'check': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
      'trending-up': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
      'calendar': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      'process': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
      'clipboard': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>`,
      'cart': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`
    };
    return icons[iconName] || icons['puzzle'];
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
    init,
    navigateTo,
    updateSidebar,
    updateBrandDisplay,
    toggleNavSection,
    toggleNavSubmenu,
    toggleMobileMenu,
    closeMobileMenu,
    showModal,
    closeModal,
    showToast,
    fillDemoAccount,
    handleLogout,
    getModuleIconSvg
  };
})();

// Garantizar disponibilidad global
if (typeof window !== 'undefined') {
  window.App = App;
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', function () {
  App.init();
});

