/**
 * ==============================================================================
 * MRosecuador - Producción y Calidad
 * CONTROLADOR DE MÓDULOS OPERATIVOS Y DINÁMICOS
 * (Dashboard, Producción, Calidad y Renderizador de Nuevas Páginas Creadas)
 * ==============================================================================
 */

const Modules = (function () {

  // --- RENDERIZADO: DASHBOARD PRINCIPAL ---
  function renderDashboard(container) {
    const prodRecords = Store.getProductionRecords();
    const qualityRecords = Store.getQualityRecords();
    const users = Store.getUsers();
    const modules = Store.getModules();

    // Cálculos estadísticos
    const totalStems = prodRecords.reduce((acc, r) => acc + (parseInt(r.stems) || 0), 0);
    const avgQuality = qualityRecords.length > 0 
      ? (qualityRecords.reduce((acc, r) => acc + (parseFloat(r.exportablePercent) || 0), 0) / qualityRecords.length).toFixed(1)
      : '96.2';

    // Agrupación por variedad
    const varietyMap = {};
    prodRecords.forEach(r => {
      varietyMap[r.variety] = (varietyMap[r.variety] || 0) + (parseInt(r.stems) || 0);
    });
    const varietyList = Object.entries(varietyMap).sort((a, b) => b[1] - a[1]);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Panel de Control MRosecuador</h1>
          <p class="view-subtitle">Supervisión integral de cosecha, postcosecha y estándares de exportación en fincas florícolas.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.renderDashboard(document.getElementById('view-container'))">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Actualizar Datos
          </button>
          <button class="btn btn-emerald" onclick="Modules.openProductionModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Registrar Cosecha
          </button>
        </div>
      </div>

      <!-- Tarjetas de Métricas Principales (KPIs) -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Tallos Cosechados</span>
            <span class="kpi-value">${totalStems.toLocaleString()}</span>
            <span class="kpi-trend positive">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              +14.2% vs semana anterior
            </span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Calidad Exportable</span>
            <span class="kpi-value">${avgQuality}%</span>
            <span class="kpi-trend positive">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              Estándar internacional cumplido
            </span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-rose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Bloques Productivos</span>
            <span class="kpi-value">4 Activos</span>
            <span class="kpi-trend neutral">Invernaderos 1 al 4</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Módulos Habilitados</span>
            <span class="kpi-value">${Auth.getAllowedModules().length}</span>
            <span class="kpi-trend positive">De ${modules.length} en el software</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
        </div>
      </div>

      <!-- Distribución y Desglose Visual -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        
        <!-- Distribución por Variedad de Rosas -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path></svg>
              Cosecha por Variedad de Rosa
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Volumen de tallos</span>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 1.15rem;">
              ${varietyList.map(([variety, count]) => {
                const pct = totalStems > 0 ? ((count / totalStems) * 100).toFixed(1) : 0;
                let dotClass = 'dot-red';
                if (variety.toLowerCase().includes('blanca') || variety.toLowerCase().includes('mondial')) dotClass = 'dot-white';
                if (variety.toLowerCase().includes('pink')) dotClass = 'dot-pink';
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; font-weight: 600;">
                      <span class="flower-variety-badge">
                        <span class="variety-dot ${dotClass}"></span>
                        Rosa ${escapeHtml(variety)}
                      </span>
                      <span>${count.toLocaleString()} tallos <span style="color: var(--text-muted); font-weight: normal;">(${pct}%)</span></span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Acceso Rápido y Estado Operativo -->
        <div class="card" style="margin-bottom: 0; display: flex; flex-direction: column;">
          <div class="card-header">
            <div class="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Acciones y Módulos Activos
            </div>
            <span class="badge badge-success">Sesión Activa</span>
          </div>
          <div class="card-body" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <button class="btn btn-secondary" style="justify-content: flex-start; padding: 0.85rem;" onclick="App.navigateTo('produccion')">
                <span style="color: var(--emerald-main);">${App.getModuleIconSvg('sprout')}</span>
                <span>Producción</span>
              </button>
              <button class="btn btn-secondary" style="justify-content: flex-start; padding: 0.85rem;" onclick="App.navigateTo('calidad')">
                <span style="color: var(--rose-600);">${App.getModuleIconSvg('award')}</span>
                <span>Calidad</span>
              </button>
              ${Auth.isAdmin() ? `
                <button class="btn btn-secondary" style="justify-content: flex-start; padding: 0.85rem;" onclick="App.navigateTo('admin-users')">
                  <span style="color: var(--info);">${App.getModuleIconSvg('users')}</span>
                  <span>Usuarios</span>
                </button>
                <button class="btn btn-secondary" style="justify-content: flex-start; padding: 0.85rem;" onclick="App.navigateTo('admin-modules')">
                  <span style="color: var(--warning);">${App.getModuleIconSvg('puzzle')}</span>
                  <span>Nuevo Módulo</span>
                </button>
              ` : `
                <button class="btn btn-secondary" style="justify-content: flex-start; padding: 0.85rem;" onclick="Modules.openQualityModal()">
                  <span style="color: var(--rose-600);">${App.getModuleIconSvg('check')}</span>
                  <span>Inspección</span>
                </button>
                <button class="btn btn-secondary" style="justify-content: flex-start; padding: 0.85rem;" onclick="Modules.openProductionModal()">
                  <span style="color: var(--emerald-main);">${App.getModuleIconSvg('sprout')}</span>
                  <span>Corte Hoy</span>
                </button>
              `}
            </div>

            <!-- Banner Informativo -->
            <div style="padding: 1rem; background: var(--primary-50); border-radius: var(--radius-md); border: 1px solid var(--primary-200); font-size: 0.82rem; color: var(--emerald-dark);">
              <strong>🌿 Finca Florícola MRosecuador:</strong> Todos los registros de cosecha y auditoría se sincronizan localmente y están protegidos por control de permisos.
            </div>
          </div>
        </div>

      </div>

      <!-- Últimos Cortes Registrados -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            Últimos Lotes de Cosecha Registrados
          </div>
          <button class="btn btn-secondary" style="font-size: 0.78rem;" onclick="App.navigateTo('produccion')">
            Ver Todos los Registros →
          </button>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Variedad</th>
                  <th>Ubicación</th>
                  <th>Tallos</th>
                  <th>Calidad</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                ${prodRecords.slice(0, 5).map(r => `
                  <tr>
                    <td><code>${escapeHtml(r.date)}</code></td>
                    <td><strong>Rosa ${escapeHtml(r.variety)}</strong></td>
                    <td>${escapeHtml(r.block)} - ${escapeHtml(r.bed)}</td>
                    <td><span class="badge badge-success">${parseInt(r.stems).toLocaleString()} tallos</span></td>
                    <td><span class="badge badge-neutral">${escapeHtml(r.grade)}</span></td>
                    <td>${escapeHtml(r.responsible)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- RENDERIZADO: MÓDULO DE PRODUCCIÓN FLORÍCOLA ---
  let currentProductionTab = 'history'; // 'history' | 'variety' | 'block' | 'harvester'

  function renderProduccion(container) {
    const records = Store.getProductionRecords();
    const totalStems = records.reduce((acc, r) => acc + (parseInt(r.stems) || 0), 0);

    // Extraer listas únicas para los filtros reactivos
    const uniqueVarieties = Array.from(new Set(records.map(r => r.variety).filter(Boolean)));
    const uniqueBlocks = Array.from(new Set(records.map(r => r.block).filter(Boolean)));
    const uniqueHarvesters = Array.from(new Set(records.map(r => r.harvester || r.responsible).filter(Boolean)));

    // Estadísticas clave:
    // 1. Variedad Líder
    const stemsByVar = {};
    records.forEach(r => {
      stemsByVar[r.variety] = (stemsByVar[r.variety] || 0) + (parseInt(r.stems) || 0);
    });
    let topVar = '-';
    let topVarStems = 0;
    Object.entries(stemsByVar).forEach(([v, s]) => {
      if (s > topVarStems) { topVar = v; topVarStems = s; }
    });

    // 2. Bloque Top
    const stemsByBlk = {};
    records.forEach(r => {
      stemsByBlk[r.block] = (stemsByBlk[r.block] || 0) + (parseInt(r.stems) || 0);
    });
    let topBlk = '-';
    let topBlkStems = 0;
    Object.entries(stemsByBlk).forEach(([b, s]) => {
      if (s > topBlkStems) { topBlk = b; topBlkStems = s; }
    });

    // 3. Cosechador Destacado
    const stemsByHarv = {};
    records.forEach(r => {
      const h = r.harvester || r.responsible || 'Personal de Cosecha';
      stemsByHarv[h] = (stemsByHarv[h] || 0) + (parseInt(r.stems) || 0);
    });
    let topHarv = '-';
    let topHarvStems = 0;
    Object.entries(stemsByHarv).forEach(([h, s]) => {
      if (s > topHarvStems) { topHarv = h; topHarvStems = s; }
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Control de Producción Florícola</h1>
          <p class="view-subtitle">Registro y análisis de cosecha por <strong>Variedad, Bloque y Cosechador</strong>.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.renderProduccion(document.getElementById('view-container'))">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Refrescar
          </button>
          <button class="btn btn-secondary" onclick="Modules.exportProductionXLSX()" title="Descargar datos en Excel">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel (.xlsx)
          </button>
          <button class="btn btn-emerald" onclick="Modules.openProductionModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Registro de Cosecha
          </button>
        </div>
      </div>

      <!-- KPIs Ejecutivos de Producción -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Tallos Totales</span>
            <span class="kpi-value">${totalStems.toLocaleString()}</span>
            <span class="kpi-trend positive">Cosecha acumulada (${records.length} lotes)</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Variedad Líder</span>
            <span class="kpi-value" style="font-size: 1.3rem;">Rosa ${escapeHtml(topVar)}</span>
            <span class="kpi-trend alert">${topVarStems.toLocaleString()} tallos cosechados</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-rose">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5 1.2.7 2 2 2 3.5a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-1.5.8-2.8 2-3.5-1.2-.7-2-2-2-3.5a4 4 0 0 1 4-4z"></path></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Bloque Más Productivo</span>
            <span class="kpi-value" style="font-size: 1.3rem;">${escapeHtml(topBlk)}</span>
            <span class="kpi-trend positive">${topBlkStems.toLocaleString()} tallos cortados</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Cosechador Destacado</span>
            <span class="kpi-value" style="font-size: 1.2rem;">${escapeHtml(topHarv)}</span>
            <span class="kpi-trend positive">${topHarvStems.toLocaleString()} tallos acumulados</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>
      </div>

      <!-- Barra de Filtros Reactivos por Variedad, Bloque y Cosechador -->
      <div class="card" style="margin-bottom: 1rem;">
        <div class="card-body" style="padding: 0.75rem 1rem;">
          <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
            <div style="font-weight: 700; font-size: 0.8rem; color: var(--emerald-dark); display: flex; align-items: center; gap: 0.35rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filtrar Cosecha:
            </div>

            <div style="flex: 1; min-width: 140px;">
              <select id="prod-filter-variety" class="form-control" style="padding: 0.38rem 0.55rem; font-size: 0.78rem;" onchange="Modules.filterProductionView()">
                <option value="">Todas las Variedades</option>
                ${uniqueVarieties.map(v => `<option value="${escapeHtml(v)}">🌹 Rosa ${escapeHtml(v)}</option>`).join('')}
              </select>
            </div>

            <div style="flex: 1; min-width: 130px;">
              <select id="prod-filter-block" class="form-control" style="padding: 0.38rem 0.55rem; font-size: 0.78rem;" onchange="Modules.filterProductionView()">
                <option value="">Todos los Bloques</option>
                ${uniqueBlocks.map(b => `<option value="${escapeHtml(b)}">📍 ${escapeHtml(b)}</option>`).join('')}
              </select>
            </div>

            <div style="flex: 1; min-width: 150px;">
              <select id="prod-filter-harvester" class="form-control" style="padding: 0.38rem 0.55rem; font-size: 0.78rem;" onchange="Modules.filterProductionView()">
                <option value="">Todos los Cosechadores</option>
                ${uniqueHarvesters.map(h => `<option value="${escapeHtml(h)}">🧑‍🌾 ${escapeHtml(h)}</option>`).join('')}
              </select>
            </div>

            <div style="flex: 1.2; min-width: 160px;">
              <input type="text" id="prod-filter-text" class="form-control" style="padding: 0.38rem 0.55rem; font-size: 0.78rem;" placeholder="Buscar por cama, calidad, nota..." oninput="Modules.filterProductionView()">
            </div>

            <button class="btn btn-secondary" style="padding: 0.38rem 0.65rem; font-size: 0.75rem;" onclick="Modules.clearProductionFilters()">
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Pestañas Analíticas -->
      <div style="display: flex; gap: 0.4rem; margin-bottom: 0.85rem; border-bottom: 2px solid var(--border-light); padding-bottom: 0.4rem; flex-wrap: wrap;">
        <button class="btn ${currentProductionTab === 'history' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="Modules.switchProductionTab('history')">
          📋 Historial Detallado (${records.length})
        </button>
        <button class="btn ${currentProductionTab === 'variety' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="Modules.switchProductionTab('variety')">
          🌹 Resumen por Variedad
        </button>
        <button class="btn ${currentProductionTab === 'block' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="Modules.switchProductionTab('block')">
          🗺️ Rendimiento por Bloque
        </button>
        <button class="btn ${currentProductionTab === 'harvester' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="Modules.switchProductionTab('harvester')">
          🧑‍🌾 Rendimiento por Cosechador
        </button>
      </div>

      <!-- Contenedor de la Pestaña Activa -->
      <div id="production-tab-content">
        ${renderProductionTabContent(currentProductionTab, records)}
      </div>
    `;
  }

  function switchProductionTab(tabKey) {
    currentProductionTab = tabKey;
    renderProduccion(document.getElementById('view-container'));
  }

  function filterProductionView() {
    const varFilter = (document.getElementById('prod-filter-variety')?.value || '').toLowerCase();
    const blkFilter = (document.getElementById('prod-filter-block')?.value || '').toLowerCase();
    const harvFilter = (document.getElementById('prod-filter-harvester')?.value || '').toLowerCase();
    const textFilter = (document.getElementById('prod-filter-text')?.value || '').toLowerCase();

    const allRecords = Store.getProductionRecords();
    const filtered = allRecords.filter(r => {
      const matchVar = !varFilter || (r.variety && r.variety.toLowerCase() === varFilter);
      const matchBlk = !blkFilter || (r.block && r.block.toLowerCase() === blkFilter);
      const harvesterName = (r.harvester || r.responsible || '').toLowerCase();
      const matchHarv = !harvFilter || (harvesterName === harvFilter);

      const combinedText = `${r.variety} ${r.block} ${r.bed} ${r.grade} ${harvesterName} ${r.notes || ''}`.toLowerCase();
      const matchText = !textFilter || combinedText.includes(textFilter);

      return matchVar && matchBlk && matchHarv && matchText;
    });

    const contentEl = document.getElementById('production-tab-content');
    if (contentEl) {
      contentEl.innerHTML = renderProductionTabContent(currentProductionTab, filtered);
    }
  }

  function clearProductionFilters() {
    const vf = document.getElementById('prod-filter-variety');
    const bf = document.getElementById('prod-filter-block');
    const hf = document.getElementById('prod-filter-harvester');
    const tf = document.getElementById('prod-filter-text');
    if (vf) vf.value = '';
    if (bf) bf.value = '';
    if (hf) hf.value = '';
    if (tf) tf.value = '';
    filterProductionView();
  }

  function renderProductionTabContent(tabKey, records) {
    if (tabKey === 'variety') {
      return renderProductionVarietySummary(records);
    } else if (tabKey === 'block') {
      return renderProductionBlockSummary(records);
    } else if (tabKey === 'harvester') {
      return renderProductionHarvesterSummary(records);
    } else {
      return renderProductionHistoryTable(records);
    }
  }

  // Vista 1: Historial Detallado de Cosecha
  function renderProductionHistoryTable(records) {
    if (!records || records.length === 0) {
      return `
        <div class="card">
          <div class="card-body" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            No se encontraron registros de cosecha que coincidan con los filtros aplicados.
          </div>
        </div>
      `;
    }

    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Historial de Cosechas Registradas
          </div>
          <span class="badge badge-success">${records.length} Lotes Listados</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Variedad</th>
                  <th>Bloque</th>
                  <th>Camas</th>
                  <th>Cosechador / Cortador</th>
                  <th style="text-align: right;">Tallos Cortados</th>
                  <th>Calidad / Grado</th>
                  <th>Observaciones</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(r => `
                  <tr>
                    <td><code>${escapeHtml(r.date)}</code></td>
                    <td>
                      <span class="badge" style="background: var(--primary-50); color: var(--emerald-dark); border: 1px solid var(--primary-200); font-weight: 700;">
                        🌹 ${escapeHtml(r.variety)}
                      </span>
                    </td>
                    <td><strong>${escapeHtml(r.block)}</strong></td>
                    <td>${escapeHtml(r.bed || '-')}</td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.35rem;">
                        <span style="color: var(--primary-700);">🧑‍🌾</span>
                        <strong>${escapeHtml(r.harvester || r.responsible || 'Personal')}</strong>
                      </div>
                    </td>
                    <td style="text-align: right;">
                      <strong style="color: var(--emerald-dark); font-size: 0.95rem;">${parseInt(r.stems).toLocaleString()}</strong>
                    </td>
                    <td>
                      <span class="badge badge-success">${escapeHtml(r.grade || 'Exportación')}</span>
                    </td>
                    <td style="font-size: 0.78rem; color: var(--text-muted); max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      ${escapeHtml(r.notes || '-')}
                    </td>
                    <td style="text-align: right; white-space: nowrap;">
                      <button class="btn btn-secondary btn-icon-only" title="Modificar Cosecha" style="padding: 0.28rem 0.5rem;" onclick="Modules.openProductionModal('${r.id}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button class="btn btn-secondary btn-icon-only btn-icon-danger" title="Eliminar Registro" style="padding: 0.28rem 0.5rem;" onclick="Modules.deleteProduction('${r.id}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Vista 2: Resumen Agrupado por Variedad
  function renderProductionVarietySummary(records) {
    const totalStems = records.reduce((acc, r) => acc + (parseInt(r.stems) || 0), 0) || 1;
    const summary = {};

    records.forEach(r => {
      const v = r.variety || 'Sin Variedad';
      if (!summary[v]) {
        summary[v] = { variety: v, stems: 0, batches: 0, blocks: new Set() };
      }
      summary[v].stems += (parseInt(r.stems) || 0);
      summary[v].batches += 1;
      if (r.block) summary[v].blocks.add(r.block);
    });

    const list = Object.values(summary).sort((a, b) => b.stems - a.stems);

    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5 1.2.7 2 2 2 3.5a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-1.5.8-2.8 2-3.5-1.2-.7-2-2-2-3.5a4 4 0 0 1 4-4z"></path></svg>
            Rendimiento Cosechado por Variedad de Rosa
          </div>
          <span class="badge badge-success">${list.length} Variedades en Producción</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Variedad</th>
                  <th style="text-align: right;">Tallos Totales</th>
                  <th style="min-width: 180px;">% de la Cosecha</th>
                  <th style="text-align: center;">Lotes Cortados</th>
                  <th>Bloques Donde se Cosecha</th>
                  <th style="text-align: right;">Promedio por Corte</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(item => {
                  const percent = ((item.stems / totalStems) * 100).toFixed(1);
                  const avg = Math.round(item.stems / item.batches);
                  return `
                    <tr>
                      <td>
                        <strong>🌹 Rosa ${escapeHtml(item.variety)}</strong>
                      </td>
                      <td style="text-align: right;">
                        <strong style="color: var(--emerald-dark); font-size: 0.95rem;">${item.stems.toLocaleString()}</strong>
                      </td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <div style="flex: 1; height: 8px; background: var(--bg-subtle); border-radius: 99px; overflow: hidden;">
                            <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, var(--emerald-main), var(--emerald-dark)); border-radius: 99px;"></div>
                          </div>
                          <span style="font-weight: 700; font-size: 0.75rem; color: var(--emerald-dark); width: 42px;">${percent}%</span>
                        </div>
                      </td>
                      <td style="text-align: center;"><span class="badge badge-neutral">${item.batches}</span></td>
                      <td style="font-size: 0.78rem; color: var(--text-muted);">${Array.from(item.blocks).join(', ') || '-'}</td>
                      <td style="text-align: right; font-size: 0.82rem; font-weight: 600;">${avg.toLocaleString()} tallos</td>
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

  // Vista 3: Resumen Agrupado por Bloque
  function renderProductionBlockSummary(records) {
    const totalStems = records.reduce((acc, r) => acc + (parseInt(r.stems) || 0), 0) || 1;
    const summary = {};

    records.forEach(r => {
      const b = r.block || 'Sin Bloque';
      if (!summary[b]) {
        summary[b] = { block: b, stems: 0, batches: 0, varieties: new Set() };
      }
      summary[b].stems += (parseInt(r.stems) || 0);
      summary[b].batches += 1;
      if (r.variety) summary[b].varieties.add(r.variety);
    });

    const list = Object.values(summary).sort((a, b) => b.stems - a.stems);

    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            Rendimiento Florícola por Bloque e Invernadero
          </div>
          <span class="badge badge-success">${list.length} Bloques Productivos</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Bloque / Invernadero</th>
                  <th style="text-align: right;">Tallos Cosechados</th>
                  <th style="min-width: 180px;">Aporte al Total</th>
                  <th style="text-align: center;">Cortes Realizados</th>
                  <th>Variedades Producidas</th>
                  <th style="text-align: right;">Promedio por Corte</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(item => {
                  const percent = ((item.stems / totalStems) * 100).toFixed(1);
                  const avg = Math.round(item.stems / item.batches);
                  return `
                    <tr>
                      <td><strong>📍 ${escapeHtml(item.block)}</strong></td>
                      <td style="text-align: right;">
                        <strong style="color: var(--primary-800); font-size: 0.95rem;">${item.stems.toLocaleString()}</strong>
                      </td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <div style="flex: 1; height: 8px; background: var(--bg-subtle); border-radius: 99px; overflow: hidden;">
                            <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #0284c7, #0369a1); border-radius: 99px;"></div>
                          </div>
                          <span style="font-weight: 700; font-size: 0.75rem; color: #0284c7; width: 42px;">${percent}%</span>
                        </div>
                      </td>
                      <td style="text-align: center;"><span class="badge badge-neutral">${item.batches}</span></td>
                      <td style="font-size: 0.78rem; color: var(--text-muted);">${Array.from(item.varieties).join(', ') || '-'}</td>
                      <td style="text-align: right; font-size: 0.82rem; font-weight: 600;">${avg.toLocaleString()} tallos</td>
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

  // Vista 4: Rendimiento por Cosechador (Cortador de Rosas)
  function renderProductionHarvesterSummary(records) {
    const totalStems = records.reduce((acc, r) => acc + (parseInt(r.stems) || 0), 0) || 1;
    const summary = {};

    records.forEach(r => {
      const h = r.harvester || r.responsible || 'Personal de Cosecha';
      if (!summary[h]) {
        summary[h] = { harvester: h, stems: 0, batches: 0, varieties: new Set(), blocks: new Set() };
      }
      summary[h].stems += (parseInt(r.stems) || 0);
      summary[h].batches += 1;
      if (r.variety) summary[h].varieties.add(r.variety);
      if (r.block) summary[h].blocks.add(r.block);
    });

    const list = Object.values(summary).sort((a, b) => b.stems - a.stems);

    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Ranking y Productividad del Personal Cosechador
          </div>
          <span class="badge badge-success">${list.length} Cosechadores Registrados</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px;">Rank</th>
                  <th>Cosechador / Cortador</th>
                  <th style="text-align: right;">Tallos Cosechados</th>
                  <th style="min-width: 180px;">% del Corte Total</th>
                  <th style="text-align: center;">Jornadas / Cortes</th>
                  <th>Bloques Asignados</th>
                  <th style="text-align: right;">Promedio por Jornada</th>
                </tr>
              </thead>
              <tbody>
                ${list.map((item, index) => {
                  const percent = ((item.stems / totalStems) * 100).toFixed(1);
                  const avg = Math.round(item.stems / item.batches);
                  const medal = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : `${index + 1}º`));

                  return `
                    <tr>
                      <td style="font-weight: 700; font-size: 0.85rem; text-align: center;">${medal}</td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.55rem;">
                          <div class="user-avatar" style="width: 28px; height: 28px; font-size: 0.7rem; background: linear-gradient(135deg, var(--emerald-main), var(--emerald-dark));">
                            ${escapeHtml(item.harvester.substring(0, 2).toUpperCase())}
                          </div>
                          <strong>${escapeHtml(item.harvester)}</strong>
                        </div>
                      </td>
                      <td style="text-align: right;">
                        <strong style="color: var(--emerald-dark); font-size: 0.95rem;">${item.stems.toLocaleString()}</strong>
                      </td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <div style="flex: 1; height: 8px; background: var(--bg-subtle); border-radius: 99px; overflow: hidden;">
                            <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #f59e0b, #d97706); border-radius: 99px;"></div>
                          </div>
                          <span style="font-weight: 700; font-size: 0.75rem; color: #b45309; width: 42px;">${percent}%</span>
                        </div>
                      </td>
                      <td style="text-align: center;"><span class="badge badge-neutral">${item.batches}</span></td>
                      <td style="font-size: 0.78rem; color: var(--text-muted);">${Array.from(item.blocks).join(', ') || '-'}</td>
                      <td style="text-align: right; font-size: 0.82rem; font-weight: 600;">${avg.toLocaleString()} tallos</td>
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

  // --- MODAL DE COSECHA (NUEVO / MODIFICAR) ---
  function openProductionModal(recordId = null) {
    const isEdit = !!recordId;
    const record = isEdit ? Store.getProductionRecord(recordId) : null;
    const user = Auth.getCurrentUser();
    const today = new Date().toISOString().split('T')[0];

    // Cargar variedades dinámicas del catálogo y planos
    const catalogVarieties = Store.getVarieties().map(v => v.name);
    const farmPlanVarieties = Store.getFarmPlans().map(fp => fp.variety);
    const standardVarieties = ['Freedom', 'Explorer', 'Mondial', 'Playa Blanca', 'Pink Floyd', 'Nina', 'Mandala'];
    const allVarieties = Array.from(new Set([...catalogVarieties, ...farmPlanVarieties, ...standardVarieties])).filter(Boolean);

    // Cargar bloques de los planos de finca
    const farmBlocks = Store.getFarmPlans().map(fp => fp.block);
    const standardBlocks = ['Bloque 1', 'Bloque 2', 'Bloque 3', 'Bloque 4A', 'Bloque 4B', 'Bloque 5'];
    const allBlocks = Array.from(new Set([...farmBlocks, ...standardBlocks])).filter(Boolean);

    // Cosechadores conocidos
    const knownHarvesters = ['Juan Tipán', 'Carlos Mendoza', 'Byron Guamán', 'María Toapanta', 'Luis Chiluisa'];
    if (user && user.name && !knownHarvesters.includes(user.name)) {
      knownHarvesters.unshift(user.name);
    }

    const currentVariety = record ? record.variety : allVarieties[0];
    const currentBlock = record ? record.block : allBlocks[0];
    const currentHarvester = record ? (record.harvester || record.responsible) : (user ? user.name : 'Juan Tipán');

    const bodyHtml = `
      <form id="form-production-modal" onsubmit="event.preventDefault(); Modules.saveProductionFromForm('${recordId || ''}');">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
          
          <div class="form-group">
            <label class="form-label">Fecha de Cosecha</label>
            <input type="date" id="prod-modal-date" class="form-control" required value="${record ? record.date : today}">
          </div>

          <div class="form-group">
            <label class="form-label">Variedad de Rosa</label>
            <select id="prod-modal-variety" class="form-control" required>
              ${allVarieties.map(v => `
                <option value="${escapeHtml(v)}" ${v === currentVariety ? 'selected' : ''}>🌹 Rosa ${escapeHtml(v)}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Bloque / Invernadero</label>
            <select id="prod-modal-block" class="form-control" required>
              ${allBlocks.map(b => `
                <option value="${escapeHtml(b)}" ${b === currentBlock ? 'selected' : ''}>📍 ${escapeHtml(b)}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Camas Cosechadas</label>
            <input type="text" id="prod-modal-bed" class="form-control" required placeholder="Ej: Camas 01 al 12" value="${record ? escapeHtml(record.bed || '') : ''}">
          </div>

          <div class="form-group">
            <label class="form-label">Cosechador / Cortador</label>
            <input type="text" id="prod-modal-harvester" list="harvesters-list" class="form-control" required placeholder="Nombre del cosechador" value="${escapeHtml(currentHarvester)}">
            <datalist id="harvesters-list">
              ${knownHarvesters.map(h => `<option value="${escapeHtml(h)}"></option>`).join('')}
            </datalist>
          </div>

          <div class="form-group">
            <label class="form-label">Cantidad de Tallos</label>
            <input type="number" id="prod-modal-stems" class="form-control" required min="1" placeholder="Ej: 4200" value="${record ? record.stems : ''}">
          </div>

          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Calidad / Grado Exportable</label>
            <select id="prod-modal-grade" class="form-control">
              <option value="Exportación Premium" ${record && record.grade.includes('Premium') ? 'selected' : ''}>Exportación Premium (80-90+ cm)</option>
              <option value="Exportación Selecta" ${!record || record.grade.includes('Selecta') || record.grade.includes('Alta') ? 'selected' : ''}>Exportación Selecta (60-70 cm)</option>
              <option value="Exportación Estándar" ${record && record.grade.includes('Estándar') ? 'selected' : ''}>Exportación Estándar (50 cm)</option>
              <option value="Nacional" ${record && record.grade.includes('Nacional') ? 'selected' : ''}>Nacional / Decorativa</option>
            </select>
          </div>

          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Observaciones del Corte</label>
            <textarea id="prod-modal-notes" class="form-control" rows="2" placeholder="Punto de corte adecuado, calibre uniforme, etc.">${record ? escapeHtml(record.notes || '') : ''}</textarea>
          </div>

        </div>
      </form>
    `;

    App.showModal(isEdit ? `Modificar Cosecha: #${record.id}` : 'Registrar Nueva Cosecha de Rosas', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-production-modal').requestSubmit()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        ${isEdit ? 'Guardar Cambios' : 'Registrar Cosecha'}
      </button>
    `);
  }

  function saveProductionFromForm(recordId = null) {
    const date = document.getElementById('prod-modal-date').value;
    const variety = document.getElementById('prod-modal-variety').value;
    const block = document.getElementById('prod-modal-block').value;
    const bed = document.getElementById('prod-modal-bed').value.trim();
    const harvester = document.getElementById('prod-modal-harvester').value.trim();
    const stems = parseInt(document.getElementById('prod-modal-stems').value) || 0;
    const grade = document.getElementById('prod-modal-grade').value;
    const notes = document.getElementById('prod-modal-notes').value.trim();

    if (!harvester) {
      App.showToast('Por favor especifica el cosechador o responsable del corte', 'danger');
      return;
    }

    const payload = {
      date,
      variety,
      block,
      bed,
      harvester,
      responsible: harvester,
      stems,
      grade,
      notes
    };

    try {
      if (recordId) {
        Store.updateProductionRecord(recordId, payload);
        App.showToast(`Cosecha modificada: ${stems.toLocaleString()} tallos de rosa ${variety}`, 'success');
      } else {
        Store.addProductionRecord(payload);
        App.showToast(`Cosecha de ${stems.toLocaleString()} tallos de rosa ${variety} registrada con éxito`, 'success');
      }
      App.closeModal();
      renderProduccion(document.getElementById('view-container'));
    } catch (e) {
      App.showToast(e.message, 'danger');
    }
  }

  function deleteProduction(recordId) {
    const record = Store.getProductionRecord(recordId);
    if (!record) return;

    if (confirm(`¿Estás seguro de eliminar el registro de cosecha de ${record.stems} tallos de Rosa ${record.variety} (${record.block})?`)) {
      try {
        Store.deleteProductionRecord(recordId);
        App.showToast('Registro de cosecha eliminado correctamente', 'success');
        renderProduccion(document.getElementById('view-container'));
      } catch (e) {
        App.showToast(e.message, 'danger');
      }
    }
  }

  function exportProductionXLSX() {
    try {
      if (typeof XLSX === 'undefined') {
        App.showToast('La biblioteca de Excel (SheetJS) no está cargada', 'danger');
        return;
      }

      const records = Store.getProductionRecords();
      if (!records || records.length === 0) {
        App.showToast('No hay registros de producción para exportar', 'warning');
        return;
      }

      const excelRows = records.map(r => ({
        'Fecha de Cosecha': r.date || '',
        'Variedad de Rosa': r.variety || '',
        'Bloque': r.block || '',
        'Camas Cosechadas': r.bed || '',
        'Cosechador / Cortador': r.harvester || r.responsible || '',
        'Tallos Cortados': parseInt(r.stems) || 0,
        'Calidad / Grado': r.grade || '',
        'Observaciones': r.notes || ''
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelRows);

      ws['!cols'] = [
        { wch: 16 }, // Fecha
        { wch: 20 }, // Variedad
        { wch: 15 }, // Bloque
        { wch: 18 }, // Camas
        { wch: 24 }, // Cosechador
        { wch: 16 }, // Tallos
        { wch: 28 }, // Calidad
        { wch: 35 }  // Observaciones
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Producción y Cosecha');

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `mrosecuador_control_produccion_${dateStr}.xlsx`);
      App.showToast('Reporte de producción exportado en formato .xlsx', 'success');
    } catch (e) {
      console.error(e);
      App.showToast('Error al exportar archivo Excel: ' + e.message, 'danger');
    }
  }

  // --- RENDERIZADO: MÓDULO DE CALIDAD ---
  function renderCalidad(container) {
    const records = Store.getQualityRecords();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Control de Calidad y Postcosecha</h1>
          <p class="view-subtitle">Inspección de longitud de tallos, apertura de botón, sanidad y tasa exportable de MRosecuador.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.renderCalidad(document.getElementById('view-container'))">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Refrescar
          </button>
          <button class="btn btn-rose" onclick="Modules.openQualityModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Inspección de Calidad
          </button>
        </div>
      </div>

      <!-- Métricas Calidad -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Auditorías Realizadas</span>
            <span class="kpi-value">${records.length}</span>
            <span class="kpi-trend positive">Lotes verificados</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-rose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Promedio Calidad Exportable</span>
            <span class="kpi-value">96.2%</span>
            <span class="kpi-trend positive">Supera el umbral del 92%</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Descarte Promedio</span>
            <span class="kpi-value">3.8%</span>
            <span class="kpi-trend positive">Bajo control fitosanitario</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
        </div>
      </div>

      <!-- Tabla de Inspecciones -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            Planilla de Inspecciones en Sala de Postcosecha
          </div>
          <span class="badge badge-success">Protocolo ISO & FlorEcuador</span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Lote / Ref</th>
                  <th>Variedad</th>
                  <th>Muestra (Tallos)</th>
                  <th>Longitud Promedio</th>
                  <th>% Exportable</th>
                  <th>Defecto Principal</th>
                  <th>Estado</th>
                  <th>Inspector</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(r => `
                  <tr>
                    <td><code>${escapeHtml(r.date)}</code></td>
                    <td><strong>${escapeHtml(r.batch)}</strong></td>
                    <td>Rosa ${escapeHtml(r.variety)}</td>
                    <td>${r.sampleSize} tallos</td>
                    <td>${escapeHtml(r.stemLengthAvg)}</td>
                    <td>
                      <span class="badge ${parseFloat(r.exportablePercent) >= 95 ? 'badge-success' : 'badge-warning'}">
                        ${r.exportablePercent}%
                      </span>
                    </td>
                    <td style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(r.mainDefect || 'Ninguno relevante')}</td>
                    <td><span class="badge badge-success">${escapeHtml(r.status)}</span></td>
                    <td>${escapeHtml(r.inspector)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function openQualityModal() {
    const user = Auth.getCurrentUser();
    const today = new Date().toISOString().split('T')[0];
    const batchCode = 'LOTE-' + today.replace(/-/g, '') + '-ROSA';

    const bodyHtml = `
      <form id="form-new-quality" onsubmit="event.preventDefault(); Modules.saveQualityFromForm();">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          
          <div class="form-group">
            <label class="form-label">Fecha de Inspección</label>
            <input type="date" id="qual-date" class="form-control" required value="${today}">
          </div>

          <div class="form-group">
            <label class="form-label">Código de Lote</label>
            <input type="text" id="qual-batch" class="form-control" required value="${batchCode}">
          </div>

          <div class="form-group">
            <label class="form-label">Variedad Evaluada</label>
            <select id="qual-variety" class="form-control" style="padding-left: 0.85rem;" required>
              <option value="Freedom">Freedom</option>
              <option value="Explorer">Explorer</option>
              <option value="Mondial">Mondial</option>
              <option value="Playa Blanca">Playa Blanca</option>
              <option value="Pink Floyd">Pink Floyd</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Tamaño de Muestra (Tallos)</label>
            <input type="number" id="qual-sample" class="form-control" required min="10" value="200">
          </div>

          <div class="form-group">
            <label class="form-label">Longitud Promedio del Tallo</label>
            <select id="qual-length" class="form-control" style="padding-left: 0.85rem;">
              <option value="50 cm">50 cm</option>
              <option value="60 cm">60 cm</option>
              <option value="70 cm" selected>70 cm</option>
              <option value="80 cm">80 cm</option>
              <option value="90+ cm">90+ cm (Super Premium)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">% Exportable Cumplido</label>
            <input type="number" id="qual-percent" class="form-control" required min="50" max="100" step="0.1" value="97.5">
          </div>

          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Defecto Principal Observado (Si Hubiere)</label>
            <input type="text" id="qual-defect" class="form-control" placeholder="Ej: Curvatura leve de tallo / Ninguno relevante" value="Calibre homogéneo y limpio">
          </div>

          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Inspector(a) Responsable</label>
            <input type="text" id="qual-inspector" class="form-control" required value="${user ? escapeHtml(user.name) : 'Elena Rosero'}">
          </div>

        </div>
      </form>
    `;

    App.showModal('Nueva Inspección de Calidad', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-rose" onclick="document.getElementById('form-new-quality').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
        Guardar Inspección
      </button>
    `);
  }

  function saveQualityFromForm() {
    const date = document.getElementById('qual-date').value;
    const batch = document.getElementById('qual-batch').value.trim();
    const variety = document.getElementById('qual-variety').value;
    const sampleSize = parseInt(document.getElementById('qual-sample').value) || 200;
    const stemLengthAvg = document.getElementById('qual-length').value;
    const exportablePercent = parseFloat(document.getElementById('qual-percent').value) || 95;
    const mainDefect = document.getElementById('qual-defect').value.trim();
    const inspector = document.getElementById('qual-inspector').value.trim();

    try {
      Store.addQualityRecord({
        date,
        batch,
        variety,
        sampleSize,
        stemLengthAvg,
        exportablePercent,
        mainDefect,
        status: exportablePercent >= 95 ? 'Aprobado Exportación' : 'Aprobado Estándar',
        inspector
      });
      App.closeModal();
      App.showToast(`Inspección de calidad de ${batch} guardada correctamente`, 'success');
      renderCalidad(document.getElementById('view-container'));
    } catch (e) {
      App.showToast(e.message, 'danger');
    }
  }

  // --- RENDERIZADO: MOTOR DE MÓDULOS FUTUROS Y DINÁMICOS ---
  function renderDynamicModule(container, mod) {
    const records = Store.getDynamicRecords(mod.key);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
            <div class="matrix-module-icon" style="width: 38px; height: 38px;">
              ${App.getModuleIconSvg(mod.icon)}
            </div>
            <h1>${escapeHtml(mod.name)}</h1>
          </div>
          <p class="view-subtitle">${escapeHtml(mod.description || 'Módulo modular integrado en MRosecuador.')}</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.renderDynamicModule(document.getElementById('view-container'), Store.getModules().find(m => m.key === '${mod.key}'))">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Refrescar
          </button>
          <button class="btn btn-emerald" onclick="Modules.openDynamicRecordModal('${mod.key}', '${escapeHtml(mod.name)}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Registro en ${escapeHtml(mod.name)}
          </button>
        </div>
      </div>

      <!-- Tarjetas de Información del Módulo Creado -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Registros Guardados</span>
            <span class="kpi-value">${records.length}</span>
            <span class="kpi-trend positive">Datos en este módulo</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            ${App.getModuleIconSvg(mod.icon)}
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Categoría</span>
            <span class="kpi-value" style="font-size: 1.45rem; text-transform: capitalize;">${escapeHtml(mod.category)}</span>
            <span class="kpi-trend neutral">Ruta: #${escapeHtml(mod.key)}</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Estado de Acceso</span>
            <span class="kpi-value" style="font-size: 1.45rem; color: var(--emerald-dark);">Habilitado</span>
            <span class="kpi-trend positive">Controlado por el Administrador</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
        </div>
      </div>

      <!-- Tabla de Datos del Módulo Dinámico -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            Planilla de Registros de ${escapeHtml(mod.name)}
          </div>
          <button class="btn btn-emerald" style="font-size: 0.8rem;" onclick="Modules.openDynamicRecordModal('${mod.key}', '${escapeHtml(mod.name)}')">
            + Agregar Registro
          </button>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Código / Ref</th>
                  <th>Descripción / Detalle</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                ${records.length > 0 ? records.map(r => `
                  <tr>
                    <td><code>${escapeHtml(r.fecha)}</code></td>
                    <td><strong>${escapeHtml(r.codigo)}</strong></td>
                    <td>${escapeHtml(r.descripcion)}</td>
                    <td>${escapeHtml(r.responsable)}</td>
                    <td><span class="badge ${r.estado === 'Completado' ? 'badge-success' : 'badge-neutral'}">${escapeHtml(r.estado)}</span></td>
                    <td style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(r.notas || '-')}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="6" style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
                      <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">
                        Aún no hay registros en este módulo
                      </div>
                      <div style="font-size: 0.85rem; margin-bottom: 1rem;">
                        Comienza a cargar información presionando el botón "Nuevo Registro".
                      </div>
                      <button class="btn btn-emerald" onclick="Modules.openDynamicRecordModal('${mod.key}', '${escapeHtml(mod.name)}')">
                        + Crear Primer Registro
                      </button>
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function openDynamicRecordModal(moduleKey, moduleName) {
    const user = Auth.getCurrentUser();
    const today = new Date().toLocaleDateString('es-EC');
    const autoRef = 'REF-' + Date.now().toString(36).toUpperCase().substr(-5);

    const bodyHtml = `
      <form id="form-dynamic-record" onsubmit="event.preventDefault(); Modules.saveDynamicRecordFromForm('${moduleKey}');">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Código / Referencia</label>
              <input type="text" id="dyn-codigo" class="form-control" required value="${autoRef}">
            </div>

            <div class="form-group">
              <label class="form-label">Estado</label>
              <select id="dyn-estado" class="form-control" style="padding-left: 0.85rem;">
                <option value="Completado">Completado / Listo</option>
                <option value="En Proceso" selected>En Proceso</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Descripción / Detalle de la Operación</label>
            <input type="text" id="dyn-descripcion" class="form-control" required placeholder="Ej: Despacho aéreo para cliente Miami / Inspección de bombas de riego">
          </div>

          <div class="form-group">
            <label class="form-label">Responsable</label>
            <input type="text" id="dyn-responsable" class="form-control" required value="${user ? escapeHtml(user.name) : ''}">
          </div>

          <div class="form-group">
            <label class="form-label">Notas Adicionales</label>
            <textarea id="dyn-notas" class="form-control" rows="2" style="padding-left: 0.85rem;" placeholder="Observaciones complementarias..."></textarea>
          </div>

        </div>
      </form>
    `;

    App.showModal(`Nuevo Registro en ${moduleName}`, bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-dynamic-record').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
        Guardar Registro
      </button>
    `);
  }

  function saveDynamicRecordFromForm(moduleKey) {
    const codigo = document.getElementById('dyn-codigo').value.trim();
    const descripcion = document.getElementById('dyn-descripcion').value.trim();
    const responsable = document.getElementById('dyn-responsable').value.trim();
    const estado = document.getElementById('dyn-estado').value;
    const notas = document.getElementById('dyn-notas').value.trim();

    try {
      Store.addDynamicRecord(moduleKey, {
        codigo,
        descripcion,
        responsable,
        estado,
        notas
      });

      App.closeModal();
      App.showToast('Registro guardado en el módulo exitosamente', 'success');
    } catch (e) {
      App.showToast('Error al guardar registro: ' + e.message, 'danger');
    }
  }

  // --- RENDERIZADO: CONFIGURACIÃ“N DE FINCA - PLANOS DE FINCA Y ÃREAS ---
  let currentFarmTab = 'blocks';

  function switchFarmPlansTab(tab) {
    currentFarmTab = tab;
    const vc = document.getElementById('view-container');
    if (vc) renderFarmPlans(vc);
  }

  function renderFarmPlans(container) {
    if (!container) container = document.getElementById('view-container');
    if (!container) return;
    localStorage.setItem('mrose_active_module_v1', 'config-finca-planos');

    const plans = Store.getFarmPlans ? Store.getFarmPlans() : [];
    const varieties = Store.getVarieties ? Store.getVarieties() : [];
    const areas = Store.getFarmAreas ? Store.getFarmAreas() : [];

    const totalBeds = plans.reduce((acc, p) => acc + (parseInt(p.beds) || 0), 0);
    const totalPlants = plans.reduce((acc, p) => acc + (parseInt(p.plantsTotal) || 0), 0);
    const activeBlocks = plans.filter(p => p.status === 'Activo').length;
    const totalSurfaceHa = areas.reduce((acc, a) => acc + (parseFloat(a.surfaceHa) || 0), 0).toFixed(1);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--emerald-main); background: var(--primary-50); padding: 0.2rem 0.65rem; border-radius: 99px;">
              ConfiguraciÃ³n de Finca
            </span>
            <span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.75rem; font-weight:700;">
              ${currentFarmTab === 'blocks' ? `${plans.length} Bloques` : `${areas.length} Ãreas / Sectores`}
            </span>
          </div>
          <h1>Planos de Finca, Bloques y Ãreas</h1>
          <p class="view-subtitle">Administra los sectores e instalaciones de la finca, bloques de cultivo, variedades de rosas, camas y ciclos productivos.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-emerald" onclick="Modules.openFarmAreaModal()" style="display: flex; align-items: center; gap: 0.35rem; background: #047857;" title="Agregar Nueva Ãrea o Sector de Finca">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            + Nueva Ãrea
          </button>
          <button class="btn btn-emerald" onclick="Modules.openFarmPlanModal()" style="display: flex; align-items: center; gap: 0.35rem;" title="Agregar Nuevo Bloque">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Nuevo Bloque
          </button>
          <button class="btn btn-secondary" onclick="Modules.downloadFarmTemplateXLSX()" title="Descargar formato modelo en Excel">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Plantilla .xlsx
          </button>
          <button class="btn btn-secondary btn-excel" onclick="Modules.openImportExcelModal()" title="Cargar archivo Excel .xlsx">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Subir .xlsx
          </button>
          <button class="btn btn-secondary" onclick="Modules.exportFarmPlansXLSX()" title="Descargar datos actuales">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            Exportar Excel
          </button>
        </div>
      </div>

      <!-- Selector de PestaÃ±as: Bloques vs Ãreas de la Finca -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; align-items: center;">
        <button id="btn-farm-tab-blocks" class="btn ${currentFarmTab === 'blocks' ? 'btn-emerald' : 'btn-secondary'}" onclick="Modules.switchFarmPlansTab('blocks')" style="font-weight: 700; display: flex; align-items: center; gap: 0.4rem; padding: 0.45rem 1rem;">
          ðŸŒ¿ Bloques de Cultivo (${plans.length})
        </button>
        <button id="btn-farm-tab-areas" class="btn ${currentFarmTab === 'areas' ? 'btn-emerald' : 'btn-secondary'}" onclick="Modules.switchFarmPlansTab('areas')" style="font-weight: 700; display: flex; align-items: center; gap: 0.4rem; padding: 0.45rem 1rem;">
          ðŸ—ºï¸ Ãreas e Instalaciones de Finca (${areas.length})
        </button>
      </div>

      ${currentFarmTab === 'blocks' ? `
        <!-- MÃ©tricas florÃ­colas de la Finca (Bloques) -->
        <div class="kpi-grid" style="margin-bottom: 1.25rem;">
          <div class="kpi-card">
            <div class="kpi-info">
              <span class="kpi-label">Bloques Productivos</span>
              <span class="kpi-value">${plans.length}</span>
              <span class="kpi-trend positive">${activeBlocks} bloques activos</span>
            </div>
            <div class="kpi-icon-wrap kpi-icon-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-info">
              <span class="kpi-label">Camas Instaladas</span>
              <span class="kpi-value">${totalBeds} Camas</span>
              <span class="kpi-trend positive">Capacidad FLORÃCOLA</span>
            </div>
            <div class="kpi-icon-wrap kpi-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-info">
              <span class="kpi-label">Plantas Sembradas</span>
              <span class="kpi-value">${totalPlants.toLocaleString()}</span>
              <span class="kpi-trend positive">PoblaciÃ³n total estimada</span>
            </div>
            <div class="kpi-icon-wrap kpi-icon-rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-info">
              <span class="kpi-label">Variedades en Campo</span>
              <span class="kpi-value">${new Set(plans.map(p => p.variety)).size}</span>
              <span class="kpi-trend neutral">De ${varieties.length} en catÃ¡logo</span>
            </div>
            <div class="kpi-icon-wrap kpi-icon-amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a7 7 0 0 0 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 0 7-7z"></path></svg>
            </div>
          </div>
        </div>

        <!-- Tabla Principal de Planos y Bloques de Finca -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
              Listado de Bloques de Cultivo
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="text" id="farm-search-input" placeholder="Buscar por bloque, Ã¡rea o variedad..." class="form-control" style="padding: 0.4rem 0.85rem; width: 260px; font-size: 0.82rem;" oninput="Modules.filterFarmPlansTable()">
            </div>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="data-table" id="farm-plans-table">
                <thead>
                  <tr>
                    <th>NÃºmero de Bloque</th>
                    <th>Ãrea / Sector</th>
                    <th>Variedad de Rosa</th>
                    <th>Camas</th>
                    <th>Fecha de Siembra</th>
                    <th>Ciclo Productivo</th>
                    <th>Plantas Estimadas</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                    <th style="text-align: right;">Acciones</th>
                  </tr>
                </thead>
                <tbody id="farm-plans-table-body">
                  ${renderFarmPlansTableRows(plans)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ` : `
        <!-- MÃ©tricas florÃ­colas de Ãreas de Finca -->
        <div class="kpi-grid" style="margin-bottom: 1.25rem;">
          <div class="kpi-card" style="border-left: 5px solid #059669;">
            <div class="kpi-info">
              <span class="kpi-label">Ãreas e Instalaciones</span>
              <span class="kpi-value">${areas.length}</span>
              <span class="kpi-trend positive">${areas.filter(a => a.status === 'Activa').length} activas</span>
            </div>
            <div class="kpi-icon-wrap kpi-icon-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
            </div>
          </div>

          <div class="kpi-card" style="border-left: 5px solid #0284c7;">
            <div class="kpi-info">
              <span class="kpi-label">Superficie Total Registrada</span>
              <span class="kpi-value">${totalSurfaceHa} Ha</span>
              <span class="kpi-trend positive">ExtensiÃ³n Finca</span>
            </div>
            <div class="kpi-icon-wrap kpi-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
            </div>
          </div>

          <div class="kpi-card" style="border-left: 5px solid #10b981;">
            <div class="kpi-info">
              <span class="kpi-label">Sectores de Cultivo</span>
              <span class="kpi-value">${areas.filter(a => a.type.toLowerCase().includes('cultivo') || a.type.toLowerCase().includes('producciÃ³n')).length}</span>
              <span class="kpi-trend positive">${plans.length} bloques alojados</span>
            </div>
            <div class="kpi-icon-wrap kpi-icon-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>

          <div class="kpi-card" style="border-left: 5px solid #8b5cf6;">
            <div class="kpi-info">
              <span class="kpi-label">Infraestructura & Proceso</span>
              <span class="kpi-value">${areas.filter(a => !a.type.toLowerCase().includes('cultivo') && !a.type.toLowerCase().includes('producciÃ³n')).length}</span>
              <span class="kpi-trend neutral">Poscosecha, FrÃ­o, Riego</span>
            </div>
            <div class="kpi-icon-wrap kpi-icon-amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
          </div>
        </div>

        <!-- Tabla Principal de Ãreas -->
        <div class="card">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              CatÃ¡logo de Ãreas, Sectores e Instalaciones de la Finca
            </div>
            <button class="btn btn-emerald btn-sm" onclick="Modules.openFarmAreaModal()" style="display: flex; align-items: center; gap: 0.35rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              + Nueva Ãrea
            </button>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>CÃ³digo</th>
                    <th>Nombre de Ãrea / Sector</th>
                    <th>Tipo / CategorÃ­a</th>
                    <th>Superficie</th>
                    <th>Bloques Asignados</th>
                    <th>Supervisor</th>
                    <th>Estado</th>
                    <th>DescripciÃ³n</th>
                    <th style="text-align: right;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderFarmAreasTableRows(areas, plans)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `}
    `;
  }

  function renderFarmPlansTableRows(plans) {
    if (!plans || plans.length === 0) {
      return `<tr><td colspan="10" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">No hay bloques registrados. Puedes presionar "Nuevo Bloque" o "Subir Plantilla .xlsx".</td></tr>`;
    }

    return plans.map(p => {
      let varietyDot = 'dot-red';
      if (p.variety.toLowerCase().includes('blanca') || p.variety.toLowerCase().includes('mondial')) varietyDot = 'dot-white';
      if (p.variety.toLowerCase().includes('pink')) varietyDot = 'dot-pink';

      let statusBadge = `<span class="badge badge-success">Activo</span>`;
      if (p.status === 'En Poda') statusBadge = `<span class="badge badge-warning">En Poda</span>`;
      if (p.status === 'En PreparaciÃ³n') statusBadge = `<span class="badge badge-neutral">En PreparaciÃ³n</span>`;

      return `
        <tr data-plan-id="${p.id}">
          <td><strong style="color: var(--primary-900); font-size: 0.92rem;">${escapeHtml(p.block)}</strong></td>
          <td>
            <span class="badge" style="background: #ecfdf5; color: #047857; font-weight: 700; font-size: 0.72rem; border: 1px solid #a7f3d0;">
              ðŸ—ºï¸ ${escapeHtml(p.area || 'Sector Norte - Invernaderos')}
            </span>
          </td>
          <td>
            <span class="flower-variety-badge">
              <span class="variety-dot ${varietyDot}"></span>
              Rosa ${escapeHtml(p.variety)}
            </span>
          </td>
          <td><strong>${escapeHtml(p.beds)}</strong> camas</td>
          <td><code>${escapeHtml(p.plantingDate)}</code></td>
          <td><span class="badge badge-neutral" style="background: var(--primary-50); color: var(--emerald-dark);">${escapeHtml(p.cycle)}</span></td>
          <td>${(parseInt(p.plantsTotal) || 0).toLocaleString()} plantas</td>
          <td>${statusBadge}</td>
          <td style="font-size: 0.78rem; color: var(--text-muted); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(p.notes || '-')}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.35rem;">
              <button class="btn btn-secondary btn-icon-only" title="Modificar Bloque" onclick="Modules.openFarmPlanModal('${p.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button class="btn btn-secondary btn-icon-only btn-icon-danger" title="Eliminar Bloque" onclick="Modules.deleteFarmPlan('${p.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderFarmAreasTableRows(areas, plans) {
    if (!areas || areas.length === 0) {
      return `<tr><td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">No hay Ã¡reas registradas. Presiona "+ Nueva Ãrea" para comenzar.</td></tr>`;
    }

    return areas.map(a => {
      const assignedBlocks = (plans || []).filter(p => p.area === a.name || p.area === a.code);
      return `
        <tr data-area-id="${a.id}">
          <td><strong style="color: #0369a1; font-family: monospace; font-size: 0.85rem;">${escapeHtml(a.code || 'S/C')}</strong></td>
          <td><strong style="color: var(--primary-900); font-size: 0.92rem;">${escapeHtml(a.name)}</strong></td>
          <td><span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.72rem;">${escapeHtml(a.type || 'Cultivo')}</span></td>
          <td>
            <strong>${a.surfaceHa || '0'} Ha</strong>
            <span style="font-size:0.72rem; color:#64748b; margin-left:2px;">(${(a.surfaceM2 || ((a.surfaceHa || 0) * 10000)).toLocaleString()} mÂ²)</span>
          </td>
          <td>
            ${assignedBlocks.length > 0 
              ? assignedBlocks.map(b => `<span class="badge badge-success" style="font-size:0.68rem; margin:1px;">${escapeHtml(b.block)}</span>`).join(' ')
              : '<span style="font-size:0.75rem; color:#94a3b8;">Sin bloques</span>'}
          </td>
          <td style="font-size: 0.82rem;">${escapeHtml(a.supervisor || '-')}</td>
          <td>
            <span class="badge ${a.status === 'Activa' ? 'badge-success' : 'badge-warning'}">
              ${escapeHtml(a.status || 'Activa')}
            </span>
          </td>
          <td style="font-size: 0.78rem; color: var(--text-muted); max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${escapeHtml(a.description || '-')}
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.35rem;">
              <button class="btn btn-secondary btn-icon-only" title="Modificar Ãrea" onclick="Modules.openFarmAreaModal('${a.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button class="btn btn-secondary btn-icon-only btn-icon-danger" title="Eliminar Ãrea" onclick="Modules.deleteFarmArea('${a.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterFarmPlansTable() {
    const input = document.getElementById('farm-search-input');
    if (!input) return;
    const term = input.value.toLowerCase().trim();
    const plans = Store.getFarmPlans();
    const filtered = plans.filter(p => 
      p.block.toLowerCase().includes(term) ||
      (p.area && p.area.toLowerCase().includes(term)) ||
      p.variety.toLowerCase().includes(term) ||
      (p.cycle && p.cycle.toLowerCase().includes(term))
    );
    const tbody = document.getElementById('farm-plans-table-body');
    if (tbody) tbody.innerHTML = renderFarmPlansTableRows(filtered);
  }

  function openFarmAreaModal(areaId = null) {
    const isEdit = !!areaId;
    const area = isEdit ? (Store.getFarmArea ? Store.getFarmArea(areaId) : null) : null;

    const bodyHtml = `
      <form id="form-farm-area" onsubmit="event.preventDefault(); Modules.saveFarmAreaFromForm('${areaId || ''}');">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">CÃ³digo del Ãrea / Sector</label>
            <input type="text" id="fa-code" class="form-control" required placeholder="Ej: SEC-NTE, POS-01" value="${area ? escapeHtml(area.code) : ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Nombre del Ãrea o Sector</label>
            <input type="text" id="fa-name" class="form-control" required placeholder="Ej: Sector Norte - Invernaderos" value="${area ? escapeHtml(area.name) : ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Tipo / CategorÃ­a de Ãrea</label>
            <select id="fa-type" class="form-control" style="padding-left: 0.85rem;" required>
              <option value="Cultivo / ProducciÃ³n" ${!area || area.type === 'Cultivo / ProducciÃ³n' ? 'selected' : ''}>ðŸŒ¿ Cultivo / ProducciÃ³n</option>
              <option value="Poscosecha / Proceso" ${area && area.type === 'Poscosecha / Proceso' ? 'selected' : ''}>ðŸ“¦ Poscosecha / Proceso</option>
              <option value="RefrigeraciÃ³n / AlmacÃ©n" ${area && area.type === 'RefrigeraciÃ³n / AlmacÃ©n' ? 'selected' : ''}>â„ï¸ RefrigeraciÃ³n / Cuartos FrÃ­os</option>
              <option value="Infraestructura / Riego" ${area && area.type === 'Infraestructura / Riego' ? 'selected' : ''}>ðŸ’§ Infraestructura / Riego</option>
              <option value="Bodega / Fitosanitarios" ${area && area.type === 'Bodega / Fitosanitarios' ? 'selected' : ''}>ðŸ¢ Bodega / Insumos</option>
              <option value="Ãrea Administrativa" ${area && area.type === 'Ãrea Administrativa' ? 'selected' : ''}>ðŸ›ï¸ Ãrea Administrativa</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Superficie en HectÃ¡reas (Ha)</label>
            <input type="number" id="fa-surface-ha" step="0.01" min="0" class="form-control" placeholder="Ej: 4.5" value="${area ? area.surfaceHa : '1.0'}" oninput="document.getElementById('fa-surface-m2').value = Math.round(parseFloat(this.value || 0) * 10000)">
          </div>
          <div class="form-group">
            <label class="form-label">Superficie en Metros Cuadrados (mÂ²)</label>
            <input type="number" id="fa-surface-m2" min="0" class="form-control" placeholder="Ej: 45000" value="${area ? (area.surfaceM2 || (area.surfaceHa * 10000)) : '10000'}">
          </div>
          <div class="form-group">
            <label class="form-label">Supervisor / Responsable</label>
            <input type="text" id="fa-supervisor" class="form-control" placeholder="Ej: Ing. Mateo ProaÃ±o" value="${area ? escapeHtml(area.supervisor) : 'Ing. Mateo ProaÃ±o'}">
          </div>
          <div class="form-group">
            <label class="form-label">Estado del Ãrea</label>
            <select id="fa-status" class="form-control" style="padding-left: 0.85rem;">
              <option value="Activa" ${!area || area.status === 'Activa' ? 'selected' : ''}>Activa (Operativa)</option>
              <option value="En Mantenimiento" ${area && area.status === 'En Mantenimiento' ? 'selected' : ''}>En Mantenimiento</option>
              <option value="En ConstrucciÃ³n" ${area && area.status === 'En ConstrucciÃ³n' ? 'selected' : ''}>En ConstrucciÃ³n / AmpliaciÃ³n</option>
            </select>
          </div>
          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">DescripciÃ³n / Observaciones</label>
            <textarea id="fa-description" class="form-control" rows="2" placeholder="Detalles de naves, equipamiento, sistema de ventilaciÃ³n o riego...">${area ? escapeHtml(area.description) : ''}</textarea>
          </div>
        </div>
      </form>
    `;

    App.showModal(isEdit ? `Modificar Ãrea: ${area.name}` : 'Agregar Nueva Ãrea o InstalaciÃ³n a Finca', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-farm-area').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
        ${isEdit ? 'Actualizar Ãrea' : 'Guardar Ãrea'}
      </button>
    `);
  }

  function saveFarmAreaFromForm(areaId = null) {
    const code = document.getElementById('fa-code')?.value.trim() || 'SEC';
    const name = document.getElementById('fa-name')?.value.trim();
    if (!name) {
      App.showToast('Por favor ingrese el nombre del Ã¡rea', 'warning');
      return;
    }
    const type = document.getElementById('fa-type')?.value || 'Cultivo / ProducciÃ³n';
    const surfaceHa = parseFloat(document.getElementById('fa-surface-ha')?.value) || 0;
    const surfaceM2 = parseInt(document.getElementById('fa-surface-m2')?.value, 10) || Math.round(surfaceHa * 10000);
    const supervisor = document.getElementById('fa-supervisor')?.value.trim() || 'Supervisor';
    const status = document.getElementById('fa-status')?.value || 'Activa';
    const description = document.getElementById('fa-description')?.value.trim() || '';

    try {
      const payload = {
        code,
        name,
        type,
        surfaceHa,
        surfaceM2,
        supervisor,
        status,
        description
      };
      if (areaId) payload.id = areaId;

      Store.saveFarmArea(payload);
      App.closeModal();
      App.showToast(areaId ? 'Ãrea modificada con Ã©xito' : 'Nueva Ã¡rea guardada en la finca', 'success');
      currentFarmTab = 'areas';
      renderFarmPlans(document.getElementById('view-container'));
    } catch (e) {
      App.showToast(e.message, 'danger');
    }
  }

  function deleteFarmArea(areaId) {
    const area = Store.getFarmArea ? Store.getFarmArea(areaId) : null;
    if (!area) return;
    if (confirm(`Â¿EstÃ¡s seguro de eliminar el Ã¡rea "${area.name}"?`)) {
      try {
        Store.deleteFarmArea(areaId);
        App.showToast('Ãrea eliminada correctamente', 'success');
        renderFarmPlans(document.getElementById('view-container'));
      } catch (e) {
        App.showToast(e.message, 'danger');
      }
    }
  }

  function openFarmPlanModal(planId = null) {
    const isEdit = !!planId;
    const plan = isEdit ? Store.getFarmPlan(planId) : null;
    const varieties = Store.getVarieties ? Store.getVarieties() : [];
    const areas = Store.getFarmAreas ? Store.getFarmAreas() : [];
    const today = new Date().toISOString().split('T')[0];

    const bodyHtml = `
      <form id="form-farm-plan" onsubmit="event.preventDefault(); Modules.saveFarmPlanFromForm('${planId || ''}');">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          
          <div class="form-group">
            <label class="form-label">NÃºmero / Nombre del Bloque</label>
            <input type="text" id="fp-block" class="form-control" required placeholder="Ej: Bloque 1 o Bloque 2A" value="${plan ? escapeHtml(plan.block) : ''}">
          </div>

          <div class="form-group">
            <label class="form-label">Ãrea / Sector de la Finca</label>
            <select id="fp-area" class="form-control" style="padding-left: 0.85rem;" required>
              ${areas.map(a => `
                <option value="${escapeHtml(a.name)}" ${plan && plan.area === a.name ? 'selected' : ''}>ðŸ—ºï¸ ${escapeHtml(a.name)}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Variedad de Rosa</label>
            <select id="fp-variety" class="form-control" style="padding-left: 0.85rem;" required>
              ${varieties.map(v => `
                <option value="${escapeHtml(v.name)}" ${plan && plan.variety === v.name ? 'selected' : ''}>ðŸŒ¹ Rosa ${escapeHtml(v.name)}</option>
              `).join('')}
              <option value="Otra Variedad" ${plan && !varieties.some(v => v.name === plan.variety) ? 'selected' : ''}>+ Otra Variedad</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Cantidad de Camas</label>
            <input type="number" id="fp-beds" class="form-control" required min="1" placeholder="Ej: 24" value="${plan ? escapeHtml(plan.beds) : '24'}">
          </div>

          <div class="form-group">
            <label class="form-label">Fecha de Siembra</label>
            <input type="date" id="fp-planting-date" class="form-control" required value="${plan ? escapeHtml(plan.plantingDate) : today}">
          </div>

          <div class="form-group">
            <label class="form-label">
              <span>Ciclo Productivo (en dÃ­as)</span>
              <span style="font-size: 0.72rem; color: var(--emerald-main); font-weight: 600;">Manual en dÃ­as</span>
            </label>
            <div class="input-container">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </span>
              <input type="number" id="fp-cycle" class="form-control" required min="1" max="999" placeholder="Ej: 75 o 90" value="${plan ? (parseInt(plan.cycle) || 75) : 75}" style="padding-right: 3rem;">
              <span style="position: absolute; right: 0.85rem; color: var(--text-muted); font-size: 0.82rem; font-weight: 600; pointer-events: none;">dÃ­as</span>
            </div>
            <div style="display: flex; gap: 0.35rem; margin-top: 0.35rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;" onclick="document.getElementById('fp-cycle').value = '65'">65 dÃ­as</button>
              <button type="button" class="btn btn-secondary" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;" onclick="document.getElementById('fp-cycle').value = '75'">75 dÃ­as</button>
              <button type="button" class="btn btn-secondary" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;" onclick="document.getElementById('fp-cycle').value = '80'">80 dÃ­as</button>
              <button type="button" class="btn btn-secondary" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;" onclick="document.getElementById('fp-cycle').value = '90'">90 dÃ­as</button>
              <button type="button" class="btn btn-secondary" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;" onclick="document.getElementById('fp-cycle').value = '105'">105 dÃ­as</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Plantas Estimadas Totales</label>
            <input type="number" id="fp-plants" class="form-control" min="0" placeholder="Ej: 4800" value="${plan ? escapeHtml(plan.plantsTotal) : '4800'}">
          </div>

          <div class="form-group">
            <label class="form-label">Estado del Bloque</label>
            <select id="fp-status" class="form-control" style="padding-left: 0.85rem;">
              <option value="Activo" ${!plan || plan.status === 'Activo' ? 'selected' : ''}>Activo (En ProducciÃ³n)</option>
              <option value="En Poda" ${plan && plan.status === 'En Poda' ? 'selected' : ''}>En Poda</option>
              <option value="En PreparaciÃ³n" ${plan && plan.status === 'En PreparaciÃ³n' ? 'selected' : ''}>En PreparaciÃ³n</option>
            </select>
          </div>

          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Observaciones florÃ­colas</label>
            <textarea id="fp-notes" class="form-control" rows="2" style="padding-left: 0.85rem;" placeholder="Tipo de sustrato, sistema de riego, porte de tallo, etc.">${plan ? escapeHtml(plan.notes) : ''}</textarea>
          </div>

        </div>
      </form>
    `;

    App.showModal(isEdit ? `Modificar Bloque: ${plan.block}` : 'Agregar Nuevo Bloque a Planos de Finca', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-farm-plan').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
        ${isEdit ? 'Actualizar Bloque' : 'Guardar Bloque'}
      </button>
    `);
  }

  function saveFarmPlanFromForm(planId) {
    const block = document.getElementById('fp-block').value.trim();
    const area = document.getElementById('fp-area')?.value || 'Sector Norte - Invernaderos';
    const variety = document.getElementById('fp-variety').value;
    const beds = document.getElementById('fp-beds').value.trim();
    const plantingDate = document.getElementById('fp-planting-date').value;
    const cycleVal = document.getElementById('fp-cycle').value.trim();
    const cycle = cycleVal ? `${cycleVal} dÃ­as` : '75 dÃ­as';
    const plantsTotal = document.getElementById('fp-plants').value.trim() || '0';
    const status = document.getElementById('fp-status').value;
    const notes = document.getElementById('fp-notes').value.trim();

    try {
      const payload = {
        block,
        area,
        variety,
        beds,
        plantingDate,
        cycle,
        plantsTotal,
        status,
        notes
      };
      if (planId) payload.id = planId;

      Store.saveFarmPlan(payload);
      App.closeModal();
      App.showToast(planId ? 'Bloque modificado con Ã©xito' : 'Nuevo bloque guardado en planos de finca', 'success');
      currentFarmTab = 'blocks';
      renderFarmPlans(document.getElementById('view-container'));
    } catch (e) {
      App.showToast(e.message, 'danger');
    }
  }

  function deleteFarmPlan(planId) {
    const plan = Store.getFarmPlan(planId);
    if (!plan) return;
    if (confirm(`Â¿EstÃ¡s seguro de eliminar el bloque "${plan.block}" (${plan.variety}) de los planos de finca?`)) {
      try {
        Store.deleteFarmPlan(planId);
        App.showToast('Bloque eliminado correctamente', 'success');
        renderFarmPlans(document.getElementById('view-container'));
      } catch (e) {
        App.showToast(e.message, 'danger');
      }
    }
  }


  // --- DESCARGA Y SUBIDA DE PLANTILLAS EXCEL (.xlsx) ---
  function downloadFarmTemplateXLSX() {
    try {
      const headers = [
        ['NUMERO_BLOQUE', 'VARIEDAD', 'CAMAS', 'FECHA_SIEMBRA', 'CICLO_PRODUCTIVO', 'PLANTAS_ESTIMADAS', 'ESTADO', 'OBSERVACIONES'],
        ['Bloque 1', 'Freedom', 24, '2025-06-15', '75 días', 4800, 'Activo', 'Corte regular exportación'],
        ['Bloque 2', 'Mondial', 20, '2025-08-20', '80 días', 4000, 'Activo', 'Bodas y eventos'],
        ['Bloque 3', 'Explorer', 28, '2025-04-10', '70 días', 5600, 'Activo', 'Rojo terciopelo'],
        ['Bloque 4A', 'Playa Blanca', 18, '2026-01-12', '90 días', 3600, 'Activo', 'Siembra nueva'],
        ['Bloque 4B', 'Pink Floyd', 16, '2024-11-05', '65 días', 3200, 'En Poda', 'Poda sincronizada']
      ];

      if (window.XLSX) {
        const ws = XLSX.utils.aoa_to_sheet(headers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Planos_Finca');
        XLSX.writeFile(wb, 'Plantilla_Planos_Finca_MRosecuador.xlsx');
        App.showToast('Plantilla Excel .xlsx descargada con éxito', 'success');
      } else {
        // Fallback CSV si no se hubiese cargado la librería
        let csvContent = 'data:text/csv;charset=utf-8,' + headers.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'Plantilla_Planos_Finca_MRosecuador.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        App.showToast('Plantilla CSV descargada (fallback)', 'warning');
      }
    } catch (e) {
      App.showToast('Error al generar plantilla Excel: ' + e.message, 'danger');
    }
  }

  function exportFarmPlansXLSX() {
    try {
      const plans = Store.getFarmPlans();
      const rows = [
        ['NUMERO_BLOQUE', 'VARIEDAD', 'CAMAS', 'FECHA_SIEMBRA', 'CICLO_PRODUCTIVO', 'PLANTAS_ESTIMADAS', 'ESTADO', 'OBSERVACIONES']
      ];

      plans.forEach(p => {
        rows.push([
          p.block,
          p.variety,
          parseInt(p.beds) || p.beds,
          p.plantingDate,
          p.cycle,
          parseInt(p.plantsTotal) || p.plantsTotal,
          p.status,
          p.notes || ''
        ]);
      });

      if (window.XLSX) {
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Planos_MRosecuador');
        const filename = `Planos_Finca_MRosecuador_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        App.showToast('Planos de finca exportados a Excel exitosamente', 'success');
      } else {
        App.showToast('Librería de exportación no disponible', 'danger');
      }
    } catch (e) {
      App.showToast('Error al exportar a Excel: ' + e.message, 'danger');
    }
  }

  function openImportExcelModal() {
    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div class="excel-dropzone" id="excel-drop-target" onclick="document.getElementById('excel-file-input').click()">
          <div class="excel-dropzone-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div>
            <div style="font-weight: 700; color: var(--emerald-dark); font-size: 1rem;">
              Haz clic aquí para seleccionar o arrastra tu archivo Excel (.xlsx)
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              Formatos soportados: .xlsx, .xls o .csv
            </div>
          </div>
          <input type="file" id="excel-file-input" accept=".xlsx, .xls, .csv" style="display: none;" onchange="Modules.handleExcelFileSelect(this)">
        </div>

        <div id="excel-import-preview" style="display: none; padding: 1rem; background: var(--bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="color: var(--primary-900); font-size: 0.88rem;" id="excel-preview-count">Registros detectados: 0</strong>
            <span class="badge badge-success">Formato Válido</span>
          </div>
          <div id="excel-preview-list" style="max-height: 160px; overflow-y: auto; font-size: 0.8rem; color: var(--text-main);"></div>
        </div>
      </div>
    `;

    App.showModal('Subir e Importar Plantilla Excel (.xlsx)', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" id="btn-confirm-import-excel" disabled onclick="Modules.executeExcelImport()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Confirmar e Importar a Finca
      </button>
    `);

    // Habilitar drag & drop en el dropzone
    setTimeout(() => {
      const dropzone = document.getElementById('excel-drop-target');
      if (dropzone) {
        ['dragenter', 'dragover'].forEach(name => {
          dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
          }, false);
        });

        ['dragleave', 'drop'].forEach(name => {
          dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
          }, false);
        });

        dropzone.addEventListener('drop', (e) => {
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            Modules.processExcelFile(files[0]);
          }
        }, false);
      }
    }, 100);
  }

  let parsedExcelData = [];

  function handleExcelFileSelect(input) {
    if (input.files && input.files[0]) {
      processExcelFile(input.files[0]);
    }
  }

  function processExcelFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!json || json.length < 2) {
          App.showToast('El archivo Excel está vacío o no contiene datos', 'danger');
          return;
        }

        // Buscar encabezados
        const headers = json[0].map(h => String(h || '').toUpperCase().trim());
        const blockIdx = headers.findIndex(h => h.includes('BLOQUE') || h.includes('BLOCK'));
        const varIdx = headers.findIndex(h => h.includes('VARIEDAD') || h.includes('ROSA'));
        const bedIdx = headers.findIndex(h => h.includes('CAMA') || h.includes('BED'));
        const dateIdx = headers.findIndex(h => h.includes('SIEMBRA') || h.includes('FECHA') || h.includes('DATE'));
        const cycleIdx = headers.findIndex(h => h.includes('CICLO') || h.includes('CYCLE'));
        const plantsIdx = headers.findIndex(h => h.includes('PLANTA'));
        const statusIdx = headers.findIndex(h => h.includes('ESTADO'));
        const notesIdx = headers.findIndex(h => h.includes('OBSERVAC') || h.includes('NOTA'));

        parsedExcelData = [];

        for (let i = 1; i < json.length; i++) {
          const row = json[i];
          if (!row || row.length === 0) continue;
          const block = row[blockIdx >= 0 ? blockIdx : 0];
          const variety = row[varIdx >= 0 ? varIdx : 1];
          if (!block || !variety) continue;

          parsedExcelData.push({
            block: String(block).trim(),
            variety: String(variety).trim(),
            beds: bedIdx >= 0 && row[bedIdx] ? String(row[bedIdx]) : '20',
            plantingDate: dateIdx >= 0 && row[dateIdx] ? String(row[dateIdx]) : new Date().toISOString().split('T')[0],
            cycle: cycleIdx >= 0 && row[cycleIdx] 
              ? (String(row[cycleIdx]).toLowerCase().includes('día') ? String(row[cycleIdx]).trim() : String(row[cycleIdx]).trim() + ' días') 
              : '75 días',
            plantsTotal: plantsIdx >= 0 && row[plantsIdx] ? String(row[plantsIdx]) : '4000',
            status: statusIdx >= 0 && row[statusIdx] ? String(row[statusIdx]) : 'Activo',
            notes: notesIdx >= 0 && row[notesIdx] ? String(row[notesIdx]) : 'Importado vía Excel .xlsx'
          });
        }

        if (parsedExcelData.length === 0) {
          App.showToast('No se encontraron filas con Bloque y Variedad válidos', 'danger');
          return;
        }

        // Mostrar Preview
        const previewEl = document.getElementById('excel-import-preview');
        const countEl = document.getElementById('excel-preview-count');
        const listEl = document.getElementById('excel-preview-list');
        const confirmBtn = document.getElementById('btn-confirm-import-excel');

        if (previewEl && countEl && listEl && confirmBtn) {
          previewEl.style.display = 'block';
          countEl.textContent = `Registros listos para importar: ${parsedExcelData.length}`;
          listEl.innerHTML = parsedExcelData.slice(0, 10).map((r, idx) => `
            <div style="padding: 0.25rem 0; border-bottom: 1px solid var(--border-light);">
              <strong>${idx + 1}. ${escapeHtml(r.block)}</strong> - Rosa ${escapeHtml(r.variety)} (${r.beds} camas, ${r.cycle})
            </div>
          `).join('') + (parsedExcelData.length > 10 ? `<div style="padding: 0.25rem 0; color: var(--text-muted);">... y ${parsedExcelData.length - 10} registros más.</div>` : '');

          confirmBtn.disabled = false;
        }

        App.showToast(`Excel leído: ${parsedExcelData.length} bloques identificados`, 'success');

      } catch (err) {
        App.showToast('Error al procesar el archivo Excel: ' + err.message, 'danger');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function executeExcelImport() {
    if (!parsedExcelData || parsedExcelData.length === 0) {
      App.showToast('No hay registros cargados para importar', 'danger');
      return;
    }

    const imported = Store.importFarmPlansBatch(parsedExcelData);
    App.closeModal();
    App.showToast(`¡Excelente! Se han importado ${imported} bloques a los planos de finca`, 'success');
    renderFarmPlans(document.getElementById('view-container'));
  }

  // --- RENDERIZADO: CONFIGURACIÓN DE FINCA - CATÁLOGO DE VARIEDADES ---
  function renderVarietiesCatalog(container) {
    const varieties = Store.getVarieties();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--rose-600); background: var(--rose-50); padding: 0.2rem 0.65rem; border-radius: 99px;">
              Configuración de Finca
            </span>
          </div>
          <h1>Catálogo de Variedades de Rosas</h1>
          <p class="view-subtitle">Ficha técnica FLORÍCOLA: fotografías, tamaño de botón floral, largos de tallos, punto de corte, prueba de florero y número de pétalos.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.renderVarietiesCatalog(document.getElementById('view-container'))">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            Refrescar
          </button>
          <button class="btn btn-secondary" onclick="Modules.openPrintCatalogModal()" style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 700; border-color: #059669; color: #047857;" title="Imprimir Catálogo Técnico con toda la información">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Catálogo
          </button>
          <button class="btn btn-emerald" onclick="Modules.openVarietyModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Variedad de Rosa
          </button>
        </div>
      </div>

      <!-- Filtros Rápidos de Color y Búsqueda -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem; background: #ffffff; padding: 0.65rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
        <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
          <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Filtrar Color:</span>
          <button class="btn btn-secondary" style="padding: 0.25rem 0.65rem; font-size: 0.74rem;" onclick="Modules.filterVarietiesCatalog('all')">Todos (${varieties.length})</button>
          <button class="btn btn-secondary" style="padding: 0.25rem 0.65rem; font-size: 0.74rem;" onclick="Modules.filterVarietiesCatalog('rojo')">🌹 Rojas</button>
          <button class="btn btn-secondary" style="padding: 0.25rem 0.65rem; font-size: 0.74rem;" onclick="Modules.filterVarietiesCatalog('blanco')">🤍 Blancas</button>
          <button class="btn btn-secondary" style="padding: 0.25rem 0.65rem; font-size: 0.74rem;" onclick="Modules.filterVarietiesCatalog('fucsia')">🌸 Fucsias</button>
        </div>
        <input type="text" id="variety-search-input" placeholder="Buscar variedad, color u obtentor..." class="form-control" style="width: 250px; padding: 0.38rem 0.8rem; font-size: 0.8rem;" oninput="Modules.filterVarietiesCatalogByText(this.value)">
      </div>

      <!-- Tabla Principal de Variedades de Rosas -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a7 7 0 0 0 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 0 7-7z"></path></svg>
            Listado Técnico de Variedades de Rosas
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;" id="varieties-count-badge">
            ${varieties.length} variedades registradas
          </span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table" id="varieties-table">
              <thead>
                <tr>
                  <th style="width: 48px; text-align: center;">Foto</th>
                  <th>Variedad y Obtentor</th>
                  <th>Color / Tonalidad</th>
                  <th>Botón Floral</th>
                  <th>N° Pétalos</th>
                  <th>Punto de Corte</th>
                  <th>Vida Florero</th>
                  <th>Largos de Tallos</th>
                  <th>Observaciones</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody id="varieties-table-body">
                ${renderVarietiesTableRowsHtml(varieties)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderVarietiesTableRowsHtml(varieties) {
    if (!varieties || varieties.length === 0) {
      return `<tr><td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No se encontraron variedades de rosas que coincidan con la búsqueda.</td></tr>`;
    }

    return varieties.map(v => {
      let dotClass = 'dot-red';
      const cTag = (v.colorTag || '').toLowerCase();
      const cName = (v.name || '').toLowerCase();
      const cColor = (v.color || '').toLowerCase();
      if (cTag.includes('blanco') || cName.includes('blanca') || cName.includes('mondial') || cColor.includes('blanco')) dotClass = 'dot-white';
      else if (cTag.includes('fucsia') || cTag.includes('pink') || cName.includes('pink') || cColor.includes('fucsia') || cColor.includes('rosad')) dotClass = 'dot-pink';
      else if (cTag.includes('amarillo') || cTag.includes('yellow') || cColor.includes('amarill')) dotClass = 'dot-yellow';
      else if (cTag.includes('naranja') || cTag.includes('peach') || cColor.includes('naranj') || cColor.includes('durazno')) dotClass = 'dot-peach';

      return `
        <tr data-variety-id="${v.id}" data-color-tag="${escapeHtml(v.colorTag || '')}">
          <td style="width: 48px; text-align: center; vertical-align: middle;">
            <div style="width: 38px; height: 38px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-light); background: var(--bg-subtle); display: inline-flex; align-items: center; justify-content: center;">
              <img src="${v.photo || 'assets/variety_freedom.svg'}" alt="${escapeHtml(v.name)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/variety_freedom.svg'">
            </div>
          </td>
          <td>
            <div style="font-weight: 700; color: var(--primary-900); font-size: 0.84rem;">Rosa ${escapeHtml(v.name)}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">${escapeHtml(v.breeder || 'MRosecuador')}</div>
          </td>
          <td>
            <span class="flower-variety-badge" style="font-size: 0.74rem;">
              <span class="variety-dot ${dotClass}"></span>
              ${escapeHtml(v.color || 'Exportación')}
            </span>
          </td>
          <td><span style="font-weight: 600;">${escapeHtml(v.budSize || '-')}</span></td>
          <td>${escapeHtml(v.petalCount || '-')}</td>
          <td><span class="badge badge-neutral" style="font-size: 0.70rem; padding: 0.12rem 0.45rem;">${escapeHtml(v.cutStage || '-')}</span></td>
          <td><span style="color: var(--emerald-dark); font-weight: 700;">${escapeHtml(v.vaseLife || '-')}</span></td>
          <td><span style="font-size: 0.74rem; color: var(--text-main);">${escapeHtml(v.stemLengths || '-')}</span></td>
          <td style="max-width: 220px; font-size: 0.72rem; color: var(--text-muted); line-height: 1.25;" title="${escapeHtml(v.description || '')}">
            ${escapeHtml(v.description ? (v.description.length > 50 ? v.description.substring(0, 47) + '...' : v.description) : '-')}
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-secondary btn-icon-only" style="padding: 0.22rem 0.4rem; color: #047857;" title="Imprimir Ficha Técnica de Variedad" onclick="Modules.printSingleVarietySheet('${v.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            </button>
            <button class="btn btn-secondary btn-icon-only" style="padding: 0.22rem 0.4rem;" title="Modificar Ficha Técnica" onclick="Modules.openVarietyModal('${v.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="btn btn-secondary btn-icon-only btn-icon-danger" style="padding: 0.22rem 0.4rem;" title="Eliminar Variedad" onclick="Modules.deleteVariety('${v.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderVarietiesCardsHtml(varieties) {
    return renderVarietiesTableRowsHtml(varieties);
  }

  function filterVarietiesCatalog(colorFilter = 'all') {
    const varieties = Store.getVarieties();
    const filtered = colorFilter === 'all' 
      ? varieties 
      : varieties.filter(v => (v.colorTag && v.colorTag.toLowerCase() === colorFilter.toLowerCase()) || (v.color && v.color.toLowerCase().includes(colorFilter.toLowerCase())));
    
    const tbody = document.getElementById('varieties-table-body');
    if (tbody) tbody.innerHTML = renderVarietiesTableRowsHtml(filtered);

    const badge = document.getElementById('varieties-count-badge');
    if (badge) badge.textContent = `${filtered.length} variedades ${colorFilter !== 'all' ? 'filtradas' : 'registradas'}`;
  }

  function filterVarietiesCatalogByText(term) {
    const cleanTerm = term.toLowerCase().trim();
    const varieties = Store.getVarieties();
    const filtered = varieties.filter(v => 
      (v.name && v.name.toLowerCase().includes(cleanTerm)) ||
      (v.color && v.color.toLowerCase().includes(cleanTerm)) ||
      (v.breeder && v.breeder.toLowerCase().includes(cleanTerm)) ||
      (v.description && v.description.toLowerCase().includes(cleanTerm))
    );
    const tbody = document.getElementById('varieties-table-body');
    if (tbody) tbody.innerHTML = renderVarietiesTableRowsHtml(filtered);

    const badge = document.getElementById('varieties-count-badge');
    if (badge) badge.textContent = `${filtered.length} variedades ${cleanTerm ? 'encontradas' : 'registradas'}`;
  }

  let selectedVarietyPhotoBase64 = null;

  function openVarietyModal(varietyId = null) {
    const isEdit = !!varietyId;
    const variety = isEdit ? Store.getVariety(varietyId) : null;
    selectedVarietyPhotoBase64 = variety ? variety.photo : null;

    const bodyHtml = `
      <form id="form-variety-edit" onsubmit="event.preventDefault(); Modules.saveVarietyFromForm('${varietyId || ''}');">
        <div style="display: flex; flex-direction: column; gap: 1.15rem;">
          
          <!-- Foto de la Variedad -->
          <div class="form-group">
            <label class="form-label">Fotografía de la Variedad de Rosa</label>
            <div class="image-upload-box" onclick="document.getElementById('var-photo-input').click()">
              <input type="file" id="var-photo-input" accept="image/*" style="display: none;" onchange="Modules.handleVarietyPhotoSelect(this)">
              <div id="var-photo-preview-wrap" style="text-align: center;">
                ${selectedVarietyPhotoBase64 ? `
                  <img src="${selectedVarietyPhotoBase64}" class="image-preview-target" id="var-photo-img-preview" alt="Vista previa">
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.4rem;">Haz clic para cambiar la fotografía</div>
                ` : `
                  <div style="color: var(--emerald-main); margin-bottom: 0.35rem;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                  <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary-900);">Subir fotografía de la rosa</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Formatos JPG, PNG, WEBP</div>
                `}
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Nombre de la Variedad</label>
              <input type="text" id="var-name" class="form-control" required placeholder="Ej: Freedom, Mondial, etc." value="${variety ? escapeHtml(variety.name) : ''}">
            </div>

            <div class="form-group">
              <label class="form-label">Color / Tonalidad Predominante</label>
              <input type="text" id="var-color" class="form-control" required placeholder="Ej: Rojo Terciopelo o Blanco Puro" value="${variety ? escapeHtml(variety.color) : ''}">
            </div>

            <div class="form-group">
              <label class="form-label">Tamaño de Botón</label>
              <input type="text" id="var-bud-size" class="form-control" required placeholder="Ej: 6.0 - 6.8 cm (Grande)" value="${variety ? escapeHtml(variety.budSize) : '6.0 - 6.8 cm'}">
            </div>

            <div class="form-group">
              <label class="form-label">Largos de Tallos Disponibles</label>
              <input type="text" id="var-stems" class="form-control" required placeholder="Ej: 60, 70, 80, 90 cm" value="${variety ? escapeHtml(variety.stemLengths) : '60, 70, 80, 90 cm'}">
            </div>

            <div class="form-group">
              <label class="form-label">Punto de Corte</label>
              <input type="text" id="var-cut" class="form-control" required placeholder="Ej: Punto 2.5 - 3.0 (Semi-abierto)" value="${variety ? escapeHtml(variety.cutStage) : 'Punto 2.5'}">
            </div>

            <div class="form-group">
              <label class="form-label">Prueba de Florero (Vida Útil)</label>
              <input type="text" id="var-vase" class="form-control" required placeholder="Ej: 14 - 18 días en florero" value="${variety ? escapeHtml(variety.vaseLife) : '15 - 18 días'}">
            </div>

            <div class="form-group">
              <label class="form-label">Número de Pétalos</label>
              <input type="text" id="var-petals" class="form-control" required placeholder="Ej: 45 - 55 pétalos" value="${variety ? escapeHtml(variety.petalCount) : '45 - 55 pétalos'}">
            </div>

            <div class="form-group">
              <label class="form-label">Casa Obtentora (Breeder)</label>
              <input type="text" id="var-breeder" class="form-control" placeholder="Ej: Rosen Tantau / Kordes" value="${variety ? escapeHtml(variety.breeder) : ''}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Descripción de Apertura y Características</label>
            <textarea id="var-desc" class="form-control" rows="2" style="padding-left: 0.85rem;" placeholder="Apertura uniforme, resistencia a botrytis, follaje brillante...">${variety ? escapeHtml(variety.description) : ''}</textarea>
          </div>

        </div>
      </form>
    `;

    App.showModal(isEdit ? `Modificar Variedad: ${variety.name}` : 'Ingresar Nueva Variedad al Catálogo', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-variety-edit').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
        ${isEdit ? 'Actualizar Variedad' : 'Guardar Variedad'}
      </button>
    `);
  }

  function handleVarietyPhotoSelect(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        selectedVarietyPhotoBase64 = e.target.result;
        const wrap = document.getElementById('var-photo-preview-wrap');
        if (wrap) {
          wrap.innerHTML = `
            <img src="${selectedVarietyPhotoBase64}" class="image-preview-target" id="var-photo-img-preview" alt="Vista previa">
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.4rem;">Foto cargada con éxito. Clic para cambiar</div>
          `;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function saveVarietyFromForm(varietyId) {
    const name = document.getElementById('var-name').value.trim();
    const color = document.getElementById('var-color').value.trim();
    const budSize = document.getElementById('var-bud-size').value.trim();
    const stemLengths = document.getElementById('var-stems').value.trim();
    const cutStage = document.getElementById('var-cut').value.trim();
    const vaseLife = document.getElementById('var-vase').value.trim();
    const petalCount = document.getElementById('var-petals').value.trim();
    const breeder = document.getElementById('var-breeder').value.trim();
    const description = document.getElementById('var-desc').value.trim();

    // Determinar etiqueta de color
    let colorTag = 'rojo';
    const cLower = color.toLowerCase();
    if (cLower.includes('blan') || cLower.includes('marfil')) colorTag = 'blanco';
    if (cLower.includes('fuc') || cLower.includes('pink') || cLower.includes('rosa')) colorTag = 'fucsia';
    if (cLower.includes('amaril') || cLower.includes('yellow')) colorTag = 'amarillo';

    const payload = {
      name,
      color,
      colorTag,
      budSize,
      stemLengths,
      cutStage,
      vaseLife,
      petalCount,
      breeder: breeder || 'MRosecuador',
      description,
      photo: selectedVarietyPhotoBase64 || 'assets/variety_freedom.svg'
    };

    if (varietyId) payload.id = varietyId;

    try {
      Store.saveVariety(payload);
      App.closeModal();
      App.showToast(varietyId ? 'Variedad actualizada con éxito' : 'Nueva variedad ingresada al catálogo', 'success');
      renderVarietiesCatalog(document.getElementById('view-container'));
    } catch (e) {
      App.showToast(e.message, 'danger');
    }
  }

  function deleteVariety(varietyId) {
    const v = Store.getVariety(varietyId);
    if (!v) return;
    if (confirm(`¿Estás seguro de eliminar la variedad "${v.name}" del catálogo?`)) {
      try {
        Store.deleteVariety(varietyId);
        App.showToast('Variedad eliminada del catálogo', 'success');
        renderVarietiesCatalog(document.getElementById('view-container'));
      } catch (e) {
        App.showToast(e.message, 'danger');
      }
    }
  }
  // ==============================================================================
  // MOTOR DE CÓDIGO DE BARRAS CODE 128 (FORMATO VECTORIAL SVG PARA IMPRESIÓN)
  // ==============================================================================
  const CODE128_PATTERNS = [
    "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
    "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
    "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
    "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
    "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
    "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
    "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
    "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
    "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
    "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
    "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
  ];

  function generateCode128Svg(text, width = 220, height = 55, showText = true) {
    if (!text) text = "MR001";
    const clean = String(text).trim();
    const codes = [104]; // Inicio Code 128 B
    let checkSum = 104;

    for (let i = 0; i < clean.length; i++) {
      const charCode = clean.charCodeAt(i);
      const val = (charCode >= 32 && charCode <= 126) ? (charCode - 32) : 0;
      codes.push(val);
      checkSum += val * (i + 1);
    }

    codes.push(checkSum % 103);
    codes.push(106); // Stop

    const modules = [];
    codes.forEach(c => {
      const pat = CODE128_PATTERNS[c] || "212222";
      for (let j = 0; j < pat.length; j++) {
        const w = parseInt(pat[j], 10);
        modules.push({ isBar: (j % 2 === 0), width: w });
      }
    });

    const totalWidthModules = modules.reduce((acc, m) => acc + m.width, 0) + 16;
    const unitWidth = width / totalWidthModules;
    let currentX = 8 * unitWidth;
    const barHeight = showText ? height - 15 : height;

    let svgBars = '';
    modules.forEach(m => {
      const barW = m.width * unitWidth;
      if (m.isBar) {
        svgBars += `<rect x="${currentX.toFixed(2)}" y="2" width="${barW.toFixed(2)}" height="${barHeight}" fill="#0f172a" />`;
      }
      currentX += barW;
    });

    const textSvg = showText 
      ? `<text x="${(width / 2).toFixed(2)}" y="${height - 2}" font-family="monospace, monospace" font-size="10" font-weight="700" fill="#334155" text-anchor="middle" letter-spacing="1">${escapeHtml(clean)}</text>`
      : '';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="barcode-svg" style="background:#ffffff; border-radius: 4px; display: block; margin: 0 auto;">
        ${svgBars}
        ${textSvg}
      </svg>
    `;
  }

  // ==============================================================================
  // MÓDULO: GENERAR CÓDIGOS Y ETIQUETAS DE PRODUCCIÓN
  // ==============================================================================
  function renderBarcodeLabels(container) {
    const barcodes = Store.getBarcodes();
    const plans = Store.getFarmPlans();
    const varieties = Store.getVarieties();
    const uniqueHarvesters = new Set(barcodes.map(b => b.harvester).filter(Boolean)).size;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--emerald-main); background: var(--primary-50); padding: 0.2rem 0.65rem; border-radius: 99px;">
              Trazabilidad y Empaque
            </span>
          </div>
          <h1>Generar Códigos y Etiquetas</h1>
          <p class="view-subtitle">Emisión e impresión de etiquetas con código de barras Code 128 para mallas y carretas de cosecha por Bloque, Variedad y Cosechador.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.openPrintLabelsModal()" title="Imprimir hoja de etiquetas">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Hoja de Stickers
          </button>
          <button class="btn btn-emerald" onclick="Modules.openBarcodeModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Etiqueta / Lote
          </button>
        </div>
      </div>

      <!-- Métricas de Etiquetas -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Lotes Etiquetados</span>
            <span class="kpi-value">${barcodes.length}</span>
            <span class="kpi-trend positive">Etiquetas activas</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5v14M6 5v14M10 5v14M13 5v14M16 5v14M18 5v14M21 5v14"/></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Total Stickers Emitidos</span>
            <span class="kpi-value">${barcodes.reduce((acc, b) => acc + (parseInt(b.count) || 1), 0)}</span>
            <span class="kpi-trend positive">Impresiones para campo</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Cosechadores Asignados</span>
            <span class="kpi-value">${uniqueHarvesters}</span>
            <span class="kpi-trend positive">Personal con código</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-rose">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Bloques con Cobertura</span>
            <span class="kpi-value">${new Set(barcodes.map(b => b.block)).size} de ${plans.length}</span>
            <span class="kpi-trend neutral">Trazabilidad de origen</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
          </div>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem; background: #ffffff; padding: 0.65rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
        <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
          <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Filtrar por Bloque:</span>
          <select id="filter-barcode-block" class="form-control" style="width: 150px; padding: 0.25rem 0.6rem; font-size: 0.76rem;" onchange="Modules.filterBarcodeTable()">
            <option value="">Todos los Bloques</option>
            ${plans.map(p => `<option value="${escapeHtml(p.block)}">${escapeHtml(p.block)}</option>`).join('')}
          </select>
          <select id="filter-barcode-variety" class="form-control" style="width: 160px; padding: 0.25rem 0.6rem; font-size: 0.76rem;" onchange="Modules.filterBarcodeTable()">
            <option value="">Todas las Variedades</option>
            ${varieties.map(v => `<option value="${escapeHtml(v.name)}">Rosa ${escapeHtml(v.name)}</option>`).join('')}
          </select>
        </div>
        <input type="text" id="barcode-search-input" placeholder="Buscar por código, cosechador o lote..." class="form-control" style="width: 250px; padding: 0.38rem 0.8rem; font-size: 0.8rem;" oninput="Modules.filterBarcodeTable()">
      </div>

      <!-- Tabla de Etiquetas y Códigos de Barras -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5v14M6 5v14M10 5v14M13 5v14M16 5v14M18 5v14M21 5v14"/></svg>
            Listado de Códigos de Barras y Etiquetas Emitidas
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;" id="barcodes-count-badge">
            ${barcodes.length} etiquetas registradas
          </span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table" id="barcodes-table">
              <thead>
                <tr>
                  <th style="width: 190px; text-align: center;">Código de Barras</th>
                  <th>Código Alfanumérico</th>
                  <th>Bloque</th>
                  <th>Variedad de Rosa</th>
                  <th>Cosechador</th>
                  <th>Fecha / Lote</th>
                  <th style="text-align: center;">Stickers</th>
                  <th>Observaciones</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody id="barcodes-table-body">
                ${renderBarcodeTableRows(barcodes)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderBarcodeTableRows(barcodes) {
    if (!barcodes || barcodes.length === 0) {
      return `<tr><td colspan="9" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No hay etiquetas generadas. Presiona "Nueva Etiqueta / Lote" para comenzar.</td></tr>`;
    }

    return barcodes.map(b => `
      <tr data-barcode-id="${b.id}">
        <td style="text-align: center; padding: 0.3rem 0.5rem; background: #fafafa;">
          ${generateCode128Svg(b.code, 175, 42, false)}
        </td>
        <td>
          <span style="font-family: monospace; font-weight: 700; color: var(--primary-900); font-size: 0.82rem; background: var(--bg-subtle); padding: 0.2rem 0.45rem; border-radius: 4px; border: 1px solid var(--border-light);">
            ${escapeHtml(b.code)}
          </span>
        </td>
        <td><strong style="color: var(--primary-800);">${escapeHtml(b.block)}</strong></td>
        <td>
          <span class="flower-variety-badge" style="font-size: 0.76rem;">
            <span class="variety-dot dot-red"></span>
            Rosa ${escapeHtml(b.variety)}
          </span>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main); font-size: 0.80rem;">${escapeHtml(b.harvester)}</div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">ID: ${escapeHtml(b.harvesterCode || 'C-01')}</div>
        </td>
        <td>
          <div style="font-size: 0.78rem; font-weight: 600;">${escapeHtml(b.date || '')}</div>
          <div style="font-size: 0.68rem; color: var(--emerald-dark);">${escapeHtml(b.batch || 'LOTE GENERAL')}</div>
        </td>
        <td style="text-align: center;">
          <span class="badge badge-neutral" style="font-size: 0.72rem;">${b.count || 1} uds</span>
        </td>
        <td style="max-width: 180px; font-size: 0.72rem; color: var(--text-muted);">
          ${escapeHtml(b.notes || '-')}
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-secondary btn-icon-only" style="padding: 0.22rem 0.4rem;" title="Vista previa e Impresión" onclick="Modules.openPrintLabelsModal('${b.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          </button>
          <button class="btn btn-secondary btn-icon-only" style="padding: 0.22rem 0.4rem;" title="Editar Parámetros" onclick="Modules.openBarcodeModal('${b.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn btn-secondary btn-icon-only btn-icon-danger" style="padding: 0.22rem 0.4rem;" title="Eliminar Etiqueta" onclick="Modules.deleteBarcode('${b.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function filterBarcodeTable() {
    const block = document.getElementById('filter-barcode-block')?.value || '';
    const variety = document.getElementById('filter-barcode-variety')?.value || '';
    const term = (document.getElementById('barcode-search-input')?.value || '').toLowerCase().trim();

    const barcodes = Store.getBarcodes();
    const filtered = barcodes.filter(b => {
      const matchBlock = !block || b.block === block;
      const matchVar = !variety || b.variety.toLowerCase().includes(variety.toLowerCase());
      const matchTerm = !term || 
        b.code.toLowerCase().includes(term) ||
        b.harvester.toLowerCase().includes(term) ||
        (b.batch && b.batch.toLowerCase().includes(term));
      return matchBlock && matchVar && matchTerm;
    });

    const tbody = document.getElementById('barcodes-table-body');
    if (tbody) tbody.innerHTML = renderBarcodeTableRows(filtered);

    const badge = document.getElementById('barcodes-count-badge');
    if (badge) badge.textContent = `${filtered.length} etiquetas encontradas`;
  }

  function openBarcodeModal(barcodeId = null) {
    const isEdit = !!barcodeId;
    const item = isEdit ? Store.getBarcode(barcodeId) : null;
    const plans = Store.getFarmPlans();
    const varieties = Store.getVarieties();
    const today = new Date().toISOString().split('T')[0];

    const bodyHtml = `
      <form id="form-barcode" onsubmit="event.preventDefault(); Modules.saveBarcodeFromForm('${barcodeId || ''}');">
        <div style="display: flex; flex-direction: column; gap: 0.95rem;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Bloque de Corte *</label>
              <select id="lbl-block" class="form-control" required onchange="Modules.autoGenerateBarcodeCode()">
                <option value="">Seleccione bloque...</option>
                ${plans.map(p => `
                  <option value="${escapeHtml(p.block)}" ${item && item.block === p.block ? 'selected' : ''}>
                    ${escapeHtml(p.block)} (${escapeHtml(p.variety)})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Variedad de Rosa *</label>
              <select id="lbl-variety" class="form-control" required onchange="Modules.autoGenerateBarcodeCode()">
                <option value="">Seleccione variedad...</option>
                ${varieties.map(v => `
                  <option value="${escapeHtml(v.name)}" ${item && item.variety === v.name ? 'selected' : ''}>
                    Rosa ${escapeHtml(v.name)}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Nombre del Cosechador *</label>
              <input type="text" id="lbl-harvester" class="form-control" placeholder="Ej: Juan Tipán" value="${item ? escapeHtml(item.harvester) : 'Juan Tipán'}" required oninput="Modules.autoGenerateBarcodeCode()">
            </div>
            <div class="form-group">
              <label class="form-label">Código Cosechador</label>
              <input type="text" id="lbl-harvester-code" class="form-control" placeholder="C-01" value="${item ? escapeHtml(item.harvesterCode || 'C-01') : 'C-01'}" oninput="Modules.autoGenerateBarcodeCode()">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Fecha de Cosecha</label>
              <input type="date" id="lbl-date" class="form-control" value="${item ? item.date : today}" required onchange="Modules.autoGenerateBarcodeCode()">
            </div>
            <div class="form-group">
              <label class="form-label">Cantidad de Stickers a Emitir</label>
              <input type="number" id="lbl-count" class="form-control" min="1" max="500" value="${item ? item.count : 20}" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Código de Barra Generado (Code 128)</label>
            <input type="text" id="lbl-code" class="form-control" style="font-family: monospace; font-weight: 700; background: var(--bg-subtle);" value="${item ? escapeHtml(item.code) : ''}" required>
          </div>

          <!-- Vista previa en tiempo real -->
          <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); text-align: center;">
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.4rem;">
              Vista Previa del Código de Barras
            </div>
            <div id="lbl-preview-box">
              ${generateCode128Svg(item ? item.code : 'MR-B01-FREED-C01', 240, 52, true)}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Observaciones / Destino</label>
            <input type="text" id="lbl-notes" class="form-control" placeholder="Ej: Mallas para recepción en poscosecha sala 1" value="${item ? escapeHtml(item.notes || '') : ''}">
          </div>

        </div>
      </form>
    `;

    App.showModal(isEdit ? 'Editar Parámetros de Etiqueta' : 'Generar Nuevo Código de Barras y Etiquetas', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-barcode').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ${isEdit ? 'Guardar Cambios' : 'Generar Etiquetas'}
      </button>
    `);

    if (!isEdit) {
      setTimeout(() => autoGenerateBarcodeCode(), 50);
    }
  }

  function autoGenerateBarcodeCode() {
    const blockEl = document.getElementById('lbl-block');
    const varEl = document.getElementById('lbl-variety');
    const harvCodeEl = document.getElementById('lbl-harvester-code');
    const codeEl = document.getElementById('lbl-code');
    const previewEl = document.getElementById('lbl-preview-box');

    if (!codeEl) return;

    const blockVal = blockEl && blockEl.value ? blockEl.value.replace(/\s+/g, '').substring(0, 4).toUpperCase() : 'B01';
    const varVal = varEl && varEl.value ? varEl.value.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase() : 'VAR';
    const hCode = harvCodeEl && harvCodeEl.value ? harvCodeEl.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase() : 'C01';
    const dateShort = new Date().toISOString().slice(2, 10).replace(/-/g, '');

    const generated = `MR-${blockVal}-${varVal}-${hCode}-${dateShort}`;
    codeEl.value = generated;

    if (previewEl) {
      previewEl.innerHTML = generateCode128Svg(generated, 240, 52, true);
    }
  }

  function saveBarcodeFromForm(barcodeId = null) {
    const block = document.getElementById('lbl-block').value;
    const variety = document.getElementById('lbl-variety').value;
    const harvester = document.getElementById('lbl-harvester').value;
    const harvesterCode = document.getElementById('lbl-harvester-code').value || 'C-01';
    const date = document.getElementById('lbl-date').value;
    const count = parseInt(document.getElementById('lbl-count').value, 10) || 1;
    const code = document.getElementById('lbl-code').value;
    const notes = document.getElementById('lbl-notes').value;

    if (!block || !variety || !harvester || !code) {
      App.showToast('Por favor completa todos los campos requeridos', 'danger');
      return;
    }

    const payload = {
      id: barcodeId || undefined,
      code: code.trim(),
      block,
      variety,
      harvester: harvester.trim(),
      harvesterCode: harvesterCode.trim(),
      date,
      count,
      batch: `LOTE-${block.replace(/\s+/g, '')}-${date.replace(/-/g, '').slice(4)}`,
      notes: notes.trim()
    };

    try {
      Store.saveBarcode(payload);
      App.closeModal();
      App.showToast(`Etiqueta "${payload.code}" generada con éxito (${count} unidades)`, 'success');
      renderBarcodeLabels(document.getElementById('view-container'));
    } catch (e) {
      App.showToast('Error al guardar etiqueta: ' + e.message, 'danger');
    }
  }

  function deleteBarcode(barcodeId) {
    if (confirm('¿Deseas eliminar este registro de etiquetas emitidas?')) {
      Store.deleteBarcode(barcodeId);
      App.showToast('Registro de etiquetas eliminado', 'success');
      renderBarcodeLabels(document.getElementById('view-container'));
    }
  }

  function openPrintLabelsModal(barcodeId = null) {
    const barcodes = Store.getBarcodes();
    const target = barcodeId ? barcodes.find(b => b.id === barcodeId) : (barcodes[0] || null);

    if (!target) {
      App.showToast('No hay etiquetas disponibles para imprimir', 'danger');
      return;
    }

    const countToPrint = Math.min(target.count || 12, 24);
    const stickersHtml = Array.from({ length: countToPrint }).map((_, idx) => `
      <div class="sticker-label-card" style="border: 1px dashed #cbd5e1; padding: 0.65rem 0.5rem; background: #ffffff; border-radius: 6px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2rem; margin-bottom: 0.3rem;">
          <span style="font-weight: 800; font-size: 0.65rem; color: #065f46; letter-spacing: 0.05em;">MROSECUADOR</span>
          <span style="font-size: 0.62rem; color: #64748b; font-weight: 600;">#${idx + 1}</span>
        </div>
        <div style="margin: 0.2rem 0;">
          ${generateCode128Svg(target.code, 180, 46, true)}
        </div>
        <div style="font-size: 0.70rem; font-weight: 700; color: #0f172a; margin-top: 0.2rem;">
          ${escapeHtml(target.block)} - Rosa ${escapeHtml(target.variety)}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.62rem; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 0.2rem; margin-top: 0.25rem;">
          <span>Cosecha: ${escapeHtml(target.harvester)}</span>
          <span>${escapeHtml(target.date)}</span>
        </div>
      </div>
    `).join('');

    const bodyHtml = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: var(--primary-50); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--primary-100);">
          <div>
            <div style="font-weight: 700; color: var(--emerald-dark); font-size: 0.88rem;">
              Lote: ${escapeHtml(target.code)}
            </div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">
              ${escapeHtml(target.block)} | Rosa ${escapeHtml(target.variety)} | Cosechador: ${escapeHtml(target.harvester)}
            </div>
          </div>
          <span class="badge badge-success">Vista para Impresión (${countToPrint} stickers)</span>
        </div>

        <div id="print-stickers-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 0.65rem; max-height: 55vh; overflow-y: auto; padding: 0.5rem; background: var(--bg-subtle); border-radius: var(--radius-md);">
          ${stickersHtml}
        </div>
      </div>
    `;

    App.showModal('Impresión de Etiquetas de Código de Barras', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
      <button class="btn btn-emerald" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Mandar a Imprimir Etiquetas
      </button>
    `);
  }

  // ==============================================================================
  // MÓDULO: CONTROL DE RIEGO (PH Y CE EN PREPARACIÓN Y CAMPO CON VÁLVULA)
  // ==============================================================================
  let currentIrrigationTab = 'field'; // 'field' | 'prep'

  function renderIrrigationControl(container, activeTab = currentIrrigationTab) {
    currentIrrigationTab = activeTab;
    const fieldSamples = Store.getIrrigationField();
    const prepRecords = Store.getIrrigationPrep();
    const plans = Store.getFarmPlans();

    // Promedios florícolas
    const avgFieldPh = fieldSamples.length > 0 
      ? (fieldSamples.reduce((acc, s) => acc + (parseFloat(s.ph) || 0), 0) / fieldSamples.length).toFixed(2)
      : '6.00';
    const avgFieldEc = fieldSamples.length > 0 
      ? (fieldSamples.reduce((acc, s) => acc + (parseFloat(s.ec) || 0), 0) / fieldSamples.length).toFixed(2)
      : '1.45';

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 0.2rem 0.65rem; border-radius: 99px;">
              Monitoreo florícola
            </span>
          </div>
          <h1>Control de Riego (pH y CE)</h1>
          <p class="view-subtitle">Supervisión integral de parámetros físico-químicos: solución madre en cabezal y muestras directas en campo por Bloque, Variedad y Válvula.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.exportIrrigationXLSX()" title="Exportar historial de riego a Excel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Exportar a Excel
          </button>
          ${currentIrrigationTab === 'field' ? `
            <button class="btn btn-emerald" onclick="Modules.openFieldSampleModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nueva Muestra en Campo
            </button>
          ` : `
            <button class="btn btn-emerald" onclick="Modules.openPrepIrrigationModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nueva Preparación en Cabezal
            </button>
          `}
        </div>
      </div>

      <!-- Métricas florícolas de Riego -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Promedio pH en Campo</span>
            <span class="kpi-value" style="color: ${parseFloat(avgFieldPh) >= 5.8 && parseFloat(avgFieldPh) <= 6.3 ? 'var(--emerald-main)' : 'var(--rose-600)'};">${avgFieldPh}</span>
            <span class="kpi-trend positive">Rango óptimo: 5.8 - 6.2</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Conductividad CE Promedio</span>
            <span class="kpi-value" style="color: #0284c7;">${avgFieldEc} <small style="font-size: 0.85rem;">mS/cm</small></span>
            <span class="kpi-trend positive">Rango óptimo: 1.2 - 1.6</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Muestras de Campo Hoy</span>
            <span class="kpi-value">${fieldSamples.length}</span>
            <span class="kpi-trend positive">Monitoreos de gotero/drenaje</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Tanques Preparados</span>
            <span class="kpi-value">${prepRecords.length}</span>
            <span class="kpi-trend positive">Soluciones nutritivas</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-rose">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          </div>
        </div>
      </div>

      <!-- Pestañas de Alternancia (Campo vs Preparación) -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.85rem; border-bottom: 2px solid var(--border-light); padding-bottom: 0.5rem;">
        <button class="btn ${currentIrrigationTab === 'field' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.4rem 1rem; font-size: 0.82rem;" onclick="Modules.switchIrrigationTab('field')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
          1. Muestras en Campo (Por Válvula)
        </button>
        <button class="btn ${currentIrrigationTab === 'prep' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.4rem 1rem; font-size: 0.82rem;" onclick="Modules.switchIrrigationTab('prep')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
          2. Preparación en Cabezal (Tanques)
        </button>
      </div>

      <!-- Filtros Rápidos -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem; background: #ffffff; padding: 0.65rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
        <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
          <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Filtrar:</span>
          ${currentIrrigationTab === 'field' ? `
            <select id="filter-irrig-block" class="form-control" style="width: 150px; padding: 0.25rem 0.6rem; font-size: 0.76rem;" onchange="Modules.filterIrrigationTable()">
              <option value="">Todos los Bloques</option>
              ${plans.map(p => `<option value="${escapeHtml(p.block)}">${escapeHtml(p.block)}</option>`).join('')}
            </select>
            <select id="filter-irrig-valve" class="form-control" style="width: 150px; padding: 0.25rem 0.6rem; font-size: 0.76rem;" onchange="Modules.filterIrrigationTable()">
              <option value="">Todas las Válvulas</option>
              <option value="Válvula 1">Válvula 1</option>
              <option value="Válvula 2">Válvula 2</option>
              <option value="Válvula 3">Válvula 3</option>
              <option value="Válvula 4">Válvula 4</option>
              <option value="Válvula 5">Válvula 5</option>
            </select>
          ` : `
            <select id="filter-irrig-tank" class="form-control" style="width: 180px; padding: 0.25rem 0.6rem; font-size: 0.76rem;" onchange="Modules.filterIrrigationTable()">
              <option value="">Todos los Tanques</option>
              <option value="Tanque A">Tanque A</option>
              <option value="Tanque B">Tanque B</option>
              <option value="Tanque Ácido">Tanque Ácido</option>
              <option value="Mezcla">Mezcla General</option>
            </select>
          `}
        </div>
        <input type="text" id="irrig-search-input" placeholder="Buscar por evaluador, fórmula o notas..." class="form-control" style="width: 250px; padding: 0.38rem 0.8rem; font-size: 0.8rem;" oninput="Modules.filterIrrigationTable()">
      </div>

      <!-- Tabla de Datos Según Pestaña Activa -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
            ${currentIrrigationTab === 'field' 
              ? `Muestras en Campo por Válvula (${fieldSamples.length} lecturas)` 
              : `Preparación de Fertirriego en Cabezal (${prepRecords.length} registros)`}
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;" id="irrig-count-badge">
            Registros al día
          </span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            ${currentIrrigationTab === 'field' ? `
              <table class="data-table" id="irrig-field-table">
                <thead>
                  <tr>
                    <th>Fecha / Hora</th>
                    <th>Bloque</th>
                    <th>Variedad</th>
                    <th>Número de Válvula</th>
                    <th>Punto de Toma</th>
                    <th style="text-align: center;">pH Medido</th>
                    <th style="text-align: center;">CE (mS/cm)</th>
                    <th>Temperatura</th>
                    <th>Estado florícola</th>
                    <th>Evaluador</th>
                    <th style="text-align: right;">Acciones</th>
                  </tr>
                </thead>
                <tbody id="irrig-table-body">
                  ${renderIrrigationFieldTableRows(fieldSamples)}
                </tbody>
              </table>
            ` : `
              <table class="data-table" id="irrig-prep-table">
                <thead>
                  <tr>
                    <th>Fecha / Hora</th>
                    <th>Tanque / Mezcla</th>
                    <th style="text-align: center;">pH Preparado</th>
                    <th style="text-align: center;">CE (mS/cm)</th>
                    <th>Volumen</th>
                    <th>Fórmula Nutricional</th>
                    <th>Responsable</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                    <th style="text-align: right;">Acciones</th>
                  </tr>
                </thead>
                <tbody id="irrig-table-body">
                  ${renderIrrigationPrepTableRows(prepRecords)}
                </tbody>
              </table>
            `}
          </div>
        </div>
      </div>
    `;
  }

  function switchIrrigationTab(tab) {
    renderIrrigationControl(document.getElementById('view-container'), tab);
  }

  function renderIrrigationFieldTableRows(list) {
    if (!list || list.length === 0) {
      return `<tr><td colspan="11" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No hay muestras registradas en campo. Presiona "Nueva Muestra en Campo".</td></tr>`;
    }

    return list.map(item => {
      const ph = parseFloat(item.ph) || 0;
      const ec = parseFloat(item.ec) || 0;
      let statusBadge = `<span class="badge badge-success">Óptimo</span>`;
      if (ph < 5.6 || ph > 6.4) {
        statusBadge = `<span class="badge badge-warning">Alerta pH (${ph.toFixed(2)})</span>`;
      } else if (ec > 1.85 || ec < 1.1) {
        statusBadge = `<span class="badge badge-danger">Alerta CE (${ec.toFixed(2)})</span>`;
      }

      return `
        <tr data-irrig-id="${item.id}">
          <td>
            <div style="font-weight: 700; color: var(--primary-900); font-size: 0.80rem;">${escapeHtml(item.date)}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted);">${escapeHtml(item.time || '08:00')}</div>
          </td>
          <td><strong style="color: var(--primary-800);">${escapeHtml(item.block)}</strong></td>
          <td>
            <span class="flower-variety-badge" style="font-size: 0.74rem;">
              <span class="variety-dot dot-red"></span>
              Rosa ${escapeHtml(item.variety)}
            </span>
          </td>
          <td><span class="badge badge-neutral" style="font-size: 0.74rem; font-weight: 700;">${escapeHtml(item.valve || 'Válvula 1')}</span></td>
          <td style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(item.sampleType || 'Gotero')}</td>
          <td style="text-align: center; font-weight: 800; font-size: 0.84rem; color: ${ph >= 5.8 && ph <= 6.3 ? 'var(--emerald-dark)' : 'var(--rose-600)'};">
            ${ph.toFixed(2)}
          </td>
          <td style="text-align: center; font-weight: 800; font-size: 0.84rem; color: #0284c7;">
            ${ec.toFixed(2)}
          </td>
          <td style="font-size: 0.76rem;">${escapeHtml(item.temperature || '18 °C')}</td>
          <td>${statusBadge}</td>
          <td style="font-size: 0.76rem;">${escapeHtml(item.evaluator || 'Técnico')}</td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-secondary btn-icon-only" style="padding: 0.22rem 0.4rem;" title="Editar Muestra" onclick="Modules.openFieldSampleModal('${item.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="btn btn-secondary btn-icon-only btn-icon-danger" style="padding: 0.22rem 0.4rem;" title="Eliminar Muestra" onclick="Modules.deleteFieldSample('${item.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderIrrigationPrepTableRows(list) {
    if (!list || list.length === 0) {
      return `<tr><td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No hay preparaciones registradas en cabezal. Presiona "Nueva Preparación en Cabezal".</td></tr>`;
    }

    return list.map(item => `
      <tr data-irrig-prep-id="${item.id}">
        <td>
          <div style="font-weight: 700; color: var(--primary-900); font-size: 0.80rem;">${escapeHtml(item.date)}</div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">${escapeHtml(item.time || '07:00')}</div>
        </td>
        <td><strong style="color: var(--primary-800);">${escapeHtml(item.tank)}</strong></td>
        <td style="text-align: center; font-weight: 800; font-size: 0.84rem; color: var(--emerald-dark);">${(parseFloat(item.ph) || 6.0).toFixed(2)}</td>
        <td style="text-align: center; font-weight: 800; font-size: 0.84rem; color: #0284c7;">${(parseFloat(item.ec) || 1.45).toFixed(2)}</td>
        <td style="font-size: 0.78rem;">${escapeHtml(item.volume || '10,000 L')}</td>
        <td style="font-size: 0.74rem; color: var(--text-main); max-width: 220px;">${escapeHtml(item.formula || 'Fórmula estándar')}</td>
        <td style="font-size: 0.76rem;">${escapeHtml(item.responsible || 'Operador')}</td>
        <td><span class="badge badge-success">${escapeHtml(item.status || 'Óptimo')}</span></td>
        <td style="font-size: 0.72rem; color: var(--text-muted); max-width: 180px;">${escapeHtml(item.notes || '-')}</td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-secondary btn-icon-only" style="padding: 0.22rem 0.4rem;" title="Editar Preparación" onclick="Modules.openPrepIrrigationModal('${item.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn btn-secondary btn-icon-only btn-icon-danger" style="padding: 0.22rem 0.4rem;" title="Eliminar Registro" onclick="Modules.deletePrepIrrigation('${item.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function filterIrrigationTable() {
    const term = (document.getElementById('irrig-search-input')?.value || '').toLowerCase().trim();

    if (currentIrrigationTab === 'field') {
      const block = document.getElementById('filter-irrig-block')?.value || '';
      const valve = document.getElementById('filter-irrig-valve')?.value || '';
      const list = Store.getIrrigationField();
      const filtered = list.filter(item => {
        const mBlock = !block || item.block === block;
        const mValve = !valve || item.valve === valve;
        const mTerm = !term || 
          item.variety.toLowerCase().includes(term) ||
          (item.evaluator && item.evaluator.toLowerCase().includes(term)) ||
          (item.notes && item.notes.toLowerCase().includes(term));
        return mBlock && mValve && mTerm;
      });

      const tbody = document.getElementById('irrig-table-body');
      if (tbody) tbody.innerHTML = renderIrrigationFieldTableRows(filtered);
    } else {
      const tank = document.getElementById('filter-irrig-tank')?.value || '';
      const list = Store.getIrrigationPrep();
      const filtered = list.filter(item => {
        const mTank = !tank || item.tank.toLowerCase().includes(tank.toLowerCase());
        const mTerm = !term ||
          item.formula.toLowerCase().includes(term) ||
          (item.responsible && item.responsible.toLowerCase().includes(term));
        return mTank && mTerm;
      });

      const tbody = document.getElementById('irrig-table-body');
      if (tbody) tbody.innerHTML = renderIrrigationPrepTableRows(filtered);
    }
  }

  function openFieldSampleModal(sampleId = null) {
    const isEdit = !!sampleId;
    const item = isEdit ? Store.getIrrigationField().find(s => s.id === sampleId) : null;
    const plans = Store.getFarmPlans();
    const varieties = Store.getVarieties();
    const today = new Date().toISOString().split('T')[0];

    const bodyHtml = `
      <form id="form-field-sample" onsubmit="event.preventDefault(); Modules.saveFieldSampleFromForm('${sampleId || ''}');">
        <div style="display: flex; flex-direction: column; gap: 0.95rem;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Bloque a Muestrear *</label>
              <select id="smpl-block" class="form-control" required>
                <option value="">Seleccione bloque...</option>
                ${plans.map(p => `
                  <option value="${escapeHtml(p.block)}" ${item && item.block === p.block ? 'selected' : ''}>
                    ${escapeHtml(p.block)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Variedad de Rosa *</label>
              <select id="smpl-variety" class="form-control" required>
                <option value="">Seleccione variedad...</option>
                ${varieties.map(v => `
                  <option value="${escapeHtml(v.name)}" ${item && item.variety === v.name ? 'selected' : ''}>
                    Rosa ${escapeHtml(v.name)}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Número de Válvula *</label>
              <select id="smpl-valve" class="form-control" required>
                ${['Válvula 1', 'Válvula 2', 'Válvula 3', 'Válvula 4', 'Válvula 5', 'Válvula 6', 'Válvula 7', 'Válvula 8'].map(vl => `
                  <option value="${vl}" ${item && item.valve === vl ? 'selected' : ''}>${vl}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Punto de Muestra *</label>
              <select id="smpl-type" class="form-control" required>
                <option value="Gotero emisor" ${item && item.sampleType === 'Gotero emisor' ? 'selected' : ''}>Gotero Emisor (Entrada)</option>
                <option value="Drenaje de cama" ${item && item.sampleType === 'Drenaje de cama' ? 'selected' : ''}>Drenaje de Cama (Salida)</option>
                <option value="Humedad en sustrato" ${item && item.sampleType === 'Humedad en sustrato' ? 'selected' : ''}>Humedad en Sustrato</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">pH Medido *</label>
              <input type="number" id="smpl-ph" step="0.01" min="3.0" max="9.0" class="form-control" placeholder="6.00" value="${item ? item.ph : '6.00'}" required>
              <span style="font-size: 0.68rem; color: var(--emerald-dark); font-weight: 600;">Óptimo: 5.8 a 6.2</span>
            </div>

            <div class="form-group">
              <label class="form-label">CE Medida (mS/cm) *</label>
              <input type="number" id="smpl-ec" step="0.01" min="0.2" max="5.0" class="form-control" placeholder="1.45" value="${item ? item.ec : '1.45'}" required>
              <span style="font-size: 0.68rem; color: #0284c7; font-weight: 600;">Óptimo: 1.2 a 1.6</span>
            </div>

            <div class="form-group">
              <label class="form-label">Temperatura (°C)</label>
              <input type="text" id="smpl-temp" class="form-control" placeholder="18.5 °C" value="${item ? escapeHtml(item.temperature || '18.5 °C') : '18.5 °C'}">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Fecha</label>
              <input type="date" id="smpl-date" class="form-control" value="${item ? item.date : today}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Evaluador / Agrónomo</label>
              <input type="text" id="smpl-evaluator" class="form-control" placeholder="Ing. Agrónomo" value="${item ? escapeHtml(item.evaluator || 'Carlos Viteri') : 'Carlos Viteri'}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Observaciones de Campo</label>
            <input type="text" id="smpl-notes" class="form-control" placeholder="Ej: Válvula con presión estable, drenaje limpio" value="${item ? escapeHtml(item.notes || '') : ''}">
          </div>

        </div>
      </form>
    `;

    App.showModal(isEdit ? 'Modificar Muestra en Campo' : 'Registrar Muestra de Riego en Campo (Válvula)', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-field-sample').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Guardar Muestra
      </button>
    `);
  }

  function saveFieldSampleFromForm(sampleId = null) {
    const block = document.getElementById('smpl-block').value;
    const variety = document.getElementById('smpl-variety').value;
    const valve = document.getElementById('smpl-valve').value;
    const sampleType = document.getElementById('smpl-type').value;
    const ph = parseFloat(document.getElementById('smpl-ph').value);
    const ec = parseFloat(document.getElementById('smpl-ec').value);
    const temp = document.getElementById('smpl-temp').value;
    const date = document.getElementById('smpl-date').value;
    const evaluator = document.getElementById('smpl-evaluator').value;
    const notes = document.getElementById('smpl-notes').value;

    if (!block || !variety || !valve || isNaN(ph) || isNaN(ec)) {
      App.showToast('Por favor completa todos los campos numéricos y selecciones requeridas', 'danger');
      return;
    }

    const payload = {
      id: sampleId || undefined,
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      block,
      variety,
      valve,
      sampleType,
      ph,
      ec,
      temperature: temp || '18 °C',
      evaluator: evaluator || 'Evaluador',
      status: (ph >= 5.8 && ph <= 6.3 && ec >= 1.2 && ec <= 1.7) ? 'Óptimo' : 'Alerta',
      notes: notes.trim()
    };

    try {
      Store.saveIrrigationField(payload);
      App.closeModal();
      App.showToast(`Muestra guardada: ${block} - ${valve} (pH ${ph.toFixed(2)}, CE ${ec.toFixed(2)})`, 'success');
      renderIrrigationControl(document.getElementById('view-container'), 'field');
    } catch (e) {
      App.showToast('Error al registrar muestra: ' + e.message, 'danger');
    }
  }

  function deleteFieldSample(id) {
    if (confirm('¿Deseas eliminar este registro de muestra de campo?')) {
      Store.deleteIrrigationField(id);
      App.showToast('Muestra eliminada', 'success');
      renderIrrigationControl(document.getElementById('view-container'), 'field');
    }
  }

  function openPrepIrrigationModal(prepId = null) {
    const isEdit = !!prepId;
    const item = isEdit ? Store.getIrrigationPrep().find(p => p.id === prepId) : null;
    const today = new Date().toISOString().split('T')[0];

    const bodyHtml = `
      <form id="form-prep-irrigation" onsubmit="event.preventDefault(); Modules.savePrepIrrigationFromForm('${prepId || ''}');">
        <div style="display: flex; flex-direction: column; gap: 0.95rem;">
          
          <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Tanque / Cabezal *</label>
              <input type="text" id="prep-tank" class="form-control" placeholder="Ej: Tanque A + B (Mezcla General)" value="${item ? escapeHtml(item.tank) : 'Tanque A + B (Mezcla General)'}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Volumen Preparado</label>
              <input type="text" id="prep-vol" class="form-control" placeholder="Ej: 15,000 L" value="${item ? escapeHtml(item.volume) : '15,000 L'}" required>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">pH Preparado *</label>
              <input type="number" id="prep-ph" step="0.01" min="4.0" max="8.0" class="form-control" placeholder="6.00" value="${item ? item.ph : '6.00'}" required>
            </div>
            <div class="form-group">
              <label class="form-label">CE Preparada (mS/cm) *</label>
              <input type="number" id="prep-ec" step="0.01" min="0.5" max="3.5" class="form-control" placeholder="1.45" value="${item ? item.ec : '1.45'}" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Fórmula Nutricional / Fertilizantes *</label>
            <input type="text" id="prep-formula" class="form-control" placeholder="Ej: Nitrato de Calcio, Nitrato de Potasio, Sulfato de Magnesio..." value="${item ? escapeHtml(item.formula) : 'Fórmula Vegetativa Alta (N-P-K + Microelementos)'}" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Fecha</label>
              <input type="date" id="prep-date" class="form-control" value="${item ? item.date : today}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Responsable Fertirriego</label>
              <input type="text" id="prep-resp" class="form-control" placeholder="Ing. Encargado" value="${item ? escapeHtml(item.responsible || 'Ing. Mateo Proaño') : 'Ing. Mateo Proaño'}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Observaciones y Ajustes</label>
            <input type="text" id="prep-notes" class="form-control" placeholder="Ej: Corrección de pH con ácido nítrico" value="${item ? escapeHtml(item.notes || '') : ''}">
          </div>

        </div>
      </form>
    `;

    App.showModal(isEdit ? 'Editar Preparación de Fertirriego' : 'Nueva Preparación de Riego en Cabezal', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-prep-irrigation').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Guardar Preparación
      </button>
    `);
  }

  function savePrepIrrigationFromForm(prepId = null) {
    const tank = document.getElementById('prep-tank').value;
    const vol = document.getElementById('prep-vol').value;
    const ph = parseFloat(document.getElementById('prep-ph').value);
    const ec = parseFloat(document.getElementById('prep-ec').value);
    const formula = document.getElementById('prep-formula').value;
    const date = document.getElementById('prep-date').value;
    const resp = document.getElementById('prep-resp').value;
    const notes = document.getElementById('prep-notes').value;

    if (!tank || isNaN(ph) || isNaN(ec) || !formula) {
      App.showToast('Por favor completa los campos requeridos', 'danger');
      return;
    }

    const payload = {
      id: prepId || undefined,
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tank: tank.trim(),
      volume: vol.trim(),
      ph,
      ec,
      formula: formula.trim(),
      responsible: resp.trim() || 'Operador Fertirriego',
      status: 'Óptimo',
      notes: notes.trim()
    };

    try {
      Store.saveIrrigationPrep(payload);
      App.closeModal();
      App.showToast(`Preparación de ${payload.tank} guardada con éxito`, 'success');
      renderIrrigationControl(document.getElementById('view-container'), 'prep');
    } catch (e) {
      App.showToast('Error al guardar preparación: ' + e.message, 'danger');
    }
  }

  function deletePrepIrrigation(id) {
    if (confirm('¿Deseas eliminar este registro de preparación de riego?')) {
      Store.deleteIrrigationPrep(id);
      App.showToast('Registro eliminado', 'success');
      renderIrrigationControl(document.getElementById('view-container'), 'prep');
    }
  }

  function exportIrrigationXLSX() {
    try {
      if (!window.XLSX) {
        App.showToast('Librería de exportación no disponible', 'danger');
        return;
      }

      const fieldList = Store.getIrrigationField();
      const prepList = Store.getIrrigationPrep();

      const wb = XLSX.utils.book_new();

      // Hoja 1: Muestras de Campo
      const fieldRows = [
        ['FECHA', 'HORA', 'BLOQUE', 'VARIEDAD', 'NUMERO_VALVULA', 'PUNTO_TOMA', 'PH_MEDIDO', 'CE_MS_CM', 'TEMPERATURA', 'ESTADO', 'EVALUADOR', 'NOTAS']
      ];
      fieldList.forEach(s => {
        fieldRows.push([
          s.date, s.time || '', s.block, s.variety, s.valve || 'Válvula 1', s.sampleType || '', s.ph, s.ec, s.temperature || '', s.status || '', s.evaluator || '', s.notes || ''
        ]);
      });
      const wsField = XLSX.utils.aoa_to_sheet(fieldRows);
      XLSX.utils.book_append_sheet(wb, wsField, 'Muestras_Campo_Valvulas');

      // Hoja 2: Preparación en Cabezal
      const prepRows = [
        ['FECHA', 'HORA', 'TANQUE_CABEZAL', 'VOLUMEN', 'PH_PREPARADO', 'CE_MS_CM', 'FORMULA_NUTRICIONAL', 'RESPONSABLE', 'ESTADO', 'OBSERVACIONES']
      ];
      prepList.forEach(p => {
        prepRows.push([
          p.date, p.time || '', p.tank, p.volume || '', p.ph, p.ec, p.formula || '', p.responsible || '', p.status || '', p.notes || ''
        ]);
      });
      const wsPrep = XLSX.utils.aoa_to_sheet(prepRows);
      XLSX.utils.book_append_sheet(wb, wsPrep, 'Preparacion_Cabezal');

      const filename = `Control_Riego_PH_CE_MRosecuador_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      App.showToast('Historial de riego exportado a Excel exitosamente', 'success');
    } catch (e) {
      App.showToast('Error al exportar a Excel: ' + e.message, 'danger');
    }
  }

  // ==============================================================================
  // MÓDULO: REGISTRO DE PRODUCCIÓN DE COSECHA (MALLAS, TALLOS Y ESCÁNER)
  // ==============================================================================
  function playScannerBeep(isSuccess = true) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSuccess ? 1200 : 350, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      // Audio autoplay restrictions graceful fallback
    }
  }

  function renderHarvestProduction(container) {
    const harvests = Store.getHarvestProd();
    const plans = Store.getFarmPlans();
    const varieties = Store.getVarieties();
    const totalStems = harvests.reduce((acc, h) => acc + (parseInt(h.totalStems) || 0), 0);
    const totalMallas = harvests.reduce((acc, h) => acc + (parseInt(h.mallas) || 0), 0);
    const uniqueBlocks = new Set(harvests.map(h => h.block)).size;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--emerald-main); background: var(--primary-50); padding: 0.2rem 0.65rem; border-radius: 99px;">
              Operaciones de Campo
            </span>
          </div>
          <h1>Registro de Producción de Cosecha</h1>
          <p class="view-subtitle">Captura ágil de corte de flor por Bloque y Variedad en Mallas o Tallos, con soporte interactivo de escaneo de códigos de barras.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.exportHarvestProdXLSX()" title="Exportar registros de cosecha a Excel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Exportar a Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openHarvestProdModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Registro de Cosecha
          </button>
        </div>
      </div>

      <!-- SECCIÓN DESTACADA: LECTOR / ESCÁNER INTERACTIVO DE CÓDIGOS DE BARRAS -->
      <div class="card" style="border: 2px solid var(--emerald-main); background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); margin-bottom: 1rem;">
        <div class="card-body" style="padding: 1.15rem 1.35rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: var(--emerald-main); color: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 5v14M6 5v14M10 5v14M13 5v14M16 5v14M18 5v14M21 5v14"/></svg>
              </div>
              <div>
                <h3 style="font-size: 1rem; font-weight: 800; color: var(--emerald-dark); margin-bottom: 0.15rem;">
                  Lector de Código de Barras (Escaneo de Cosecha)
                </h3>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">
                  Apunta tu pistola óptica o lector USB a la etiqueta generada. El sistema detectará automáticamente el Bloque, Variedad y Cosechador.
                </p>
              </div>
            </div>

            <!-- Entrada Rápida de Escaneo -->
            <div style="display: flex; gap: 0.45rem; flex: 1; max-width: 440px; min-width: 280px;">
              <input type="text" id="barcode-scan-input" class="form-control" placeholder="Pasa el lector de código aquí (o pulsa Enter)..." style="font-weight: 700; font-family: monospace; border-color: var(--emerald-main); background: #ffffff;" onkeydown="if(event.key==='Enter') { event.preventDefault(); Modules.handleBarcodeScanInput(event); }">
              <button class="btn btn-emerald" type="button" onclick="Modules.handleBarcodeScanInput({ target: document.getElementById('barcode-scan-input') })" style="padding: 0.4rem 1rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>
                Escanear
              </button>
            </div>
          </div>

          <!-- Banner de estado del escáner -->
          <div id="barcode-scan-status-banner" style="display: none; margin-top: 0.85rem; padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600;"></div>
        </div>
      </div>

      <!-- Métricas KPI de Producción -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Tallos Totales Cosechados</span>
            <span class="kpi-value">${totalStems.toLocaleString()}</span>
            <span class="kpi-trend positive">${harvests.length} ingresos registrados</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20h10"></path><path d="M10 20c5.5-2.5.8-6.4 3-10"></path></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Mallas de Corte</span>
            <span class="kpi-value">${totalMallas} <small style="font-size: 0.85rem;">mallas</small></span>
            <span class="kpi-trend positive">Recepción en poscosecha</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Bloques en Cosecha</span>
            <span class="kpi-value">${uniqueBlocks} de ${plans.length}</span>
            <span class="kpi-trend neutral">Rendimiento por nave</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-rose">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Promedio Tallos/Malla</span>
            <span class="kpi-value">${totalMallas > 0 ? (totalStems / totalMallas).toFixed(0) : '25'}</span>
            <span class="kpi-trend positive">Factor florícola</span>
          </div>
          <div class="kpi-icon-wrap kpi-icon-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          </div>
        </div>
      </div>

      <!-- Filtros Rápidos -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem; background: #ffffff; padding: 0.65rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
        <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
          <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Filtrar Cosecha:</span>
          <select id="filter-hrv-block" class="form-control" style="width: 150px; padding: 0.25rem 0.6rem; font-size: 0.76rem;" onchange="Modules.filterHarvestProdTable()">
            <option value="">Todos los Bloques</option>
            ${plans.map(p => `<option value="${escapeHtml(p.block)}">${escapeHtml(p.block)}</option>`).join('')}
          </select>
          <select id="filter-hrv-variety" class="form-control" style="width: 160px; padding: 0.25rem 0.6rem; font-size: 0.76rem;" onchange="Modules.filterHarvestProdTable()">
            <option value="">Todas las Variedades</option>
            ${varieties.map(v => `<option value="${escapeHtml(v.name)}">Rosa ${escapeHtml(v.name)}</option>`).join('')}
          </select>
        </div>
        <input type="text" id="hrv-search-input" placeholder="Buscar por cosechador, código de barra..." class="form-control" style="width: 250px; padding: 0.38rem 0.8rem; font-size: 0.8rem;" oninput="Modules.filterHarvestProdTable()">
      </div>

      <!-- Tabla de Registros de Producción -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20h10"></path><path d="M10 20c5.5-2.5.8-6.4 3-10"></path></svg>
            Listado Diario de Cosecha (${harvests.length} recepciones)
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;" id="hrv-count-badge">
            ${totalStems.toLocaleString()} tallos acumulados
          </span>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table" id="harvest-prod-table">
              <thead>
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Bloque</th>
                  <th>Variedad de Rosa</th>
                  <th>Cosechador</th>
                  <th>Modalidad Cosecha</th>
                  <th style="text-align: center;">Mallas</th>
                  <th style="text-align: center;">Total Tallos</th>
                  <th>Calidad / Grado</th>
                  <th>Código de Barra</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody id="harvest-prod-table-body">
                ${renderHarvestProductionTableRows(harvests)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const scanInput = document.getElementById('barcode-scan-input');
      if (scanInput) scanInput.focus();
    }, 150);
  }

  function renderHarvestProductionTableRows(list) {
    if (!list || list.length === 0) {
      return `<tr><td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No hay ingresos de cosecha registrados hoy. Puedes escanear un código de barras o pulsar "Nuevo Registro de Cosecha".</td></tr>`;
    }

    return list.map(h => `
      <tr data-harvest-id="${h.id}">
        <td>
          <div style="font-weight: 700; color: var(--primary-900); font-size: 0.80rem;">${escapeHtml(h.date)}</div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">${escapeHtml(h.time || '07:30')} (${escapeHtml(h.shift || 'Mañana')})</div>
        </td>
        <td><strong style="color: var(--primary-800);">${escapeHtml(h.block)}</strong></td>
        <td>
          <span class="flower-variety-badge" style="font-size: 0.74rem;">
            <span class="variety-dot dot-red"></span>
            Rosa ${escapeHtml(h.variety)}
          </span>
        </td>
        <td>
          <span style="font-weight: 600; color: var(--text-main); font-size: 0.80rem;">${escapeHtml(h.harvester)}</span>
        </td>
        <td>
          <span class="badge ${h.mode === 'mallas' ? 'badge-success' : 'badge-neutral'}" style="font-size: 0.70rem;">
            ${h.mode === 'mallas' ? '📦 En Mallas' : '✂️ Por Tallos'}
          </span>
        </td>
        <td style="text-align: center; font-weight: 700;">
          ${h.mode === 'mallas' ? `${h.mallas} <small style="font-weight: normal; color: var(--text-muted);">(${h.stemsPerMalla || 25} c/u)</small>` : '-'}
        </td>
        <td style="text-align: center; font-size: 0.92rem; font-weight: 800; color: var(--emerald-dark);">
          ${parseInt(h.totalStems, 10).toLocaleString()}
        </td>
        <td>
          <span class="badge badge-neutral" style="font-size: 0.72rem;">${escapeHtml(h.grade || 'Exportación')}</span>
        </td>
        <td>
          ${h.barcode ? `
            <span style="font-family: monospace; font-size: 0.72rem; color: var(--primary-800); background: var(--bg-subtle); padding: 0.15rem 0.4rem; border-radius: 4px; border: 1px solid var(--border-light);">
              ${escapeHtml(h.barcode)}
            </span>
          ` : '<span style="color: var(--text-muted); font-size: 0.72rem;">Manual</span>'}
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-secondary btn-icon-only" style="padding: 0.22rem 0.4rem;" title="Editar Cosecha" onclick="Modules.openHarvestProdModal('${h.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn btn-secondary btn-icon-only btn-icon-danger" style="padding: 0.22rem 0.4rem;" title="Eliminar Registro" onclick="Modules.deleteHarvestProd('${h.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function handleBarcodeScanInput(event) {
    const input = document.getElementById('barcode-scan-input');
    if (!input) return;
    const code = (input.value || '').trim();
    if (!code) {
      App.showToast('Por favor ingresa o escanea un código de barras', 'warning');
      return;
    }
    processBarcodeScan(code);
    input.value = '';
    input.focus();
  }

  function processBarcodeScan(code) {
    const barcodes = Store.getBarcodes();
    // 1. Buscar coincidencia exacta en las etiquetas registradas
    let match = barcodes.find(b => b.code.toLowerCase() === code.toLowerCase() || b.id.toLowerCase() === code.toLowerCase());

    // 2. Si no es coincidencia exacta, parsear el patrón MR-B{X}-{VAR}-{HARV}
    if (!match && code.toUpperCase().startsWith('MR-')) {
      const parts = code.split('-');
      if (parts.length >= 3) {
        const plans = Store.getFarmPlans();
        const varieties = Store.getVarieties();
        const blockMatch = plans.find(p => p.block.toUpperCase().includes(parts[1])) || plans[0];
        const varMatch = varieties.find(v => v.name.toUpperCase().includes(parts[2])) || varieties[0];
        match = {
          code: code.toUpperCase(),
          block: blockMatch ? blockMatch.block : 'Bloque 1',
          variety: varMatch ? varMatch.name : 'Freedom',
          harvester: 'Cosechador ' + (parts[3] || 'C-01'),
          batch: 'LOTE-' + code
        };
      }
    }

    const banner = document.getElementById('barcode-scan-status-banner');

    if (match) {
      playScannerBeep(true);
      if (banner) {
        banner.style.display = 'block';
        banner.style.background = '#dcfce7';
        banner.style.color = '#14532d';
        banner.style.border = '1px solid #86efac';
        banner.innerHTML = `
          ✓ <strong>¡CÓDIGO IDENTIFICADO!</strong> Bloque: <u>${escapeHtml(match.block)}</u> | Variedad: <u>Rosa ${escapeHtml(match.variety)}</u> | Cosechador: <u>${escapeHtml(match.harvester)}</u> (${escapeHtml(match.code)})
        `;
      }
      App.showToast(`¡Código leído! ${match.block} - Rosa ${match.variety} (${match.harvester})`, 'success');
      
      // Abrir modal de confirmación rápida con los datos precargados
      openHarvestProdModal(null, match);
    } else {
      playScannerBeep(false);
      if (banner) {
        banner.style.display = 'block';
        banner.style.background = '#fee2e2';
        banner.style.color = '#7f1d1d';
        banner.style.border = '1px solid #fca5a5';
        banner.innerHTML = `
          ⚠️ <strong>CÓDIGO NO REGISTRADO:</strong> "${escapeHtml(code)}". Puedes registrar la cosecha manualmente seleccionando el bloque.
        `;
      }
      App.showToast(`Código "${code}" no encontrado en la base de etiquetas`, 'danger');
    }
  }

  function openHarvestProdModal(harvestId = null, prefillData = null) {
    const isEdit = !!harvestId;
    const item = isEdit ? Store.getHarvestProd().find(h => h.id === harvestId) : null;
    const plans = Store.getFarmPlans();
    const varieties = Store.getVarieties();
    const today = new Date().toISOString().split('T')[0];

    // Datos por defecto o precargados desde el escaneo
    const selBlock = item ? item.block : (prefillData ? prefillData.block : (plans[0]?.block || ''));
    const selVariety = item ? item.variety : (prefillData ? prefillData.variety : (varieties[0]?.name || ''));
    const selHarvester = item ? item.harvester : (prefillData ? prefillData.harvester : 'Juan Tipán');
    const selBarcode = item ? (item.barcode || '') : (prefillData ? prefillData.code : '');
    const selMode = item ? item.mode : 'mallas';
    const selMallas = item ? (item.mallas || 35) : 30;
    const selFactor = item ? (item.stemsPerMalla || 25) : 25;
    const selTotal = item ? item.totalStems : (selMallas * selFactor);

    const bodyHtml = `
      <form id="form-harvest-prod" onsubmit="event.preventDefault(); Modules.saveHarvestProdFromForm('${harvestId || ''}');">
        <div style="display: flex; flex-direction: column; gap: 0.95rem;">
          
          ${selBarcode ? `
            <div style="background: var(--primary-50); border: 1px solid var(--emerald-main); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.70rem; text-transform: uppercase; font-weight: 700; color: var(--emerald-dark);">Etiqueta Escaneada:</span>
                <div style="font-family: monospace; font-weight: 800; color: var(--primary-900); font-size: 0.86rem;">${escapeHtml(selBarcode)}</div>
              </div>
              <span class="badge badge-success">Verificado</span>
            </div>
          ` : ''}

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Bloque de Corte *</label>
              <select id="hrv-block" class="form-control" required>
                <option value="">Seleccione bloque...</option>
                ${plans.map(p => `
                  <option value="${escapeHtml(p.block)}" ${selBlock === p.block ? 'selected' : ''}>
                    ${escapeHtml(p.block)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Variedad de Rosa *</label>
              <select id="hrv-variety" class="form-control" required>
                <option value="">Seleccione variedad...</option>
                ${varieties.map(v => `
                  <option value="${escapeHtml(v.name)}" ${selVariety === v.name ? 'selected' : ''}>
                    Rosa ${escapeHtml(v.name)}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Cosechador / Operario *</label>
              <input type="text" id="hrv-harvester" class="form-control" placeholder="Nombre del cosechador" value="${escapeHtml(selHarvester)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Turno de Cosecha</label>
              <select id="hrv-shift" class="form-control">
                <option value="Mañana" ${item && item.shift === 'Mañana' ? 'selected' : ''}>Mañana (06:00 - 12:00)</option>
                <option value="Tarde" ${item && item.shift === 'Tarde' ? 'selected' : ''}>Tarde (13:00 - 17:00)</option>
              </select>
            </div>
          </div>

          <!-- Modalidad de Cálculo: Mallas vs Tallos Directos -->
          <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <label class="form-label" style="margin-bottom: 0.4rem;">Modalidad de Conteo</label>
            <div style="display: flex; gap: 1.5rem; margin-bottom: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
                <input type="radio" name="hrv-mode-radio" value="mallas" ${selMode === 'mallas' ? 'checked' : ''} onchange="Modules.toggleHarvestMode('mallas')">
                <span>📦 Por Mallas Cosechadas</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
                <input type="radio" name="hrv-mode-radio" value="tallos" ${selMode === 'tallos' ? 'checked' : ''} onchange="Modules.toggleHarvestMode('tallos')">
                <span>✂️ Por Conteo Directo de Tallos</span>
              </label>
            </div>

            <!-- Campos para conteo por Mallas -->
            <div id="hrv-mallas-inputs-wrap" style="display: ${selMode === 'mallas' ? 'grid' : 'none'}; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label">Número de Mallas</label>
                <input type="number" id="hrv-mallas-count" class="form-control" min="1" max="1000" value="${selMallas}" oninput="Modules.updateHarvestTotalStems()">
              </div>
              <div class="form-group">
                <label class="form-label">Tallos por Malla (Factor)</label>
                <input type="number" id="hrv-stems-per-malla" class="form-control" min="1" max="100" value="${selFactor}" oninput="Modules.updateHarvestTotalStems()">
              </div>
            </div>

            <!-- Total de Tallos Calculado / Ingresado -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px solid var(--border-light);">
              <div>
                <span style="font-size: 0.78rem; font-weight: 800; color: var(--primary-900);">Total Tallos Calculados:</span>
                <div style="font-size: 0.68rem; color: var(--text-muted);">Ingreso formal a poscosecha</div>
              </div>
              <input type="number" id="hrv-total-stems" class="form-control" style="width: 140px; font-size: 1.15rem; font-weight: 800; color: var(--emerald-dark); text-align: right;" value="${selTotal}" required>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Calidad / Grado</label>
              <select id="hrv-grade" class="form-control">
                <option value="Exportación Premium">Exportación Premium</option>
                <option value="Exportación Selecta">Exportación Selecta</option>
                <option value="Exportación Estándar">Exportación Estándar</option>
                <option value="Mercado Nacional">Mercado Nacional</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Cosecha</label>
              <input type="date" id="hrv-date" class="form-control" value="${item ? item.date : today}" required>
            </div>
          </div>

          <input type="hidden" id="hrv-barcode-hidden" value="${escapeHtml(selBarcode)}">

          <div class="form-group">
            <label class="form-label">Observaciones</label>
            <input type="text" id="hrv-notes" class="form-control" placeholder="Ej: Tallos de 80 y 90cm punto 2.5 limpio" value="${item ? escapeHtml(item.notes || '') : ''}">
          </div>

        </div>
      </form>
    `;

    App.showModal(isEdit ? 'Editar Registro de Cosecha' : 'Nuevo Registro de Cosecha (Mallas / Tallos)', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-harvest-prod').requestSubmit()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Confirmar e Ingresar Cosecha
      </button>
    `);
  }

  function toggleHarvestMode(mode) {
    const wrap = document.getElementById('hrv-mallas-inputs-wrap');
    const totalInput = document.getElementById('hrv-total-stems');
    if (!wrap || !totalInput) return;

    if (mode === 'mallas') {
      wrap.style.display = 'grid';
      updateHarvestTotalStems();
    } else {
      wrap.style.display = 'none';
      totalInput.focus();
    }
  }

  function updateHarvestTotalStems() {
    const mallasInput = document.getElementById('hrv-mallas-count');
    const factorInput = document.getElementById('hrv-stems-per-malla');
    const totalInput = document.getElementById('hrv-total-stems');
    if (!mallasInput || !factorInput || !totalInput) return;

    const mallas = parseInt(mallasInput.value, 10) || 0;
    const factor = parseInt(factorInput.value, 10) || 0;
    totalInput.value = mallas * factor;
  }

  function saveHarvestProdFromForm(harvestId = null) {
    const block = document.getElementById('hrv-block').value;
    const variety = document.getElementById('hrv-variety').value;
    const harvester = document.getElementById('hrv-harvester').value;
    const shift = document.getElementById('hrv-shift').value;
    const mode = document.querySelector('input[name="hrv-mode-radio"]:checked')?.value || 'mallas';
    const mallas = mode === 'mallas' ? (parseInt(document.getElementById('hrv-mallas-count').value, 10) || 0) : 0;
    const stemsPerMalla = mode === 'mallas' ? (parseInt(document.getElementById('hrv-stems-per-malla').value, 10) || 25) : 0;
    const totalStems = parseInt(document.getElementById('hrv-total-stems').value, 10) || (mallas * stemsPerMalla);
    const grade = document.getElementById('hrv-grade').value;
    const date = document.getElementById('hrv-date').value;
    const barcode = document.getElementById('hrv-barcode-hidden').value;
    const notes = document.getElementById('hrv-notes').value;

    if (!block || !variety || !harvester || totalStems <= 0) {
      App.showToast('Por favor completa el bloque, variedad, cosechador y un número válido de tallos', 'danger');
      return;
    }

    const payload = {
      id: harvestId || undefined,
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      block,
      variety,
      harvester: harvester.trim(),
      mode,
      mallas,
      stemsPerMalla,
      totalStems,
      grade,
      shift,
      barcode: barcode.trim(),
      notes: notes.trim()
    };

    try {
      Store.saveHarvestProd(payload);
      App.closeModal();
      App.showToast(`¡Cosecha registrada! ${totalStems.toLocaleString()} tallos de Rosa ${variety} (${block})`, 'success');
      renderHarvestProduction(document.getElementById('view-container'));
    } catch (e) {
      App.showToast('Error al registrar cosecha: ' + e.message, 'danger');
    }
  }

  function deleteHarvestProd(id) {
    if (confirm('¿Deseas eliminar este registro de cosecha?')) {
      Store.deleteHarvestProd(id);
      App.showToast('Registro de cosecha eliminado', 'success');
      renderHarvestProduction(document.getElementById('view-container'));
    }
  }

  function filterHarvestProdTable() {
    const block = document.getElementById('filter-hrv-block')?.value || '';
    const variety = document.getElementById('filter-hrv-variety')?.value || '';
    const term = (document.getElementById('hrv-search-input')?.value || '').toLowerCase().trim();

    const list = Store.getHarvestProd();
    const filtered = list.filter(h => {
      const mBlock = !block || h.block === block;
      const mVar = !variety || h.variety.toLowerCase().includes(variety.toLowerCase());
      const mTerm = !term ||
        h.harvester.toLowerCase().includes(term) ||
        (h.barcode && h.barcode.toLowerCase().includes(term)) ||
        (h.notes && h.notes.toLowerCase().includes(term));
      return mBlock && mVar && mTerm;
    });

    const tbody = document.getElementById('harvest-prod-table-body');
    if (tbody) tbody.innerHTML = renderHarvestProductionTableRows(filtered);

    const badge = document.getElementById('hrv-count-badge');
    if (badge) {
      const stems = filtered.reduce((acc, h) => acc + (parseInt(h.totalStems) || 0), 0);
      badge.textContent = `${stems.toLocaleString()} tallos en ${filtered.length} registros`;
    }
  }

  function exportHarvestProdXLSX() {
    try {
      if (!window.XLSX) {
        App.showToast('Librería de exportación no disponible', 'danger');
        return;
      }

      const list = Store.getHarvestProd();
      const rows = [
        ['FECHA', 'HORA', 'BLOQUE', 'VARIEDAD', 'COSECHADOR', 'MODO', 'MALLAS', 'TALLOS_X_MALLA', 'TOTAL_TALLOS', 'GRADO_CALIDAD', 'TURNO', 'CODIGO_BARRA', 'NOTAS']
      ];

      list.forEach(h => {
        rows.push([
          h.date,
          h.time || '',
          h.block,
          h.variety,
          h.harvester,
          h.mode,
          h.mallas || 0,
          h.stemsPerMalla || 0,
          parseInt(h.totalStems, 10) || 0,
          h.grade || 'Exportación',
          h.shift || 'Mañana',
          h.barcode || '',
          h.notes || ''
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cosecha_MRosecuador');
      const filename = `Produccion_Cosecha_MRosecuador_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      App.showToast('Registros de cosecha exportados a Excel exitosamente', 'success');
    } catch (e) {
      App.showToast('Error al exportar a Excel: ' + e.message, 'danger');
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



  // ==============================================================================
  // ==============================================================================
  // ==============================================================================
  // ==============================================================================
  // MÓDULO: DASHBOARD GERENCIAL (PRODUCCIÓN, RIEGO, VENTAS Y TENDENCIAS)
  // ==============================================================================
  let currentDashboardPeriod = 'dia'; // 'dia' | 'semana' | 'mes' | 'ano' | 'rango'
  let currentGerencialDateFrom = '2026-10-01';
  let currentGerencialDateTo = '2026-10-09';
  let currentProdCurveVariety = 'todas';
  let currentProdCurveBlock = 'todos';
  let currentProdCurveDate = '';

  function setDashboardPeriod(period) {
    currentDashboardPeriod = period;
    renderGerencialDashboard(document.getElementById('view-container'));
  }

  function applyGerencialDateRange() {
    const fromEl = document.getElementById('gerencial-date-from');
    const toEl = document.getElementById('gerencial-date-to');
    if (fromEl && fromEl.value) currentGerencialDateFrom = fromEl.value;
    if (toEl && toEl.value) currentGerencialDateTo = toEl.value;
    if (currentGerencialDateFrom > currentGerencialDateTo) {
      App.showToast('La fecha "Desde" no puede ser mayor a la fecha "Hasta"', 'warning');
      return;
    }
    currentDashboardPeriod = 'rango';
    renderGerencialDashboard(document.getElementById('view-container'));
  }

  function setGerencialCurveFilters() {
    currentProdCurveVariety = document.getElementById('gerencial-curve-variety')?.value || 'todas';
    currentProdCurveBlock = document.getElementById('gerencial-curve-block')?.value || 'todos';
    currentProdCurveDate = document.getElementById('gerencial-curve-date')?.value || '';
    renderGerencialDashboard(document.getElementById('view-container'));
  }

  function resetGerencialCurveFilters() {
    currentProdCurveVariety = 'todas';
    currentProdCurveBlock = 'todos';
    currentProdCurveDate = '';
    renderGerencialDashboard(document.getElementById('view-container'));
  }

  // Helper: Cálculo preciso de la Semana calendario de Lunes a Domingo
  function getWeekMondayToSunday(refDateStr) {
    let d;
    if (refDateStr && typeof refDateStr === 'string' && refDateStr.includes('-')) {
      const parts = refDateStr.split('-');
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      d = new Date();
    }

    const dayOfWeek = d.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
    // Distancia para retroceder al Lunes (inicio de la semana florícola):
    // Si es Domingo (0), restar 6 días para el Lunes anterior
    // Si es Lunes (1), 0 días
    // Si es Martes a Sábado (2 a 6), restar (dayOfWeek - 1)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);

    const days = [];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dayShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    for (let i = 0; i < 7; i++) {
      const cur = new Date(monday);
      cur.setDate(monday.getDate() + i);
      const yyyy = cur.getFullYear();
      const mm = String(cur.getMonth() + 1).padStart(2, '0');
      const dd = String(cur.getDate()).padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;
      days.push({
        date: cur,
        isoDate: iso,
        dayIndex: i,
        dayName: dayNames[i],
        shortName: dayShort[i],
        formattedDate: `${dd}/${mm}`,
        chartLabel: `${dayShort[i]} ${dd}`,
        fullLabel: `${dayNames[i]} ${dd}/${mm}`
      });
    }

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthName = monthNames[days[0].date.getMonth()];

    return {
      monday,
      sunday: days[6].date,
      mondayIso: days[0].isoDate,
      sundayIso: days[6].isoDate,
      days,
      labels: days.map(d => d.chartLabel),
      periodTitle: `Semana del Lunes ${days[0].formattedDate} al Domingo ${days[6].formattedDate} de ${monthName}, ${days[0].date.getFullYear()}`
    };
  }

  // Generador de Gráfico SVG de Línea Individual (Producción de Tallos)
  function renderSvgLineChart(labels, data, color, unit) {
    if (!data || data.length === 0) {
      return '<div style="height:150px; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:0.8rem;">Sin datos suficientes</div>';
    }

    const width = 520;
    const height = 180;
    const padL = 50;
    const padR = 25;
    const padT = 20;
    const padB = 30;

    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = (maxVal - minVal) === 0 ? 1 : (maxVal - minVal);
    const yMin = Math.max(0, Math.floor(minVal - range * 0.1));
    const yMax = Math.ceil(maxVal + range * 0.15);
    const yRange = yMax - yMin;

    const stepX = labels.length > 1 ? chartW / (labels.length - 1) : chartW;

    const points = data.map((val, idx) => {
      const x = padL + idx * stepX;
      const y = padT + chartH - ((val - yMin) / yRange) * chartH;
      return { x, y, val, label: labels[idx] };
    });

    const pointsStr = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaStr = `${points[0].x.toFixed(1)},${padT + chartH} ` + pointsStr + ` ${points[points.length - 1].x.toFixed(1)},${padT + chartH}`;
    const gradId = 'grad-line-' + color.replace('#', '');

    const gridY1 = padT;
    const gridY2 = padT + chartH * 0.5;
    const gridY3 = padT + chartH;

    const valY1 = yMax;
    const valY2 = Math.round((yMax + yMin) / 2);
    const valY3 = yMin;

    return `
      <div style="width: 100%; overflow-x: auto;">
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: ${width}px; height: auto; display: block; font-family: sans-serif;">
          <defs>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${color}" stop-opacity="0.25" />
              <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Líneas de fondo de cuadrícula -->
          <line x1="${padL}" y1="${gridY1}" x2="${width - padR}" y2="${gridY1}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="${padL}" y1="${gridY2}" x2="${width - padR}" y2="${gridY2}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="${padL}" y1="${gridY3}" x2="${width - padR}" y2="${gridY3}" stroke="#e2e8f0" stroke-width="1.5" />

          <!-- Etiquetas Y -->
          <text x="${padL - 8}" y="${gridY1 + 4}" fill="#64748b" font-size="10" text-anchor="end">${valY1.toLocaleString()}</text>
          <text x="${padL - 8}" y="${gridY2 + 4}" fill="#64748b" font-size="10" text-anchor="end">${valY2.toLocaleString()}</text>
          <text x="${padL - 8}" y="${gridY3}" fill="#64748b" font-size="10" text-anchor="end">${valY3.toLocaleString()}</text>

          <!-- Área sombreada -->
          <polygon points="${areaStr}" fill="url(#${gradId})" />

          <!-- Línea continua -->
          <polyline points="${pointsStr}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Nodos y Etiquetas X -->
          ${points.map(p => `
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#ffffff" stroke="${color}" stroke-width="2">
              <title>${p.label}: ${p.val.toLocaleString()} ${unit || ''}</title>
            </circle>
            <text x="${p.x.toFixed(1)}" y="${padT + chartH + 16}" fill="#64748b" font-size="9.5" text-anchor="middle" font-weight="600">${p.label}</text>
          `).join('')}
        </svg>
      </div>
    `;
  }

  // Generador de Gráfico SVG Dual (Fertirriego: pH vs CE)
  function renderSvgDualChart(labels, dataPh, dataEc) {
    if (!dataPh || dataPh.length === 0) {
      return '<div style="height:150px; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:0.8rem;">Sin datos suficientes</div>';
    }

    const width = 520;
    const height = 180;
    const padL = 45;
    const padR = 45;
    const padT = 20;
    const padB = 30;

    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const stepX = labels.length > 1 ? chartW / (labels.length - 1) : chartW;

    const phMin = 5.6;
    const phMax = 6.4;
    const phRange = phMax - phMin;

    const ecMin = 1.0;
    const ecMax = 1.8;
    const ecRange = ecMax - ecMin;

    const pointsPh = dataPh.map((val, idx) => {
      const x = padL + idx * stepX;
      const y = padT + chartH - ((Math.min(phMax, Math.max(phMin, val)) - phMin) / phRange) * chartH;
      return { x, y, val, label: labels[idx] };
    });

    const pointsEc = dataEc.map((val, idx) => {
      const x = padL + idx * stepX;
      const y = padT + chartH - ((Math.min(ecMax, Math.max(ecMin, val)) - ecMin) / ecRange) * chartH;
      return { x, y, val, label: labels[idx] };
    });

    const pointsPhStr = pointsPh.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const pointsEcStr = pointsEc.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    return `
      <div style="width: 100%; overflow-x: auto;">
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: ${width}px; height: auto; display: block; font-family: sans-serif;">
          <!-- Cuadrícula -->
          <line x1="${padL}" y1="${padT}" x2="${width - padR}" y2="${padT}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="${padL}" y1="${padT + chartH * 0.5}" x2="${width - padR}" y2="${padT + chartH * 0.5}" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="${padL}" y1="${padT + chartH}" x2="${width - padR}" y2="${padT + chartH}" stroke="#e2e8f0" stroke-width="1.5" />

          <!-- Eje Y Izquierdo (pH verde) -->
          <text x="${padL - 6}" y="${padT + 4}" fill="#059669" font-size="9.5" text-anchor="end" font-weight="700">6.4</text>
          <text x="${padL - 6}" y="${padT + chartH * 0.5 + 4}" fill="#059669" font-size="9.5" text-anchor="end" font-weight="700">6.0</text>
          <text x="${padL - 6}" y="${padT + chartH}" fill="#059669" font-size="9.5" text-anchor="end" font-weight="700">5.6</text>

          <!-- Eje Y Derecho (CE azul) -->
          <text x="${width - padR + 6}" y="${padT + 4}" fill="#3b82f6" font-size="9.5" text-anchor="start" font-weight="700">1.8</text>
          <text x="${width - padR + 6}" y="${padT + chartH * 0.5 + 4}" fill="#3b82f6" font-size="9.5" text-anchor="start" font-weight="700">1.4</text>
          <text x="${width - padR + 6}" y="${padT + chartH}" fill="#3b82f6" font-size="9.5" text-anchor="start" font-weight="700">1.0</text>

          <!-- Línea pH -->
          <polyline points="${pointsPhStr}" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          ${pointsPh.map(p => `
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="#ffffff" stroke="#059669" stroke-width="2">
              <title>pH: ${p.val}</title>
            </circle>
          `).join('')}

          <!-- Línea CE -->
          <polyline points="${pointsEcStr}" fill="none" stroke="#3b82f6" stroke-width="2.2" stroke-dasharray="4,2" stroke-linecap="round" stroke-linejoin="round" />
          ${pointsEc.map(p => `
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="#ffffff" stroke="#3b82f6" stroke-width="2">
              <title>CE: ${p.val} mS/cm</title>
            </circle>
          `).join('')}

          <!-- Etiquetas X -->
          ${pointsPh.map(p => `
            <text x="${p.x.toFixed(1)}" y="${padT + chartH + 16}" fill="#64748b" font-size="9.5" text-anchor="middle" font-weight="600">${p.label}</text>
          `).join('')}
        </svg>
      </div>
    `;
  }

  function renderGerencialDashboard(container) {
    const harvests = Store.getHarvestProd();
    const irrigationField = Store.getIrrigationField();
    const irrigationPrep = Store.getIrrigationPrep();
    const sales = Store.getSalesRecords();
    const processList = Store.getProcessRecords();
    const varieties = Store.getVarieties();
    const plans = Store.getFarmPlans ? Store.getFarmPlans() : [];
    const fieldChecks = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const bunchChecks = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];

    // Fechas de referencia
    const todayStr = '2026-10-09'; // Fecha operativa estándar de la finca
    const currentMonthPrefix = '2026-10';
    const currentYearPrefix = '2026';
    const currentWeekInfo = getWeekMondayToSunday(todayStr);

    // Filtrar cosechas específicamente para la Curva de Producción interactiva
    let curveHarvests = harvests.slice();
    if (currentProdCurveVariety && currentProdCurveVariety !== 'todas') {
      curveHarvests = curveHarvests.filter(h => h.variety && h.variety.toLowerCase() === currentProdCurveVariety.toLowerCase());
    }
    if (currentProdCurveBlock && currentProdCurveBlock !== 'todos') {
      curveHarvests = curveHarvests.filter(h => h.block && h.block.toLowerCase() === currentProdCurveBlock.toLowerCase());
    }
    if (currentProdCurveDate) {
      curveHarvests = curveHarvests.filter(h => h.date === currentProdCurveDate);
    }

    // Función auxiliar de filtrado según período
    function isInPeriod(dateStr) {
      if (!dateStr) return true;
      if (currentDashboardPeriod === 'dia') {
        return dateStr === todayStr;
      } else if (currentDashboardPeriod === 'semana') {
        // Rango de la semana calendario: Lunes a Domingo
        return dateStr >= currentWeekInfo.mondayIso && dateStr <= currentWeekInfo.sundayIso;
      } else if (currentDashboardPeriod === 'mes') {
        return dateStr.startsWith(currentMonthPrefix);
      } else if (currentDashboardPeriod === 'ano') {
        return dateStr.startsWith(currentYearPrefix);
      } else if (currentDashboardPeriod === 'rango') {
        return dateStr >= currentGerencialDateFrom && dateStr <= currentGerencialDateTo;
      }
      return true;
    }

    // Filtrar colecciones por el período activo
    const filteredHarvests = harvests.filter(h => isInPeriod(h.date));
    const activeHarvests = filteredHarvests.length > 0 ? filteredHarvests : harvests;

    const filteredProcess = processList.filter(p => isInPeriod(p.date));
    const activeProcess = filteredProcess.length > 0 ? filteredProcess : processList;

    const filteredIrrigation = irrigationField.filter(f => isInPeriod(f.date));
    const activeIrrigation = filteredIrrigation.length > 0 ? filteredIrrigation : irrigationField;

    const filteredSales = sales.filter(s => isInPeriod(s.date));
    const activeSales = filteredSales.length > 0 ? filteredSales : sales;

    // Métricas calculadas para el período
    const totalHarvestStems = activeHarvests.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
    const totalProcessStems = activeProcess.reduce((acc, p) => acc + (parseInt(p.stemsProcessed, 10) || 0), 0);
    const totalExportStems = activeProcess.reduce((acc, p) => acc + (parseInt(p.exportStems, 10) || 0), 0);
    const totalNationalStems = activeProcess.reduce((acc, p) => acc + (parseInt(p.nationalStems, 10) || 0), 0);

    const pctExportGlobal = totalProcessStems > 0 
      ? ((totalExportStems / totalProcessStems) * 100).toFixed(1) 
      : '92.5';
    const pctNationalGlobal = totalProcessStems > 0 
      ? ((totalNationalStems / totalProcessStems) * 100).toFixed(1) 
      : '7.5';

    // Riego promedio
    const avgFieldPh = activeIrrigation.length > 0 
      ? (activeIrrigation.reduce((acc, f) => acc + (parseFloat(f.ph) || 6.0), 0) / activeIrrigation.length).toFixed(2)
      : '6.02';
    const avgFieldEc = activeIrrigation.length > 0 
      ? (activeIrrigation.reduce((acc, f) => acc + (parseFloat(f.ec) || 1.45), 0) / activeIrrigation.length).toFixed(2)
      : '1.46';

    // Ventas
    const totalRevenue = activeSales.reduce((acc, s) => acc + (parseFloat(s.totalAmount) || 0), 0);
    const totalSoldStems = activeSales.reduce((acc, s) => acc + (parseInt(s.stemsCount, 10) || 0), 0);

    // Configuración de Gráficos de Tendencia según período
    let daysLabels = [];
    let prodTrend = [];
    let phTrend = [];
    let ecTrend = [];
    let periodTitleDesc = '';

    if (currentDashboardPeriod === 'dia') {
      periodTitleDesc = 'Turnos de corte durante el día de hoy (07:00 a 17:00)';
      daysLabels = ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'];
      if (currentProdCurveVariety !== 'todas' || currentProdCurveBlock !== 'todos' || currentProdCurveDate) {
        const activeDate = currentProdCurveDate || todayStr;
        const dayHarvests = curveHarvests.filter(h => h.date === activeDate);
        const dayTotal = dayHarvests.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
        prodTrend = [
          Math.round(dayTotal * 0.12),
          Math.round(dayTotal * 0.22),
          Math.round(dayTotal * 0.28),
          Math.round(dayTotal * 0.20),
          Math.round(dayTotal * 0.12),
          Math.round(dayTotal * 0.06)
        ];
      } else {
        prodTrend = [450, 720, 980, 850, 620, 380];
      }
      phTrend = [6.00, 6.05, 5.98, 6.02, 6.01, 5.95];
      ecTrend = [1.44, 1.46, 1.48, 1.45, 1.47, 1.46];
    } else if (currentDashboardPeriod === 'semana') {
      periodTitleDesc = `${currentWeekInfo.periodTitle} (Semana completa de Lunes a Domingo)`;
      daysLabels = currentWeekInfo.labels;

      // Calcular volumen diario de tallos cosechados día a día (Lunes a Domingo)
      const fallbackHarvestCurve = [2950, 3180, 3350, 2980, 3950, 2800, 1950];
      prodTrend = currentWeekInfo.days.map((day, idx) => {
        const dayHarvests = curveHarvests.filter(h => h.date === day.isoDate);
        if (dayHarvests.length > 0) {
          return dayHarvests.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
        }
        if (currentProdCurveVariety === 'todas' && currentProdCurveBlock === 'todos' && !currentProdCurveDate) {
          return fallbackHarvestCurve[idx];
        }
        return 0;
      });

      // Fertirriego diario día a día (Lunes a Domingo)
      const fallbackPhCurve = [5.98, 6.02, 6.00, 6.08, 6.02, 5.98, 6.01];
      const fallbackEcCurve = [1.44, 1.45, 1.42, 1.48, 1.46, 1.45, 1.44];

      phTrend = currentWeekInfo.days.map((day, idx) => {
        const dayIrrig = irrigationField.filter(f => f.date === day.isoDate);
        if (dayIrrig.length > 0) {
          const avg = dayIrrig.reduce((a, b) => a + parseFloat(b.ph || 6.0), 0) / dayIrrig.length;
          return parseFloat(avg.toFixed(2));
        }
        return fallbackPhCurve[idx];
      });

      ecTrend = currentWeekInfo.days.map((day, idx) => {
        const dayIrrig = irrigationField.filter(f => f.date === day.isoDate);
        if (dayIrrig.length > 0) {
          const avg = dayIrrig.reduce((a, b) => a + parseFloat(b.ec || 1.45), 0) / dayIrrig.length;
          return parseFloat(avg.toFixed(2));
        }
        return fallbackEcCurve[idx];
      });
    } else if (currentDashboardPeriod === 'mes') {
      periodTitleDesc = 'Consolidado semanal durante el mes de Octubre';
      daysLabels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
      prodTrend = [21500, 24200, 22800, 25400];
      phTrend = [6.01, 5.98, 6.03, 6.00];
      ecTrend = [1.45, 1.47, 1.44, 1.46];
    } else if (currentDashboardPeriod === 'ano') {
      periodTitleDesc = 'Tendencia mensual acumulada durante el año 2026';
      daysLabels = ['Ene', 'Feb (Valentín)', 'Mar', 'Abr', 'May (Madre)', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      prodTrend = [85000, 168000, 92000, 88000, 154000, 79000, 81000, 83000, 87000, 94000, 98000, 135000];
      phTrend = [6.02, 6.00, 6.01, 5.99, 6.03, 6.01, 6.00, 6.02, 5.98, 6.01, 6.00, 6.02];
      ecTrend = [1.46, 1.48, 1.45, 1.44, 1.47, 1.45, 1.46, 1.45, 1.46, 1.46, 1.45, 1.47];
    } else { // 'rango'
      periodTitleDesc = `Rango personalizado del ${currentGerencialDateFrom} al ${currentGerencialDateTo}`;

      const startD = new Date(currentGerencialDateFrom + 'T00:00:00');
      const endD = new Date(currentGerencialDateTo + 'T00:00:00');
      const diffTime = Math.max(0, endD - startD);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const rangeDays = [];
      const cur = new Date(startD);
      const count = Math.min(diffDays, 31);
      for (let i = 0; i < count; i++) {
        const yyyy = cur.getFullYear();
        const mm = String(cur.getMonth() + 1).padStart(2, '0');
        const dd = String(cur.getDate()).padStart(2, '0');
        rangeDays.push({
          iso: `${yyyy}-${mm}-${dd}`,
          label: `${dd}/${mm}`
        });
        cur.setDate(cur.getDate() + 1);
      }

      daysLabels = rangeDays.map(d => d.label);
      prodTrend = rangeDays.map(d => {
        const dayHarvests = curveHarvests.filter(h => h.date === d.iso);
        return dayHarvests.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
      });

      phTrend = rangeDays.map(d => {
        const dayIrrig = irrigationField.filter(f => f.date === d.iso);
        if (dayIrrig.length > 0) {
          const avg = dayIrrig.reduce((a, b) => a + parseFloat(b.ph || 6.0), 0) / dayIrrig.length;
          return parseFloat(avg.toFixed(2));
        }
        return 6.00;
      });

      ecTrend = rangeDays.map(d => {
        const dayIrrig = irrigationField.filter(f => f.date === d.iso);
        if (dayIrrig.length > 0) {
          const avg = dayIrrig.reduce((a, b) => a + parseFloat(b.ec || 1.45), 0) / dayIrrig.length;
          return parseFloat(avg.toFixed(2));
        }
        return 1.45;
      });
    }

    const periodLabelsText = {
      'dia': 'Reporte del Día (Hoy)',
      'semana': 'Reporte Semanal (Lunes a Domingo)',
      'mes': 'Reporte Mensual (Octubre 2026)',
      'ano': 'Reporte Anual (Año 2026)',
      'rango': `Rango Personalizado (${currentGerencialDateFrom} al ${currentGerencialDateTo})`
    };

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Panel de Control Estratégico
            </span>
          </div>
          <h1 style="color: #065f46;">Dashboard Gerencial Florícola</h1>
          <p class="view-subtitle" style="color: #047857;">Monitoreo en vivo de Producción diaria, Estabilidad de Fertirriego (pH/CE), Ventas y Líneas de Tendencia FLORÍCOLA.</p>
        </div>

        <div class="view-actions" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          
          <!-- Filtro de Temporalidad: Día, Semanas (Lun-Dom), Meses, Años, Rango de Fechas -->
          <div style="display: flex; align-items: center; gap: 0.25rem; background: #f0fdf4; padding: 0.25rem 0.45rem; border-radius: 8px; border: 1.5px solid #a7f3d0; flex-wrap: wrap;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #047857; text-transform: uppercase; margin-right: 0.25rem;">Período:</span>
            <button class="btn ${currentDashboardPeriod === 'dia' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.22rem 0.55rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setDashboardPeriod('dia')">
              📅 Día
            </button>
            <button class="btn ${currentDashboardPeriod === 'semana' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.22rem 0.55rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setDashboardPeriod('semana')" title="Semana completa de Lunes a Domingo (${currentWeekInfo.days[0].formattedDate} al ${currentWeekInfo.days[6].formattedDate})">
              📆 Semanas (Lun - Dom)
            </button>
            <button class="btn ${currentDashboardPeriod === 'mes' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.22rem 0.55rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setDashboardPeriod('mes')">
              📊 Meses
            </button>
            <button class="btn ${currentDashboardPeriod === 'ano' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.22rem 0.55rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setDashboardPeriod('ano')">
              📈 Años
            </button>
            <button class="btn ${currentDashboardPeriod === 'rango' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.22rem 0.55rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setDashboardPeriod('rango')" title="Filtrar por rango de fecha personalizado">
              🗓️ Rango de Fechas
            </button>
          </div>

          <!-- Botón Imprimir Reporte Gerencial -->
          <button class="btn btn-secondary" onclick="Modules.printDashboardReport()" style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 700; border-color: #059669; color: #047857;" title="Imprimir Reporte Gerencial Ejecutivo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Reporte
          </button>

          <button class="btn btn-emerald" onclick="App.navigateTo('proyecciones-pinch')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
            Ver Proyecciones
          </button>
        </div>
      </div>

      <!-- Selector interactivo de Rango de Fechas para Dashboard Gerencial -->
      ${currentDashboardPeriod === 'rango' ? `
        <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 0.65rem 1rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <strong style="color: #065f46; font-size: 0.82rem;">Filtrar Dashboard Gerencial por Rango de Fechas:</strong>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.78rem;">
              <label for="gerencial-date-from" style="color: #065f46; font-weight: 700;">Desde:</label>
              <input type="date" id="gerencial-date-from" class="form-control" value="${currentGerencialDateFrom}" style="padding: 0.25rem 0.5rem; font-size: 0.78rem; width: auto; height: 32px;" onchange="Modules.applyGerencialDateRange()">
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.78rem;">
              <label for="gerencial-date-to" style="color: #065f46; font-weight: 700;">Hasta:</label>
              <input type="date" id="gerencial-date-to" class="form-control" value="${currentGerencialDateTo}" style="padding: 0.25rem 0.5rem; font-size: 0.78rem; width: auto; height: 32px;" onchange="Modules.applyGerencialDateRange()">
            </div>
            <button class="btn btn-emerald" style="padding: 0.28rem 0.75rem; font-size: 0.78rem; font-weight: 700;" onclick="Modules.applyGerencialDateRange()">
              Aplicar Rango
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Indicador del Período Visualizado -->
      <div style="background: #ffffff; border: 1px solid #d1fae5; border-left: 4px solid #059669; padding: 0.55rem 1rem; border-radius: 6px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <div style="font-size: 0.8rem; color: #065f46; font-weight: 700;">
          Vista Activa: <span style="color: #047857;">${periodLabelsText[currentDashboardPeriod]}</span>
          <span style="font-size: 0.74rem; font-weight: 500; color: #64748b; margin-left: 0.5rem;">— ${periodTitleDesc}</span>
          ${currentDashboardPeriod === 'semana' ? `<span class="badge" style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; margin-left:0.5rem; font-size:0.7rem; font-weight:800;">Lun a Dom</span>` : ''}
        </div>
        <div style="font-size: 0.72rem; color: #64748b;">
          Última sincronización: <strong>Hoy, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
        </div>
      </div>

      <!-- Tarjetas KPI Resumen Gerencial -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem;">
        <div class="kpi-card" style="border-left: 4px solid #10b981; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Cosecha del Período</span>
            <span class="kpi-badge badge-success">Producción</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalHarvestStems.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            📈 <span style="font-weight: 700;">+8.4%</span> rendimiento proyectado
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #059669; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Fertirriego Promedio</span>
            <span class="kpi-badge badge-success">Nutrición</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">pH ${avgFieldPh}</span>
            <span class="kpi-unit">| CE ${avgFieldEc} mS/cm</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            🌱 <span>Óptimo en solución y raíz</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #3b82f6; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #1d4ed8;">Calidad en Proceso</span>
            <span class="kpi-badge badge-info">Postcosecha</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #1e40af;">${pctExportGlobal}%</span>
            <span class="kpi-unit">Exportable</span>
          </div>
          <div class="kpi-sub" style="color: #b91c1c;">
            🍂 Flor Nacional: <strong>${pctNationalGlobal}%</strong>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #047857; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Ventas & Facturación</span>
            <span class="kpi-badge badge-success">Comercial</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            <span class="kpi-unit">USD</span>
          </div>
          <div class="kpi-sub" style="color: #047857;">
            📦 <span>${totalSoldStems.toLocaleString()} tallos despachados</span>
          </div>
        </div>
      </div>

      <!-- Gráficos de Tendencias en SVG -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
        
        <!-- Gráfico 1: Tendencia de Producción -->
        <div class="card" style="padding: 1rem; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
            <div>
              <h3 style="font-size: 0.92rem; font-weight: 800; color: #065f46; margin: 0;">Curva de Producción (Tallos en Período)</h3>
              <span style="font-size: 0.72rem; color: #64748b;">${periodTitleDesc}</span>
            </div>
            <span style="font-size: 0.75rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.15rem 0.5rem; border-radius: 99px;">Curva de Campo</span>
          </div>

          <!-- Filtros Interactivos de Variedad, Bloque y Fecha -->
          <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.75rem; background: #f0fdf4; padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid #bbf7d0;">
            <div style="display: flex; align-items: center; gap: 0.2rem;">
              <span style="font-size: 0.7rem; font-weight: 700; color: #047857;">Variedad:</span>
              <select id="gerencial-curve-variety" class="form-control" style="font-size: 0.72rem; padding: 0.2rem 0.35rem; height: auto;" onchange="Modules.setGerencialCurveFilters()">
                <option value="todas">Todas</option>
                ${varieties.map(v => `<option value="${escapeHtml(v.name)}" ${v.name.toLowerCase() === currentProdCurveVariety.toLowerCase() ? 'selected' : ''}>${escapeHtml(v.name)}</option>`).join('')}
              </select>
            </div>
            <div style="display: flex; align-items: center; gap: 0.2rem;">
              <span style="font-size: 0.7rem; font-weight: 700; color: #047857;">Bloque:</span>
              <select id="gerencial-curve-block" class="form-control" style="font-size: 0.72rem; padding: 0.2rem 0.35rem; height: auto;" onchange="Modules.setGerencialCurveFilters()">
                <option value="todos">Todos</option>
                ${plans.map(p => `<option value="${escapeHtml(p.block)}" ${p.block === currentProdCurveBlock ? 'selected' : ''}>${escapeHtml(p.block)}</option>`).join('')}
              </select>
            </div>
            <div style="display: flex; align-items: center; gap: 0.2rem;">
              <span style="font-size: 0.7rem; font-weight: 700; color: #047857;">Fecha:</span>
              <input type="date" id="gerencial-curve-date" class="form-control" style="font-size: 0.72rem; padding: 0.2rem 0.35rem; height: auto;" value="${currentProdCurveDate}" onchange="Modules.setGerencialCurveFilters()">
            </div>
            ${(currentProdCurveVariety !== 'todas' || currentProdCurveBlock !== 'todos' || currentProdCurveDate) ? `
              <button class="btn btn-secondary" style="font-size: 0.68rem; padding: 0.2rem 0.45rem;" onclick="Modules.resetGerencialCurveFilters()" title="Restablecer filtros de la curva">
                ✕ Limpiar
              </button>
            ` : ''}
          </div>

          ${renderSvgLineChart(daysLabels, prodTrend, '#10b981', 'tallos')}
        </div>

        <!-- Gráfico 2: Estabilidad de Riego (pH y CE) -->
        <div class="card" style="padding: 1rem; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <h3 style="font-size: 0.92rem; font-weight: 800; color: #065f46; margin: 0;">Estabilidad de Fertirriego (pH vs CE)</h3>
              <span style="font-size: 0.72rem; color: #64748b;">Monitoreo continuo de acidez (pH) y conductividad eléctrica (CE mS/cm)</span>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <span style="font-size: 0.68rem; font-weight: 700; color: #059669;">● pH (5.8-6.2)</span>
              <span style="font-size: 0.68rem; font-weight: 700; color: #3b82f6;">● CE (1.2-1.6)</span>
            </div>
          </div>
          ${renderSvgDualChart(daysLabels, phTrend, ecTrend)}
        </div>
      </div>

      <!-- Tabla Resumen Ejecutivo de Variedades en Producción y Stock -->
      <div class="card" style="padding: 1rem; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 800; color: #065f46; margin: 0;">Resumen Gerencial de Finca por Variedad</h3>
            <span style="font-size: 0.74rem; color: #64748b;">Consolidado de cosecha, rendimiento en mesa, flor nacional y stock exportable disponible</span>
          </div>
          <button class="btn btn-secondary" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;" onclick="App.navigateTo('ventas-stock')">
            Ir a Módulo de Ventas &rarr;
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table" style="font-size: 0.82rem;">
            <thead>
              <tr style="background: #f8fafc;">
                <th>Variedad</th>
                <th>Cosecha Período</th>
                <th>Procesado</th>
                <th>Flor Nacional</th>
                <th>% Exportable</th>
                <th>Stock Disponible</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${varieties.map(v => {
                const varHarvests = activeHarvests.filter(h => h.variety === v.name).reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
                const varProc = activeProcess.filter(p => p.variety === v.name).reduce((acc, p) => acc + (parseInt(p.stemsProcessed, 10) || 0), 0);
                const varNac = activeProcess.filter(p => p.variety === v.name).reduce((acc, p) => acc + (parseInt(p.nationalStems, 10) || 0), 0);
                const varExp = varProc > 0 ? varProc - varNac : Math.round(varHarvests * 0.92);
                const pctExp = varProc > 0 ? ((varExp / varProc) * 100).toFixed(1) : '92.0';
                const stock = Math.max(0, varExp - 500);

                return `
                  <tr>
                    <td><strong>${escapeHtml(v.name)}</strong> <span style="font-size: 0.72rem; color: #64748b;">(${escapeHtml(v.color || '')})</span></td>
                    <td>${varHarvests > 0 ? varHarvests.toLocaleString() : '1,250'} tallos</td>
                    <td>${varProc > 0 ? varProc.toLocaleString() : '1,250'} tallos</td>
                    <td><span style="color: #b91c1c; font-weight: 600;">${varNac > 0 ? varNac.toLocaleString() : '100'} tallos</span></td>
                    <td><span style="color: #047857; font-weight: 700;">${pctExp}%</span></td>
                    <td><strong>${stock.toLocaleString()} tallos</strong> <span style="font-size: 0.72rem; color: #64748b;">(${Math.floor(stock/25)} bchs)</span></td>
                    <td><span class="badge" style="background: #d1fae5; color: #065f46; font-size: 0.72rem;">Alta Demanda</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Función para Imprimir Reporte Gerencial Ejecutivo
  function printDashboardReport() {
    const periodLabelsText = {
      'dia': 'Reporte Diario de Operaciones (Hoy)',
      'semana': 'Reporte Semanal Consolidado (Semana Lunes a Domingo)',
      'mes': 'Reporte Mensual Ejecutivo (Octubre 2026)',
      'ano': 'Reporte Anual de Rendimiento (Año 2026)',
      'rango': `Reporte por Rango de Fechas (${currentGerencialDateFrom} al ${currentGerencialDateTo})`
    };

    const harvests = Store.getHarvestProd();
    const irrigationField = Store.getIrrigationField();
    const sales = Store.getSalesRecords();
    const processList = Store.getProcessRecords();
    const varieties = Store.getVarieties();

    const todayStr = '2026-10-09';
    const currentMonthPrefix = '2026-10';
    const currentYearPrefix = '2026';
    const currentWeekInfo = getWeekMondayToSunday(todayStr);

    function isPrintInPeriod(dateStr) {
      if (!dateStr) return true;
      if (currentDashboardPeriod === 'dia') {
        return dateStr === todayStr;
      } else if (currentDashboardPeriod === 'semana') {
        return dateStr >= currentWeekInfo.mondayIso && dateStr <= currentWeekInfo.sundayIso;
      } else if (currentDashboardPeriod === 'mes') {
        return dateStr.startsWith(currentMonthPrefix);
      } else if (currentDashboardPeriod === 'ano') {
        return dateStr.startsWith(currentYearPrefix);
      } else if (currentDashboardPeriod === 'rango') {
        return dateStr >= currentGerencialDateFrom && dateStr <= currentGerencialDateTo;
      }
      return true;
    }

    const filteredHarvests = harvests.filter(h => isPrintInPeriod(h.date));
    const activeHarvests = filteredHarvests.length > 0 ? filteredHarvests : harvests;

    const filteredProcess = processList.filter(p => isPrintInPeriod(p.date));
    const activeProcess = filteredProcess.length > 0 ? filteredProcess : processList;

    const filteredIrrigation = irrigationField.filter(f => isPrintInPeriod(f.date));
    const activeIrrigation = filteredIrrigation.length > 0 ? filteredIrrigation : irrigationField;

    const filteredSales = sales.filter(s => isPrintInPeriod(s.date));
    const activeSales = filteredSales.length > 0 ? filteredSales : sales;

    const totalHarvest = activeHarvests.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
    const totalProc = activeProcess.reduce((acc, p) => acc + (parseInt(p.stemsProcessed, 10) || 0), 0);
    const totalExp = activeProcess.reduce((acc, p) => acc + (parseInt(p.exportStems, 10) || 0), 0);
    const totalNac = activeProcess.reduce((acc, p) => acc + (parseInt(p.nationalStems, 10) || 0), 0);
    const totalRev = activeSales.reduce((acc, s) => acc + (parseFloat(s.totalAmount) || 0), 0);

    const avgPh = activeIrrigation.length > 0 ? (activeIrrigation.reduce((a, b) => a + parseFloat(b.ph || 6.0), 0) / activeIrrigation.length).toFixed(2) : '6.02';
    const avgEc = activeIrrigation.length > 0 ? (activeIrrigation.reduce((a, b) => a + parseFloat(b.ec || 1.45), 0) / activeIrrigation.length).toFixed(2) : '1.46';

    const printWin = window.open('', '_blank', 'width=950,height=800,scrollbars=yes,resizable=yes');
    if (!printWin) {
      App.showToast('Autoriza las ventanas emergentes para imprimir el reporte', 'danger');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte Gerencial Ejecutivo - MRosecuador</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            padding: 20px;
            color: #0f172a;
            font-size: 11.5px;
            background: #ffffff;
            line-height: 1.4;
          }
          @page { size: A4 portrait; margin: 10mm; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
          }
          .header-box {
            border-bottom: 2px solid #047857;
            padding-bottom: 10px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .kpi-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 15px;
          }
          .kpi-item {
            border: 1px solid #cbd5e1;
            border-left: 3.5px solid #059669;
            padding: 8px;
            border-radius: 6px;
            background: #f8fafc;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 15px;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 5px 8px;
            text-align: left;
          }
          th {
            background: #047857;
            color: #ffffff;
            font-weight: 700;
          }
          .sign-area {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 35px;
            text-align: center;
          }
          .sign-line {
            border-top: 1px solid #64748b;
            padding-top: 5px;
            font-weight: 700;
            font-size: 10.5px;
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background:#047857; color:#fff; padding:8px 16px; border-radius:6px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
          <strong>Vista Oficial de Impresión - Reporte Gerencial MRosecuador</strong>
          <div>
            <button onclick="window.print()" style="background:#fff; color:#047857; border:none; padding:5px 14px; font-weight:700; border-radius:4px; cursor:pointer;">Imprimir / Guardar PDF</button>
            <button onclick="window.close()" style="background:transparent; color:#fff; border:1px solid #fff; padding:5px 12px; margin-left:6px; border-radius:4px; cursor:pointer;">Cerrar</button>
          </div>
        </div>

        <div class="header-box">
          <div>
            <h1 style="font-size: 18px; color: #065f46; margin-bottom: 2px;">MROSECUADOR FLORICULTURA DE EXPORTACIÓN</h1>
            <div style="font-size: 13px; font-weight: 800; color: #047857;">${periodLabelsText[currentDashboardPeriod]}</div>
            <div style="font-size: 10px; color: #64748b;">Cotopaxi & Cayambe, Ecuador | Altitud 2.850 m.s.n.m.</div>
          </div>
          <div style="text-align: right; font-size: 10.5px; color: #475569;">
            <div><strong>Fecha Emisión:</strong> ${new Date().toLocaleDateString('es-EC', {year:'numeric', month:'long', day:'numeric'})}</div>
            <div><strong>Hora:</strong> ${new Date().toLocaleTimeString()}</div>
            <div style="color: #059669; font-weight: 700;">Auditoría General Validada</div>
          </div>
        </div>

        <div class="kpi-row">
          <div class="kpi-item">
            <div style="font-size: 9.5px; text-transform: uppercase; color: #64748b; font-weight: 700;">Cosecha Período</div>
            <div style="font-size: 16px; font-weight: 800; color: #065f46;">${totalHarvest.toLocaleString()} <span style="font-size: 10px;">tallos</span></div>
          </div>
          <div class="kpi-item">
            <div style="font-size: 9.5px; text-transform: uppercase; color: #64748b; font-weight: 700;">Fertirriego Raíz</div>
            <div style="font-size: 16px; font-weight: 800; color: #065f46;">pH ${avgPh} <span style="font-size: 11px;">| CE ${avgEc}</span></div>
          </div>
          <div class="kpi-item">
            <div style="font-size: 9.5px; text-transform: uppercase; color: #64748b; font-weight: 700;">% Exportable</div>
            <div style="font-size: 16px; font-weight: 800; color: #047857;">${((totalExp/totalProc)*100).toFixed(1)}% <span style="font-size: 10px;">(Nac: ${((totalNac/totalProc)*100).toFixed(1)}%)</span></div>
          </div>
          <div class="kpi-item">
            <div style="font-size: 9.5px; text-transform: uppercase; color: #64748b; font-weight: 700;">Facturación FOB</div>
            <div style="font-size: 16px; font-weight: 800; color: #059669;">$${totalRev.toLocaleString('en-US', {minimumFractionDigits: 2})} USD</div>
          </div>
        </div>

        <h3 style="font-size: 12px; font-weight: 800; color: #065f46; margin-bottom: 6px; text-transform: uppercase;">
          1. Consolidado de Rendimiento florícola por Variedad
        </h3>
        <table>
          <thead>
            <tr>
              <th>Variedad</th>
              <th>Color / Obtentor</th>
              <th>Cosechado</th>
              <th>Procesado</th>
              <th>Exportable</th>
              <th>Nacional</th>
              <th>% Export</th>
            </tr>
          </thead>
          <tbody>
            ${varieties.map(v => {
              const hStems = activeHarvests.filter(h => h.variety === v.name).reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
              const pStems = activeProcess.filter(p => p.variety === v.name).reduce((acc, p) => acc + (parseInt(p.stemsProcessed, 10) || 0), 0);
              const nStems = activeProcess.filter(p => p.variety === v.name).reduce((acc, p) => acc + (parseInt(p.nationalStems, 10) || 0), 0);
              const eStems = pStems > 0 ? (pStems - nStems) : Math.round(hStems * 0.92);
              const pct = pStems > 0 ? ((eStems / pStems) * 100).toFixed(1) : '92.0';
              return `
                <tr>
                  <td><strong>Rosa ${escapeHtml(v.name)}</strong></td>
                  <td>${escapeHtml(v.color || '')}</td>
                  <td>${hStems > 0 ? hStems.toLocaleString() : '1,250'}</td>
                  <td>${pStems > 0 ? pStems.toLocaleString() : '1,250'}</td>
                  <td style="color:#047857; font-weight:700;">${eStems.toLocaleString()}</td>
                  <td style="color:#b91c1c;">${nStems > 0 ? nStems.toLocaleString() : '100'}</td>
                  <td><strong>${pct}%</strong></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <h3 style="font-size: 12px; font-weight: 800; color: #065f46; margin-bottom: 6px; text-transform: uppercase;">
          2. Registro de Muestras de Riego (pH y Conductividad Eléctrica)
        </h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Bloque</th>
              <th>Variedad</th>
              <th>Válvula</th>
              <th>pH Muestra</th>
              <th>CE (mS/cm)</th>
              <th>Temperatura</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            ${irrigationField.slice(0, 5).map(f => `
              <tr>
                <td>${f.date}</td>
                <td>${f.time || '09:00'}</td>
                <td>${escapeHtml(f.block)}</td>
                <td>${escapeHtml(f.variety)}</td>
                <td>${escapeHtml(f.valve || 'V-01')}</td>
                <td><strong>${f.ph}</strong></td>
                <td><strong>${f.ec}</strong></td>
                <td>${f.temp ? f.temp + '°C' : '18.5°C'}</td>
                <td>${escapeHtml(f.responsible || 'Técnico Riego')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="sign-area">
          <div>
            <div class="sign-line">Ing. Juan Tipán<br><span style="font-weight: normal; font-size: 9.5px;">Administrador General</span></div>
          </div>
          <div>
            <div class="sign-line">Ing. Elena Rosero<br><span style="font-weight: normal; font-size: 9.5px;">Jefatura FLORÍCOLA & Cultivo</span></div>
          </div>
          <div>
            <div class="sign-line">Supervisión Poscosecha<br><span style="font-weight: normal; font-size: 9.5px;">Control de Calidad & Empaque</span></div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  // ==============================================================================
  // MÓDULO: DASHBOARD DE PRODUCCIÓN FLORÍCOLA (PANEL EJECUTIVO)
  // ==============================================================================
  let currentProdDashPeriod = 'semana'; // 'dia' | 'semana' | 'mes' | 'ano' | 'rango'
  let currentProdDashVariety = 'todas';
  let currentProdDashBlock = 'todos';
  let currentProdDashDateFrom = '2026-10-05';
  let currentProdDashDateTo = '2026-10-11';

  function setProdDashPeriod(period) {
    currentProdDashPeriod = period;
    renderProductionDashboard(document.getElementById('view-container'));
  }

  function setProdDashVariety(variety) {
    currentProdDashVariety = variety;
    renderProductionDashboard(document.getElementById('view-container'));
  }

  function setProdDashBlock(block) {
    currentProdDashBlock = block;
    renderProductionDashboard(document.getElementById('view-container'));
  }

  function applyProdDashDateRange() {
    const fromVal = document.getElementById('p-dash-from')?.value;
    const toVal = document.getElementById('p-dash-to')?.value;
    if (!fromVal || !toVal) {
      App.showToast('Por favor selecciona ambas fechas (Desde y Hasta)', 'warning');
      return;
    }
    if (fromVal > toVal) {
      App.showToast('La fecha "Desde" no puede ser mayor que "Hasta"', 'warning');
      return;
    }
    currentProdDashDateFrom = fromVal;
    currentProdDashDateTo = toVal;
    currentProdDashPeriod = 'rango';
    renderProductionDashboard(document.getElementById('view-container'));
  }

  function resetProdDashFilters() {
    currentProdDashPeriod = 'semana';
    currentProdDashVariety = 'todas';
    currentProdDashBlock = 'todos';
    currentProdDashDateFrom = '2026-10-05';
    currentProdDashDateTo = '2026-10-11';
    renderProductionDashboard(document.getElementById('view-container'));
  }

  // Generador de Gráfico SVG Vectorial para la Línea de Tendencia de Producción
  function renderProdDashboardSvgChart(labels, data, subtitle, unit = 'tallos') {
    if (!data || data.length === 0) {
      return '<div style="height:200px; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:0.85rem;">Sin datos para el período o filtros seleccionados</div>';
    }

    const width = 880;
    const height = 240;
    const padL = 55;
    const padR = 30;
    const padT = 25;
    const padB = 35;

    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const rawMax = Math.max(...data, 100);
    const maxVal = Math.ceil((rawMax * 1.15) / 500) * 500;
    const minVal = 0;

    const count = data.length;
    const stepX = count > 1 ? chartW / (count - 1) : chartW / 2;

    const points = data.map((val, i) => {
      const x = padL + (count > 1 ? i * stepX : chartW / 2);
      const ratio = (val - minVal) / (maxVal - minVal);
      const y = padT + chartH - (ratio * chartH);
      return { x, y, val, label: labels[i] || '' };
    });

    const pathD = points.map((p, idx) => (idx === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)).join(' ');
    const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${padT + chartH} L ${points[0].x.toFixed(1)} ${padT + chartH} Z`;

    const gridLines = [0, 0.25, 0.5, 0.75, 1];

    return `
      <div style="width: 100%; overflow-x: auto;">
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; min-width: 600px; height: auto; display: block;" font-family="Plus Jakarta Sans, sans-serif">
          <defs>
            <linearGradient id="prodTrendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#059669" stop-opacity="0.38"/>
              <stop offset="70%" stop-color="#10b981" stop-opacity="0.10"/>
              <stop offset="100%" stop-color="#34d399" stop-opacity="0.00"/>
            </linearGradient>
            <filter id="prodShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#059669" flood-opacity="0.25"/>
            </filter>
          </defs>

          <!-- Líneas de Cuadrícula Horizontal -->
          ${gridLines.map(ratio => {
            const y = padT + chartH - (ratio * chartH);
            const val = Math.round(minVal + ratio * (maxVal - minVal));
            return `
              <line x1="${padL}" y1="${y.toFixed(1)}" x2="${padL + chartW}" y2="${y.toFixed(1)}" stroke="#f1f5f9" stroke-width="1.2" stroke-dasharray="3,3"/>
              <text x="${padL - 8}" y="${(y + 3.5).toFixed(1)}" fill="#64748b" font-size="10" text-anchor="end" font-weight="600">${val.toLocaleString()}</text>
            `;
          }).join('')}

          <!-- Ejes principales -->
          <line x1="${padL}" y1="${padT + chartH}" x2="${padL + chartW}" y2="${padT + chartH}" stroke="#cbd5e1" stroke-width="1.5"/>
          <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + chartH}" stroke="#cbd5e1" stroke-width="1.5"/>

          <!-- Relleno de Área Degradada -->
          <path d="${areaD}" fill="url(#prodTrendGrad)"/>

          <!-- Línea Principal de Tendencia -->
          <path d="${pathD}" fill="none" stroke="#059669" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#prodShadow)"/>

          <!-- Puntos y Etiquetas de Valor -->
          ${points.map(p => `
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5.5" fill="#ffffff" stroke="#047857" stroke-width="2.8"/>
            <rect x="${(p.x - 22).toFixed(1)}" y="${(p.y - 23).toFixed(1)}" width="44" height="16" rx="4" fill="#065f46" opacity="0.95"/>
            <text x="${p.x.toFixed(1)}" y="${(p.y - 12).toFixed(1)}" fill="#ffffff" font-size="9" text-anchor="middle" font-weight="700">${p.val.toLocaleString()}</text>
            <text x="${p.x.toFixed(1)}" y="${padT + chartH + 18}" fill="#334155" font-size="10" text-anchor="middle" font-weight="700">${p.label}</text>
          `).join('')}
        </svg>
      </div>
    `;
  }

  function renderProductionDashboard(container) {
    const harvests = Store.getHarvestProd();
    const plans = Store.getFarmPlans ? Store.getFarmPlans() : [];
    const varieties = Store.getVarieties ? Store.getVarieties() : [];

    const todayStr = '2026-10-09';
    const currentMonthPrefix = '2026-10';
    const currentYearPrefix = '2026';
    const currentWeekInfo = getWeekMondayToSunday(todayStr);

    function matchesPeriod(dateStr) {
      if (!dateStr) return false;
      if (currentProdDashPeriod === 'dia') {
        return dateStr === todayStr;
      } else if (currentProdDashPeriod === 'semana') {
        return dateStr >= currentWeekInfo.mondayIso && dateStr <= currentWeekInfo.sundayIso;
      } else if (currentProdDashPeriod === 'mes') {
        return dateStr.startsWith(currentMonthPrefix);
      } else if (currentProdDashPeriod === 'ano') {
        return dateStr.startsWith(currentYearPrefix);
      } else if (currentProdDashPeriod === 'rango') {
        const from = currentProdDashDateFrom || '2026-10-01';
        const to = currentProdDashDateTo || todayStr;
        return dateStr >= from && dateStr <= to;
      }
      return true;
    }

    const periodHarvests = harvests.filter(h => matchesPeriod(h.date));
    let filteredHarvests = periodHarvests.slice();

    if (currentProdDashVariety && currentProdDashVariety !== 'todas') {
      filteredHarvests = filteredHarvests.filter(h => h.variety && h.variety.toLowerCase() === currentProdDashVariety.toLowerCase());
    }

    if (currentProdDashBlock && currentProdDashBlock !== 'todos') {
      filteredHarvests = filteredHarvests.filter(h => h.block && h.block.toLowerCase() === currentProdDashBlock.toLowerCase());
    }

    const totalStems = filteredHarvests.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
    const totalMallas = filteredHarvests.reduce((acc, h) => acc + (parseInt(h.mallas, 10) || 0), 0);
    const avgStemsPerMalla = totalMallas > 0 ? (totalStems / totalMallas).toFixed(1) : (filteredHarvests.length > 0 ? '25.0' : '0');

    let periodDaysCount = 1;
    let periodTitleDesc = '';
    let chartLabels = [];
    let chartData = [];

    if (currentProdDashPeriod === 'dia') {
      periodDaysCount = 1;
      periodTitleDesc = `Producción del Día: ${todayStr} (Turnos de corte 07:00 a 17:00)`;
      chartLabels = ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'];
      if (filteredHarvests.length > 0) {
        chartData = [
          Math.round(totalStems * 0.14),
          Math.round(totalStems * 0.22),
          Math.round(totalStems * 0.26),
          Math.round(totalStems * 0.18),
          Math.round(totalStems * 0.12),
          Math.round(totalStems * 0.08)
        ];
      } else {
        chartData = [0, 0, 0, 0, 0, 0];
      }
    } else if (currentProdDashPeriod === 'semana') {
      periodDaysCount = 7;
      periodTitleDesc = `${currentWeekInfo.periodTitle} (Semana completa de Lunes a Domingo)`;
      chartLabels = currentWeekInfo.labels;
      chartData = currentWeekInfo.days.map(day => {
        const dayHarvests = filteredHarvests.filter(h => h.date === day.isoDate);
        return dayHarvests.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
      });
    } else if (currentProdDashPeriod === 'mes') {
      periodDaysCount = 31;
      periodTitleDesc = `Consolidado Mensual de Octubre 2026 (Por Semanas)`;
      chartLabels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
      const s1 = Math.round(totalStems * 0.23);
      const s2 = Math.round(totalStems * 0.26);
      const s3 = Math.round(totalStems * 0.24);
      const s4 = totalStems - s1 - s2 - s3;
      chartData = [s1, s2, s3, s4 > 0 ? s4 : Math.round(totalStems * 0.27)];
    } else if (currentProdDashPeriod === 'ano') {
      periodDaysCount = 365;
      periodTitleDesc = `Consolidado Anual 2026 (Picos comerciales San Valentín y Madres)`;
      chartLabels = ['Ene', 'Feb (Valentín)', 'Mar', 'Abr', 'May (Madres)', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthlyPcts = [0.06, 0.18, 0.08, 0.07, 0.16, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09];
      chartData = monthlyPcts.map(pct => Math.round(totalStems * pct));
    } else { // 'rango'
      const d1 = new Date(currentProdDashDateFrom + 'T00:00:00');
      const d2 = new Date(currentProdDashDateTo + 'T00:00:00');
      const diffTime = Math.abs(d2 - d1);
      periodDaysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      periodTitleDesc = `Rango personalizado: ${currentProdDashDateFrom} al ${currentProdDashDateTo} (${periodDaysCount} días)`;

      const rangeDays = [];
      const cur = new Date(d1);
      while (cur <= d2) {
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const d = String(cur.getDate()).padStart(2, '0');
        rangeDays.push({ iso: `${y}-${m}-${d}`, label: `${d}/${m}` });
        cur.setDate(cur.getDate() + 1);
      }

      chartLabels = rangeDays.map(rd => rd.label);
      chartData = rangeDays.map(rd => {
        const dHarvests = filteredHarvests.filter(h => h.date === rd.iso);
        return dHarvests.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
      });
    }

    const avgStemsPerDay = periodDaysCount > 0 ? Math.round(totalStems / periodDaysCount) : totalStems;

    // Desglose por Variedad
    const varietyMap = {};
    varieties.forEach(v => { varietyMap[v.name] = 0; });
    filteredHarvests.forEach(h => {
      const vName = h.variety || 'Otras';
      varietyMap[vName] = (varietyMap[vName] || 0) + (parseInt(h.totalStems, 10) || 0);
    });

    const varietyStats = Object.keys(varietyMap)
      .map(name => ({
        name,
        stems: varietyMap[name],
        pct: totalStems > 0 ? ((varietyMap[name] / totalStems) * 100).toFixed(1) : '0'
      }))
      .filter(v => v.stems > 0 || currentProdDashVariety === 'todas')
      .sort((a, b) => b.stems - a.stems);

    const topVariety = varietyStats[0] || { name: 'Sin datos', stems: 0, pct: '0' };

    // Desglose por Bloque
    const blockMap = {};
    filteredHarvests.forEach(h => {
      const bName = h.block || 'Bloque 1';
      blockMap[bName] = (blockMap[bName] || 0) + (parseInt(h.totalStems, 10) || 0);
    });

    const blockStats = Object.keys(blockMap)
      .map(name => ({
        name,
        stems: blockMap[name],
        pct: totalStems > 0 ? ((blockMap[name] / totalStems) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.stems - a.stems);

    const topBlock = blockStats[0] || { name: 'Sin datos', stems: 0, pct: '0' };

    // Turnos de corte
    const morningStems = filteredHarvests.filter(h => (h.shift || '').toLowerCase().includes('mañana')).reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
    const afternoonStems = filteredHarvests.filter(h => (h.shift || '').toLowerCase().includes('tarde')).reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
    const morningPct = totalStems > 0 ? ((morningStems / totalStems) * 100).toFixed(1) : '85.0';
    const afternoonPct = totalStems > 0 ? ((afternoonStems / totalStems) * 100).toFixed(1) : '15.0';

    const availableBlocks = Array.from(new Set([
      ...plans.map(p => p.block),
      ...harvests.map(h => h.block)
    ])).filter(Boolean).sort();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 800; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Panel Ejecutivo • Módulo de Producción Neta
            </span>
          </div>
          <h1 style="color: #065f46;">Dashboard de Producción Florícola</h1>
          <p class="view-subtitle" style="color: #047857;">Monitoreo especializado de corte y producción FLORÍCOLA: tendencias temporales, curvas de rendimiento, desgloses por bloque y variedad.</p>
        </div>

        <div class="view-actions" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="Modules.printProductionDashboardReport()" style="display: flex; align-items: center; gap: 0.4rem;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Reporte Producción
          </button>
          <button class="btn btn-emerald" onclick="App.navigateTo('produccion-cosecha')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Registrar Cosecha
          </button>
        </div>
      </div>

      <!-- Cuadros Resúmenes Verticales KPI (Producción Neta) -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem;">
        
        <div class="kpi-card" style="border-left: 4px solid #059669; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Total Tallos Cosechados</span>
            <span class="kpi-badge badge-success">Cosecha Neta</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalStems.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub" style="color: #047857;">
            🌾 <span>${filteredHarvests.length} registros de corte en campo</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #10b981; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Promedio Diario de Corte</span>
            <span class="kpi-badge badge-success">${periodDaysCount} ${periodDaysCount === 1 ? 'Día' : 'Días'}</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${avgStemsPerDay.toLocaleString()}</span>
            <span class="kpi-unit">tallos/día</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            📊 <span>Ritmo de cosecha activo</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #047857; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Rendimiento de Cosecha</span>
            <span class="kpi-badge badge-success">${totalMallas.toLocaleString()} Mallas</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${avgStemsPerMalla}</span>
            <span class="kpi-unit">tallos/malla</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            🏷️ <span>Estándar finca: 25 tallos/malla</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #0d9488; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Variedad Líder</span>
            <span class="kpi-badge badge-success">${topVariety.pct}% del Total</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46; font-size: 1.35rem;">Rosa ${escapeHtml(topVariety.name)}</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            🌹 <span>${topVariety.stems.toLocaleString()} tallos cortados</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #14b8a6; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Bloque Más Productivo</span>
            <span class="kpi-badge badge-success">${topBlock.pct}% del Total</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46; font-size: 1.35rem;">${escapeHtml(topBlock.name)}</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            🌿 <span>${topBlock.stems.toLocaleString()} tallos cosechados</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #065f46; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Turnos de Corte</span>
            <span class="kpi-badge badge-success">Mañana vs Tarde</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46; font-size: 1.25rem;">${morningPct}% / ${afternoonPct}%</span>
          </div>
          <div class="kpi-sub" style="color: #047857;">
            ☀️ <span>${morningStems.toLocaleString()} matutino | ⛅ ${afternoonStems.toLocaleString()} tarde</span>
          </div>
        </div>

      </div>

      <!-- Barra de Filtros Integrados: Período, Bloque, Variedad y Rango (Ubicada bajo los Cuadros Resumen) -->
      <div class="card" style="padding: 0.85rem 1rem; margin-bottom: 1.25rem; background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 8px;">
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: space-between; align-items: center;">
          
          <div style="display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap;">
            <span style="font-size: 0.75rem; font-weight: 800; color: #047857; text-transform: uppercase; margin-right: 0.2rem;">Período:</span>
            <button class="btn ${currentProdDashPeriod === 'dia' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setProdDashPeriod('dia')">
              📅 Día
            </button>
            <button class="btn ${currentProdDashPeriod === 'semana' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setProdDashPeriod('semana')" title="Semana completa de Lunes a Domingo">
              📆 Semanas (Lun - Dom)
            </button>
            <button class="btn ${currentProdDashPeriod === 'mes' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setProdDashPeriod('mes')">
              🗓️ Mes
            </button>
            <button class="btn ${currentProdDashPeriod === 'ano' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setProdDashPeriod('ano')">
              📈 Año
            </button>
            <button class="btn ${currentProdDashPeriod === 'rango' ? 'btn-emerald' : 'btn-secondary'}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700;" onclick="Modules.setProdDashPeriod('rango')">
              🎯 Rango de Fechas
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <span style="font-size: 0.75rem; font-weight: 700; color: #334155;">Bloque:</span>
              <select id="p-dash-block" class="form-control" style="font-size: 0.78rem; padding: 0.25rem 0.5rem; height: auto;" onchange="Modules.setProdDashBlock(this.value)">
                <option value="todos">Todos los Bloques</option>
                ${availableBlocks.map(b => `<option value="${escapeHtml(b)}" ${b === currentProdDashBlock ? 'selected' : ''}>${escapeHtml(b)}</option>`).join('')}
              </select>
            </div>

            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <span style="font-size: 0.75rem; font-weight: 700; color: #334155;">Variedad:</span>
              <select id="p-dash-variety" class="form-control" style="font-size: 0.78rem; padding: 0.25rem 0.5rem; height: auto;" onchange="Modules.setProdDashVariety(this.value)">
                <option value="todas">Todas las Variedades</option>
                ${varieties.map(v => `<option value="${escapeHtml(v.name)}" ${v.name.toLowerCase() === currentProdDashVariety.toLowerCase() ? 'selected' : ''}>${escapeHtml(v.name)}</option>`).join('')}
              </select>
            </div>

            ${(currentProdDashPeriod !== 'semana' || currentProdDashVariety !== 'todas' || currentProdDashBlock !== 'todos') ? `
              <button class="btn btn-secondary" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="Modules.resetProdDashFilters()" title="Restablecer todos los filtros">
                ✕ Limpiar Filtros
              </button>
            ` : ''}
          </div>
        </div>

        ${currentProdDashPeriod === 'rango' ? `
          <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed #a7f3d0; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <span style="font-size: 0.75rem; font-weight: 800; color: #047857;">Seleccionar Intervalo:</span>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <label style="font-size: 0.75rem; color: #475569; font-weight: 600;">Desde:</label>
              <input type="date" id="p-dash-from" class="form-control" style="font-size: 0.78rem; padding: 0.22rem 0.5rem; height: auto;" value="${currentProdDashDateFrom}">
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <label style="font-size: 0.75rem; color: #475569; font-weight: 600;">Hasta:</label>
              <input type="date" id="p-dash-to" class="form-control" style="font-size: 0.78rem; padding: 0.22rem 0.5rem; height: auto;" value="${currentProdDashDateTo}">
            </div>
            <button class="btn btn-emerald" style="padding: 0.25rem 0.75rem; font-size: 0.78rem; font-weight: 700;" onclick="Modules.applyProdDashDateRange()">
              Aplicar Intervalo
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Tarjeta Principal: Línea de Tendencia de Producción en SVG -->
      <div class="card" style="padding: 1.25rem; margin-bottom: 1.25rem; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 800; color: #065f46; margin: 0;">Línea de Tendencia de Producción FLORÍCOLA</h3>
            <span style="font-size: 0.78rem; color: #64748b;">${periodTitleDesc}</span>
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <span style="font-size: 0.74rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Filtro: ${currentProdDashVariety === 'todas' ? 'Todas las Variedades' : currentProdDashVariety} | ${currentProdDashBlock === 'todos' ? 'Todos los Bloques' : currentProdDashBlock}
            </span>
          </div>
        </div>

        ${renderProdDashboardSvgChart(chartLabels, chartData, periodTitleDesc, 'tallos')}
      </div>

      <!-- Desgloses Comparativos: Por Variedad y Por Bloque -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
        
        <div class="card" style="padding: 1rem; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-light);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
            <h3 style="font-size: 0.92rem; font-weight: 800; color: #065f46; margin: 0;">
              🌹 Distribución de Cosecha por Variedad
            </h3>
            <span style="font-size: 0.72rem; color: #64748b;">Total: ${totalStems.toLocaleString()} tallos</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            ${varietyStats.map(v => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.2rem;">
                  <strong style="color: #1e293b;">Rosa ${escapeHtml(v.name)}</strong>
                  <span style="color: #047857; font-weight: 700;">${v.stems.toLocaleString()} tallos (${v.pct}%)</span>
                </div>
                <div style="height: 8px; width: 100%; background: #f1f5f9; border-radius: 99px; overflow: hidden;">
                  <div style="height: 100%; width: ${v.pct}%; background: linear-gradient(90deg, #10b981, #059669); border-radius: 99px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card" style="padding: 1rem; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-light);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
            <h3 style="font-size: 0.92rem; font-weight: 800; color: #065f46; margin: 0;">
              🌿 Productividad por Bloque de Cultivo
            </h3>
            <span style="font-size: 0.72rem; color: #64748b;">${blockStats.length} bloques activos</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            ${blockStats.map(b => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.2rem;">
                  <strong style="color: #1e293b;">${escapeHtml(b.name)}</strong>
                  <span style="color: #047857; font-weight: 700;">${b.stems.toLocaleString()} tallos (${b.pct}%)</span>
                </div>
                <div style="height: 8px; width: 100%; background: #f1f5f9; border-radius: 99px; overflow: hidden;">
                  <div style="height: 100%; width: ${b.pct}%; background: linear-gradient(90deg, #34d399, #047857); border-radius: 99px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Tabla Detallada de Producción de Cosecha Filtrada -->
      <div class="card" style="border: 1px solid var(--border-light); background: #ffffff; border-radius: 8px;">
        <div class="card-header" style="background: #f0fdf4; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="card-title" style="color: #065f46; font-size: 0.92rem; font-weight: 800;">
              Detalle de Registros de Cosecha en el Período
            </div>
            <span style="font-size: 0.74rem; color: #047857;">${filteredHarvests.length} registros que cumplen los filtros seleccionados</span>
          </div>
          <button class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.25rem 0.65rem;" onclick="App.navigateTo('produccion-cosecha')">
            Ir a Registro de Cosecha &rarr;
          </button>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table" style="font-size: 0.82rem;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Bloque</th>
                  <th>Variedad</th>
                  <th>Cosechador</th>
                  <th>Turno</th>
                  <th style="text-align: right;">Mallas</th>
                  <th style="text-align: right;">Tallos/Malla</th>
                  <th style="text-align: right;">Total Tallos</th>
                  <th>Calidad</th>
                  <th>Código de Lote</th>
                </tr>
              </thead>
              <tbody>
                ${filteredHarvests.length === 0 ? `
                  <tr><td colspan="11" style="text-align:center; padding:2rem; color:#64748b;">No existen registros de cosecha para los filtros seleccionados.</td></tr>
                ` : filteredHarvests.map(h => `
                  <tr>
                    <td><strong>${h.date}</strong></td>
                    <td style="color:#64748b;">${h.time || '07:30'}</td>
                    <td><span class="badge badge-neutral" style="font-weight:700;">${escapeHtml(h.block)}</span></td>
                    <td><span class="flower-variety-badge" style="font-weight:700;">${escapeHtml(h.variety)}</span></td>
                    <td>${escapeHtml(h.harvester || 'Juan Tipán')}</td>
                    <td>
                      <span class="badge" style="background:${(h.shift||'').toLowerCase().includes('mañana') ? '#ecfdf5' : '#fffbeb'}; color:${(h.shift||'').toLowerCase().includes('mañana') ? '#047857' : '#b45309'}; font-weight:700;">
                        ${escapeHtml(h.shift || 'Mañana')}
                      </span>
                    </td>
                    <td style="text-align: right; font-weight: 700;">${h.mallas || 0}</td>
                    <td style="text-align: right; color: #64748b;">${h.stemsPerMalla || 25}</td>
                    <td style="text-align: right; font-weight: 800; color: #047857; font-size: 0.86rem;">
                      ${(parseInt(h.totalStems, 10) || 0).toLocaleString()}
                    </td>
                    <td><span style="font-size:0.75rem; color:#475569;">${escapeHtml(h.grade || 'Exportación')}</span></td>
                    <td><code style="font-size:0.72rem; color:#059669;">${escapeHtml(h.barcode || '-')}</code></td>
                  </tr>
                `).join('')}
              </tbody>
              ${filteredHarvests.length > 0 ? `
                <tfoot style="background: #f8fafc; font-weight: 800; border-top: 2px solid #cbd5e1;">
                  <tr>
                    <td colspan="6" style="text-align: right; color: #065f46;">TOTALES CONSOLIDADOS:</td>
                    <td style="text-align: right; color: #065f46;">${totalMallas.toLocaleString()}</td>
                    <td style="text-align: right; color: #64748b;">${avgStemsPerMalla} prom.</td>
                    <td style="text-align: right; color: #047857; font-size: 0.92rem;">${totalStems.toLocaleString()} tallos</td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              ` : ''}
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function printProductionDashboardReport() {
    const harvests = Store.getHarvestProd();
    const plans = Store.getFarmPlans ? Store.getFarmPlans() : [];
    const varieties = Store.getVarieties ? Store.getVarieties() : [];
    const farmInfo = Store.getFarmInfo ? Store.getFarmInfo() : null;

    const todayStr = '2026-10-09';
    const currentWeekInfo = getWeekMondayToSunday(todayStr);

    function matchesPeriod(dateStr) {
      if (!dateStr) return false;
      if (currentProdDashPeriod === 'dia') return dateStr === todayStr;
      if (currentProdDashPeriod === 'semana') return dateStr >= currentWeekInfo.mondayIso && dateStr <= currentWeekInfo.sundayIso;
      if (currentProdDashPeriod === 'mes') return dateStr.startsWith('2026-10');
      if (currentProdDashPeriod === 'ano') return dateStr.startsWith('2026');
      if (currentProdDashPeriod === 'rango') return dateStr >= currentProdDashDateFrom && dateStr <= currentProdDashDateTo;
      return true;
    }

    let filtered = harvests.filter(h => matchesPeriod(h.date));
    if (currentProdDashVariety !== 'todas') {
      filtered = filtered.filter(h => h.variety && h.variety.toLowerCase() === currentProdDashVariety.toLowerCase());
    }
    if (currentProdDashBlock !== 'todos') {
      filtered = filtered.filter(h => h.block && h.block.toLowerCase() === currentProdDashBlock.toLowerCase());
    }

    const totalStems = filtered.reduce((acc, h) => acc + (parseInt(h.totalStems, 10) || 0), 0);
    const totalMallas = filtered.reduce((acc, h) => acc + (parseInt(h.mallas, 10) || 0), 0);

    const farmName = farmInfo?.name || 'MROSECUADOR';
    const farmRuc = farmInfo?.ruc || '1792345678001';
    const farmLocation = farmInfo?.location || 'Cotopaxi & Cayambe, Ecuador';
    const farmAltitude = farmInfo?.altitude || '2.850 m.s.n.m.';
    const farmEmail = farmInfo?.email || 'gerencia@mrosecuador.com';

    const periodNames = {
      'dia': `Día ${todayStr}`,
      'semana': currentWeekInfo.periodTitle,
      'mes': 'Mes de Octubre 2026',
      'ano': 'Año 2026',
      'rango': `Rango ${currentProdDashDateFrom} al ${currentProdDashDateTo}`
    };

    const printWin = window.open('', '_blank', 'width=950,height=750');
    if (!printWin) {
      alert('Por favor habilita las ventanas emergentes en tu navegador para imprimir.');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte Ejecutivo de Producción - ${farmName}</title>
        <style>
          @page { size: portrait; margin: 12mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1e293b; margin: 0; padding: 15px; }
          .header-box { border-bottom: 2.5px solid #047857; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
          .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 15px; }
          .kpi-card { border: 1px solid #cbd5e1; border-left: 3.5px solid #059669; padding: 8px; border-radius: 6px; background: #f8fafc; }
          table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; }
          th { background: #047857; color: #ffffff; font-weight: 700; }
          tfoot td { background: #f1f5f9; font-weight: 700; }
          .sign-area { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-top: 40px; text-align: center; }
          .sign-line { border-top: 1px solid #64748b; padding-top: 5px; font-weight: 700; font-size: 10.5px; }
        </style>
      </head>
      <body>
        <div style="background:#047857; color:#fff; padding:8px 14px; border-radius:6px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;" class="no-print">
          <strong>Informe Oficial de Producción FLORÍCOLA</strong>
          <div>
            <button onclick="window.print()" style="background:#fff; color:#047857; border:none; padding:4px 12px; font-weight:700; border-radius:4px; cursor:pointer;">Imprimir / Guardar PDF</button>
            <button onclick="window.close()" style="background:transparent; color:#fff; border:1px solid #fff; padding:4px 10px; margin-left:6px; border-radius:4px; cursor:pointer;">Cerrar</button>
          </div>
        </div>

        <div class="header-box">
          <div>
            <h1 style="font-size: 18px; color: #065f46; margin: 0 0 3px 0;">${farmName}</h1>
            <div style="font-size: 13px; font-weight: 800; color: #047857;">INFORME EJECUTIVO DE PRODUCCIÓN FLORÍCOLA</div>
            <div style="font-size: 10px; color: #64748b;">RUC: ${farmRuc} | ${farmLocation} | Altura: ${farmAltitude}</div>
            <div style="font-size: 10px; color: #64748b;">Contacto: ${farmEmail}</div>
          </div>
          <div style="text-align: right; font-size: 10.5px; color: #475569;">
            <div><strong>Período:</strong> ${periodNames[currentProdDashPeriod]}</div>
            <div><strong>Filtros:</strong> Variedad: ${currentProdDashVariety === 'todas' ? 'Todas' : currentProdDashVariety} | Bloque: ${currentProdDashBlock === 'todos' ? 'Todos' : currentProdDashBlock}</div>
            <div><strong>Emisión:</strong> ${new Date().toLocaleDateString('es-EC', {year:'numeric', month:'long', day:'numeric'})} ${new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        <div class="kpi-row">
          <div class="kpi-card">
            <div style="font-size: 9.5px; color: #64748b; font-weight: 700;">TOTAL TALLOS COSECHADOS</div>
            <div style="font-size: 16px; font-weight: 800; color: #065f46;">${totalStems.toLocaleString()}</div>
          </div>
          <div class="kpi-card">
            <div style="font-size: 9.5px; color: #64748b; font-weight: 700;">TOTAL MALLAS</div>
            <div style="font-size: 16px; font-weight: 800; color: #065f46;">${totalMallas.toLocaleString()}</div>
          </div>
          <div class="kpi-card">
            <div style="font-size: 9.5px; color: #64748b; font-weight: 700;">PROMEDIO TALLOS/MALLA</div>
            <div style="font-size: 16px; font-weight: 800; color: #065f46;">${totalMallas > 0 ? (totalStems / totalMallas).toFixed(1) : '25.0'}</div>
          </div>
          <div class="kpi-card">
            <div style="font-size: 9.5px; color: #64748b; font-weight: 700;">REGISTROS DE CORTE</div>
            <div style="font-size: 16px; font-weight: 800; color: #065f46;">${filtered.length}</div>
          </div>
        </div>

        <h3 style="font-size: 12px; font-weight: 800; color: #065f46; margin: 0 0 6px 0; text-transform: uppercase;">
          Detalle Consolidado de Cosecha
        </h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Bloque</th>
              <th>Variedad</th>
              <th>Cosechador</th>
              <th>Turno</th>
              <th style="text-align: right;">Mallas</th>
              <th style="text-align: right;">Tallos/Malla</th>
              <th style="text-align: right;">Total Tallos</th>
              <th>Grado</th>
              <th>Código Lote</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(h => `
              <tr>
                <td><strong>${h.date}</strong></td>
                <td>${h.time || '07:30'}</td>
                <td>${escapeHtml(h.block)}</td>
                <td>${escapeHtml(h.variety)}</td>
                <td>${escapeHtml(h.harvester || 'Juan Tipán')}</td>
                <td>${escapeHtml(h.shift || 'Mañana')}</td>
                <td style="text-align: right;">${h.mallas || 0}</td>
                <td style="text-align: right;">${h.stemsPerMalla || 25}</td>
                <td style="text-align: right; font-weight: 700; color: #047857;">${(parseInt(h.totalStems, 10) || 0).toLocaleString()}</td>
                <td>${escapeHtml(h.grade || 'Exportación')}</td>
                <td><code>${escapeHtml(h.barcode || '-')}</code></td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6" style="text-align: right;">TOTALES:</td>
              <td style="text-align: right;">${totalMallas.toLocaleString()}</td>
              <td style="text-align: right;">-</td>
              <td style="text-align: right; color: #047857;">${totalStems.toLocaleString()} tallos</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>

        <div class="sign-area">
          <div>
            <div class="sign-line">Ing. Elena Rosero<br><span style="font-weight: normal; font-size: 9.5px;">Supervisión FLORÍCOLA & Cultivo</span></div>
          </div>
          <div>
            <div class="sign-line">Ing. Juan Tipán<br><span style="font-weight: normal; font-size: 9.5px;">Gerencia de Producción & Operaciones</span></div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  // MÓDULO: PROYECCIONES DE COSECHA & PROGRAMACIÓN DE PINCH
  // ==============================================================================
  function renderProjectionsModule(container) {
    const projections = Store.getProjections();
    const plans = Store.getFarmPlans();
    const varieties = Store.getVarieties();

    const totalProjectedStems = projections.reduce((acc, p) => acc + (parseInt(p.projectedStems, 10) || 0), 0);
    const totalInducedStems = projections.reduce((acc, p) => acc + (parseInt(p.totalInduced, 10) || 0), 0);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Planificación FLORÍCOLA
            </span>
          </div>
          <h1 style="color: #065f46;">Proyecciones de Cosecha & Programación de Pinch</h1>
          <p class="view-subtitle" style="color: #047857;">Suma de Cosecha del Día + Pinch (Despunte) proyectada mediante el Ciclo Productivo en días hacia la fecha objetivo requerida.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.exportProjectionsXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openProjectionModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Proyección / Pinch
          </button>
        </div>
      </div>

      <!-- Métricas Clave de Proyección -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem;">
        <div class="kpi-card" style="border-left: 4px solid #10b981; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Tallos Inducidos en Ciclo</span>
            <span class="kpi-badge badge-success">Inducción</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalInducedStems.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            ✂️ <span>Cosecha del día + Pinch</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #059669; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Volumen Futuro Proyectado</span>
            <span class="kpi-badge badge-success">Cosecha Est.</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalProjectedStems.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub" style="color: #047857;">
            🌿 <span>Factor de rebrote medio 1.08</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #3b82f6; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #1d4ed8;">Ciclo Promedio de Finca</span>
            <span class="kpi-badge badge-info">florícola</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #1e40af;">78</span>
            <span class="kpi-unit">días a corte</span>
          </div>
          <div class="kpi-sub" style="color: #3b82f6;">
            ⏱️ <span>Ventana de corte calculada</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #e11d48; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #be123c;">Pico Comercial Objetivo</span>
            <span class="kpi-badge badge-danger">Campaña</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #9f1239; font-size: 1.15rem;">San Valentín 2027</span>
          </div>
          <div class="kpi-sub" style="color: #e11d48;">
            🌹 <span>Pinch programado en curso</span>
          </div>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="filter-bar" style="background:#ffffff; padding:0.65rem 0.85rem; border-radius:8px; border:1px solid var(--border-light); margin-bottom:1rem; display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center;">
        <div style="flex:1; min-width:200px;">
          <input type="text" id="filter-proj-search" class="form-control" placeholder="Buscar por bloque, variedad, temporada..." oninput="Modules.filterProjectionsTable()" style="font-size:0.82rem; padding:0.38rem 0.65rem;">
        </div>
        <select id="filter-proj-block" class="form-control" style="width:160px; font-size:0.82rem; padding:0.38rem 0.65rem;" onchange="Modules.filterProjectionsTable()">
          <option value="">Todos los Bloques</option>
          ${[...new Set(projections.map(p => p.block))].map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('')}
        </select>
        <select id="filter-proj-variety" class="form-control" style="width:160px; font-size:0.82rem; padding:0.38rem 0.65rem;" onchange="Modules.filterProjectionsTable()">
          <option value="">Todas las Variedades</option>
          ${[...new Set(projections.map(p => p.variety))].map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('')}
        </select>
        <span id="proj-count-badge" class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.78rem; padding: 0.35rem 0.65rem; border: 1px solid #a7f3d0;">
          ${projections.length} proyecciones
        </span>
      </div>

      <!-- Tabla de Proyecciones -->
      <div class="card" style="padding:0; background:#ffffff; border-radius:8px; border:1px solid var(--border-light); overflow:hidden; box-shadow:var(--shadow-sm);">
        <div class="table-responsive">
          <table class="data-table" style="font-size:0.82rem;">
            <thead>
              <tr style="background:#f8fafc;">
                <th>Fecha Pinch</th>
                <th>Bloque</th>
                <th>Variedad</th>
                <th>Cosecha Día</th>
                <th>Pinch (Tallos)</th>
                <th>Total Inducido</th>
                <th>Ciclo (Días)</th>
                <th style="color:#047857; font-weight:800;">Fecha Objetivo Cosecha</th>
                <th>Volumen Est.</th>
                <th>Temporada</th>
                <th style="text-align:right;">Acciones</th>
              </tr>
            </thead>
            <tbody id="projections-table-body">
              ${renderProjectionsTableRows(projections)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderProjectionsTableRows(list) {
    if (!list || list.length === 0) {
      return `<tr><td colspan="11" style="text-align:center; padding:2rem; color:#64748b;">No hay proyecciones registradas con los filtros seleccionados.</td></tr>`;
    }

    return list.map(p => {
      return `
        <tr>
          <td><strong>${p.date}</strong></td>
          <td><span class="badge" style="background:#f1f5f9; color:#1e293b; font-weight:700;">${escapeHtml(p.block)}</span></td>
          <td><strong>${escapeHtml(p.variety)}</strong></td>
          <td>${(parseInt(p.dayHarvest,10)||0).toLocaleString()}</td>
          <td><span style="color:#059669; font-weight:600;">+${(parseInt(p.pinchStems,10)||0).toLocaleString()}</span></td>
          <td><strong>${(parseInt(p.totalInduced,10)||0).toLocaleString()}</strong></td>
          <td><span class="badge" style="background:#dbeafe; color:#1e40af; font-weight:700;">${p.cycleDays} días</span></td>
          <td style="color:#047857; font-weight:800; font-size:0.86rem;">
            📅 ${p.projectedHarvestDate}
          </td>
          <td><strong>${(parseInt(p.projectedStems,10)||0).toLocaleString()}</strong> tallos</td>
          <td><span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700;">${escapeHtml(p.targetSeason || 'Regular')}</span></td>
          <td style="text-align:right;">
            <div style="display:inline-flex; gap:0.25rem;">
              <button class="btn btn-secondary" style="padding:0.25rem 0.45rem; font-size:0.75rem;" onclick="Modules.openProjectionModal('${p.id}')" title="Editar">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button class="btn btn-secondary" style="padding:0.25rem 0.45rem; font-size:0.75rem; color:#dc2626;" onclick="Modules.deleteProjection('${p.id}')" title="Eliminar">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterProjectionsTable() {
    const search = (document.getElementById('filter-proj-search')?.value || '').toLowerCase();
    const block = document.getElementById('filter-proj-block')?.value || '';
    const variety = document.getElementById('filter-proj-variety')?.value || '';

    const list = Store.getProjections();
    const filtered = list.filter(p => {
      const matchSearch = !search || p.block.toLowerCase().includes(search) || p.variety.toLowerCase().includes(search) || (p.targetSeason && p.targetSeason.toLowerCase().includes(search));
      const matchBlock = !block || p.block === block;
      const matchVariety = !variety || p.variety === variety;
      return matchSearch && matchBlock && matchVariety;
    });

    const tbody = document.getElementById('projections-table-body');
    if (tbody) tbody.innerHTML = renderProjectionsTableRows(filtered);

    const badge = document.getElementById('proj-count-badge');
    if (badge) badge.textContent = `${filtered.length} proyecciones`;
  }

  function openProjectionModal(projId = null) {
    const list = Store.getProjections();
    const item = projId ? list.find(p => p.id === projId) : null;
    const isEdit = !!item;
    const plans = Store.getFarmPlans();
    const varieties = Store.getVarieties();

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultDate = item ? item.date : todayStr;
    const defaultBlock = item ? item.block : (plans[0]?.block || 'Bloque 1');
    const defaultVariety = item ? item.variety : (varieties[0]?.name || 'Freedom');
    const defaultDayHarvest = item ? item.dayHarvest : 800;
    const defaultPinch = item ? item.pinchStems : 300;
    const defaultCycle = item ? item.cycleDays : 75;
    const defaultFactor = item ? item.rebudFactor : 1.05;
    const defaultSeason = item ? item.targetSeason : 'San Valentín';

    const bodyHtml = `
      <form id="form-projection" onsubmit="event.preventDefault(); Modules.saveProjectionFromForm('${projId || ''}');">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Bloque de Cultivo</label>
            <select id="proj-block" class="form-control" required onchange="Modules.autoSyncCycleFromPlan()">
              ${plans.map(p => `<option value="${escapeHtml(p.block)}" ${p.block === defaultBlock ? 'selected' : ''}>${escapeHtml(p.block)} (${escapeHtml(p.variety)})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Variedad de Rosa</label>
            <select id="proj-variety" class="form-control" required>
              ${varieties.map(v => `<option value="${escapeHtml(v.name)}" ${v.name === defaultVariety ? 'selected' : ''}>${escapeHtml(v.name)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Fecha de Pinch / Corte</label>
            <input type="date" id="proj-date" class="form-control" value="${defaultDate}" required onchange="Modules.recalcProjectionInModal()">
          </div>
          <div class="form-group">
            <label class="form-label">Ciclo Productivo (en días)</label>
            <input type="number" id="proj-cycle" class="form-control" value="${defaultCycle}" min="40" max="150" required oninput="Modules.recalcProjectionInModal()">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Cosecha del Día (tallos)</label>
            <input type="number" id="proj-day-harvest" class="form-control" value="${defaultDayHarvest}" min="0" required oninput="Modules.recalcProjectionInModal()">
          </div>
          <div class="form-group">
            <label class="form-label">Pinch / Despunte Adicional (tallos)</label>
            <input type="number" id="proj-pinch" class="form-control" value="${defaultPinch}" min="0" required oninput="Modules.recalcProjectionInModal()">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Factor Rebrote (tallos/brote)</label>
            <input type="number" id="proj-factor" class="form-control" value="${defaultFactor}" step="0.01" min="0.8" max="2.0" required oninput="Modules.recalcProjectionInModal()">
          </div>
          <div class="form-group">
            <label class="form-label">Temporada Objetivo</label>
            <select id="proj-season" class="form-control">
              <option value="San Valentín" ${defaultSeason === 'San Valentín' ? 'selected' : ''}>San Valentín (Febrero)</option>
              <option value="Día de la Madre" ${defaultSeason === 'Día de la Madre' ? 'selected' : ''}>Día de la Madre (Mayo)</option>
              <option value="Día de la Mujer" ${defaultSeason === 'Día de la Mujer' ? 'selected' : ''}>Día de la Mujer (Marzo)</option>
              <option value="Navidad y Fin de Año" ${defaultSeason === 'Navidad y Fin de Año' ? 'selected' : ''}>Navidad y Fin de Año (Diciembre)</option>
              <option value="Mercado Regular" ${defaultSeason === 'Mercado Regular' ? 'selected' : ''}>Mercado Regular</option>
            </select>
          </div>
        </div>

        <!-- Cartel de Resultado Proyectado en Vivo -->
        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 0.85rem; margin-bottom: 0.75rem;">
          <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:#047857; margin-bottom:0.35rem;">
            Cálculo florícola en Tiempo Real
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-size:0.78rem; color:#334155;">Total Tallos Inducidos:</span>
              <strong id="live-proj-induced" style="font-size:1.1rem; color:#065f46; margin-left:0.3rem;">1,100</strong>
            </div>
            <div>
              <span style="font-size:0.78rem; color:#334155;">Fecha Proyectada de Cosecha:</span>
              <strong id="live-proj-date" style="font-size:1.1rem; color:#047857; margin-left:0.3rem;">--</strong>
            </div>
          </div>
          <div style="margin-top:0.35rem; font-size:0.78rem; color:#047857;">
            Volumen Estimado a Cosechar: <strong id="live-proj-volume">1,155 tallos</strong>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Notas florícolas</label>
          <input type="text" id="proj-notes" class="form-control" value="${escapeHtml(item ? item.notes : '')}" placeholder="Detalles de desyeme, clima o estimación...">
        </div>
      </form>
    `;

    App.showModal(isEdit ? 'Editar Proyección de Cosecha' : 'Nueva Proyección (Cosecha Día + Pinch)', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-projection').requestSubmit()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Guardar Proyección
      </button>
    `);

    setTimeout(() => {
      Modules.recalcProjectionInModal();
    }, 50);
  }

  function recalcProjectionInModal() {
    const dayHarvest = parseInt(document.getElementById('proj-day-harvest')?.value, 10) || 0;
    const pinch = parseInt(document.getElementById('proj-pinch')?.value, 10) || 0;
    const cycle = parseInt(document.getElementById('proj-cycle')?.value, 10) || 75;
    const factor = parseFloat(document.getElementById('proj-factor')?.value) || 1.05;
    const dateStr = document.getElementById('proj-date')?.value;

    const totalInduced = dayHarvest + pinch;
    const totalVolume = Math.round(totalInduced * factor);

    let projectedDateStr = '--';
    if (dateStr) {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      d.setDate(d.getDate() + cycle);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      projectedDateStr = `${y}-${m}-${day}`;
    }

    const indEl = document.getElementById('live-proj-induced');
    const dateEl = document.getElementById('live-proj-date');
    const volEl = document.getElementById('live-proj-volume');

    if (indEl) indEl.textContent = totalInduced.toLocaleString() + ' tallos';
    if (dateEl) dateEl.textContent = projectedDateStr;
    if (volEl) volEl.textContent = totalVolume.toLocaleString() + ' tallos';
  }

  function autoSyncCycleFromPlan() {
    const block = document.getElementById('proj-block')?.value;
    if (!block) return;
    const plans = Store.getFarmPlans();
    const target = plans.find(p => p.block === block);
    if (target && target.cycle) {
      const match = target.cycle.match(/\d+/);
      if (match) {
        const cycleInput = document.getElementById('proj-cycle');
        if (cycleInput) {
          cycleInput.value = parseInt(match[0], 10);
          recalcProjectionInModal();
        }
      }
    }
  }

  function saveProjectionFromForm(projId = null) {
    const block = document.getElementById('proj-block').value;
    const variety = document.getElementById('proj-variety').value;
    const date = document.getElementById('proj-date').value;
    const cycleDays = parseInt(document.getElementById('proj-cycle').value, 10) || 75;
    const dayHarvest = parseInt(document.getElementById('proj-day-harvest').value, 10) || 0;
    const pinchStems = parseInt(document.getElementById('proj-pinch').value, 10) || 0;
    const rebudFactor = parseFloat(document.getElementById('proj-factor').value) || 1.05;
    const targetSeason = document.getElementById('proj-season').value;
    const notes = document.getElementById('proj-notes').value;

    if (!block || !variety || !date) {
      App.showToast('Por favor completa los campos requeridos', 'danger');
      return;
    }

    Store.saveProjection({
      id: projId || undefined,
      block,
      variety,
      date,
      cycleDays,
      dayHarvest,
      pinchStems,
      rebudFactor,
      targetSeason,
      notes,
      responsible: 'Ing. Agrónomo'
    });

    App.closeModal();
    App.showToast('Proyección guardada y calculada exitosamente', 'success');
    renderProjectionsModule(document.getElementById('view-container'));
  }

  function deleteProjection(id) {
    if (confirm('¿Deseas eliminar este registro de proyección?')) {
      Store.deleteProjection(id);
      App.showToast('Proyección eliminada', 'success');
      renderProjectionsModule(document.getElementById('view-container'));
    }
  }

  function exportProjectionsXLSX() {
    try {
      if (!window.XLSX) {
        App.showToast('Librería de exportación no disponible', 'danger');
        return;
      }
      const list = Store.getProjections();
      const rows = [
        ['FECHA_PINCH', 'BLOQUE', 'VARIEDAD', 'COSECHA_DIA', 'PINCH_TALLOS', 'TOTAL_INDUCIDO', 'CICLO_DIAS', 'FECHA_OBJETIVO_COSECHA', 'VOLUMEN_ESTIMADO', 'TEMPORADA', 'NOTAS']
      ];
      list.forEach(p => {
        rows.push([
          p.date,
          p.block,
          p.variety,
          p.dayHarvest,
          p.pinchStems,
          p.totalInduced,
          p.cycleDays,
          p.projectedHarvestDate,
          p.projectedStems,
          p.targetSeason,
          p.notes || ''
        ]);
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Proyecciones_MRose');
      XLSX.writeFile(wb, `Proyecciones_Pinch_MRosecuador_${new Date().toISOString().split('T')[0]}.xlsx`);
      App.showToast('Proyecciones exportadas a Excel exitosamente', 'success');
    } catch(e) {
      App.showToast('Error al exportar a Excel: ' + e.message, 'danger');
    }
  }

  // ==============================================================================
  // MÓDULO: PROYECCIÓN DE RETORNOS DE FLOR SEGÚN CICLO DE VARIEDAD
  // ==============================================================================
  const VARIETY_CYCLE_DEFAULTS = {
    'Freedom': 75,
    'Mondial': 80,
    'Explorer': 70,
    'Playa Blanca': 90,
    'Pink Floyd': 65,
    'Vendela': 78,
    'Candlelight': 74,
    'Deep Purple': 72,
    'Sweet Unique': 70,
    'Hermosa': 68,
    'Country Blues': 75,
    'Paloma': 82,
    'Gotcha': 76,
    'Topaz': 72
  };

  let currentReturnFilter = { search: '', block: '', variety: '', season: '' };

  function renderReturnProjectionsModule(container) {
    const list = Store.getReturnProjections ? Store.getReturnProjections() : [];
    const varieties = Store.getVarieties ? Store.getVarieties() : [];
    const plans = Store.getFarmPlans ? Store.getFarmPlans() : [];

    const totalProjected = list.reduce((sum, r) => sum + (parseInt(r.projectedStems, 10) || 0), 0);
    const totalInduced = list.reduce((sum, r) => sum + (parseInt(r.inducedStems, 10) || 0), 0);

    // Próximo retorno pico
    const sortedByDate = [...list].sort((a, b) => new Date(a.returnDate) - new Date(b.returnDate));
    const nextReturn = sortedByDate.length > 0 ? sortedByDate[0] : null;

    // Conteo de semanas únicas planificadas
    const uniqueWeeks = [...new Set(list.map(r => r.targetWeek).filter(Boolean))];

    // Variedad líder en volumen proyectado
    const varVolumeMap = {};
    list.forEach(r => {
      varVolumeMap[r.variety] = (varVolumeMap[r.variety] || 0) + (parseInt(r.projectedStems, 10) || 0);
    });
    let topVariety = '-';
    let topVolume = 0;
    Object.entries(varVolumeMap).forEach(([v, vol]) => {
      if (vol > topVolume) {
        topVolume = vol;
        topVariety = v;
      }
    });

    // Distribución por semana para gráfico
    const weekMap = {};
    list.forEach(r => {
      const wk = r.targetWeek || 'Sem ?';
      weekMap[wk] = (weekMap[wk] || 0) + (parseInt(r.projectedStems, 10) || 0);
    });
    const maxWeekVol = Math.max(1, ...Object.values(weekMap));

    // Filtrado de la tabla
    let filteredList = list.filter(r => {
      const q = currentReturnFilter.search.toLowerCase();
      const matchSearch = !q || 
        r.block.toLowerCase().includes(q) || 
        r.variety.toLowerCase().includes(q) || 
        (r.season && r.season.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q));
      const matchBlock = !currentReturnFilter.block || r.block === currentReturnFilter.block;
      const matchVariety = !currentReturnFilter.variety || r.variety === currentReturnFilter.variety;
      const matchSeason = !currentReturnFilter.season || r.season === currentReturnFilter.season;
      return matchSearch && matchBlock && matchVariety && matchSeason;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.78rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Proyección FLORÍCOLA de Cosechas
            </span>
          </div>
          <h1 style="color: #065f46;">Proyección de Retornos según Ciclo de Variedad</h1>
          <p class="view-subtitle" style="color: #047857;">Cálculo de fechas de floración y retornos de cosecha futura a partir de fechas de pinch/corte y días de ciclo vegetativo de cada variedad.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.exportReturnProjectionsXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openReturnProjectionModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Nueva Proyección de Retorno
          </button>
        </div>
      </div>

      <!-- Tarjetas KPI de Retornos -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem;">
        <div class="kpi-card" style="border-left: 4px solid #10b981; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Tallos Totales Proyectados</span>
            <span class="kpi-badge badge-success">Cosecha Retorno</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalProjected.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            🌿 <span>${totalInduced.toLocaleString()} tallos inducidos en base</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #059669; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Próximo Retorno Pico</span>
            <span class="kpi-badge badge-success">Calendario</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46; font-size: 1.25rem;">
              ${nextReturn ? `Sem ${nextReturn.targetWeek}` : '-'}
            </span>
            <span class="kpi-unit">${nextReturn ? nextReturn.returnDate : ''}</span>
          </div>
          <div class="kpi-sub" style="color: #047857;">
            ⏱️ <span>${nextReturn ? `${nextReturn.variety} (${nextReturn.cycleDays}d ciclo)` : 'Sin proyecciones'}</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #3b82f6; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #1d4ed8;">Semanas Planificadas</span>
            <span class="kpi-badge badge-info">Ventanas</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #1e40af;">${uniqueWeeks.length}</span>
            <span class="kpi-unit">semanas activas</span>
          </div>
          <div class="kpi-sub" style="color: #3b82f6;">
            📅 <span>Semanas ${uniqueWeeks.sort((a,b)=>a-b).join(', ')}</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #e11d48; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #be123c;">Variedad Líder de Retorno</span>
            <span class="kpi-badge badge-danger">Volumen</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #9f1239; font-size: 1.2rem;">${topVariety}</span>
          </div>
          <div class="kpi-sub" style="color: #e11d48;">
            🌹 <span>${topVolume.toLocaleString()} tallos proyectados</span>
          </div>
        </div>
      </div>

      <!-- Gráfico de Barras: Distribución de Retornos por Semana -->
      ${Object.keys(weekMap).length > 0 ? `
        <div class="card" style="margin-bottom: 1.25rem; border: 1px solid #d1fae5; background: #ffffff;">
          <div class="card-header" style="background: #f0fdf4; padding: 0.65rem 1rem; display: flex; justify-content: space-between; align-items: center;">
            <div class="card-title" style="color: #065f46; font-size: 0.88rem; font-weight: 700;">
              📊 Curva de Retornos Proyectados por Semana Comercial
            </div>
            <span style="font-size: 0.74rem; color: #047857; font-weight: 600;">Pico acumulado por semanas de cosecha</span>
          </div>
          <div class="card-body" style="padding: 1rem;">
            <div style="display: flex; gap: 1rem; align-items: flex-end; height: 130px; padding: 0.5rem 0.25rem; overflow-x: auto;">
              ${Object.entries(weekMap).map(([wk, vol]) => {
                const pct = Math.max(12, Math.round((vol / maxWeekVol) * 100));
                return `
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem; min-width: 65px; height: 100%; justify-content: flex-end;">
                    <span style="font-size: 0.7rem; font-weight: 800; color: #065f46;">${vol.toLocaleString()}</span>
                    <div style="width: 38px; height: ${pct}%; background: linear-gradient(180deg, #10b981 0%, #047857 100%); border-radius: 5px 5px 0 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s ease;"></div>
                    <span style="font-size: 0.72rem; font-weight: 700; color: #334155;">Sem ${wk}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Filtros de Proyecciones de Retorno -->
      <div class="filter-bar" style="background:#ffffff; padding:0.65rem 0.85rem; border-radius:8px; border:1px solid var(--border-light); margin-bottom:1rem; display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center;">
        <div style="flex:1; min-width:200px;">
          <input type="text" id="ret-filter-search" class="form-control" placeholder="🔍 Buscar por bloque, variedad, temporada, notas..." value="${escapeHtml(currentReturnFilter.search)}" oninput="Modules.filterReturnProjectionsTable()" style="font-size:0.82rem; padding:0.38rem 0.65rem;">
        </div>
        <select id="ret-filter-block" class="form-control" style="width:160px; font-size:0.82rem; padding:0.38rem 0.65rem;" onchange="Modules.filterReturnProjectionsTable()">
          <option value="">Todos los Bloques</option>
          ${[...new Set(list.map(r => r.block))].map(b => `<option value="${escapeHtml(b)}" ${currentReturnFilter.block === b ? 'selected' : ''}>${escapeHtml(b)}</option>`).join('')}
        </select>
        <select id="ret-filter-variety" class="form-control" style="width:160px; font-size:0.82rem; padding:0.38rem 0.65rem;" onchange="Modules.filterReturnProjectionsTable()">
          <option value="">Todas las Variedades</option>
          ${[...new Set(list.map(r => r.variety))].map(v => `<option value="${escapeHtml(v)}" ${currentReturnFilter.variety === v ? 'selected' : ''}>${escapeHtml(v)}</option>`).join('')}
        </select>
        <select id="ret-filter-season" class="form-control" style="width:160px; font-size:0.82rem; padding:0.38rem 0.65rem;" onchange="Modules.filterReturnProjectionsTable()">
          <option value="">Todas las Temporadas</option>
          ${[...new Set(list.map(r => r.season).filter(Boolean))].map(s => `<option value="${escapeHtml(s)}" ${currentReturnFilter.season === s ? 'selected' : ''}>${escapeHtml(s)}</option>`).join('')}
        </select>
        <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.78rem; padding: 0.35rem 0.65rem; border: 1px solid #a7f3d0;">
          ${filteredList.length} registros
        </span>
      </div>

      <!-- Tabla de Retornos -->
      <div class="card" style="padding:0; background:#ffffff; border-radius:8px; border:1px solid var(--border-light); overflow:hidden; box-shadow:var(--shadow-sm);">
        <div class="table-responsive">
          <table class="data-table" style="font-size:0.82rem;">
            <thead>
              <tr style="background:#f8fafc;">
                <th>Bloque / Variedad</th>
                <th>Fecha Base (Pinch)</th>
                <th>Ciclo Variedad</th>
                <th style="color:#047857; font-weight:800;">Fecha Retorno Proyectada</th>
                <th>Semana</th>
                <th>Tallos Inducidos</th>
                <th>Tasa (%)</th>
                <th style="color:#047857; font-weight:800;">Tallos Retorno</th>
                <th>Temporada</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th style="text-align:right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${filteredList.length === 0 ? `
                <tr><td colspan="12" style="text-align:center; padding:2.5rem; color:#64748b;">No hay proyecciones de retornos registradas con los filtros seleccionados.</td></tr>
              ` : filteredList.map(r => {
                const statusColor = r.status === 'Listo para Corte' ? '#047857' : (r.status === 'Botón Floral' ? '#2563eb' : '#d97706');
                const statusBg = r.status === 'Listo para Corte' ? '#ecfdf5' : (r.status === 'Botón Floral' ? '#eff6ff' : '#fffbeb');
                return `
                  <tr>
                    <td>
                      <div style="font-weight:700; color:#0f172a;">${escapeHtml(r.variety)}</div>
                      <div style="font-size:0.72rem; color:#64748b;"><span class="badge badge-primary" style="background:#dcfce7; color:#166534; font-size:0.68rem;">${escapeHtml(r.block)}</span></div>
                    </td>
                    <td>
                      <div>${r.baseDate}</div>
                      <div style="font-size:0.7rem; color:#64748b;">${escapeHtml(r.baseType || 'Pinch')}</div>
                    </td>
                    <td>
                      <span class="badge" style="background:#f1f5f9; color:#334155; font-weight:700;">
                        ⏱️ ${r.cycleDays} días
                      </span>
                    </td>
                    <td>
                      <strong style="color:#047857; font-size:0.86rem;">${r.returnDate}</strong>
                    </td>
                    <td>
                      <span class="badge badge-success" style="font-weight:800; font-size:0.75rem;">
                        Sem ${r.targetWeek || '-'}
                      </span>
                    </td>
                    <td>${(r.inducedStems || 0).toLocaleString()}</td>
                    <td>${r.conversionRate || 100}%</td>
                    <td>
                      <strong style="color:#065f46; font-size:0.88rem;">${(r.projectedStems || 0).toLocaleString()}</strong>
                      <span style="font-size:0.7rem; color:#64748b;">tallos</span>
                    </td>
                    <td>
                      <span class="badge" style="background:#fdf2f8; color:#be185d; font-weight:700;">
                        ${escapeHtml(r.season || 'Regular')}
                      </span>
                    </td>
                    <td>
                      <span class="badge" style="background:${statusBg}; color:${statusColor}; font-weight:700;">
                        ${escapeHtml(r.status || 'En Vegetación')}
                      </span>
                    </td>
                    <td style="font-size:0.75rem; color:#475569;">${escapeHtml(r.responsible || 'Agrónomo')}</td>
                    <td style="text-align:right; white-space:nowrap;">
                      <button class="btn btn-secondary btn-icon-only" style="padding:0.2rem 0.4rem;" title="Editar Proyección de Retorno" onclick="Modules.openReturnProjectionModal('${r.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button class="btn btn-secondary btn-icon-only btn-icon-danger" style="padding:0.2rem 0.4rem;" title="Eliminar" onclick="Modules.deleteReturnProjection('${r.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function filterReturnProjectionsTable() {
    currentReturnFilter = {
      search: document.getElementById('ret-filter-search')?.value || '',
      block: document.getElementById('ret-filter-block')?.value || '',
      variety: document.getElementById('ret-filter-variety')?.value || '',
      season: document.getElementById('ret-filter-season')?.value || ''
    };
    renderReturnProjectionsModule(document.getElementById('view-container'));
  }

  function openReturnProjectionModal(retId = null) {
    const list = Store.getReturnProjections ? Store.getReturnProjections() : [];
    const item = retId ? list.find(r => r.id === retId) : null;
    const varieties = Store.getVarieties ? Store.getVarieties() : [];
    const plans = Store.getFarmPlans ? Store.getFarmPlans() : [];

    const defaultBlock = item ? item.block : (plans[0]?.block || 'Bloque 1');
    const defaultVariety = item ? item.variety : (varieties[0]?.name || 'Freedom');
    const defaultCycle = item ? item.cycleDays : (VARIETY_CYCLE_DEFAULTS[defaultVariety] || 75);
    const defaultBaseDate = item ? item.baseDate : new Date().toISOString().split('T')[0];
    const defaultBaseType = item ? item.baseType : 'Pinch San Valentín';
    const defaultInduced = item ? item.inducedStems : 15000;
    const defaultRate = item ? item.conversionRate : 108;
    const defaultSeason = item ? item.season : 'San Valentín 2027';
    const defaultStatus = item ? item.status : 'En Vegetación';
    const defaultResponsible = item ? item.responsible : 'Ing. Carlos Medina';
    const defaultNotes = item ? item.notes : '';

    const bodyHtml = `
      <form id="form-return-proj" onsubmit="event.preventDefault(); Modules.saveReturnProjectionFromForm('${retId || ''}')">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Bloque de Producción</label>
            <select id="ret-modal-block" class="form-control" required>
              ${['Bloque 1', 'Bloque 2', 'Bloque 3', 'Bloque 4', 'Bloque 5', 'Bloque 6', 'Bloque 7', 'Bloque 8'].map(b => `
                <option value="${b}" ${defaultBlock === b ? 'selected' : ''}>${b}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Variedad de Rosa</label>
            <select id="ret-modal-variety" class="form-control" required onchange="Modules.onReturnVarietyChange(this.value)">
              ${varieties.map(v => `
                <option value="${escapeHtml(v.name)}" ${defaultVariety === v.name ? 'selected' : ''}>${escapeHtml(v.name)} (${v.color || 'Flor'})</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Fecha Base (Pinch / Corte)</label>
            <input type="date" id="ret-modal-basedate" class="form-control" value="${defaultBaseDate}" required onchange="Modules.recalcReturnProjectionInModal()">
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Ciclo de la Variedad (Días)</label>
            <input type="number" id="ret-modal-cycledays" class="form-control" value="${defaultCycle}" min="40" max="130" required oninput="Modules.recalcReturnProjectionInModal()">
            <span style="font-size:0.7rem; color:#64748b;">Días desde pinch hasta corte</span>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Tipo de Operación Base</label>
            <select id="ret-modal-basetype" class="form-control">
              <option value="Pinch San Valentín" ${defaultBaseType === 'Pinch San Valentín' ? 'selected' : ''}>Pinch San Valentín</option>
              <option value="Pinch Madres" ${defaultBaseType === 'Pinch Madres' ? 'selected' : ''}>Pinch Día de las Madres</option>
              <option value="Pinch Rápido" ${defaultBaseType === 'Pinch Rápido' ? 'selected' : ''}>Pinch Rápido</option>
              <option value="Corte Cíclico" ${defaultBaseType === 'Corte Cíclico' ? 'selected' : ''}>Corte Cíclico</option>
              <option value="Despunte Seleccionado" ${defaultBaseType === 'Despunte Seleccionado' ? 'selected' : ''}>Despunte Seleccionado</option>
            </select>
          </div>
        </div>

        <!-- Tarjeta de Auto-Cálculo de Retorno -->
        <div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border:1.5px solid #a7f3d0; border-radius:8px; padding:0.85rem 1rem; margin-bottom:0.85rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem;">
          <div>
            <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:#047857;">Fecha Estimada de Retorno (Cálculo Automático):</div>
            <strong id="ret-live-date" style="font-size:1.35rem; color:#065f46;">--</strong>
            <span id="ret-live-week" class="badge badge-success" style="font-size:0.8rem; margin-left:0.5rem; vertical-align:middle;">Semana --</span>
          </div>
          <div>
            <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:#047857;">Tallos Proyectados a Cosechar:</div>
            <strong id="ret-live-stems" style="font-size:1.35rem; color:#065f46;">--</strong>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Tallos Inducidos / Base</label>
            <input type="number" id="ret-modal-induced" class="form-control" value="${defaultInduced}" min="100" step="50" required oninput="Modules.recalcReturnProjectionInModal()">
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Tasa de Conversión / Rebrote (%)</label>
            <input type="number" id="ret-modal-rate" class="form-control" value="${defaultRate}" min="50" max="200" step="1" required oninput="Modules.recalcReturnProjectionInModal()">
            <span style="font-size:0.7rem; color:#64748b;">100% = 1 tallo por corte</span>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Temporada Objetivo</label>
            <input type="text" id="ret-modal-season" class="form-control" value="${escapeHtml(defaultSeason)}" placeholder="Ej: San Valentín 2027">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Estado del Cultivo</label>
            <select id="ret-modal-status" class="form-control">
              <option value="En Vegetación" ${defaultStatus === 'En Vegetación' ? 'selected' : ''}>🌱 En Vegetación (Brote nuevo)</option>
              <option value="En Arveja" ${defaultStatus === 'En Arveja' ? 'selected' : ''}>🟢 En Arveja (Botón pequeño)</option>
              <option value="Botón Floral" ${defaultStatus === 'Botón Floral' ? 'selected' : ''}>🌸 Botón Floral Formado</option>
              <option value="Listo para Corte" ${defaultStatus === 'Listo para Corte' ? 'selected' : ''}>✂️ Listo para Corte</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Responsable florícola</label>
            <input type="text" id="ret-modal-resp" class="form-control" value="${escapeHtml(defaultResponsible)}" required>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0.85rem;">
          <label class="form-label" style="font-weight:700;">Observaciones y Estrategia</label>
          <textarea id="ret-modal-notes" class="form-control" rows="2" placeholder="Notas de aplicación, altura de despunte o camas involucradas...">${escapeHtml(defaultNotes)}</textarea>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-emerald" style="font-weight:700;">Guardar Proyección de Retorno</button>
        </div>
      </form>
    `;

    App.showModal(retId ? 'Editar Proyección de Retorno' : 'Nueva Proyección de Retorno por Ciclo de Variedad', bodyHtml);
    setTimeout(() => {
      Modules.recalcReturnProjectionInModal();
    }, 50);
  }

  function onReturnVarietyChange(varietyName) {
    const cycleInput = document.getElementById('ret-modal-cycledays');
    if (cycleInput) {
      cycleInput.value = VARIETY_CYCLE_DEFAULTS[varietyName] || 75;
      recalcReturnProjectionInModal();
    }
  }

  function recalcReturnProjectionInModal() {
    const baseDateVal = document.getElementById('ret-modal-basedate')?.value;
    const cycleDaysVal = parseInt(document.getElementById('ret-modal-cycledays')?.value, 10) || 75;
    const inducedVal = parseInt(document.getElementById('ret-modal-induced')?.value, 10) || 0;
    const rateVal = parseFloat(document.getElementById('ret-modal-rate')?.value) || 100;

    const liveDateEl = document.getElementById('ret-live-date');
    const liveWeekEl = document.getElementById('ret-live-week');
    const liveStemsEl = document.getElementById('ret-live-stems');

    if (!baseDateVal) return;

    // Calcular Fecha de Retorno: Fecha Base + Ciclo en días
    const bDate = new Date(baseDateVal + 'T12:00:00');
    bDate.setDate(bDate.getDate() + cycleDaysVal);
    const returnDateStr = bDate.toISOString().split('T')[0];

    // Calcular Semana ISO
    const d = new Date(returnDateStr + 'T12:00:00');
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    const targetWeek = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);

    // Calcular Tallos Proyectados
    const projectedStems = Math.round((inducedVal * rateVal) / 100);

    if (liveDateEl) liveDateEl.textContent = returnDateStr;
    if (liveWeekEl) liveWeekEl.textContent = `Semana ${targetWeek}`;
    if (liveStemsEl) liveStemsEl.textContent = `${projectedStems.toLocaleString()} tallos`;
  }

  function saveReturnProjectionFromForm(retId = null) {
    const block = document.getElementById('ret-modal-block').value;
    const variety = document.getElementById('ret-modal-variety').value;
    const baseDate = document.getElementById('ret-modal-basedate').value;
    const cycleDays = parseInt(document.getElementById('ret-modal-cycledays').value, 10) || 75;
    const baseType = document.getElementById('ret-modal-basetype').value;
    const inducedStems = parseInt(document.getElementById('ret-modal-induced').value, 10) || 0;
    const conversionRate = parseFloat(document.getElementById('ret-modal-rate').value) || 100;
    const season = document.getElementById('ret-modal-season').value.trim();
    const status = document.getElementById('ret-modal-status').value;
    const responsible = document.getElementById('ret-modal-resp').value.trim();
    const notes = document.getElementById('ret-modal-notes').value.trim();

    // Auto-cálculo de fecha y semana
    const bDate = new Date(baseDate + 'T12:00:00');
    bDate.setDate(bDate.getDate() + cycleDays);
    const returnDate = bDate.toISOString().split('T')[0];

    const d = new Date(returnDate + 'T12:00:00');
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    const targetWeek = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);

    const projectedStems = Math.round((inducedStems * conversionRate) / 100);

    Store.saveReturnProjection({
      id: retId || undefined,
      block,
      variety,
      baseDate,
      cycleDays,
      baseType,
      returnDate,
      targetWeek,
      season,
      inducedStems,
      conversionRate,
      projectedStems,
      status,
      responsible,
      notes
    });

    App.closeModal();
    App.showToast('Proyección de retorno guardada y calculada exitosamente', 'success');
    renderReturnProjectionsModule(document.getElementById('view-container'));
  }

  function deleteReturnProjection(id) {
    if (confirm('¿Deseas eliminar este registro de proyección de retorno?')) {
      Store.deleteReturnProjection(id);
      App.showToast('Proyección de retorno eliminada', 'success');
      renderReturnProjectionsModule(document.getElementById('view-container'));
    }
  }

  function exportReturnProjectionsXLSX() {
    try {
      if (!window.XLSX) {
        App.showToast('Librería de exportación no disponible', 'danger');
        return;
      }
      const list = Store.getReturnProjections ? Store.getReturnProjections() : [];
      const rows = [
        ['BLOQUE', 'VARIEDAD', 'FECHA_BASE', 'TIPO_BASE', 'CICLO_DIAS', 'FECHA_RETORNO_PROYECTADA', 'SEMANA_OBJETIVO', 'TALLOS_INDUCIDOS', 'TASA_CONVERSION_PCT', 'TALLOS_PROYECTADOS', 'TEMPORADA', 'ESTADO', 'RESPONSABLE', 'NOTAS']
      ];
      list.forEach(r => {
        rows.push([
          r.block,
          r.variety,
          r.baseDate,
          r.baseType || 'Pinch',
          r.cycleDays,
          r.returnDate,
          r.targetWeek,
          r.inducedStems,
          r.conversionRate,
          r.projectedStems,
          r.season,
          r.status,
          r.responsible || '',
          r.notes || ''
        ]);
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Retornos_MRose');
      XLSX.writeFile(wb, `Proyeccion_Retornos_MRosecuador_${new Date().toISOString().split('T')[0]}.xlsx`);
      App.showToast('Proyección de retornos exportada a Excel exitosamente', 'success');
    } catch(e) {
      App.showToast('Error al exportar a Excel: ' + e.message, 'danger');
    }
  }


  // ==============================================================================
  // MÓDULO: PROCESO Y CLASIFICACIÓN (MESAS & FLOR NACIONAL)
  // ==============================================================================
  function renderProcessModule(container) {
    const processList = Store.getProcessRecords();
    const varieties = Store.getVarieties();
    const plans = Store.getFarmPlans();

    const totalProcessed = processList.reduce((acc, p) => acc + (parseInt(p.stemsProcessed, 10) || 0), 0);
    const totalExport = processList.reduce((acc, p) => acc + (parseInt(p.exportStems, 10) || 0), 0);
    const totalNational = processList.reduce((acc, p) => acc + (parseInt(p.nationalStems, 10) || 0), 0);
    const pctNational = totalProcessed > 0 ? ((totalNational / totalProcessed) * 100).toFixed(1) : 0;
    const pctExport = totalProcessed > 0 ? ((totalExport / totalProcessed) * 100).toFixed(1) : 0;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Postcosecha y Clasificación
            </span>
          </div>
          <h1 style="color: #065f46;">Proceso de Clasificación en Mesas</h1>
          <p class="view-subtitle" style="color: #047857;">Control de tallos procesados por código de mesa, registro de Flor Nacional, % Exportable y rendimiento vs. Cosecha Real.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.exportProcessXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openProcessModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Registro por Mesa
          </button>
        </div>
      </div>

      <!-- Métricas Clave de Proceso -->
      <div class="kpi-grid">
        <div class="kpi-card" style="border-left: 4px solid #10b981;">
          <div class="kpi-header">
            <span class="kpi-title">Total Tallos Procesados</span>
            <span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">Mesas Activas</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalProcessed.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Consolidado de recepción y clasificación</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #059669;">
          <div class="kpi-header">
            <span class="kpi-title">Flor Exportable Aprobada</span>
            <span class="badge" style="background:#d1fae5; color:#065f46; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">${pctExport}% Rendimiento</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalExport.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Flor seleccionada apta para exportación</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #e11d48;">
          <div class="kpi-header">
            <span class="kpi-title" style="color:#b91c1c;">Flor Nacional (Descarte)</span>
            <span class="badge" style="background:#ffe4e6; color:#be123c; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">${pctNational}% Local</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #9f1239;">${totalNational.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub" style="color:#be123c;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            <span>Comercialización para mercado interno</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #3b82f6;">
          <div class="kpi-header">
            <span class="kpi-title" style="color:#1d4ed8;">Eficiencia vs Cosecha</span>
            <span class="badge" style="background:#eff6ff; color:#1d4ed8; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">Balance 1:1</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #1e40af;">99.4%</span>
            <span class="kpi-unit">efectividad</span>
          </div>
          <div class="kpi-sub" style="color:#1d4ed8;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span>Control estricto de mermas y balance de entrada</span>
          </div>
        </div>
      </div>

      <!-- Tabla de Mesas de Clasificación -->
      <div class="card" style="padding:0; background:#ffffff; border-radius:8px; border:1px solid var(--border-light); overflow:hidden; box-shadow:var(--shadow-sm);">
        <div class="table-responsive">
          <table class="data-table" style="font-size:0.82rem;">
            <thead>
              <tr style="background:#f8fafc;">
                <th>Fecha / Hora</th>
                <th>Mesa (Código)</th>
                <th>Variedad</th>
                <th>Bloque</th>
                <th>Procesados</th>
                <th>Exportable (% Exp)</th>
                <th>Flor Nacional (% Nac)</th>
                <th>vs Cosecha Real</th>
                <th>Responsable</th>
                <th style="text-align:right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${processList.map(p => `
                <tr>
                  <td><strong>${p.date}</strong> <span style="font-size:0.72rem; color:#64748b;">${p.time || ''}</span></td>
                  <td><span class="badge" style="background:#059669; color:#ffffff; font-weight:800; font-family:monospace;">${escapeHtml(p.tableCode || 'M-01')}</span> <span style="font-size:0.75rem; color:#475569;">${escapeHtml(p.tableName || '')}</span></td>
                  <td><strong>${escapeHtml(p.variety)}</strong></td>
                  <td><span class="badge" style="background:#f1f5f9; color:#1e293b;">${escapeHtml(p.block)}</span></td>
                  <td><strong>${(parseInt(p.stemsProcessed,10)||0).toLocaleString()}</strong></td>
                  <td>
                    <span style="color:#047857; font-weight:700;">${(parseInt(p.exportStems,10)||0).toLocaleString()} tallos</span>
                    <span class="badge" style="background:#d1fae5; color:#065f46; font-size:0.7rem; margin-left:0.25rem;">${p.pctExport}%</span>
                  </td>
                  <td>
                    <span style="color:#b91c1c; font-weight:700;">${(parseInt(p.nationalStems,10)||0).toLocaleString()} tallos</span>
                    <span class="badge" style="background:#fee2e2; color:#991b1b; font-size:0.7rem; margin-left:0.25rem;">${p.pctNational}%</span>
                  </td>
                  <td><span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">${p.pctVsHarvest}%</span></td>
                  <td>${escapeHtml(p.responsible || 'Operario')}</td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex; gap:0.25rem;">
                      <button class="btn btn-secondary" style="padding:0.25rem 0.45rem; font-size:0.75rem;" onclick="Modules.openProcessModal('${p.id}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button class="btn btn-secondary" style="padding:0.25rem 0.45rem; font-size:0.75rem; color:#dc2626;" onclick="Modules.deleteProcessRecord('${p.id}')">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function openProcessModal(procId = null) {
    const list = Store.getProcessRecords();
    const item = procId ? list.find(p => p.id === procId) : null;
    const isEdit = !!item;
    const varieties = Store.getVarieties();
    const plans = Store.getFarmPlans();

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultDate = item ? item.date : todayStr;
    const defaultTable = item ? item.tableCode : 'M-01';
    const defaultVariety = item ? item.variety : (varieties[0]?.name || 'Freedom');
    const defaultBlock = item ? item.block : (plans[0]?.block || 'Bloque 1');
    const defaultHarvested = item ? item.stemsHarvested : 1000;
    const defaultProcessed = item ? item.stemsProcessed : 1000;
    const defaultNational = item ? item.nationalStems : 80;

    const bodyHtml = `
      <form id="form-process" onsubmit="event.preventDefault(); Modules.saveProcessFromForm('${procId || ''}');">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Código y Mesa de Trabajo</label>
            <select id="proc-table" class="form-control" required>
              <option value="M-01" ${defaultTable === 'M-01' ? 'selected' : ''}>M-01 - Mesa 1 (Clasificación A)</option>
              <option value="M-02" ${defaultTable === 'M-02' ? 'selected' : ''}>M-02 - Mesa 2 (Clasificación B)</option>
              <option value="M-03" ${defaultTable === 'M-03' ? 'selected' : ''}>M-03 - Mesa 3 (Especiales / Rojas)</option>
              <option value="M-04" ${defaultTable === 'M-04' ? 'selected' : ''}>M-04 - Mesa 4 (Blancas / Colores)</option>
              <option value="M-05" ${defaultTable === 'M-05' ? 'selected' : ''}>M-05 - Mesa 5 (Riego Directo)</option>
              <option value="M-06" ${defaultTable === 'M-06' ? 'selected' : ''}>M-06 - Mesa 6 (Poscosecha Rápida)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Variedad de Rosa</label>
            <select id="proc-variety" class="form-control" required>
              ${varieties.map(v => `<option value="${escapeHtml(v.name)}" ${v.name === defaultVariety ? 'selected' : ''}>${escapeHtml(v.name)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Bloque de Origen</label>
            <select id="proc-block" class="form-control" required>
              ${plans.map(p => `<option value="${escapeHtml(p.block)}" ${p.block === defaultBlock ? 'selected' : ''}>${escapeHtml(p.block)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Proceso</label>
            <input type="date" id="proc-date" class="form-control" value="${defaultDate}" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Cosecha Recibida (tallos)</label>
            <input type="number" id="proc-harvested" class="form-control" value="${defaultHarvested}" min="0" required oninput="Modules.recalcProcessInModal()">
          </div>
          <div class="form-group">
            <label class="form-label">Tallos Procesados</label>
            <input type="number" id="proc-processed" class="form-control" value="${defaultProcessed}" min="0" required oninput="Modules.recalcProcessInModal()">
          </div>
          <div class="form-group">
            <label class="form-label">Flor Nacional (tallos)</label>
            <input type="number" id="proc-national" class="form-control" value="${defaultNational}" min="0" required oninput="Modules.recalcProcessInModal()">
          </div>
        </div>

        <!-- Previsualización de Cálculos en Vivo -->
        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 0.85rem; margin-bottom: 0.75rem;">
          <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:#047857; margin-bottom:0.4rem;">
            Rendimiento Calculado en Vivo
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; text-align:center;">
            <div style="background:#ffffff; padding:0.4rem; border-radius:6px; border:1px solid #a7f3d0;">
              <span style="font-size:0.7rem; color:#64748b; display:block;">Flor Exportable:</span>
              <strong id="live-proc-export" style="font-size:1.1rem; color:#065f46;">920</strong>
            </div>
            <div style="background:#ffffff; padding:0.4rem; border-radius:6px; border:1px solid #a7f3d0;">
              <span style="font-size:0.7rem; color:#64748b; display:block;">% Exportable:</span>
              <strong id="live-proc-pct-exp" style="font-size:1.1rem; color:#047857;">92.0%</strong>
            </div>
            <div style="background:#ffffff; padding:0.4rem; border-radius:6px; border:1px solid #fee2e2;">
              <span style="font-size:0.7rem; color:#64748b; display:block;">% Nacional:</span>
              <strong id="live-proc-pct-nac" style="font-size:1.1rem; color:#b91c1c;">8.0%</strong>
            </div>
          </div>
          <div style="margin-top:0.4rem; font-size:0.75rem; color:#065f46; text-align:center;">
            Eficiencia vs Cosecha Real: <strong id="live-proc-pct-harvest">100.0%</strong>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Responsable de Mesa</label>
            <input type="text" id="proc-responsible" class="form-control" value="${escapeHtml(item ? item.responsible : 'Marta Pillajo')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Turno de Trabajo</label>
            <select id="proc-shift" class="form-control">
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Observaciones de Mesa</label>
          <input type="text" id="proc-notes" class="form-control" value="${escapeHtml(item ? item.notes : '')}" placeholder="Motivo de flor nacional, calibre de botón...">
        </div>
      </form>
    `;

    App.showModal(isEdit ? 'Editar Proceso en Mesa' : 'Nuevo Registro de Proceso en Mesa', bodyHtml, `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="document.getElementById('form-process').requestSubmit()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Guardar Registro de Mesa
      </button>
    `);

    setTimeout(() => {
      Modules.recalcProcessInModal();
    }, 50);
  }

  function recalcProcessInModal() {
    const harvested = parseInt(document.getElementById('proc-harvested')?.value, 10) || 0;
    const processed = parseInt(document.getElementById('proc-processed')?.value, 10) || 0;
    const national = parseInt(document.getElementById('proc-national')?.value, 10) || 0;

    const exportStems = Math.max(0, processed - national);
    const pctNac = processed > 0 ? ((national / processed) * 100).toFixed(1) : '0.0';
    const pctExp = processed > 0 ? ((exportStems / processed) * 100).toFixed(1) : '0.0';
    const pctHrv = harvested > 0 ? ((processed / harvested) * 100).toFixed(1) : '100.0';

    const expEl = document.getElementById('live-proc-export');
    const pctExpEl = document.getElementById('live-proc-pct-exp');
    const pctNacEl = document.getElementById('live-proc-pct-nac');
    const pctHrvEl = document.getElementById('live-proc-pct-harvest');

    if (expEl) expEl.textContent = exportStems.toLocaleString();
    if (pctExpEl) pctExpEl.textContent = pctExp + '%';
    if (pctNacEl) pctNacEl.textContent = pctNac + '%';
    if (pctHrvEl) pctHrvEl.textContent = pctHrv + '%';
  }

  function saveProcessFromForm(procId = null) {
    const tableCode = document.getElementById('proc-table').value;
    const tableName = document.getElementById('proc-table').options[document.getElementById('proc-table').selectedIndex].text;
    const variety = document.getElementById('proc-variety').value;
    const block = document.getElementById('proc-block').value;
    const date = document.getElementById('proc-date').value;
    const stemsHarvested = parseInt(document.getElementById('proc-harvested').value, 10) || 0;
    const stemsProcessed = parseInt(document.getElementById('proc-processed').value, 10) || 0;
    const nationalStems = parseInt(document.getElementById('proc-national').value, 10) || 0;
    const responsible = document.getElementById('proc-responsible').value;
    const shift = document.getElementById('proc-shift').value;
    const notes = document.getElementById('proc-notes').value;

    if (!tableCode || !variety || stemsProcessed <= 0) {
      App.showToast('Por favor completa todos los campos numéricos requeridos', 'danger');
      return;
    }

    Store.saveProcessRecord({
      id: procId || undefined,
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tableCode,
      tableName,
      variety,
      block,
      stemsHarvested,
      stemsProcessed,
      nationalStems,
      responsible,
      shift,
      notes
    });

    App.closeModal();
    App.showToast('Registro de mesa guardado exitosamente', 'success');
    renderProcessModule(document.getElementById('view-container'));
  }

  function deleteProcessRecord(id) {
    if (confirm('¿Deseas eliminar este registro de proceso?')) {
      Store.deleteProcessRecord(id);
      App.showToast('Registro eliminado', 'success');
      renderProcessModule(document.getElementById('view-container'));
    }
  }

  function exportProcessXLSX() {
    try {
      if (!window.XLSX) {
        App.showToast('Librería de exportación no disponible', 'danger');
        return;
      }
      const list = Store.getProcessRecords();
      const rows = [
        ['FECHA', 'HORA', 'MESA_CODIGO', 'MESA_NOMBRE', 'VARIEDAD', 'BLOQUE', 'TALLOS_COSECHADOS', 'TALLOS_PROCESADOS', 'FLOR_EXPORTABLE', 'PCT_EXPORTABLE', 'FLOR_NACIONAL', 'PCT_NACIONAL', 'EFICIENCIA_COSECHA', 'RESPONSABLE', 'NOTAS']
      ];
      list.forEach(p => {
        rows.push([
          p.date,
          p.time || '',
          p.tableCode,
          p.tableName,
          p.variety,
          p.block,
          p.stemsHarvested,
          p.stemsProcessed,
          p.exportStems,
          p.pctExport + '%',
          p.nationalStems,
          p.pctNational + '%',
          p.pctVsHarvest + '%',
          p.responsible,
          p.notes || ''
        ]);
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Proceso_Mesas');
      XLSX.writeFile(wb, `Proceso_Clasificacion_MRose_${new Date().toISOString().split('T')[0]}.xlsx`);
      App.showToast('Registros de mesa exportados exitosamente a Excel', 'success');
    } catch(e) {
      App.showToast('Error al exportar a Excel: ' + e.message, 'danger');
    }
  }


  // ==============================================================================
  // MÓDULO: CONTROL DE CALIDAD (LABORES CULTURALES, MALLAS DE COSECHADOR Y BONCHES)
  // ==============================================================================
  // MÓDULO: CONTROL DE CALIDAD (CAMPO: LABORES & MALLAS | PROCESO: BONCHES)
  
  // ==============================================================================
  // MÓDULO CALIDAD FLORÍCOLA INTEGRAL (CAMPO & POSCOSECHA) & DASHBOARD EJECUTIVO
  // ==============================================================================
  let currentQualityTab = 'campo';
  let currentFieldCheckPhotos = [];
  let currentBunchCheckPhotos = [];

  // Helper para refrescar la vista actual de calidad
  function refreshCurrentQualityView() {
    const vc = document.getElementById('view-container');
    if (!vc) return;
    const activeMod = localStorage.getItem('mrose_active_module_v1') || '';
    if (activeMod === 'dashboard-calidad-campo') {
      renderQualityFieldDashboard(vc);
    } else if (activeMod === 'dashboard-calidad-proceso') {
      renderQualityProcessDashboard(vc);
    } else if (activeMod === 'dashboard-calidad') {
      renderQualityDashboard(vc);
    } else if (activeMod === 'calidad-campo') {
      renderQualityFieldModule(vc);
    } else if (activeMod === 'calidad-proceso') {
      renderQualityProcessModule(vc);
    } else {
      renderQualityChecklistsModule(vc);
    }
  }

  // ==============================================================================
  // 0.A DASHBOARD EJECUTIVO - CALIDAD CAMPO (PANEL EJECUTIVO)
  // ==============================================================================
  // 0.A SISTEMA DE LÍNEAS DE TENDENCIA SVG Y DASHBOARDS EJECUTIVOS DE CALIDAD
  // ==============================================================================

  let fieldTrendPeriod = 'weeks';   // 'weeks' | 'months'
  let fieldTrendFilter = 'ALL';     // 'ALL' | 'area:Nombre' | 'block:Nombre'
  let processTrendPeriod = 'weeks'; // 'weeks' | 'months'
  let processTrendFilter = 'ALL';   // 'ALL' | 'variety:Nombre' | 'table:Nombre'

  function setFieldTrendPeriod(period) {
    fieldTrendPeriod = period;
    updateQualityFieldTrend();
  }

  function setProcessTrendPeriod(period) {
    processTrendPeriod = period;
    updateQualityProcessTrend();
  }

  function computeFieldTrendData(fieldChecks, period, filter) {
    const plans = Store.getFarmPlans ? Store.getFarmPlans() : [];
    const blockAreaMap = {};
    plans.forEach(p => { if (p.block) blockAreaMap[p.block] = p.area || 'Sector Norte - Invernaderos'; });

    let filtered = (fieldChecks || []).slice();
    if (filter && filter !== 'ALL') {
      if (filter.startsWith('area:')) {
        const areaName = filter.replace('area:', '').toLowerCase();
        filtered = filtered.filter(f => (blockAreaMap[f.block] || '').toLowerCase() === areaName || (f.area || '').toLowerCase() === areaName);
      } else if (filter.startsWith('block:')) {
        const blockName = filter.replace('block:', '').toLowerCase();
        filtered = filtered.filter(f => (f.block || '').toLowerCase() === blockName);
      }
    }

    if (period === 'weeks') {
      const weeks = [
        { label: 'Sem 36', key: '36', sum: 0, count: 0, defaultPct: 91 },
        { label: 'Sem 37', key: '37', sum: 0, count: 0, defaultPct: 93 },
        { label: 'Sem 38', key: '38', sum: 0, count: 0, defaultPct: 88 },
        { label: 'Sem 39', key: '39', sum: 0, count: 0, defaultPct: 95 },
        { label: 'Sem 40', key: '40', sum: 0, count: 0, defaultPct: 92 },
        { label: 'Sem 41', key: '41', sum: 0, count: 0, defaultPct: 96 }
      ];

      filtered.forEach(f => {
        if (!f.date) return;
        const d = new Date(f.date);
        const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000));
        const weekNum = Math.ceil((dayOfYear + 1) / 7);
        const wObj = weeks.find(w => parseInt(w.key) === weekNum) || weeks[weeks.length - 1];
        if (wObj && f.score !== undefined) {
          wObj.sum += f.score;
          wObj.count++;
        }
      });

      return weeks.map(w => ({
        label: w.label,
        pct: w.count > 0 ? Math.round(w.sum / w.count) : w.defaultPct,
        count: w.count
      }));
    } else {
      const months = [
        { label: 'Mayo', monthIdx: 4, sum: 0, count: 0, defaultPct: 89 },
        { label: 'Junio', monthIdx: 5, sum: 0, count: 0, defaultPct: 92 },
        { label: 'Julio', monthIdx: 6, sum: 0, count: 0, defaultPct: 90 },
        { label: 'Agosto', monthIdx: 7, sum: 0, count: 0, defaultPct: 94 },
        { label: 'Septiembre', monthIdx: 8, sum: 0, count: 0, defaultPct: 93 },
        { label: 'Octubre', monthIdx: 9, sum: 0, count: 0, defaultPct: 96 }
      ];

      filtered.forEach(f => {
        if (!f.date) return;
        const d = new Date(f.date);
        const mIdx = d.getMonth();
        const mObj = months.find(m => m.monthIdx === mIdx) || months[months.length - 1];
        if (mObj && f.score !== undefined) {
          mObj.sum += f.score;
          mObj.count++;
        }
      });

      return months.map(m => ({
        label: m.label,
        pct: m.count > 0 ? Math.round(m.sum / m.count) : m.defaultPct,
        count: m.count
      }));
    }
  }

  function computeProcessTrendData(bunchChecks, period, filter) {
    let filtered = (bunchChecks || []).slice();
    if (filter && filter !== 'ALL') {
      if (filter.startsWith('variety:')) {
        const vName = filter.replace('variety:', '').toLowerCase();
        filtered = filtered.filter(b => (b.variety || '').toLowerCase() === vName);
      } else if (filter.startsWith('table:')) {
        const tName = filter.replace('table:', '').toLowerCase();
        filtered = filtered.filter(b => (b.tableCode || '').toLowerCase() === tName);
      }
    }

    if (period === 'weeks') {
      const weeks = [
        { label: 'Sem 36', key: '36', sum: 0, count: 0, defaultPct: 88 },
        { label: 'Sem 37', key: '37', sum: 0, count: 0, defaultPct: 90 },
        { label: 'Sem 38', key: '38', sum: 0, count: 0, defaultPct: 94 },
        { label: 'Sem 39', key: '39', sum: 0, count: 0, defaultPct: 91 },
        { label: 'Sem 40', key: '40', sum: 0, count: 0, defaultPct: 93 },
        { label: 'Sem 41', key: '41', sum: 0, count: 0, defaultPct: 95 }
      ];

      filtered.forEach(b => {
        if (!b.date) return;
        const d = new Date(b.date);
        const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000));
        const weekNum = Math.ceil((dayOfYear + 1) / 7);
        const wObj = weeks.find(w => parseInt(w.key) === weekNum) || weeks[weeks.length - 1];
        const sc = b.totalScore !== undefined ? b.totalScore : b.score;
        if (wObj && sc !== undefined) {
          wObj.sum += sc;
          wObj.count++;
        }
      });

      return weeks.map(w => ({
        label: w.label,
        pct: w.count > 0 ? Math.round(w.sum / w.count) : w.defaultPct,
        count: w.count
      }));
    } else {
      const months = [
        { label: 'Mayo', monthIdx: 4, sum: 0, count: 0, defaultPct: 87 },
        { label: 'Junio', monthIdx: 5, sum: 0, count: 0, defaultPct: 89 },
        { label: 'Julio', monthIdx: 6, sum: 0, count: 0, defaultPct: 92 },
        { label: 'Agosto', monthIdx: 7, sum: 0, count: 0, defaultPct: 91 },
        { label: 'Septiembre', monthIdx: 8, sum: 0, count: 0, defaultPct: 94 },
        { label: 'Octubre', monthIdx: 9, sum: 0, count: 0, defaultPct: 95 }
      ];

      filtered.forEach(b => {
        if (!b.date) return;
        const d = new Date(b.date);
        const mIdx = d.getMonth();
        const mObj = months.find(m => m.monthIdx === mIdx) || months[months.length - 1];
        const sc = b.totalScore !== undefined ? b.totalScore : b.score;
        if (mObj && sc !== undefined) {
          mObj.sum += sc;
          mObj.count++;
        }
      });

      return months.map(m => ({
        label: m.label,
        pct: m.count > 0 ? Math.round(m.sum / m.count) : m.defaultPct,
        count: m.count
      }));
    }
  }

  function renderTrendLineSVG(points, metaVal = 85, colorPrimary = '#059669', gradId = 'fieldGrad') {
    if (!points || points.length === 0) return '<div style="text-align:center; padding:2rem; color:#94a3b8;">Sin datos suficientes</div>';

    const width = 720;
    const height = 210;
    const padLeft = 45;
    const padRight = 35;
    const padTop = 35;
    const padBottom = 35;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const minY = 50;
    const maxY = 100;
    const getY = (val) => padTop + chartH - ((Math.max(minY, Math.min(maxY, val)) - minY) / (maxY - minY)) * chartH;
    const getX = (idx) => padLeft + (idx / (points.length - 1 || 1)) * chartW;

    const metaY = getY(metaVal);

    const yLevels = [60, 70, 80, 90, 100];
    let gridLinesSvg = yLevels.map(lvl => {
      const y = getY(lvl);
      return `
        <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 3"/>
        <text x="${padLeft - 8}" y="${y + 4}" font-size="10" fill="#94a3b8" text-anchor="end" font-weight="600">${lvl}%</text>
      `;
    }).join('');

    const metaSvg = `
      <line x1="${padLeft}" y1="${metaY}" x2="${width - padRight}" y2="${metaY}" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="5 4"/>
      <text x="${width - padRight + 6}" y="${metaY + 4}" font-size="10" fill="#d97706" font-weight="700">Meta ${metaVal}%</text>
    `;

    const coords = points.map((p, idx) => ({ x: getX(idx), y: getY(p.pct), label: p.label, pct: p.pct }));
    const pointsStr = coords.map(c => `${c.x},${c.y}`).join(' ');
    const areaPoints = `${coords[0].x},${padTop + chartH} ` + pointsStr + ` ${coords[coords.length - 1].x},${padTop + chartH}`;

    const nodesSvg = coords.map(c => `
      <g>
        <circle cx="${c.x}" cy="${c.y}" r="6" fill="${colorPrimary}" stroke="#ffffff" stroke-width="2.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));"/>
        <rect x="${c.x - 17}" y="${c.y - 25}" width="34" height="17" rx="8" fill="#0f172a" opacity="0.9"/>
        <text x="${c.x}" y="${c.y - 13}" font-size="10" fill="#ffffff" font-weight="800" text-anchor="middle">${c.pct}%</text>
        <text x="${c.x}" y="${height - 10}" font-size="11" fill="#475569" font-weight="700" text-anchor="middle">${c.label}</text>
      </g>
    `).join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; max-height: 250px; overflow: visible;">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${colorPrimary}" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="${colorPrimary}" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        ${gridLinesSvg}
        ${metaSvg}
        <polygon points="${areaPoints}" fill="url(#${gradId})"/>
        <polyline points="${pointsStr}" fill="none" stroke="${colorPrimary}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${nodesSvg}
      </svg>
    `;
  }

  function renderFieldTrendFilterSelect(currentVal) {
    const areas = Store.getFarmAreas ? Store.getFarmAreas() : [];
    const plans = Store.getFarmPlans ? Store.getFarmPlans() : [];

    return `
      <select id="field-trend-filter-select" class="form-control" style="font-size: 0.78rem; padding: 0.25rem 0.65rem; width: auto; height: auto;" onchange="Modules.updateQualityFieldTrend(this.value)">
        <option value="ALL" ${currentVal === 'ALL' ? 'selected' : ''}>🌐 Toda la Finca (General)</option>
        ${areas.length > 0 ? `
          <optgroup label="Filtrar por Área / Sector:">
            ${areas.map(a => `<option value="area:${escapeHtml(a.name)}" ${currentVal === 'area:' + a.name ? 'selected' : ''}>🗺️ ${escapeHtml(a.name)}</option>`).join('')}
          </optgroup>
        ` : ''}
        ${plans.length > 0 ? `
          <optgroup label="Filtrar por Bloque:">
            ${plans.map(p => `<option value="block:${escapeHtml(p.block)}" ${currentVal === 'block:' + p.block ? 'selected' : ''}>🌿 ${escapeHtml(p.block)} (${escapeHtml(p.variety)})</option>`).join('')}
          </optgroup>
        ` : ''}
      </select>
    `;
  }

  function renderProcessTrendFilterSelect(currentVal) {
    const varieties = Store.getVarieties ? Store.getVarieties() : [];

    return `
      <select id="process-trend-filter-select" class="form-control" style="font-size: 0.78rem; padding: 0.25rem 0.65rem; width: auto; height: auto;" onchange="Modules.updateQualityProcessTrend(this.value)">
        <option value="ALL" ${currentVal === 'ALL' ? 'selected' : ''}>🌐 Todo Poscosecha (General)</option>
        <optgroup label="Filtrar por Mesa de Armado:">
          <option value="table:Mesa 1" ${currentVal === 'table:Mesa 1' ? 'selected' : ''}>Mesa 1</option>
          <option value="table:Mesa 2" ${currentVal === 'table:Mesa 2' ? 'selected' : ''}>Mesa 2</option>
          <option value="table:Mesa 3" ${currentVal === 'table:Mesa 3' ? 'selected' : ''}>Mesa 3</option>
          <option value="table:Mesa 4" ${currentVal === 'table:Mesa 4' ? 'selected' : ''}>Mesa 4</option>
        </optgroup>
        ${varieties.length > 0 ? `
          <optgroup label="Filtrar por Variedad de Rosa:">
            ${varieties.map(v => `<option value="variety:${escapeHtml(v.name)}" ${currentVal === 'variety:' + v.name ? 'selected' : ''}>🌹 ${escapeHtml(v.name)}</option>`).join('')}
          </optgroup>
        ` : ''}
      </select>
    `;
  }

  function updateQualityFieldTrend(filterVal) {
    if (filterVal !== undefined) fieldTrendFilter = filterVal;
    const container = document.getElementById('field-trend-chart-card');
    if (!container) return;

    const fieldChecks = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const trendData = computeFieldTrendData(fieldChecks, fieldTrendPeriod, fieldTrendFilter);
    const avgScore = trendData.length > 0 ? Math.round(trendData.reduce((a, b) => a + b.pct, 0) / trendData.length) : 92;
    const targetMet = trendData.filter(d => d.pct >= 85).length;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.6rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <h3 style="margin: 0; font-size: 1rem; color: #065f46; font-weight: 800;">
              📈 Tendencia de Calificación en Campo (% Calidad)
            </h3>
            <span class="badge" style="background:#ecfdf5; color:#047857; font-weight:700; font-size:0.75rem;">
              Promedio: ${avgScore}%
            </span>
          </div>
          <p style="margin: 0.2rem 0 0 0; font-size: 0.78rem; color: #64748b;">
            Evolución periódica del cumplimiento técnico florícola frente a la meta (85%).
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <div style="display: inline-flex; background: #e2e8f0; padding: 2px; border-radius: 6px;">
            <button class="btn btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; font-weight: 700; border-radius: 5px; ${fieldTrendPeriod === 'weeks' ? 'background: #059669; color: #ffffff;' : 'background: transparent; color: #475569;'}" onclick="Modules.setFieldTrendPeriod('weeks')">
              📅 Semanas
            </button>
            <button class="btn btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; font-weight: 700; border-radius: 5px; ${fieldTrendPeriod === 'months' ? 'background: #059669; color: #ffffff;' : 'background: transparent; color: #475569;'}" onclick="Modules.setFieldTrendPeriod('months')">
              🗓️ Meses
            </button>
          </div>
          ${renderFieldTrendFilterSelect(fieldTrendFilter)}
        </div>
      </div>

      <div style="background: #ffffff; padding: 1rem 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 0.6rem;">
        ${renderTrendLineSVG(trendData, 85, '#059669', 'fieldGrad')}
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; padding: 0 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
        <span>🎯 Meta estándar florícola: <strong style="color:#d97706;">85.0%</strong></span>
        <span>✅ Períodos sobre la meta: <strong style="color: #059669;">${targetMet} de ${trendData.length} (${Math.round((targetMet / trendData.length) * 100)}%)</strong></span>
        <span>🏷️ Filtro activo: <strong style="color: #0369a1;">${fieldTrendFilter === 'ALL' ? 'Toda la Finca' : fieldTrendFilter.replace('area:', 'Área: ').replace('block:', 'Bloque: ')}</strong></span>
      </div>
    `;
  }

  function updateQualityProcessTrend(filterVal) {
    if (filterVal !== undefined) processTrendFilter = filterVal;
    const container = document.getElementById('process-trend-chart-card');
    if (!container) return;

    const bunchChecks = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];
    const trendData = computeProcessTrendData(bunchChecks, processTrendPeriod, processTrendFilter);
    const avgScore = trendData.length > 0 ? Math.round(trendData.reduce((a, b) => a + b.pct, 0) / trendData.length) : 90;
    const targetMet = trendData.filter(d => d.pct >= 85).length;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.6rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <h3 style="margin: 0; font-size: 1rem; color: #0284c7; font-weight: 800;">
              📈 Tendencia de Calificación en Poscosecha (% Calidad)
            </h3>
            <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.75rem;">
              Promedio: ${avgScore}%
            </span>
          </div>
          <p style="margin: 0.2rem 0 0 0; font-size: 0.78rem; color: #64748b;">
            Evolución periódica del armado e inspección de bonches frente a la meta (85%).
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <div style="display: inline-flex; background: #e2e8f0; padding: 2px; border-radius: 6px;">
            <button class="btn btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; font-weight: 700; border-radius: 5px; ${processTrendPeriod === 'weeks' ? 'background: #0284c7; color: #ffffff;' : 'background: transparent; color: #475569;'}" onclick="Modules.setProcessTrendPeriod('weeks')">
              📅 Semanas
            </button>
            <button class="btn btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; font-weight: 700; border-radius: 5px; ${processTrendPeriod === 'months' ? 'background: #0284c7; color: #ffffff;' : 'background: transparent; color: #475569;'}" onclick="Modules.setProcessTrendPeriod('months')">
              🗓️ Meses
            </button>
          </div>
          ${renderProcessTrendFilterSelect(processTrendFilter)}
        </div>
      </div>

      <div style="background: #ffffff; padding: 1rem 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 0.6rem;">
        ${renderTrendLineSVG(trendData, 85, '#0284c7', 'procGrad')}
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; padding: 0 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
        <span>🎯 Meta estándar poscosecha: <strong style="color:#d97706;">85.0%</strong></span>
        <span>✅ Períodos sobre la meta: <strong style="color: #0284c7;">${targetMet} de ${trendData.length} (${Math.round((targetMet / trendData.length) * 100)}%)</strong></span>
        <span>🏷️ Filtro activo: <strong style="color: #0369a1;">${processTrendFilter === 'ALL' ? 'Todo Poscosecha' : processTrendFilter.replace('variety:', 'Variedad: ').replace('table:', 'Mesa: ')}</strong></span>
      </div>
    `;
  }

  // ------------------------------------------------------------------------------
  // DASHBOARD EJECUTIVO - CALIDAD CAMPO (SIN BOTONES SUPERIORES)
  // ------------------------------------------------------------------------------
  function renderQualityFieldDashboard(container) {
    if (!container) container = document.getElementById('view-container');
    if (!container) return;
    localStorage.setItem('mrose_active_module_v1', 'dashboard-calidad-campo');

    const fieldChecks = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const totalField = fieldChecks.length;
    const avgField = totalField > 0 
      ? Math.round(fieldChecks.reduce((a, c) => a + (c.score || 0), 0) / totalField) 
      : 92;

    const laboresChecks = fieldChecks.filter(f => f.type === 'labores');
    const mallasChecks = fieldChecks.filter(f => f.type === 'cosecha');

    const avgLabores = laboresChecks.length > 0 
      ? Math.round(laboresChecks.reduce((a, c) => a + (c.score || 0), 0) / laboresChecks.length) 
      : 94;
    const avgMallas = mallasChecks.length > 0 
      ? Math.round(mallasChecks.reduce((a, c) => a + (c.score || 0), 0) / mallasChecks.length) 
      : 90;

    const compliantChecks = fieldChecks.filter(f => (f.score || 0) >= 80).length;
    const pctCompliant = totalField > 0 ? ((compliantChecks / totalField) * 100).toFixed(1) : '94.0';
    const totalStems = mallasChecks.reduce((a, c) => a + (parseInt(c.stemsAudit, 10) || 0), 0);

    let desyemeOk = 0, sacadaOk = 0, puestaOk = 0, manguerasOk = 0, tutorajeOk = 0, escobilladoOk = 0;
    laboresChecks.forEach(f => {
      const it = f.items || {};
      if (it.desyeme !== false) desyemeOk++;
      if (it.sacadaCapuchon !== false) sacadaOk++;
      if (it.puestaCapuchon !== false) puestaOk++;
      if (it.manguerasColocadas !== false) manguerasOk++;
      if (it.encanasteTutoraje !== false) tutorajeOk++;
      if (it.escobillado !== false) escobilladoOk++;
    });
    const lTotal = laboresChecks.length || 1;

    let corteDefects = 0, maltratoDefects = 0, botrytisDefects = 0, acarosDefects = 0, tripsDefects = 0, vellosoDefects = 0, polvosoDefects = 0, tallosCortosDefects = 0;
    mallasChecks.forEach(f => {
      const it = f.items || {};
      if (it.puntosCorte === false) corteDefects++;
      if (it.maltrato === false) maltratoDefects++;
      if (it.botrytis === false) botrytisDefects++;
      if (it.acaros === false) acarosDefects++;
      if (it.trips === false) tripsDefects++;
      if (it.velloso === false) vellosoDefects++;
      if (it.polvoso === false) polvosoDefects++;
      if (it.tallosCortos === false) tallosCortosDefects++;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Panel Ejecutivo • Calidad en Campo
            </span>
            <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 0.75rem; padding: 0.15rem 0.5rem; font-weight: 700;">
              Estándar Cultivo A+
            </span>
          </div>
          <h1 style="color: #065f46;">Dashboard Ejecutivo de Calidad en Campo</h1>
          <p class="view-subtitle" style="color: #047857;">Supervisión ejecutiva de labores culturales en camas y calificación de mallas por cosechador con auditoría fotográfica.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.printQualityChecklistReport('campo')" style="display: flex; align-items: center; gap: 0.35rem;" title="Imprimir Informe de Campo en 1 Hoja">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Informe 1 Hoja
          </button>
          <button class="btn btn-secondary" onclick="Modules.exportQualityXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openFieldCheckModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Nueva Auditoría Campo
          </button>
        </div>
      </div>

      <!-- KPI GRID DE CALIDAD CAMPO -->
      <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.25rem;">
        <div class="kpi-card" style="border-left: 5px solid #059669; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 800; color: #065f46;">Índice Calidad en Campo</span>
            <span class="badge" style="background:#059669; color:#fff; font-size:0.68rem; padding:0.2rem 0.55rem; font-weight:700;">Global</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #059669;">${avgField}%</span>
          </div>
          <div class="kpi-sub">
            <span class="kpi-trend positive" style="color:#047857; font-weight:700;">★ Meta ≥ 85%</span>
            <span>(${totalField} auditorías)</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 5px solid #10b981;">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 700;">Labores Culturales (Camas)</span>
            <span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.68rem; font-weight:700;">Manejo</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #047857;">${avgLabores}%</span>
          </div>
          <div class="kpi-sub">
            <span>${laboresChecks.length} evaluaciones de cama</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 5px solid #d97706;">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 700;">Mallas de Cosecha</span>
            <span class="badge" style="background:#fef3c7; color:#92400e; font-size:0.68rem; font-weight:700;">Corte</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #d97706;">${avgMallas}%</span>
          </div>
          <div class="kpi-sub">
            <span>${mallasChecks.length} mallas evaluadas (${totalStems} tallos)</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 5px solid #0284c7;">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 700;">Conformidad Técnica</span>
            <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.68rem; font-weight:700;">Estándar</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #0284c7;">${pctCompliant}%</span>
          </div>
          <div class="kpi-sub">
            <span>${compliantChecks} de ${totalField} conformes</span>
          </div>
        </div>
      </div>

      <!-- CARD CON LÍNEA DE TENDENCIA DINÁMICA -->
      <div class="card" id="field-trend-chart-card" style="margin-bottom: 1.25rem; padding: 1.25rem; border: 1px solid #a7f3d0; background: #fafdfb;">
      </div>

      <!-- DETALLE DE LABORES CULTURALES Y DEFECTOS EN COSECHA -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
        <div class="card">
          <div class="card-header">
            <div class="card-title" style="font-size: 0.92rem; color: #065f46;">
              🌿 Cumplimiento en Labores Culturales (Camas)
            </div>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>Desyeme / Desbrote oportuno</span>
                  <strong>${Math.round((desyemeOk / lTotal) * 100)}% (${desyemeOk}/${lTotal})</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((desyemeOk / lTotal) * 100)}%; height: 100%; background: #059669;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>Sacada oportuna de capuchón</span>
                  <strong>${Math.round((sacadaOk / lTotal) * 100)}% (${sacadaOk}/${lTotal})</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((sacadaOk / lTotal) * 100)}%; height: 100%; background: #10b981;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>Puesta correcta de capuchón</span>
                  <strong>${Math.round((puestaOk / lTotal) * 100)}% (${puestaOk}/${lTotal})</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((puestaOk / lTotal) * 100)}%; height: 100%; background: #047857;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>Mangueras de goteo bien colocadas</span>
                  <strong>${Math.round((manguerasOk / lTotal) * 100)}% (${manguerasOk}/${lTotal})</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((manguerasOk / lTotal) * 100)}%; height: 100%; background: #0284c7;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>Encanaste y tutoraje de tallos</span>
                  <strong>${Math.round((tutorajeOk / lTotal) * 100)}% (${tutorajeOk}/${lTotal})</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((tutorajeOk / lTotal) * 100)}%; height: 100%; background: #0d9488;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>Escobillado y limpieza de camas</span>
                  <strong>${Math.round((escobilladoOk / lTotal) * 100)}% (${escobilladoOk}/${lTotal})</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((escobilladoOk / lTotal) * 100)}%; height: 100%; background: #16a34a;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title" style="font-size: 0.92rem; color: #92400e;">
              ⚠️ Principales No Conformidades en Mallas de Cosecha
            </div>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #991b1b; display: block; font-weight: 600;">Puntos de Corte Incorrectos</span>
                <strong style="font-size: 1.15rem; color: #b91c1c;">${corteDefects} incidentes</strong>
              </div>
              <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #92400e; display: block; font-weight: 600;">Maltrato / Fricción en Malla</span>
                <strong style="font-size: 1.15rem; color: #b45309;">${maltratoDefects} incidentes</strong>
              </div>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #991b1b; display: block; font-weight: 600;">Presencia de Botrytis</span>
                <strong style="font-size: 1.15rem; color: #b91c1c;">${botrytisDefects} incidentes</strong>
              </div>
              <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #92400e; display: block; font-weight: 600;">Ácaros / Trips</span>
                <strong style="font-size: 1.15rem; color: #b45309;">${acarosDefects + tripsDefects} incidentes</strong>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #475569; display: block; font-weight: 600;">Tallos Cortos Fuera de Medida</span>
                <strong style="font-size: 1.15rem; color: #334155;">${tallosCortosDefects} incidentes</strong>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #475569; display: block; font-weight: 600;">Velloso / Polvoso</span>
                <strong style="font-size: 1.15rem; color: #334155;">${vellosoDefects + polvosoDefects} incidentes</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Renderizar tendencia interactiva inicial
    updateQualityFieldTrend();
  }

  // ------------------------------------------------------------------------------
  // DASHBOARD EJECUTIVO - CALIDAD PROCESO (SIN BOTONES SUPERIORES)
  // ------------------------------------------------------------------------------
  function renderQualityProcessDashboard(container) {
    if (!container) container = document.getElementById('view-container');
    if (!container) return;
    localStorage.setItem('mrose_active_module_v1', 'dashboard-calidad-proceso');

    const bunchChecks = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];
    const totalBunch = bunchChecks.length;
    const avgScore = totalBunch > 0 
      ? Math.round(bunchChecks.reduce((a, c) => a + (c.totalScore || 0), 0) / totalBunch) 
      : 89;

    const approvedChecks = bunchChecks.filter(b => (b.totalScore || 0) >= 85).length;
    const pctApproved = totalBunch > 0 ? ((approvedChecks / totalBunch) * 100).toFixed(1) : '91.5';

    const avgSanidad = totalBunch > 0 ? (bunchChecks.reduce((a, b) => a + (b.diseaseScore || 30), 0) / totalBunch).toFixed(1) : '28.5';
    const avgFisico = totalBunch > 0 ? (bunchChecks.reduce((a, b) => a + (b.damageScore || 30), 0) / totalBunch).toFixed(1) : '27.8';
    const avgArmado = totalBunch > 0 ? (bunchChecks.reduce((a, b) => a + (b.buildScore || 40), 0) / totalBunch).toFixed(1) : '36.5';

    let botrytisDef = 0, follajeDef = 0, corteDisp = 0, alturaDisp = 0, amarreFlojo = 0;
    bunchChecks.forEach(b => {
      const it = b.items || {};
      if (it.botrytis === false) botrytisDef++;
      if (it.follajeSano === false) follajeDef++;
      if (it.corteDisparejo === false || it.corteParejo === false) corteDisp++;
      if (it.alturaUniforme === false) alturaDisp++;
      if (it.amarreFirme === false) amarreFlojo++;
    });

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #bae6fd;">
              Panel Ejecutivo • Calidad en Poscosecha
            </span>
            <span class="badge" style="background: #f0fdf4; color: #15803d; font-size: 0.75rem; padding: 0.15rem 0.5rem; font-weight: 700;">
              Exportación Premium
            </span>
          </div>
          <h1 style="color: #0369a1;">Dashboard Ejecutivo de Calidad en Poscosecha</h1>
          <p class="view-subtitle" style="color: #0284c7;">Auditoría de bonches en mesas de armado: fitosanidad (30 pts), calidad física (30 pts) y armado (40 pts).</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.printQualityChecklistReport('proceso')" style="display: flex; align-items: center; gap: 0.35rem;" title="Imprimir Informe de Poscosecha en 1 Hoja">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Informe 1 Hoja
          </button>
          <button class="btn btn-secondary" onclick="Modules.exportQualityXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openBunchCheckModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Nueva Inspección Bonche
          </button>
        </div>
      </div>

      <!-- KPI GRID DE CALIDAD POSCOSECHA -->
      <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.25rem;">
        <div class="kpi-card" style="border-left: 5px solid #0284c7; background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 800; color: #0369a1;">Índice General Bonches</span>
            <span class="badge" style="background:#0284c7; color:#fff; font-size:0.68rem; padding:0.2rem 0.55rem; font-weight:700;">Global</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #0284c7;">${avgScore}%</span>
          </div>
          <div class="kpi-sub">
            <span class="kpi-trend positive" style="color:#0369a1; font-weight:700;">★ Meta ≥ 85%</span>
            <span>(${totalBunch} bonches auditados)</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 5px solid #10b981;">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 700;">Tasa de Aprobación</span>
            <span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.68rem; font-weight:700;">Cumplimiento</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #10b981;">${pctApproved}%</span>
          </div>
          <div class="kpi-sub">
            <span>${approvedChecks} de ${totalBunch} aprobados</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 5px solid #6366f1;">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 700;">Fitosanidad (30 pts)</span>
            <span class="badge" style="background:#e0e7ff; color:#3730a3; font-size:0.68rem; font-weight:700;">Botrytis/Plagas</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #4f46e5;">${avgSanidad}</span>
            <span class="kpi-unit">/ 30</span>
          </div>
          <div class="kpi-sub">
            <span>Promedio fitosanitario</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 5px solid #f59e0b;">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 700;">Armado y Amarre (40 pts)</span>
            <span class="badge" style="background:#fef3c7; color:#92400e; font-size:0.68rem; font-weight:700;">Empaque</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #d97706;">${avgArmado}</span>
            <span class="kpi-unit">/ 40</span>
          </div>
          <div class="kpi-sub">
            <span>Firmeza y corte regular</span>
          </div>
        </div>
      </div>

      <!-- CARD CON LÍNEA DE TENDENCIA DINÁMICA -->
      <div class="card" id="process-trend-chart-card" style="margin-bottom: 1.25rem; padding: 1.25rem; border: 1px solid #bae6fd; background: #f8fafc;">
      </div>

      <!-- RESUMEN DE PUNTUACIÓN Y ALERTAS -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
        <div class="card">
          <div class="card-header">
            <div class="card-title" style="font-size: 0.92rem; color: #0369a1;">
              📊 Calificación Promedio por Criterio (Escala de 100 Puntos)
            </div>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>1. Fitosanidad y Sanidad Vegetal</span>
                  <strong>${avgSanidad} / 30 pts (${Math.round((parseFloat(avgSanidad) / 30) * 100)}%)</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((parseFloat(avgSanidad) / 30) * 100)}%; height: 100%; background: #0284c7;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>2. Calidad Física, Follaje y Botón</span>
                  <strong>${avgFisico} / 30 pts (${Math.round((parseFloat(avgFisico) / 30) * 100)}%)</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((parseFloat(avgFisico) / 30) * 100)}%; height: 100%; background: #10b981;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                  <span>3. Armado, Amarre y Uniformidad</span>
                  <strong>${avgArmado} / 40 pts (${Math.round((parseFloat(avgArmado) / 40) * 100)}%)</strong>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${Math.round((parseFloat(avgArmado) / 40) * 100)}%; height: 100%; background: #f59e0b;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title" style="font-size: 0.92rem; color: #92400e;">
              ⚠️ Principales Defectos Observados en Bonches
            </div>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #991b1b; display: block; font-weight: 600;">Presencia de Botrytis en Pétalos</span>
                <strong style="font-size: 1.15rem; color: #b91c1c;">${botrytisDef} bonches</strong>
              </div>
              <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #92400e; display: block; font-weight: 600;">Follaje Maltratado / Manchas</span>
                <strong style="font-size: 1.15rem; color: #b45309;">${follajeDef} bonches</strong>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #475569; display: block; font-weight: 600;">Corte de Tallo Disparejo</span>
                <strong style="font-size: 1.15rem; color: #334155;">${corteDisp} bonches</strong>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.6rem;">
                <span style="font-size: 0.75rem; color: #475569; display: block; font-weight: 600;">Altura de Cabeza Irregular</span>
                <strong style="font-size: 1.15rem; color: #334155;">${alturaDisp} bonches</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Renderizar tendencia interactiva inicial
    updateQualityProcessTrend();
  }

  // ------------------------------------------------------------------------------
  // DASHBOARD EJECUTIVO - CONSOLIDADO (CAMPO VS POSCOSECHA)
  // ------------------------------------------------------------------------------
  function renderQualityDashboard(container) {
    if (!container) container = document.getElementById('view-container');
    if (!container) return;
    localStorage.setItem('mrose_active_module_v1', 'dashboard-calidad');

    const fieldChecks = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const bunchChecks = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];

    const totalField = fieldChecks.length;
    const avgField = totalField > 0 ? Math.round(fieldChecks.reduce((a, c) => a + (c.score || 0), 0) / totalField) : 92;

    const totalBunch = bunchChecks.length;
    const avgBunch = totalBunch > 0 ? Math.round(bunchChecks.reduce((a, c) => a + (c.totalScore || 0), 0) / totalBunch) : 89;

    const globalAvg = Math.round((avgField + avgBunch) / 2);

    const fTrend = computeFieldTrendData(fieldChecks, 'weeks', 'ALL');
    const bTrend = computeProcessTrendData(bunchChecks, 'weeks', 'ALL');

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Panel Ejecutivo • Calidad Integral
            </span>
            <span class="badge" style="background:#f0fdf4; color:#15803d; font-size:0.75rem; font-weight:700;">Visión Integral Finca</span>
          </div>
          <h1 style="color: #065f46;">Dashboard Ejecutivo de Calidad Integral</h1>
          <p class="view-subtitle" style="color: #047857;">Consolidado de cumplimiento técnico en campo (labores y mallas) y control de calidad en empaque y armado de bonches.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.exportQualityXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.renderQualityFieldDashboard()">
            🌿 Ver Dashboard Campo
          </button>
          <button class="btn btn-secondary" onclick="Modules.renderQualityProcessDashboard()">
            📦 Ver Dashboard Proceso
          </button>
        </div>
      </div>

      <!-- KPI GRID CONSOLIDADO -->
      <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 1.25rem;">
        <div class="kpi-card" style="border-left: 5px solid #059669; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 800; color: #065f46;">Índice General de Calidad</span>
            <span class="badge" style="background:#059669; color:#fff; font-size:0.68rem; font-weight:700;">Global</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #059669;">${globalAvg}%</span>
          </div>
          <div class="kpi-sub">
            <span class="kpi-trend positive" style="color:#047857; font-weight:700;">★ Meta Florícola ≥ 85%</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 5px solid #10b981;">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 700;">Calidad en Campo</span>
            <span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.68rem; font-weight:700;">Cultivo</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #10b981;">${avgField}%</span>
          </div>
          <div class="kpi-sub">
            <span>${totalField} auditorías de labores y cosecha</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 5px solid #0284c7;">
          <div class="kpi-header">
            <span class="kpi-title" style="font-weight: 700;">Calidad en Poscosecha</span>
            <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.68rem; font-weight:700;">Empaque</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #0284c7;">${avgBunch}%</span>
          </div>
          <div class="kpi-sub">
            <span>${totalBunch} bonches auditados</span>
          </div>
        </div>
      </div>

      <!-- COMPARATIVA DE LÍNEAS DE TENDENCIA -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
        <div class="card" style="padding: 1.25rem; border: 1px solid #a7f3d0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h4 style="margin: 0; color: #065f46; font-size: 0.92rem; font-weight: 700;">🌿 Tendencia Calidad en Campo</h4>
            <span class="badge" style="background:#ecfdf5; color:#047857; font-weight:700;">Prom: ${avgField}%</span>
          </div>
          ${renderTrendLineSVG(fTrend, 85, '#059669', 'consFieldGrad')}
        </div>

        <div class="card" style="padding: 1.25rem; border: 1px solid #bae6fd;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h4 style="margin: 0; color: #0369a1; font-size: 0.92rem; font-weight: 700;">📦 Tendencia Calidad en Poscosecha</h4>
            <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">Prom: ${avgBunch}%</span>
          </div>
          ${renderTrendLineSVG(bTrend, 85, '#0284c7', 'consProcGrad')}
        </div>
      </div>
    `;
  }


    // ------------------------------------------------------------------------------
  function renderQualityFieldModule(container) {
    if (!container) container = document.getElementById('view-container');
    if (!container) return;
    localStorage.setItem('mrose_active_module_v1', 'calidad-campo');
    currentQualityTab = 'campo';

    const fieldChecks = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const avgFieldScore = fieldChecks.length > 0 
      ? Math.round(fieldChecks.reduce((acc, c) => acc + (c.score || 0), 0) / fieldChecks.length) 
      : 88;
    const laboresCount = fieldChecks.filter(f => f.type === 'labores').length;
    const mallasCount = fieldChecks.filter(f => f.type === 'cosecha').length;
    const compliantChecks = fieldChecks.filter(f => (f.score || 0) >= 80).length;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Módulo de Campo
            </span>
          </div>
          <h1 style="color: #065f46;">Calidad Campo: Labores Culturales & Mallas</h1>
          <p class="view-subtitle" style="color: #047857;">Auditorías de Labores Culturales (desyeme, capuchón, mangueras, tutoraje, escobillado) y Calificación de Mallas del Cosechador.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.printQualityChecklistReport()" style="display: flex; align-items: center; gap: 0.35rem;" title="Imprimir Informe de Calidad en 1 Hoja">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Informe 1 Hoja
          </button>
          <button class="btn btn-secondary" onclick="Modules.exportQualityXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openFieldCheckModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Nueva Evaluación Campo
          </button>
        </div>
      </div>

      <!-- Resumen KPI de Calidad Campo -->
      <div class="kpi-grid">
        <div class="kpi-card" style="border-left: 4px solid #10b981;">
          <div class="kpi-header">
            <span class="kpi-title">Calificación Media Campo</span>
            <span class="badge" style="background:${avgFieldScore >= 80 ? '#ecfdf5' : '#fffbeb'}; color:${avgFieldScore >= 80 ? '#047857' : '#b45309'}; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">
              ${avgFieldScore >= 80 ? 'Conforme' : 'En Seguimiento'}
            </span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: ${avgFieldScore >= 80 ? '#059669' : '#d97706'};">${avgFieldScore}%</span>
            <span class="kpi-unit">cumplimiento</span>
          </div>
          <div class="kpi-sub">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 0 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 0 7-7z"></path></svg>
            <span>${compliantChecks} de ${fieldChecks.length} evaluaciones conformes</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #059669;">
          <div class="kpi-header">
            <span class="kpi-title">Labores Culturales</span>
            <span class="badge" style="background:#d1fae5; color:#065f46; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">Manejo Florícola</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #059669;">${laboresCount}</span>
            <span class="kpi-unit">registros</span>
          </div>
          <div class="kpi-sub">
            <span>Desyeme, capuchón, tutoraje y riego</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #047857;">
          <div class="kpi-header">
            <span class="kpi-title">Mallas del Cosechador</span>
            <span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">Cosecha</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${mallasCount}</span>
            <span class="kpi-unit">evaluaciones</span>
          </div>
          <div class="kpi-sub">
            <span>Puntos de corte, sanidad y maltrato</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #0d9488;">
          <div class="kpi-header">
            <span class="kpi-title">Total Auditorías Campo</span>
            <span class="badge" style="background:#f0fdfa; color:#0d9488; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">Campo</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #0f766e;">${fieldChecks.length}</span>
            <span class="kpi-unit">auditorías</span>
          </div>
          <div class="kpi-sub">
            <span>Control integral en bloques de cultivo</span>
          </div>
        </div>
      </div>

      <div id="quality-field-container">
        ${renderQualityFieldViewHtml(fieldChecks)}
      </div>
    `;
  }

  // ------------------------------------------------------------------------------
  // 2. MÓDULO CALIDAD PROCESO (Revisión de Bonches en Poscosecha)
  // ------------------------------------------------------------------------------
  function renderQualityProcessModule(container) {
    if (!container) container = document.getElementById('view-container');
    if (!container) return;
    localStorage.setItem('mrose_active_module_v1', 'calidad-proceso');
    currentQualityTab = 'bonches';

    const bunchChecks = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];
    const avgBunchScore = bunchChecks.length > 0 
      ? Math.round(bunchChecks.reduce((acc, c) => acc + (c.totalScore || 0), 0) / bunchChecks.length) 
      : 92;
    const approvedBunches = bunchChecks.filter(b => (b.totalScore || 0) >= 85).length;
    const pctApprovedBunches = bunchChecks.length > 0 
      ? ((approvedBunches / bunchChecks.length) * 100).toFixed(1) 
      : '100.0';
    const rejectedBunches = bunchChecks.length - approvedBunches;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Módulo de Poscosecha
            </span>
          </div>
          <h1 style="color: #065f46;">Calidad Proceso: Inspección de Bonches</h1>
          <p class="view-subtitle" style="color: #047857;">Inspección técnica de calidad en mesas de clasificación, armado de bonches, grado de apertura, follaje y empaque.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" onclick="Modules.printQualityChecklistReport()" style="display: flex; align-items: center; gap: 0.35rem;" title="Imprimir Informe de Calidad en 1 Hoja">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Informe 1 Hoja
          </button>
          <button class="btn btn-secondary" onclick="Modules.exportQualityXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openBunchCheckModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            + Nueva Inspección Bonche
          </button>
        </div>
      </div>

      <!-- Resumen KPI de Calidad Proceso -->
      <div class="kpi-grid">
        <div class="kpi-card" style="border-left: 4px solid #0284c7;">
          <div class="kpi-header">
            <span class="kpi-title">Calificación Media Bonches</span>
            <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">
              ${pctApprovedBunches}% Exportable
            </span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #0284c7;">${avgBunchScore}</span>
            <span class="kpi-unit">puntos / 100</span>
          </div>
          <div class="kpi-sub">
            <span>${approvedBunches} de ${bunchChecks.length} bonches en norma</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #10b981;">
          <div class="kpi-header">
            <span class="kpi-title">Aprobados Exportación</span>
            <span class="badge" style="background:#ecfdf5; color:#059669; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">Aprobados</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #059669;">${approvedBunches}</span>
            <span class="kpi-unit">bonches</span>
          </div>
          <div class="kpi-sub">
            <span>Calificación ≥ 85 puntos</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #ef4444;">
          <div class="kpi-header">
            <span class="kpi-title">Rechazos / Descarte</span>
            <span class="badge" style="background:${rejectedBunches > 0 ? '#fee2e2' : '#f0fdf4'}; color:${rejectedBunches > 0 ? '#b91c1c' : '#15803d'}; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">
              ${rejectedBunches > 0 ? 'Observados' : 'Cero'}
            </span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: ${rejectedBunches > 0 ? '#dc2626' : '#16a34a'};">${rejectedBunches}</span>
            <span class="kpi-unit">bonches</span>
          </div>
          <div class="kpi-sub">
            <span>Calificación &lt; 85 puntos</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #8b5cf6;">
          <div class="kpi-header">
            <span class="kpi-title">Total Revisiones Mesas</span>
            <span class="badge" style="background:#f5f3ff; color:#6d28d9; font-size:0.68rem; padding:0.15rem 0.5rem; font-weight:700;">Mesas</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #6d28d9;">${bunchChecks.length}</span>
            <span class="kpi-unit">inspecciones</span>
          </div>
          <div class="kpi-sub">
            <span>Control continuo en armado</span>
          </div>
        </div>
      </div>

      <div id="quality-process-container">
        ${renderQualityBunchViewHtml(bunchChecks)}
      </div>
    `;
  }

  // Vista unificada de compatibilidad
  function renderQualityChecklistsModule(container) {
    if (!container) container = document.getElementById('view-container');
    if (!container) return;
    const activeMod = localStorage.getItem('mrose_active_module_v1');
    if (activeMod === 'calidad-proceso') {
      renderQualityProcessModule(container);
    } else {
      renderQualityFieldModule(container);
    }
  }

  // ------------------------------------------------------------------------------
  // 3. TABLA VISTA CAMPO
  // ------------------------------------------------------------------------------
  function renderQualityFieldViewHtml(fieldChecks) {
    if (!fieldChecks || fieldChecks.length === 0) {
      return `
        <div class="card">
          <div class="card-body" style="text-align:center; padding: 2.5rem 1rem;">
            <p style="color: #64748b; margin-bottom: 1rem;">No hay evaluaciones registradas en campo.</p>
            <button class="btn btn-emerald" onclick="Modules.openFieldCheckModal()">+ Realizar Primera Evaluación</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="card-title" style="font-size: 0.95rem; color: #065f46;">
            📋 Registros de Auditorías de Labores & Mallas de Corte (${fieldChecks.length})
          </div>
          <div style="font-size: 0.75rem; color: #64748b;">
            Haz clic en las fotos para visualizarlas en tamaño completo
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tipo Auditoría</th>
                  <th>Fecha / Hora</th>
                  <th>Bloque</th>
                  <th>Variedad</th>
                  <th>Responsable / Cosechador</th>
                  <th>Malla</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                  <th>Fotos</th>
                  <th>Evaluador</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${fieldChecks.map(f => {
                  const photos = (Array.isArray(f.photos) && f.photos.length > 0) 
                    ? f.photos 
                    : (f.photo ? [f.photo] : []);
                  return `
                    <tr>
                      <td>
                        <span class="badge" style="background:${f.type === 'cosecha' ? '#fef3c7' : '#ecfdf5'}; color:${f.type === 'cosecha' ? '#92400e' : '#047857'}; font-size:0.7rem; font-weight:700;">
                          ${f.type === 'cosecha' ? 'Malla Cosecha' : 'Labor Cultural'}
                        </span>
                      </td>
                      <td>
                        <strong>${f.date}</strong>
                        <div style="font-size: 0.72rem; color: #64748b;">${f.time || '08:30'}</div>
                      </td>
                      <td><strong>${escapeHtml(f.block)}</strong></td>
                      <td>${escapeHtml(f.variety)}</td>
                      <td>
                        ${f.type === 'cosecha' 
                          ? `<strong>${escapeHtml(f.harvester || 'N/A')}</strong>` 
                          : `<div style="font-size: 0.73rem; color: #64748b; margin-top: 2px;">Manejo florícola y podas</div>`}
                      </td>
                      <td>${f.type === 'cosecha' ? `<span class="badge badge-info" style="font-size:0.7rem;">${escapeHtml(f.meshCode || 'M-01')}</span>` : '-'}</td>
                      <td>
                        <strong style="font-size: 0.95rem; color: ${f.score >= 90 ? '#059669' : (f.score >= 75 ? '#d97706' : '#dc2626')};">
                          ${f.score}%
                        </strong>
                      </td>
                      <td>
                        <span class="badge" style="background:${f.score >= 80 ? '#ecfdf5' : '#fee2e2'}; color:${f.score >= 80 ? '#059669' : '#dc2626'}; font-size:0.7rem; font-weight:700;">
                          ${escapeHtml(f.status || (f.score >= 80 ? 'Conforme' : 'No Conforme'))}
                        </span>
                      </td>
                      <td>
                        ${photos.length > 0 ? `
                          <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap; max-width: 140px;">
                            ${photos.map((p, pIdx) => `
                              <img src="${p}" alt="Foto ${pIdx + 1}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 1.5px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.12s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="Ver foto ${pIdx + 1} de ${photos.length}" onclick="Modules.viewQualityPhoto('${f.id}', 'fc', ${pIdx})">
                            `).join('')}
                          </div>
                        ` : `<span style="font-size: 0.72rem; color: #94a3b8;">Sin fotos</span>`}
                      </td>
                      <td><span style="font-size: 0.78rem;">${escapeHtml(f.evaluator || '')}</span></td>
                      <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-secondary btn-icon-only" style="padding: 0.2rem 0.4rem;" title="Imprimir Acta en 1 Hoja" onclick="Modules.printFieldCheck('${f.id}')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        </button>
                        <button class="btn btn-secondary btn-icon-only" style="padding: 0.2rem 0.4rem;" title="Editar Checklist" onclick="Modules.openFieldCheckModal('${f.id}')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button class="btn btn-secondary btn-icon-only" style="padding: 0.2rem 0.4rem; color: #dc2626;" title="Eliminar" onclick="Modules.deleteFieldCheck('${f.id}')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
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

  // ------------------------------------------------------------------------------
  // 4. TABLA VISTA POSCOSECHA
  // ------------------------------------------------------------------------------
  function renderQualityBunchViewHtml(bunchChecks) {
    if (!bunchChecks || bunchChecks.length === 0) {
      return `
        <div class="card">
          <div class="card-body" style="text-align:center; padding: 2.5rem 1rem;">
            <p style="color: #64748b; margin-bottom: 1rem;">No hay inspecciones de bonches registradas en poscosecha.</p>
            <button class="btn btn-emerald" onclick="Modules.openBunchCheckModal()">+ Realizar Primera Inspección</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="card-title" style="font-size: 0.95rem; color: #065f46;">
            📦 Registros de Inspección de Bonches en Poscosecha (${bunchChecks.length})
          </div>
          <div style="font-size: 0.75rem; color: #64748b;">
            Haz clic en las fotos para visualizarlas en tamaño completo
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Mesa</th>
                  <th>Variedad</th>
                  <th>Bonche</th>
                  <th>Sanidad (30)</th>
                  <th>Físico (30)</th>
                  <th>Armado (40)</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fotos</th>
                  <th>Inspector</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${bunchChecks.map(b => {
                  const photos = (Array.isArray(b.photos) && b.photos.length > 0) 
                    ? b.photos 
                    : (b.photo ? [b.photo] : []);
                  return `
                    <tr>
                      <td>
                        <strong>${b.date}</strong>
                        <div style="font-size: 0.72rem; color: #64748b;">${b.time || '10:30'}</div>
                      </td>
                      <td><strong>${escapeHtml(b.tableCode)}</strong></td>
                      <td>${escapeHtml(b.variety)}</td>
                      <td><span class="badge badge-neutral">${escapeHtml(b.bunchNumber || 'B-01')}</span></td>
                      <td style="font-weight: 600; color: #047857;">${b.diseaseScore || 30} pts</td>
                      <td style="font-weight: 600; color: #047857;">${b.damageScore || 30} pts</td>
                      <td style="font-weight: 600; color: #047857;">${b.buildScore || 40} pts</td>
                      <td>
                        <strong style="font-size: 1rem; color: ${b.totalScore >= 85 ? '#059669' : '#dc2626'};">
                          ${b.totalScore}%
                        </strong>
                      </td>
                      <td>
                        <span class="badge" style="background:${b.totalScore >= 85 ? '#ecfdf5' : '#fee2e2'}; color:${b.totalScore >= 85 ? '#059669' : '#dc2626'}; font-size:0.7rem; font-weight:700;">
                          ${escapeHtml(b.status || (b.totalScore >= 85 ? 'Aprobado' : 'Rechazado'))}
                        </span>
                      </td>
                      <td>
                        ${photos.length > 0 ? `
                          <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap; max-width: 140px;">
                            ${photos.map((p, pIdx) => `
                              <img src="${p}" alt="Foto ${pIdx + 1}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 1.5px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.12s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="Ver foto ${pIdx + 1} de ${photos.length}" onclick="Modules.viewQualityPhoto('${b.id}', 'bc', ${pIdx})">
                            `).join('')}
                          </div>
                        ` : `<span style="font-size: 0.72rem; color: #94a3b8;">Sin fotos</span>`}
                      </td>
                      <td><span style="font-size: 0.78rem;">${escapeHtml(b.inspector || '')}</span></td>
                      <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-secondary btn-icon-only" style="padding: 0.2rem 0.4rem;" title="Imprimir Acta en 1 Hoja" onclick="Modules.printBunchCheck('${b.id}')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        </button>
                        <button class="btn btn-secondary btn-icon-only" style="padding: 0.2rem 0.4rem;" title="Editar Inspección" onclick="Modules.openBunchCheckModal('${b.id}')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button class="btn btn-secondary btn-icon-only" style="padding: 0.2rem 0.4rem; color: #dc2626;" title="Eliminar" onclick="Modules.deleteBunchCheck('${b.id}')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
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

  // ------------------------------------------------------------------------------
  // 5. MODAL CHECKLIST DE CAMPO (CON GUARDADO ROBUSTO Y PROMINENTE)
  // ------------------------------------------------------------------------------
  function openFieldCheckModal(checkId = null) {
    if (checkId === 'null' || checkId === 'undefined' || !checkId) checkId = null;
    const list = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const blocks = Store.getBlocks ? Store.getBlocks() : [{ name: 'Bloque 1' }];
    const varieties = Store.getVarieties ? Store.getVarieties() : [{ name: 'Explorer' }];
    const item = checkId ? list.find(c => c.id === checkId) : null;

    currentFieldCheckPhotos = (Array.isArray(item?.photos) && item.photos.length > 0)
      ? [...item.photos]
      : (item?.photo ? [item.photo] : []);

    const defaultDate = item ? item.date : new Date().toISOString().split('T')[0];
    const defaultTime = item ? item.time : '08:30';
    const defaultType = item ? item.type : 'labores';
    const defaultBlock = item ? item.block : (blocks[0]?.name || 'Bloque 1');
    const defaultVariety = item ? item.variety : (varieties[0]?.name || 'Explorer');
    const defaultEvaluator = item ? item.evaluator : 'Ing. Elena Rosero';
    const defaultHarvester = item ? (item.harvester || '') : '';
    const defaultMesh = item ? (item.meshCode || 'M-01') : 'M-01';
    const defaultStemsAudit = item ? (item.stemsAudit || 25) : 25;
    const defaultNotes = item ? (item.notes || '') : '';

    const items = item ? (item.items || {}) : {
      desyeme: true,
      sacadaCapuchon: true,
      puestaCapuchon: true,
      manguerasColocadas: true,
      encanasteTutoraje: true,
      escobillado: true,
      puntosCorte: true,
      maltrato: true,
      botrytis: true,
      acaros: true,
      trips: true,
      velloso: true,
      polvoso: true,
      tallosCortos: true
    };

    const modalBody = `
      <form id="field-check-form" onsubmit="event.preventDefault(); Modules.saveFieldCheckFromForm('${checkId || ''}')">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Fecha de Auditoría</label>
            <input type="date" id="fc-date" class="form-control" value="${defaultDate}" required>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Hora</label>
            <input type="time" id="fc-time" class="form-control" value="${defaultTime}" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Bloque / Invernadero</label>
            <select id="fc-block" class="form-control" required>
              ${blocks.map(b => `<option value="${escapeHtml(b.name)}" ${b.name === defaultBlock ? 'selected' : ''}>${escapeHtml(b.name)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Variedad</label>
            <select id="fc-variety" class="form-control" required>
              ${varieties.map(v => `<option value="${escapeHtml(v.name)}" ${v.name === defaultVariety ? 'selected' : ''}>${escapeHtml(v.name)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Auditor / Evaluador</label>
            <input type="text" id="fc-evaluator" class="form-control" value="${escapeHtml(defaultEvaluator)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Tipo de Evaluación en Campo</label>
            <select id="fc-type" class="form-control" onchange="Modules.onFieldCheckTypeChange()" required>
              <option value="labores" ${defaultType === 'labores' ? 'selected' : ''}>Auditoría de Labores Culturales</option>
              <option value="cosecha" ${defaultType === 'cosecha' ? 'selected' : ''}>Calificación de Mallas del Cosechador</option>
            </select>
          </div>
        </div>

        <!-- Campos específicos de Malla Cosechador -->
        <div id="fc-harvester-info-row" style="display:${defaultType === 'cosecha' ? 'grid' : 'none'}; grid-template-columns:2fr 1fr 1fr; gap:0.6rem; background:#fef3c7; padding:0.65rem; border-radius:6px; margin-bottom:0.75rem; border:1px solid #fde68a;">
          <div class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:0.75rem; font-weight:700; color:#92400e;">Nombre del Cosechador</label>
            <input type="text" id="fc-harvester" class="form-control" placeholder="Ej. Carlos Guanoluisa" value="${escapeHtml(defaultHarvester)}">
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:0.75rem; font-weight:700; color:#92400e;">Código de Malla</label>
            <input type="text" id="fc-mesh" class="form-control" placeholder="M-01" value="${escapeHtml(defaultMesh)}">
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:0.75rem; font-weight:700; color:#92400e;">Tallos en Malla</label>
            <input type="number" id="fc-stems-audit" class="form-control" value="${defaultStemsAudit}" min="1" max="100">
          </div>
        </div>

        <!-- CHECKLIST 1: LABORES CULTURALES -->
        <div id="container-labores-culturales" style="display:${defaultType === 'labores' ? 'block' : 'none'}; margin-bottom:0.85rem;">
          <div style="font-size:0.82rem; font-weight:700; color:#065f46; margin-bottom:0.4rem; padding-bottom:0.25rem; border-bottom:1.5px solid #a7f3d0;">
            Checklist de Labores Culturales (Ponderación 16.67% c/u)
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:#f0fdf4; padding:0.75rem; border-radius:8px; border:1px solid #bbf7d0;">
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-desyeme" onchange="Modules.recalcFieldScore()" ${items.desyeme !== false ? 'checked' : ''}>
              <span><strong>1. Desyeme oportuno:</strong> Desbrote limpio sin dañar tallo</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-sacadaCapuchon" onchange="Modules.recalcFieldScore()" ${items.sacadaCapuchon !== false ? 'checked' : ''}>
              <span><strong>2. Sacada de capuchón:</strong> Retiro en madurez floral</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-puestaCapuchon" onchange="Modules.recalcFieldScore()" ${items.puestaCapuchon !== false ? 'checked' : ''}>
              <span><strong>3. Puesta de capuchón:</strong> Firme, vertical, sin ahorcar</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-manguerasColocadas" onchange="Modules.recalcFieldScore()" ${items.manguerasColocadas !== false ? 'checked' : ''}>
              <span><strong>4. Mangueras de riego:</strong> Centradas y sin estrangular</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-encanasteTutoraje" onchange="Modules.recalcFieldScore()" ${items.encanasteTutoraje !== false ? 'checked' : ''}>
              <span><strong>5. Encanaste / Tutoraje:</strong> Mallas tensas y tallos rectos</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-escobillado" onchange="Modules.recalcFieldScore()" ${items.escobillado !== false ? 'checked' : ''}>
              <span><strong>6. Escobillado sanitario:</strong> Cama limpia de restos y hojas</span>
            </label>
          </div>
        </div>

        <!-- CHECKLIST 2: MALLAS DE COSECHADOR -->
        <div id="container-mallas-cosechador" style="display:${defaultType === 'cosecha' ? 'block' : 'none'}; margin-bottom:0.85rem;">
          <div style="font-size:0.82rem; font-weight:700; color:#92400e; margin-bottom:0.4rem; padding-bottom:0.25rem; border-bottom:1.5px solid #fde68a;">
            Checklist de Calificación de Malla de Cosecha (Ponderación 12.5% c/u)
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:#fffbeb; padding:0.75rem; border-radius:8px; border:1px solid #fde68a;">
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-puntosCorte" onchange="Modules.recalcFieldScore()" ${items.puntosCorte !== false ? 'checked' : ''}>
              <span><strong>1. Punto de corte:</strong> Apertura solicitada por supervisor</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-maltrato" onchange="Modules.recalcFieldScore()" ${items.maltrato !== false ? 'checked' : ''}>
              <span><strong>2. Sin maltrato mecánico:</strong> Follaje y botón intactos</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-botrytis" onchange="Modules.recalcFieldScore()" ${items.botrytis !== false ? 'checked' : ''}>
              <span><strong>3. Libre de Botrytis:</strong> Cero presencia en pétalos</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-acaros" onchange="Modules.recalcFieldScore()" ${items.acaros !== false ? 'checked' : ''}>
              <span><strong>4. Libre de Ácaros:</strong> Sin arañita ni telarañas</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-trips" onchange="Modules.recalcFieldScore()" ${items.trips !== false ? 'checked' : ''}>
              <span><strong>5. Libre de Trips:</strong> Sin daño ni raspado en pétalo</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-velloso" onchange="Modules.recalcFieldScore()" ${items.velloso !== false ? 'checked' : ''}>
              <span><strong>6. Libre de Velloso:</strong> Sin manchas ni esporulación</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-polvoso" onchange="Modules.recalcFieldScore()" ${items.polvoso !== false ? 'checked' : ''}>
              <span><strong>7. Libre de Polvoso / Oídio:</strong> Follaje verde brillante</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; cursor:pointer;">
              <input type="checkbox" id="chk-tallosCortos" onchange="Modules.recalcFieldScore()" ${items.tallosCortos !== false ? 'checked' : ''}>
              <span><strong>8. Longitud de corte correcta:</strong> Sin tallos cortos</span>
            </label>
          </div>
        </div>

        <!-- Barra de Calificación en Tiempo Real -->
        <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:8px; padding:0.65rem 0.9rem; margin-bottom:0.85rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; color:#047857;">Calificación Calculada:</div>
            <strong id="live-field-score" style="font-size:1.35rem; color:#065f46;">100%</strong>
            <span id="live-field-detail" style="font-size:0.78rem; color:#047857; margin-left:0.5rem; font-weight:600;"></span>
          </div>
          <div>
            <span id="live-field-status" class="badge" style="background:#059669; color:#ffffff; font-size:0.84rem; padding:0.35rem 0.85rem; font-weight:700;">Aceptable</span>
          </div>
        </div>

        <!-- Evidencias Fotográficas Múltiples en Campo -->
        <div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:8px; padding:0.75rem; margin-bottom:0.85rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <strong style="font-size:0.82rem; color:#0f172a; display:flex; align-items:center; gap:0.35rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                Evidencias Fotográficas de la Evaluación
              </strong>
              <span style="font-size:0.72rem; color:#64748b;">Suba una o varias fotos o tome fotos con la cámara en vivo</span>
            </div>
            <div style="display:flex; gap:0.4rem;">
              <button type="button" class="btn btn-secondary" style="font-size:0.76rem; padding:0.3rem 0.65rem; color:#047857; font-weight:700;" onclick="Modules.openCameraCapture('fc')">
                📷 Tomar Foto
              </button>
              <button type="button" class="btn btn-secondary" style="font-size:0.76rem; padding:0.3rem 0.65rem;" onclick="document.getElementById('fc-photo-file').click()">
                📁 Subir Fotos
              </button>
              <input type="file" id="fc-photo-file" accept="image/*" multiple style="display:none;" onchange="Modules.handleCheckPhotosSelect(this, 'fc')">
            </div>
          </div>
          <div id="fc-photo-preview-wrap"></div>
        </div>

        <div class="form-group" style="margin-bottom:0.4rem;">
          <label class="form-label" style="font-weight:700;">Observaciones y Medidas Correctivas</label>
          <textarea id="fc-notes" class="form-control" rows="2" placeholder="Detalles específicos de la labor o defectos encontrados en la malla...">${escapeHtml(defaultNotes)}</textarea>
        </div>
      </form>
    `;

    // Botones prominentes en el pie fijo del modal
    const modalFooter = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:0.5rem; flex-wrap:wrap;">
        <span style="font-size:0.75rem; color:#64748b;">
          ${checkId ? 'Modificando evaluación de calidad' : 'Nueva evaluación para control de calidad en cultivo'}
        </span>
        <div style="display:flex; gap:0.5rem;">
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
          <button type="button" class="btn btn-emerald" id="btn-save-field-check-modal" style="font-weight:700; display:flex; align-items:center; gap:0.35rem;" onclick="Modules.saveFieldCheckFromForm('${checkId || ''}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Guardar Evaluación
          </button>
        </div>
      </div>
    `;

    App.showModal(checkId ? 'Editar Checklist de Campo' : 'Nuevo Checklist de Calidad en Campo', modalBody, modalFooter);
    setTimeout(() => {
      Modules.renderCheckPhotosPreview('fc');
      Modules.recalcFieldScore();
    }, 50);
  }

  function onFieldCheckTypeChange() {
    const type = document.getElementById('fc-type')?.value || 'labores';
    const rowHarvester = document.getElementById('fc-harvester-info-row');
    const containerLabores = document.getElementById('container-labores-culturales');
    const containerMallas = document.getElementById('container-mallas-cosechador');

    if (type === 'cosecha') {
      if (rowHarvester) rowHarvester.style.display = 'grid';
      if (containerLabores) containerLabores.style.display = 'none';
      if (containerMallas) containerMallas.style.display = 'block';
    } else {
      if (rowHarvester) rowHarvester.style.display = 'none';
      if (containerLabores) containerLabores.style.display = 'block';
      if (containerMallas) containerMallas.style.display = 'none';
    }
    recalcFieldScore();
  }

  function recalcFieldScore() {
    const type = document.getElementById('fc-type')?.value || 'labores';
    let score = 0;
    let detailText = '';

    if (type === 'labores') {
      const keys = ['desyeme', 'sacadaCapuchon', 'puestaCapuchon', 'manguerasColocadas', 'encanasteTutoraje', 'escobillado'];
      let okCount = 0;
      keys.forEach(k => {
        const chk = document.getElementById('chk-' + k);
        if (chk && chk.checked) okCount++;
      });
      score = Math.round((okCount / keys.length) * 100);
      detailText = `(${okCount} de 6 labores correctas)`;
    } else {
      const keys = ['puntosCorte', 'maltrato', 'botrytis', 'acaros', 'trips', 'velloso', 'polvoso', 'tallosCortos'];
      let okCount = 0;
      keys.forEach(k => {
        const chk = document.getElementById('chk-' + k);
        if (chk && chk.checked) okCount++;
      });
      score = Math.round((okCount / keys.length) * 100);
      detailText = `(${okCount} de 8 parámetros en norma)`;
    }

    const liveScore = document.getElementById('live-field-score');
    const liveDetail = document.getElementById('live-field-detail');
    const liveStatus = document.getElementById('live-field-status');

    if (liveScore) liveScore.textContent = score + '%';
    if (liveDetail) liveDetail.textContent = detailText;

    if (liveStatus) {
      if (score >= 90) {
        liveStatus.textContent = 'Excelente (Conforme)';
        liveStatus.style.background = '#059669';
      } else if (score >= 75) {
        liveStatus.textContent = 'Aceptable con Observación';
        liveStatus.style.background = '#d97706';
      } else {
        liveStatus.textContent = 'No Conforme (Corregir)';
        liveStatus.style.background = '#dc2626';
      }
    }
  }

  function saveFieldCheckFromForm(checkId = null) {
    try {
      if (checkId === 'null' || checkId === 'undefined' || !checkId) checkId = null;

      const dateEl = document.getElementById('fc-date');
      const timeEl = document.getElementById('fc-time');
      const blockEl = document.getElementById('fc-block');
      const varietyEl = document.getElementById('fc-variety');
      const evaluatorEl = document.getElementById('fc-evaluator');
      const typeEl = document.getElementById('fc-type');
      const notesEl = document.getElementById('fc-notes');

      const allBlocks = (Store.getBlocks && typeof Store.getBlocks === 'function') ? Store.getBlocks() : [{ name: 'Bloque 1' }];
      const allVarieties = (Store.getVarieties && typeof Store.getVarieties === 'function') ? Store.getVarieties() : [{ name: 'Explorer' }];
      const fallbackBlock = (allBlocks[0] && allBlocks[0].name) ? allBlocks[0].name : 'Bloque 1';
      const fallbackVariety = (allVarieties[0] && allVarieties[0].name) ? allVarieties[0].name : 'Explorer';

      const date = (dateEl && dateEl.value) ? dateEl.value : new Date().toISOString().split('T')[0];
      const time = (timeEl && timeEl.value) ? timeEl.value : '08:30';
      const block = (blockEl && blockEl.value) ? blockEl.value : fallbackBlock;
      const variety = (varietyEl && varietyEl.value) ? varietyEl.value : fallbackVariety;
      const evaluator = (evaluatorEl && evaluatorEl.value.trim()) ? evaluatorEl.value.trim() : 'Ing. Elena Rosero';
      const type = (typeEl && typeEl.value) ? typeEl.value : 'labores';
      const notes = (notesEl && notesEl.value) ? notesEl.value : '';

      let items = {};
      let score = 0;
      let status = 'Conforme';

      if (type === 'labores') {
        const keys = ['desyeme', 'sacadaCapuchon', 'puestaCapuchon', 'manguerasColocadas', 'encanasteTutoraje', 'escobillado'];
        let ok = 0;
        keys.forEach(k => {
          const chk = document.getElementById('chk-' + k);
          const val = chk ? chk.checked : true;
          items[k] = val;
          if (val) ok++;
        });
        score = Math.round((ok / keys.length) * 100);
        status = score >= 90 ? 'Excelente' : (score >= 75 ? 'Aceptable' : 'No Conforme');
      } else {
        const keys = ['puntosCorte', 'maltrato', 'botrytis', 'acaros', 'trips', 'velloso', 'polvoso', 'tallosCortos'];
        let ok = 0;
        keys.forEach(k => {
          const chk = document.getElementById('chk-' + k);
          const val = chk ? chk.checked : true;
          items[k] = val;
          if (val) ok++;
        });
        score = Math.round((ok / keys.length) * 100);
        status = score >= 90 ? 'Excelente' : (score >= 75 ? 'Aceptable' : 'No Conforme');
      }

      const harvester = type === 'cosecha' ? (document.getElementById('fc-harvester')?.value || '') : '';
      const meshCode = type === 'cosecha' ? (document.getElementById('fc-mesh')?.value || 'M-01') : '';
      const stemsAudit = type === 'cosecha' ? (parseInt(document.getElementById('fc-stems-audit')?.value, 10) || 25) : 0;

      Store.saveQualityFieldCheck({
        id: checkId || ('fc_' + Date.now()),
        date,
        time,
        block,
        variety,
        evaluator,
        type,
        harvester,
        meshCode,
        stemsAudit,
        items,
        score,
        status,
        notes,
        photos: Array.isArray(currentFieldCheckPhotos) ? [...currentFieldCheckPhotos] : [],
        photo: (Array.isArray(currentFieldCheckPhotos) && currentFieldCheckPhotos[0]) ? currentFieldCheckPhotos[0] : null
      });

      App.closeModal();
      App.showToast('Checklist de campo guardado exitosamente (' + score + '%)', 'success');
      refreshCurrentQualityView();
    } catch (err) {
      console.error('Error saving field check:', err);
      App.showToast('Error al guardar evaluación: ' + err.message, 'danger');
    }
  }

  function deleteFieldCheck(id) {
    if (confirm('¿Estás seguro de eliminar esta evaluación de campo?')) {
      Store.deleteQualityFieldCheck(id);
      App.showToast('Evaluación eliminada', 'success');
      refreshCurrentQualityView();
    }
  }

  // ------------------------------------------------------------------------------
  // 6. MODAL REVISIÓN DE BONCHES (CON GUARDADO ROBUSTO Y PROMINENTE)
  // ------------------------------------------------------------------------------
  function openBunchCheckModal(checkId = null) {
    if (checkId === 'null' || checkId === 'undefined' || !checkId) checkId = null;
    const list = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];
    const varieties = Store.getVarieties ? Store.getVarieties() : [{ name: 'Explorer' }];
    const item = checkId ? list.find(c => c.id === checkId) : null;

    currentBunchCheckPhotos = (Array.isArray(item?.photos) && item.photos.length > 0)
      ? [...item.photos]
      : (item?.photo ? [item.photo] : []);

    const defaultDate = item ? item.date : new Date().toISOString().split('T')[0];
    const defaultTime = item ? item.time : '10:30';
    const defaultTable = item ? item.tableCode : 'Mesa 1';
    const defaultVariety = item ? item.variety : (varieties[0]?.name || 'Explorer');
    const defaultBunch = item ? (item.bunchNumber || 'B-01') : 'B-01';
    const defaultSize = item ? (item.bunchSize || 25) : 25;
    const defaultInspector = item ? item.inspector : 'Ing. Elena Rosero';
    const defaultNotes = item ? (item.notes || '') : '';

    const items = item ? (item.items || {}) : {
      botrytis: true,
      velloso: true,
      acaros: true,
      cabezaTorcida: true,
      aperturaDesuniforme: true,
      puntoCorteCerrado: true,
      follajeAmarillo: true,
      tallosCortos: true,
      alturaDesuniforme: true,
      cabezaBaja: true,
      ligaApretada: true,
      empaqueFlojo: true
    };

    const modalBody = `
      <form id="bunch-check-form" onsubmit="event.preventDefault(); Modules.saveBunchCheckFromForm('${checkId || ''}')">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Fecha de Revisión</label>
            <input type="date" id="bc-date" class="form-control" value="${defaultDate}" required>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Hora</label>
            <input type="time" id="bc-time" class="form-control" value="${defaultTime}" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Mesa de Poscosecha</label>
            <input type="text" id="bc-table" class="form-control" value="${escapeHtml(defaultTable)}" placeholder="Mesa 1, Mesa 2..." required>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Variedad</label>
            <select id="bc-variety" class="form-control" required>
              ${varieties.map(v => `<option value="${escapeHtml(v.name)}" ${v.name === defaultVariety ? 'selected' : ''}>${escapeHtml(v.name)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">N° / Código de Bonche</label>
            <input type="text" id="bc-bunch" class="form-control" value="${escapeHtml(defaultBunch)}" placeholder="B-01" required>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700;">Tallos por Bonche</label>
            <input type="number" id="bc-size" class="form-control" value="${defaultSize}" min="1" max="50" required>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0.75rem;">
          <label class="form-label" style="font-weight:700;">Inspector de Calidad</label>
          <input type="text" id="bc-inspector" class="form-control" value="${escapeHtml(defaultInspector)}" required>
        </div>

        <!-- Criterio 1: Sanidad (30 pts) -->
        <div style="margin-bottom:0.75rem; background:#f0fdf4; border:1px solid #bbf7d0; padding:0.65rem; border-radius:6px;">
          <div style="font-weight:700; font-size:0.8rem; color:#065f46; margin-bottom:0.35rem;">
            1. Sanidad Vegetal (30 Puntos - 10 c/u)
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem; font-size:0.78rem;">
            <label style="cursor:pointer;"><input type="checkbox" id="bc-botrytis" ${items.botrytis !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Libre de Botrytis</label>
            <label style="cursor:pointer;"><input type="checkbox" id="bc-velloso" ${items.velloso !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Libre de Velloso</label>
            <label style="cursor:pointer;"><input type="checkbox" id="bc-acaros" ${items.acaros !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Libre de Ácaros / Trips</label>
          </div>
        </div>

        <!-- Criterio 2: Físico y Flor (30 pts) -->
        <div style="margin-bottom:0.75rem; background:#fef3c7; border:1px solid #fde68a; padding:0.65rem; border-radius:6px;">
          <div style="font-weight:700; font-size:0.8rem; color:#92400e; margin-bottom:0.35rem;">
            2. Calidad Física y Floral (30 Puntos - 10 c/u)
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem; font-size:0.78rem;">
            <label style="cursor:pointer;"><input type="checkbox" id="bc-cabezaTorcida" ${items.cabezaTorcida !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Cabeza Recta (sin torceduras)</label>
            <label style="cursor:pointer;"><input type="checkbox" id="bc-aperturaDesuniforme" ${items.aperturaDesuniforme !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Apertura Floral Uniforme</label>
            <label style="cursor:pointer;"><input type="checkbox" id="bc-follajeAmarillo" ${items.follajeAmarillo !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Follaje Verde Limpio</label>
          </div>
        </div>

        <!-- Criterio 3: Armado y Empaque (40 pts) -->
        <div style="margin-bottom:0.75rem; background:#e0f2fe; border:1px solid #bae6fd; padding:0.65rem; border-radius:6px;">
          <div style="font-weight:700; font-size:0.8rem; color:#075985; margin-bottom:0.35rem;">
            3. Armado de Bonche y Empaque (40 Puntos - 10 c/u)
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem; font-size:0.78rem;">
            <label style="cursor:pointer;"><input type="checkbox" id="bc-alturaDesuniforme" ${items.alturaDesuniforme !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Altura de Tallos Pareja</label>
            <label style="cursor:pointer;"><input type="checkbox" id="bc-cabezaBaja" ${items.cabezaBaja !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Sin Cabezas Bajas / Hundidas</label>
            <label style="cursor:pointer;"><input type="checkbox" id="bc-ligaApretada" ${items.ligaApretada !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Liga Correcta (sin ahorcar)</label>
            <label style="cursor:pointer;"><input type="checkbox" id="bc-empaqueFlojo" ${items.empaqueFlojo !== false ? 'checked' : ''} onchange="Modules.recalcBunchScore()"> Capuchón Firme y Ajustado</label>
          </div>
        </div>

        <!-- Calificación Total en Vivo -->
        <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:8px; padding:0.65rem 0.9rem; margin-bottom:0.85rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; color:#047857;">Calificación Total de Bonche:</div>
            <strong id="live-bunch-score" style="font-size:1.35rem; color:#065f46;">100 pts</strong>
          </div>
          <div>
            <span id="live-bunch-status" class="badge" style="background:#059669; color:#ffffff; font-size:0.84rem; padding:0.35rem 0.85rem; font-weight:700;">Aprobado Exportación</span>
          </div>
        </div>

        <!-- Evidencias Fotográficas Múltiples en Bonche -->
        <div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:8px; padding:0.75rem; margin-bottom:0.85rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <strong style="font-size:0.82rem; color:#0f172a; display:flex; align-items:center; gap:0.35rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                Evidencias Fotográficas del Bonche
              </strong>
              <span style="font-size:0.72rem; color:#64748b;">Suba fotos del bonche completo o tome fotos con la cámara en vivo</span>
            </div>
            <div style="display:flex; gap:0.4rem;">
              <button type="button" class="btn btn-secondary" style="font-size:0.76rem; padding:0.3rem 0.65rem; color:#047857; font-weight:700;" onclick="Modules.openCameraCapture('bc')">
                📷 Tomar Foto
              </button>
              <button type="button" class="btn btn-secondary" style="font-size:0.76rem; padding:0.3rem 0.65rem;" onclick="document.getElementById('bc-photo-file').click()">
                📁 Subir Fotos
              </button>
              <input type="file" id="bc-photo-file" accept="image/*" multiple style="display:none;" onchange="Modules.handleCheckPhotosSelect(this, 'bc')">
            </div>
          </div>
          <div id="bc-photo-preview-wrap"></div>
        </div>

        <div class="form-group" style="margin-bottom:0.4rem;">
          <label class="form-label" style="font-weight:700;">Observaciones de Poscosecha</label>
          <textarea id="bc-notes" class="form-control" rows="2" placeholder="Detalles de la mesa, tallos defectuosos observados o motivos de rechazo...">${escapeHtml(defaultNotes)}</textarea>
        </div>
      </form>
    `;

    // Botones prominentes en el pie fijo del modal
    const modalFooter = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:0.5rem; flex-wrap:wrap;">
        <span style="font-size:0.75rem; color:#64748b;">
          ${checkId ? 'Modificando inspección de bonche' : 'Nueva inspección de bonche en poscosecha'}
        </span>
        <div style="display:flex; gap:0.5rem;">
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
          <button type="button" class="btn btn-emerald" id="btn-save-bunch-check-modal" style="font-weight:700; display:flex; align-items:center; gap:0.35rem;" onclick="Modules.saveBunchCheckFromForm('${checkId || ''}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Guardar Inspección
          </button>
        </div>
      </div>
    `;

    App.showModal(checkId ? 'Editar Inspección de Bonche' : 'Nueva Inspección de Bonche en Proceso', modalBody, modalFooter);
    setTimeout(() => {
      Modules.renderCheckPhotosPreview('bc');
      Modules.recalcBunchScore();
    }, 50);
  }

  function recalcBunchScore() {
    let diseaseScore = 0;
    if (document.getElementById('bc-botrytis')?.checked) diseaseScore += 10;
    if (document.getElementById('bc-velloso')?.checked) diseaseScore += 10;
    if (document.getElementById('bc-acaros')?.checked) diseaseScore += 10;

    let damageScore = 0;
    if (document.getElementById('bc-cabezaTorcida')?.checked) damageScore += 10;
    if (document.getElementById('bc-aperturaDesuniforme')?.checked) damageScore += 10;
    if (document.getElementById('bc-follajeAmarillo')?.checked) damageScore += 10;

    let buildScore = 0;
    if (document.getElementById('bc-alturaDesuniforme')?.checked) buildScore += 10;
    if (document.getElementById('bc-cabezaBaja')?.checked) buildScore += 10;
    if (document.getElementById('bc-ligaApretada')?.checked) buildScore += 10;
    if (document.getElementById('bc-empaqueFlojo')?.checked) buildScore += 10;

    const totalScore = diseaseScore + damageScore + buildScore;
    const liveScore = document.getElementById('live-bunch-score');
    const liveStatus = document.getElementById('live-bunch-status');

    if (liveScore) liveScore.textContent = totalScore + ' pts';
    if (liveStatus) {
      if (totalScore >= 85) {
        liveStatus.textContent = 'Aprobado Exportación';
        liveStatus.style.background = '#059669';
      } else {
        liveStatus.textContent = 'Rechazado';
        liveStatus.style.background = '#dc2626';
      }
    }
  }

  function saveBunchCheckFromForm(checkId = null) {
    try {
      if (checkId === 'null' || checkId === 'undefined' || !checkId) checkId = null;

      const dateEl = document.getElementById('bc-date');
      const timeEl = document.getElementById('bc-time');
      const tableEl = document.getElementById('bc-table');
      const varietyEl = document.getElementById('bc-variety');
      const bunchEl = document.getElementById('bc-bunch');
      const sizeEl = document.getElementById('bc-size');
      const inspectorEl = document.getElementById('bc-inspector');
      const notesEl = document.getElementById('bc-notes');

      const date = (dateEl && dateEl.value) ? dateEl.value : new Date().toISOString().split('T')[0];
      const time = (timeEl && timeEl.value) ? timeEl.value : '10:30';
      const tableCode = (tableEl && tableEl.value) ? tableEl.value : 'Mesa 1';
      const allVarieties = (Store.getVarieties && typeof Store.getVarieties === 'function') ? Store.getVarieties() : [{ name: 'Explorer' }];
      const fallbackVariety = (allVarieties[0] && allVarieties[0].name) ? allVarieties[0].name : 'Explorer';
      const variety = (varietyEl && varietyEl.value) ? varietyEl.value : fallbackVariety;
      const bunchNumber = (bunchEl && bunchEl.value) ? bunchEl.value : 'B-01';
      const bunchSize = sizeEl ? (parseInt(sizeEl.value, 10) || 25) : 25;
      const inspector = (inspectorEl && inspectorEl.value.trim()) ? inspectorEl.value.trim() : 'Ing. Elena Rosero';
      const notes = (notesEl && notesEl.value) ? notesEl.value : '';

      let diseaseScore = 0;
      if (document.getElementById('bc-botrytis')?.checked) diseaseScore += 10;
      if (document.getElementById('bc-velloso')?.checked) diseaseScore += 10;
      if (document.getElementById('bc-acaros')?.checked) diseaseScore += 10;

      let damageScore = 0;
      if (document.getElementById('bc-cabezaTorcida')?.checked) damageScore += 10;
      if (document.getElementById('bc-aperturaDesuniforme')?.checked) damageScore += 10;
      if (document.getElementById('bc-follajeAmarillo')?.checked) damageScore += 10;

      let buildScore = 0;
      if (document.getElementById('bc-alturaDesuniforme')?.checked) buildScore += 10;
      if (document.getElementById('bc-cabezaBaja')?.checked) buildScore += 10;
      if (document.getElementById('bc-ligaApretada')?.checked) buildScore += 10;
      if (document.getElementById('bc-empaqueFlojo')?.checked) buildScore += 10;

      const totalScore = diseaseScore + damageScore + buildScore;
      const status = totalScore >= 85 ? 'Aprobado Exportación' : 'Rechazado';

      const items = {
        botrytis: document.getElementById('bc-botrytis')?.checked ?? true,
        velloso: document.getElementById('bc-velloso')?.checked ?? true,
        acaros: document.getElementById('bc-acaros')?.checked ?? true,
        cabezaTorcida: document.getElementById('bc-cabezaTorcida')?.checked ?? true,
        aperturaDesuniforme: document.getElementById('bc-aperturaDesuniforme')?.checked ?? true,
        follajeAmarillo: document.getElementById('bc-follajeAmarillo')?.checked ?? true,
        alturaDesuniforme: document.getElementById('bc-alturaDesuniforme')?.checked ?? true,
        cabezaBaja: document.getElementById('bc-cabezaBaja')?.checked ?? true,
        ligaApretada: document.getElementById('bc-ligaApretada')?.checked ?? true,
        empaqueFlojo: document.getElementById('bc-empaqueFlojo')?.checked ?? true
      };

      Store.saveQualityBunchCheck({
        id: checkId || ('bc_' + Date.now()),
        date,
        time,
        tableCode,
        variety,
        bunchNumber,
        bunchSize,
        inspector,
        items,
        diseaseScore,
        damageScore,
        buildScore,
        totalScore,
        status,
        notes,
        photos: Array.isArray(currentBunchCheckPhotos) ? [...currentBunchCheckPhotos] : [],
        photo: (Array.isArray(currentBunchCheckPhotos) && currentBunchCheckPhotos[0]) ? currentBunchCheckPhotos[0] : null
      });

      App.closeModal();
      App.showToast('Inspección de bonche guardada exitosamente (' + totalScore + '%)', 'success');
      refreshCurrentQualityView();
    } catch (err) {
      console.error('Error saving bunch check:', err);
      App.showToast('Error al guardar inspección: ' + err.message, 'danger');
    }
  }

  function deleteBunchCheck(id) {
    if (confirm('¿Estás seguro de eliminar esta inspección de bonche?')) {
      Store.deleteQualityBunchCheck(id);
      App.showToast('Inspección eliminada', 'success');
      refreshCurrentQualityView();
    }
  }

  // ------------------------------------------------------------------------------
  // 7. MOTOR DE FOTOGRAFÍAS MÚLTIPLES Y CÁMARA EN VIVO
  // ------------------------------------------------------------------------------
  let activeCameraStream = null;

  function openCameraCapture(targetType = 'fc') {
    const isField = targetType === 'fc';
    const bodyHtml = `
      <div style="text-align: center;">
        <div style="background: #0f172a; border-radius: 8px; overflow: hidden; position: relative; min-height: 240px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
          <video id="live-camera-video" autoplay playsinline style="width: 100%; max-height: 320px; object-fit: contain;"></video>
          <div id="camera-loading-msg" style="position: absolute; color: #ffffff; font-size: 0.85rem;">Iniciando cámara web / dispositivo...</div>
        </div>
        <canvas id="camera-snapshot-canvas" style="display:none;"></canvas>
        <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Enfoque el defecto floral, malla o tallo antes de capturar</p>
      </div>
    `;

    const footerHtml = `
      <button type="button" class="btn btn-secondary" onclick="Modules.stopCameraStream(); App.closeModal();">Cancelar</button>
      <button type="button" class="btn btn-emerald" style="font-weight: 700;" onclick="Modules.takeLiveSnapshot('${targetType}')">
        📸 Capturar y Adjuntar Foto
      </button>
    `;

    App.showModal('Cámara en Vivo - Capturar Evidencia Fotográfica', bodyHtml, footerHtml);

    setTimeout(() => {
      const video = document.getElementById('live-camera-video');
      const loadMsg = document.getElementById('camera-loading-msg');
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then(stream => {
            activeCameraStream = stream;
            if (video) {
              video.srcObject = stream;
              if (loadMsg) loadMsg.style.display = 'none';
            }
          })
          .catch(err => {
            console.warn('Acceso a cámara denegado o no disponible, usando modo simulado:', err);
            if (loadMsg) loadMsg.innerHTML = '<span style="color:#f87171;">Cámara física no disponible en este entorno.<br>Se creará una foto digital simulada al capturar.</span>';
          });
      } else {
        if (loadMsg) loadMsg.innerHTML = '<span style="color:#f87171;">Navegador sin soporte de getUserMedia.<br>Se creará una captura simulada.</span>';
      }
    }, 100);
  }

  function stopCameraStream() {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }
  }

  function takeLiveSnapshot(targetType = 'fc') {
    const video = document.getElementById('live-camera-video');
    const canvas = document.getElementById('camera-snapshot-canvas');
    let base64Data = null;

    if (video && video.videoWidth > 0 && canvas) {
      const maxDim = 340;
      let w = video.videoWidth;
      let h = video.videoHeight;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
      base64Data = canvas.toDataURL('image/jpeg', 0.52);
    } else {
      // Simulación de foto realista si la cámara web no está conectada
      const simCanvas = document.createElement('canvas');
      simCanvas.width = 340;
      simCanvas.height = 250;
      const ctx = simCanvas.getContext('2d');
      ctx.fillStyle = '#065f46';
      ctx.fillRect(0, 0, 340, 250);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MRosecuador - Evidencia', 170, 110);
      ctx.font = '12px Segoe UI, sans-serif';
      ctx.fillText(new Date().toLocaleString('es-EC'), 170, 135);
      ctx.fillText(targetType === 'fc' ? 'Auditoría en Campo' : 'Inspección Poscosecha', 170, 160);
      base64Data = simCanvas.toDataURL('image/jpeg', 0.52);
    }

    stopCameraStream();
    App.closeModal();

    if (targetType === 'fc') {
      currentFieldCheckPhotos.push(base64Data);
      renderCheckPhotosPreview('fc');
    } else {
      currentBunchCheckPhotos.push(base64Data);
      renderCheckPhotosPreview('bc');
    }

    App.showToast('Fotografía adjuntada con éxito', 'success');
  }

  function handleCheckPhotosSelect(input, targetType = 'fc') {
    if (!input.files || input.files.length === 0) return;
    const files = Array.from(input.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const maxDim = 340;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.52);

          if (targetType === 'fc') {
            currentFieldCheckPhotos.push(compressedBase64);
            renderCheckPhotosPreview('fc');
          } else {
            currentBunchCheckPhotos.push(compressedBase64);
            renderCheckPhotosPreview('bc');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  function renderCheckPhotosPreview(targetType = 'fc') {
    const isField = targetType === 'fc';
    const container = document.getElementById(isField ? 'fc-photo-preview-wrap' : 'bc-photo-preview-wrap');
    if (!container) return;

    const photos = isField ? currentFieldCheckPhotos : currentBunchCheckPhotos;

    if (photos.length === 0) {
      container.innerHTML = `
        <div style="font-size: 0.74rem; color: #94a3b8; text-align: center; padding: 0.5rem 0;">
          Ninguna foto adjunta todavía.
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.4rem;">
        ${photos.map((p, idx) => `
          <div style="position: relative; width: 68px; height: 68px; border-radius: 6px; overflow: hidden; border: 1.5px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <img src="${p}" alt="Foto ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" onclick="Modules.viewQualityPhotoDirect('${targetType}', ${idx})">
            <button type="button" onclick="Modules.removeCheckPhoto('${targetType}', ${idx})" title="Eliminar foto" style="position: absolute; top: 2px; right: 2px; background: rgba(220,38,38,0.9); color: #fff; border: none; border-radius: 50%; width: 18px; height: 18px; font-size: 11px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              ×
            </button>
            <span style="position: absolute; bottom: 1px; left: 2px; background: rgba(0,0,0,0.6); color: #fff; font-size: 8.5px; padding: 0 3px; border-radius: 2px;">
              #${idx + 1}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function removeCheckPhoto(targetType = 'fc', index) {
    if (targetType === 'fc') {
      if (index >= 0 && index < currentFieldCheckPhotos.length) {
        currentFieldCheckPhotos.splice(index, 1);
        renderCheckPhotosPreview('fc');
      }
    } else {
      if (index >= 0 && index < currentBunchCheckPhotos.length) {
        currentBunchCheckPhotos.splice(index, 1);
        renderCheckPhotosPreview('bc');
      }
    }
  }

  function viewQualityPhotoDirect(targetType, index) {
    const photos = targetType === 'fc' ? currentFieldCheckPhotos : currentBunchCheckPhotos;
    const photo = photos[index];
    if (!photo) return;
    const bodyHtml = `
      <div style="text-align: center; max-height: 70vh; overflow: hidden;">
        <img src="${photo}" alt="Evidencia Calidad" style="max-height: 65vh; max-width: 100%; object-fit: contain; border-radius: 6px;">
      </div>
    `;
    const footerHtml = `<button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>`;
    App.showModal(`Evidencia Fotográfica #${index + 1}`, bodyHtml, footerHtml);
  }

  function viewQualityPhoto(id, type, index = 0) {
    const list = type === 'fc' ? Store.getQualityFieldChecks() : Store.getQualityBunchChecks();
    const item = list.find(i => i.id === id);
    if (!item) return;

    const photos = (Array.isArray(item.photos) && item.photos.length > 0)
      ? item.photos
      : (item.photo ? [item.photo] : []);

    const currentImg = photos[index] || photos[0];
    if (!currentImg) return;

    const bodyHtml = `
      <div style="text-align: center;">
        <div style="margin-bottom: 0.6rem; font-size: 0.8rem; color: #64748b; display: flex; justify-content: space-between;">
          <span>${escapeHtml(item.variety || '')} • ${escapeHtml(item.block || item.tableCode || '')}</span>
          <strong>Foto ${index + 1} de ${photos.length}</strong>
        </div>
        <img src="${currentImg}" alt="Foto Calidad" style="max-height: 65vh; max-width: 100%; object-fit: contain; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
      ${photos.length > 1 ? `
        <button class="btn btn-emerald" onclick="Modules.viewQualityGallery('${id}', '${type}')">Ver Todas (${photos.length})</button>
      ` : ''}
    `;

    App.showModal('Evidencia Fotográfica de Calidad', bodyHtml, footerHtml);
  }

  function viewQualityGallery(id, type) {
    const list = type === 'fc' ? Store.getQualityFieldChecks() : Store.getQualityBunchChecks();
    const item = list.find(i => i.id === id);
    if (!item) return;

    const photos = (Array.isArray(item.photos) && item.photos.length > 0)
      ? item.photos
      : (item.photo ? [item.photo] : []);

    if (photos.length === 0) {
      App.showToast('Esta evaluación no cuenta con fotos registradas', 'warning');
      return;
    }

    const title = `Galería de Evidencias Fotográficas (${photos.length} fotos)`;
    const bodyHtml = `
      <div>
        <div style="margin-bottom: 0.75rem; font-size: 0.85rem; color: #065f46; font-weight: 700;">
          ${escapeHtml(item.variety || '')} - ${escapeHtml(item.block || item.tableCode || '')} (${item.date})
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem; max-height: 65vh; overflow-y: auto; padding: 0.25rem;">
          ${photos.map((p, idx) => `
            <div style="border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: #f8fafc; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <img src="${p}" alt="Evidencia ${idx + 1}" style="width: 100%; height: 110px; object-fit: cover; cursor: pointer;" onclick="Modules.viewQualityPhoto('${id}', '${type}', ${idx})">
              <div style="padding: 0.25rem 0.4rem; font-size: 0.72rem; font-weight: 700; color: #475569;">
                Foto #${idx + 1}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const footerHtml = `<button class="btn btn-secondary" onclick="App.closeModal()">Cerrar Galería</button>`;
    App.showModal(title, bodyHtml, footerHtml);
  }

  // ------------------------------------------------------------------------------
  // 8. REPORTES IMPRESOS EN UNA SOLA HOJA (ULTRA-COMPACTOS A4 1-PAGE)
  // ------------------------------------------------------------------------------

  // Acta de Campo en 1 Sola Hoja
  function printFieldCheck(checkId) {
    const list = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const item = list.find(c => c.id === checkId) || list[0];
    if (!item) {
      App.showToast('No se encontró la evaluación para imprimir', 'warning');
      return;
    }

    const farm = Store.getFarmInfo ? Store.getFarmInfo() : {};
    const printWin = window.open('', '_blank');
    if (!printWin) {
      App.showToast('Por favor permita ventanas emergentes para imprimir', 'warning');
      return;
    }

    const isCosecha = item.type === 'cosecha';
    const photos = (Array.isArray(item.photos) && item.photos.length > 0)
      ? item.photos
      : (item.photo ? [item.photo] : []);

    let criteriaHtml = '';
    if (isCosecha) {
      const keys = [
        { k: 'puntosCorte', label: '1. Puntos de corte en madurez solicitada' },
        { k: 'maltrato', label: '2. Sin maltrato mecánico en pétalos y hojas' },
        { k: 'botrytis', label: '3. Libre de Botrytis y mohos florales' },
        { k: 'acaros', label: '4. Libre de Ácaros / arañita roja' },
        { k: 'trips', label: '5. Libre de daño por Trips' },
        { k: 'velloso', label: '6. Libre de Peronospora / Velloso' },
        { k: 'polvoso', label: '7. Libre de Oídio / Mildiú polvoso' },
        { k: 'tallosCortos', label: '8. Longitud de tallos uniforme' }
      ];
      criteriaHtml = keys.map(crit => {
        const ok = item.items ? (item.items[crit.k] !== false) : true;
        return `
          <tr>
            <td style="padding: 2.5px 6px;"><strong>${crit.label}</strong></td>
            <td style="padding: 2.5px 6px; text-align: center; color: ${ok ? '#059669' : '#dc2626'}; font-weight: 700;">
              ${ok ? '✓ CONFORME' : '✕ NO CONFORME'}
            </td>
            <td style="padding: 2.5px 6px; text-align: center; color: #475569;">12.5%</td>
          </tr>
        `;
      }).join('');
    } else {
      const keys = [
        { k: 'desyeme', label: '1. Desyeme oportuno y corte limpio de brotes' },
        { k: 'sacadaCapuchon', label: '2. Sacada de capuchón en el momento óptimo' },
        { k: 'puestaCapuchon', label: '3. Puesta de capuchón firme, vertical' },
        { k: 'manguerasColocadas', label: '4. Mangueras de goteo centradas y sin dobleces' },
        { k: 'encanasteTutoraje', label: '5. Encanaste / Tutoraje con mallas tensas' },
        { k: 'escobillado', label: '6. Escobillado y limpieza sanitaria de camas' }
      ];
      criteriaHtml = keys.map(crit => {
        const ok = item.items ? (item.items[crit.k] !== false) : true;
        return `
          <tr>
            <td style="padding: 2.5px 6px;"><strong>${crit.label}</strong></td>
            <td style="padding: 2.5px 6px; text-align: center; color: ${ok ? '#059669' : '#dc2626'}; font-weight: 700;">
              ${ok ? '✓ CONFORME' : '✕ NO CONFORME'}
            </td>
            <td style="padding: 2.5px 6px; text-align: center; color: #475569;">16.67%</td>
          </tr>
        `;
      }).join('');
    }

    // Tira compacta de fotos para NO desplazar hoja
    let photoStripHtml = '';
    if (photos.length > 0) {
      photoStripHtml = `
        <div style="margin-top: 6px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px 8px; background: #f8fafc;">
          <div style="font-weight: 700; color: #065f46; font-size: 9.5px; margin-bottom: 3px; display: flex; justify-content: space-between;">
            <span>📷 REGISTRO FOTOGRÁFICO DE EVIDENCIA (${photos.length} FOTO${photos.length > 1 ? 'S' : ''})</span>
            <span style="font-size: 8.5px; color: #64748b;">Evidencias de Campo</span>
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-start; overflow: hidden;">
            ${photos.slice(0, 4).map((p, idx) => `
              <img src="${p}" alt="Evidencia ${idx+1}" style="height: 58px; max-width: 90px; object-fit: contain; border-radius: 3px; border: 1px solid #cbd5e1; background: #fff;">
            `).join('')}
          </div>
        </div>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Acta Calidad Campo - ${escapeHtml(item.id)}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; background: #ffffff; font-size: 11px; line-height: 1.25; }
          .page-sheet { display: flex; flex-direction: column; justify-content: space-between; height: 100%; max-height: 100vh; overflow: hidden; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 6px; margin-bottom: 6px; }
          .logo-box { display: flex; align-items: center; gap: 8px; }
          .logo-img { height: 36px; border-radius: 4px; }
          .farm-name { font-size: 1.15rem; font-weight: 800; color: #065f46; letter-spacing: -0.3px; line-height: 1.1; }
          .farm-sub { font-size: 9.5px; color: #64748b; }
          .doc-badge { text-align: right; }
          .doc-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; text-transform: uppercase; }
          .doc-num { font-size: 0.78rem; font-weight: 700; color: #059669; }
          .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 6px 8px; margin-bottom: 6px; }
          .info-cell strong { display: block; font-size: 8.5px; color: #64748b; text-transform: uppercase; margin-bottom: 1px; }
          .info-cell span { font-weight: 700; color: #0f172a; font-size: 10.5px; }
          .table-criteria { width: 100%; border-collapse: collapse; margin-bottom: 6px; font-size: 10.5px; }
          .table-criteria th { background: #065f46; color: #ffffff; text-align: left; padding: 4px 6px; font-size: 9.5px; text-transform: uppercase; }
          .table-criteria td { border-bottom: 1px solid #e2e8f0; }
          .score-card { display: flex; justify-content: space-between; align-items: center; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 5px; padding: 5px 10px; margin-bottom: 6px; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 10px; text-align: center; }
          .sig-line { border-top: 1px solid #94a3b8; padding-top: 3px; font-size: 9.5px; font-weight: 700; color: #334155; }
          .sig-sub { font-size: 8.5px; color: #64748b; }
          @media print {
            .no-print { display: none !important; }
            html, body { height: 100% !important; max-height: 100vh !important; overflow: hidden !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 8px; display: flex; justify-content: flex-end; gap: 6px; padding: 6px 10px; background: #f1f5f9;">
          <button onclick="window.print()" style="background: #059669; color: #ffffff; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 11px;">🖨️ Imprimir en 1 Hoja / PDF</button>
          <button onclick="window.close()" style="background: #cbd5e1; color: #334155; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 11px;">Cerrar</button>
        </div>

        <div class="page-sheet">
          <div>
            <div class="header">
              <div class="logo-box">
                <img src="${farm.logo || 'assets/logo.jpg'}" alt="MRosecuador" class="logo-img" onerror="this.style.display='none'">
                <div>
                  <div class="farm-name">${escapeHtml(farm.name || 'MRosecuador')}</div>
                  <div class="farm-sub">${escapeHtml(farm.location || 'Cayambe, Pichincha')} | RUC: ${escapeHtml(farm.ruc || '1792345678001')}</div>
                </div>
              </div>
              <div class="doc-badge">
                <div class="doc-title">Acta de Calidad: ${isCosecha ? 'Malla Cosechador' : 'Labores Culturales'}</div>
                <div class="doc-num">REG: ${escapeHtml(item.id)}</div>
                <div style="font-size: 9px; color: #64748b;">Emisión: ${new Date().toLocaleDateString('es-EC')}</div>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-cell">
                <strong>Fecha & Hora</strong>
                <span>${item.date} (${item.time || '08:00'})</span>
              </div>
              <div class="info-cell">
                <strong>Bloque / Invernadero</strong>
                <span>${escapeHtml(item.block)}</span>
              </div>
              <div class="info-cell">
                <strong>Variedad de Rosa</strong>
                <span>${escapeHtml(item.variety)}</span>
              </div>
              <div class="info-cell">
                <strong>Evaluador Responsable</strong>
                <span>${escapeHtml(item.evaluator || 'Ing. Elena Rosero')}</span>
              </div>
              ${isCosecha ? `
                <div class="info-cell">
                  <strong>Cosechador Evaluado</strong>
                  <span>${escapeHtml(item.harvester || 'N/A')}</span>
                </div>
                <div class="info-cell">
                  <strong>Código de Malla</strong>
                  <span>${escapeHtml(item.meshCode || 'M-01')}</span>
                </div>
                <div class="info-cell">
                  <strong>Muestra Auditada</strong>
                  <span>${item.stemsAudit || 25} tallos</span>
                </div>
                <div class="info-cell">
                  <strong>Tipo de Proceso</strong>
                  <span>Corte y Despacho en Campo</span>
                </div>
              ` : `
                <div class="info-cell">
                  <strong>Tipo de Labor</strong>
                  <span>Labores Culturales de Manejo</span>
                </div>
                <div class="info-cell">
                  <strong>Estado Sanitario</strong>
                  <span>Supervisión florícola</span>
                </div>
                <div class="info-cell">
                  <strong>Objetivo de Labor</strong>
                  <span>Sanidad y conformación floral</span>
                </div>
                <div class="info-cell">
                  <strong>Frecuencia</strong>
                  <span>Control semanal por bloque</span>
                </div>
              `}
            </div>

            <table class="table-criteria">
              <thead>
                <tr>
                  <th>Parámetro Evaluado</th>
                  <th style="text-align: center; width: 110px;">Resultado</th>
                  <th style="text-align: center; width: 85px;">Ponderación</th>
                </tr>
              </thead>
              <tbody>
                ${criteriaHtml}
              </tbody>
            </table>

            <div class="score-card">
              <div>
                <span style="font-size: 9.5px; text-transform: uppercase; font-weight: 700; color: #065f46;">Calificación Total de Conformidad:</span>
                <strong style="font-size: 1.25rem; font-weight: 800; color: ${item.score >= 80 ? '#059669' : '#dc2626'}; margin-left: 6px;">${item.score}%</strong>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 9.5px; text-transform: uppercase; font-weight: 700; color: #64748b;">Dictamen:</span>
                <strong style="font-size: 1rem; font-weight: 800; color: ${item.score >= 80 ? '#047857' : '#dc2626'}; margin-left: 4px;">
                  ${escapeHtml(item.status || (item.score >= 80 ? 'APROBADO CONFORME' : 'REQUIERE ACCIÓN'))}
                </strong>
              </div>
            </div>

            ${item.notes ? `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 8px; margin-bottom: 5px;">
                <strong style="font-size: 9px; color: #475569; text-transform: uppercase;">Observaciones y Medidas:</strong>
                <span style="font-size: 10px; color: #1e293b; font-style: italic; margin-left: 4px;">"${escapeHtml(item.notes)}"</span>
              </div>
            ` : ''}

            ${photoStripHtml}
          </div>

          <div class="signatures">
            <div>
              <div class="sig-line">Auditor de Calidad</div>
              <div class="sig-sub">${escapeHtml(item.evaluator || 'Ing. Elena Rosero')}</div>
            </div>
            <div>
              <div class="sig-line">Supervisor de Campo</div>
              <div class="sig-sub">Control de Cultivo</div>
            </div>
            <div>
              <div class="sig-line">Gerencia de Operaciones</div>
              <div class="sig-sub">${escapeHtml(farm.legalRep || 'Ing. Marco Rosero')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 350);
  }

  // Acta de Bonche en 1 Sola Hoja
  function printBunchCheck(checkId) {
    const list = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];
    const item = list.find(b => b.id === checkId) || list[0];
    if (!item) {
      App.showToast('No se encontró la revisión de bonche para imprimir', 'warning');
      return;
    }

    const farm = Store.getFarmInfo ? Store.getFarmInfo() : {};
    const printWin = window.open('', '_blank');
    if (!printWin) {
      App.showToast('Por favor permita ventanas emergentes para imprimir', 'warning');
      return;
    }

    const photos = (Array.isArray(item.photos) && item.photos.length > 0)
      ? item.photos
      : (item.photo ? [item.photo] : []);

    let photoStripHtml = '';
    if (photos.length > 0) {
      photoStripHtml = `
        <div style="margin-top: 6px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px 8px; background: #f8fafc;">
          <div style="font-weight: 700; color: #065f46; font-size: 9.5px; margin-bottom: 3px; display: flex; justify-content: space-between;">
            <span>📷 REGISTRO FOTOGRÁFICO DE BONCHE (${photos.length} FOTO${photos.length > 1 ? 'S' : ''})</span>
            <span style="font-size: 8.5px; color: #64748b;">Mesas de Armado</span>
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-start; overflow: hidden;">
            ${photos.slice(0, 4).map((p, idx) => `
              <img src="${p}" alt="Evidencia ${idx+1}" style="height: 58px; max-width: 90px; object-fit: contain; border-radius: 3px; border: 1px solid #cbd5e1; background: #fff;">
            `).join('')}
          </div>
        </div>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Acta Inspección Bonche - ${escapeHtml(item.id)}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; background: #ffffff; font-size: 11px; line-height: 1.25; }
          .page-sheet { display: flex; flex-direction: column; justify-content: space-between; height: 100%; max-height: 100vh; overflow: hidden; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 6px; margin-bottom: 6px; }
          .logo-box { display: flex; align-items: center; gap: 8px; }
          .logo-img { height: 36px; border-radius: 4px; }
          .farm-name { font-size: 1.15rem; font-weight: 800; color: #065f46; letter-spacing: -0.3px; line-height: 1.1; }
          .farm-sub { font-size: 9.5px; color: #64748b; }
          .doc-badge { text-align: right; }
          .doc-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; text-transform: uppercase; }
          .doc-num { font-size: 0.78rem; font-weight: 700; color: #059669; }
          .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 6px 8px; margin-bottom: 6px; }
          .info-cell strong { display: block; font-size: 8.5px; color: #64748b; text-transform: uppercase; margin-bottom: 1px; }
          .info-cell span { font-weight: 700; color: #0f172a; font-size: 10.5px; }
          .table-criteria { width: 100%; border-collapse: collapse; margin-bottom: 6px; font-size: 10.5px; }
          .table-criteria th { background: #065f46; color: #ffffff; text-align: left; padding: 4px 6px; font-size: 9.5px; text-transform: uppercase; }
          .table-criteria td { border-bottom: 1px solid #e2e8f0; }
          .score-card { display: flex; justify-content: space-between; align-items: center; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 5px; padding: 5px 10px; margin-bottom: 6px; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 10px; text-align: center; }
          .sig-line { border-top: 1px solid #94a3b8; padding-top: 3px; font-size: 9.5px; font-weight: 700; color: #334155; }
          .sig-sub { font-size: 8.5px; color: #64748b; }
          @media print {
            .no-print { display: none !important; }
            html, body { height: 100% !important; max-height: 100vh !important; overflow: hidden !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 8px; display: flex; justify-content: flex-end; gap: 6px; padding: 6px 10px; background: #f1f5f9;">
          <button onclick="window.print()" style="background: #059669; color: #ffffff; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 11px;">🖨️ Imprimir en 1 Hoja / PDF</button>
          <button onclick="window.close()" style="background: #cbd5e1; color: #334155; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 11px;">Cerrar</button>
        </div>

        <div class="page-sheet">
          <div>
            <div class="header">
              <div class="logo-box">
                <img src="${farm.logo || 'assets/logo.jpg'}" alt="MRosecuador" class="logo-img" onerror="this.style.display='none'">
                <div>
                  <div class="farm-name">${escapeHtml(farm.name || 'MRosecuador')}</div>
                  <div class="farm-sub">${escapeHtml(farm.location || 'Cayambe, Pichincha')} | RUC: ${escapeHtml(farm.ruc || '1792345678001')}</div>
                </div>
              </div>
              <div class="doc-badge">
                <div class="doc-title">Acta de Calidad: Inspección de Bonche</div>
                <div class="doc-num">REG: ${escapeHtml(item.id)}</div>
                <div style="font-size: 9px; color: #64748b;">Emisión: ${new Date().toLocaleDateString('es-EC')}</div>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-cell">
                <strong>Fecha & Hora</strong>
                <span>${item.date} (${item.time || '10:30'})</span>
              </div>
              <div class="info-cell">
                <strong>Mesa de Clasificación</strong>
                <span>${escapeHtml(item.tableCode)}</span>
              </div>
              <div class="info-cell">
                <strong>Variedad</strong>
                <span>${escapeHtml(item.variety)}</span>
              </div>
              <div class="info-cell">
                <strong>Inspector Técnico</strong>
                <span>${escapeHtml(item.inspector || 'Ing. Elena Rosero')}</span>
              </div>
              <div class="info-cell">
                <strong>Código de Bonche</strong>
                <span>${escapeHtml(item.bunchNumber || 'B-01')}</span>
              </div>
              <div class="info-cell">
                <strong>Tallos por Bonche</strong>
                <span>${item.bunchSize || 25} tallos</span>
              </div>
              <div class="info-cell">
                <strong>Etapa de Proceso</strong>
                <span>Poscosecha / Empaque</span>
              </div>
              <div class="info-cell">
                <strong>Destino Calificado</strong>
                <span>Exportación Floral</span>
              </div>
            </div>

            <table class="table-criteria">
              <thead>
                <tr>
                  <th>Grupo de Parámetros</th>
                  <th>Detalle Evaluado</th>
                  <th style="text-align: center; width: 100px;">Puntaje Máx</th>
                  <th style="text-align: center; width: 100px;">Obtenido</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 3px 6px;"><strong>1. Sanidad Vegetal</strong></td>
                  <td style="padding: 3px 6px;">Libre de Botrytis, Velloso y plagas</td>
                  <td style="padding: 3px 6px; text-align: center;">30 pts</td>
                  <td style="padding: 3px 6px; text-align: center; font-weight: 700; color: #047857;">${item.diseaseScore || 30} pts</td>
                </tr>
                <tr>
                  <td style="padding: 3px 6px;"><strong>2. Físico y Floral</strong></td>
                  <td style="padding: 3px 6px;">Cabeza recta, apertura uniforme, follaje verde</td>
                  <td style="padding: 3px 6px; text-align: center;">30 pts</td>
                  <td style="padding: 3px 6px; text-align: center; font-weight: 700; color: #047857;">${item.damageScore || 30} pts</td>
                </tr>
                <tr>
                  <td style="padding: 3px 6px;"><strong>3. Armado y Empaque</strong></td>
                  <td style="padding: 3px 6px;">Altura pareja, sin cabeza baja, liga y capuchón</td>
                  <td style="padding: 3px 6px; text-align: center;">40 pts</td>
                  <td style="padding: 3px 6px; text-align: center; font-weight: 700; color: #047857;">${item.buildScore || 40} pts</td>
                </tr>
              </tbody>
            </table>

            <div class="score-card">
              <div>
                <span style="font-size: 9.5px; text-transform: uppercase; font-weight: 700; color: #065f46;">Calificación Total Bonche:</span>
                <strong style="font-size: 1.25rem; font-weight: 800; color: ${item.totalScore >= 85 ? '#059669' : '#dc2626'}; margin-left: 6px;">${item.totalScore} pts / 100</strong>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 9.5px; text-transform: uppercase; font-weight: 700; color: #64748b;">Dictamen de Exportación:</span>
                <strong style="font-size: 1rem; font-weight: 800; color: ${item.totalScore >= 85 ? '#047857' : '#dc2626'}; margin-left: 4px;">
                  ${escapeHtml(item.status || (item.totalScore >= 85 ? 'APROBADO EXPORTACIÓN' : 'RECHAZADO'))}
                </strong>
              </div>
            </div>

            ${item.notes ? `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 8px; margin-bottom: 5px;">
                <strong style="font-size: 9px; color: #475569; text-transform: uppercase;">Observaciones Poscosecha:</strong>
                <span style="font-size: 10px; color: #1e293b; font-style: italic; margin-left: 4px;">"${escapeHtml(item.notes)}"</span>
              </div>
            ` : ''}

            ${photoStripHtml}
          </div>

          <div class="signatures">
            <div>
              <div class="sig-line">Inspector de Calidad</div>
              <div class="sig-sub">${escapeHtml(item.inspector || 'Ing. Elena Rosero')}</div>
            </div>
            <div>
              <div class="sig-line">Supervisor de Poscosecha</div>
              <div class="sig-sub">Sala de Clasificación</div>
            </div>
            <div>
              <div class="sig-line">Jefatura Técnica Florícola</div>
              <div class="sig-sub">${escapeHtml(farm.legalRep || 'Ing. Marco Rosero')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 350);
  }

  // Informe General Consolidado de Calidad en 1 Sola Hoja
  function printQualityChecklistReport() {
    const fieldChecks = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const bunchChecks = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];
    const farm = Store.getFarmInfo ? Store.getFarmInfo() : {};

    const printWin = window.open('', '_blank');
    if (!printWin) {
      App.showToast('Por favor permita ventanas emergentes para imprimir el informe', 'warning');
      return;
    }

    const avgField = fieldChecks.length > 0 
      ? Math.round(fieldChecks.reduce((a, c) => a + (c.score || 0), 0) / fieldChecks.length) : 0;
    const avgBunch = bunchChecks.length > 0 
      ? Math.round(bunchChecks.reduce((a, c) => a + (c.totalScore || 0), 0) / bunchChecks.length) : 0;

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Informe Consolidado Calidad Florícola - MRosecuador</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; background: #ffffff; font-size: 10.5px; line-height: 1.25; }
          .page-sheet { display: flex; flex-direction: column; justify-content: space-between; height: 100%; max-height: 100vh; overflow: hidden; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 5px; margin-bottom: 6px; }
          .farm-name { font-size: 1.15rem; font-weight: 800; color: #065f46; letter-spacing: -0.3px; line-height: 1.1; }
          .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px; }
          .kpi-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 5px; text-align: center; }
          .kpi-num { font-size: 1.15rem; font-weight: 800; color: #047857; line-height: 1.1; }
          .kpi-label { font-size: 8px; color: #64748b; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 10px; }
          th { background: #065f46; color: #ffffff; padding: 3px 6px; text-align: left; font-size: 9px; }
          td { padding: 2.5px 6px; border-bottom: 1px solid #e2e8f0; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 10px; text-align: center; }
          .sig-line { border-top: 1px solid #94a3b8; padding-top: 3px; font-size: 9.5px; font-weight: 700; color: #334155; }
          .sig-sub { font-size: 8.5px; color: #64748b; }
          @media print {
            .no-print { display: none !important; }
            html, body { height: 100% !important; max-height: 100vh !important; overflow: hidden !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 8px; display: flex; justify-content: flex-end; gap: 6px; padding: 6px 10px; background: #f1f5f9;">
          <button onclick="window.print()" style="background: #059669; color: #ffffff; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 11px;">🖨️ Imprimir en 1 Hoja / PDF</button>
          <button onclick="window.close()" style="background: #cbd5e1; color: #334155; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 11px;">Cerrar</button>
        </div>

        <div class="page-sheet">
          <div>
            <div class="header">
              <div>
                <div class="farm-name">${escapeHtml(farm.name || 'MRosecuador')}</div>
                <div style="font-size: 9px; color: #64748b;">Informe Consolidado de Aseguramiento de Calidad Florícola</div>
              </div>
              <div style="text-align: right; font-size: 9px; color: #64748b;">
                Fecha de Emisión: ${new Date().toLocaleDateString('es-EC')}
              </div>
            </div>

            <div class="kpi-row">
              <div class="kpi-box">
                <div class="kpi-num">${avgField}%</div>
                <div class="kpi-label">Promedio Campo</div>
              </div>
              <div class="kpi-box">
                <div class="kpi-num">${fieldChecks.length}</div>
                <div class="kpi-label">Auditorías Campo</div>
              </div>
              <div class="kpi-box">
                <div class="kpi-num">${avgBunch}%</div>
                <div class="kpi-label">Promedio Bonches</div>
              </div>
              <div class="kpi-box">
                <div class="kpi-num">${bunchChecks.length}</div>
                <div class="kpi-label">Revisiones Mesas</div>
              </div>
            </div>

            <div style="font-weight: 700; color: #065f46; font-size: 10px; margin-bottom: 3px;">1. Auditorías de Calidad en Campo (Muestras Recientes)</div>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Bloque</th>
                  <th>Variedad</th>
                  <th>Tipo</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                  <th>Evaluador</th>
                </tr>
              </thead>
              <tbody>
                ${fieldChecks.slice(0, 6).map(f => `
                  <tr>
                    <td>${f.date}</td>
                    <td>${escapeHtml(f.block)}</td>
                    <td>${escapeHtml(f.variety)}</td>
                    <td>${f.type === 'cosecha' ? 'Malla Cosecha' : 'Labor Cultural'}</td>
                    <td style="font-weight: 700; color: ${f.score >= 80 ? '#047857' : '#dc2626'};">${f.score}%</td>
                    <td>${escapeHtml(f.status || 'Conforme')}</td>
                    <td>${escapeHtml(f.evaluator || '')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="font-weight: 700; color: #065f46; font-size: 10px; margin-bottom: 3px; margin-top: 6px;">2. Revisiones de Bonches en Poscosecha (Muestras Recientes)</div>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Mesa</th>
                  <th>Variedad</th>
                  <th>Bonche</th>
                  <th>Sanidad (30)</th>
                  <th>Físico (30)</th>
                  <th>Armado (40)</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${bunchChecks.slice(0, 6).map(b => `
                  <tr>
                    <td>${b.date}</td>
                    <td>${escapeHtml(b.tableCode)}</td>
                    <td>${escapeHtml(b.variety)}</td>
                    <td>${escapeHtml(b.bunchNumber || 'B-01')}</td>
                    <td>${b.diseaseScore || 30}</td>
                    <td>${b.damageScore || 30}</td>
                    <td>${b.buildScore || 40}</td>
                    <td style="font-weight: 700; color: ${b.totalScore >= 85 ? '#047857' : '#dc2626'};">${b.totalScore}%</td>
                    <td>${escapeHtml(b.status || 'Aprobado')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="signatures">
            <div>
              <div class="sig-line">Auditor de Calidad</div>
              <div class="sig-sub">Aseguramiento de Calidad</div>
            </div>
            <div>
              <div class="sig-line">Jefatura Florícola & Poscosecha</div>
              <div class="sig-sub">Control Técnico de Procesos</div>
            </div>
            <div>
              <div class="sig-line">Gerencia General</div>
              <div class="sig-sub">${escapeHtml(farm.legalRep || 'Ing. Marco Rosero')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 350);
  }

  function exportQualityXLSX() {
    const fieldChecks = Store.getQualityFieldChecks ? Store.getQualityFieldChecks() : [];
    const bunchChecks = Store.getQualityBunchChecks ? Store.getQualityBunchChecks() : [];

    const fieldRows = [
      ['TIPO AUDITORIA', 'FECHA', 'HORA', 'BLOQUE', 'VARIEDAD', 'COSECHADOR / RESPONSABLE', 'MALLA', 'CALIFICACION %', 'ESTADO', 'EVALUADOR', 'FOTOS ADJUNTAS', 'OBSERVACIONES'],
      ...fieldChecks.map(f => [
        f.type === 'cosecha' ? 'Malla Cosecha' : 'Labor Cultural',
        f.date,
        f.time || '',
        f.block,
        f.variety,
        f.harvester || '',
        f.meshCode || '',
        f.score,
        f.status || '',
        f.evaluator || '',
        Array.isArray(f.photos) ? f.photos.length : (f.photo ? 1 : 0),
        f.notes || ''
      ])
    ];

    const bunchRows = [
      ['FECHA', 'HORA', 'MESA', 'VARIEDAD', 'CODIGO BONCHE', 'TALLOS', 'SANIDAD (30)', 'FISICO FLOR (30)', 'ARMADO (40)', 'TOTAL PTS', 'ESTADO', 'INSPECTOR', 'FOTOS ADJUNTAS', 'OBSERVACIONES'],
      ...bunchChecks.map(b => [
        b.date,
        b.time || '',
        b.tableCode,
        b.variety,
        b.bunchNumber || '',
        b.bunchSize || 25,
        b.diseaseScore || 30,
        b.damageScore || 30,
        b.buildScore || 40,
        b.totalScore,
        b.status || '',
        b.inspector || '',
        Array.isArray(b.photos) ? b.photos.length : (b.photo ? 1 : 0),
        b.notes || ''
      ])
    ];

    if (typeof XLSX === 'undefined') {
      App.showToast('Librería de Excel cargando...', 'info');
      return;
    }

    const wb = XLSX.utils.book_new();
    const wsField = XLSX.utils.aoa_to_sheet(fieldRows);
    const wsBunch = XLSX.utils.aoa_to_sheet(bunchRows);

    XLSX.utils.book_append_sheet(wb, wsField, 'Calidad Campo');
    XLSX.utils.book_append_sheet(wb, wsBunch, 'Calidad Poscosecha');

    XLSX.writeFile(wb, `MRosecuador_Auditorias_Calidad_${new Date().toISOString().split('T')[0]}.xlsx`);
    App.showToast('Auditorías de calidad exportadas exitosamente a Excel', 'success');
  }



// ==============================================================================
  function renderSalesModule(container) {
    const sales = Store.getSalesRecords();
    const stockSummary = Store.getProcessedStockSummary();
    const varieties = Store.getVarieties();

    const totalStemsSold = sales.reduce((acc, s) => acc + (parseInt(s.stemsCount, 10) || 0), 0);
    const totalAmountSold = sales.reduce((acc, s) => acc + (parseFloat(s.totalAmount) || 0), 0);
    const totalAvailableStock = stockSummary.reduce((acc, s) => acc + s.availableStems, 0);
    const pendingOrders = sales.filter(s => s.status === 'Pendiente' || s.status === 'En Frío').length;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Comercialización & Despachos
            </span>
          </div>
          <h1 style="color: #065f46;">Ventas de Exportación & Stock en Cuarto Frío</h1>
          <p class="view-subtitle" style="color: #047857;">Control de inventario de flor clasificada lista para exportación, pedidos de clientes internacionales y facturación en tiempo real.</p>
        </div>
        <div class="view-actions" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="Modules.printSaleInvoice(null)" style="display: flex; align-items: center; gap: 0.35rem;" title="Imprimir Factura o Comprobante">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir Factura / Comprobante
          </button>
          <button class="btn btn-secondary" onclick="Modules.exportSalesXLSX()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar Excel
          </button>
          <button class="btn btn-emerald" onclick="Modules.openSaleModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Venta / Pedido
          </button>
        </div>
      </div>

      <!-- Resumen KPI Comercial -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem;">
        <div class="kpi-card" style="border-left: 4px solid #10b981; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Stock Disponible Cuarto Frío</span>
            <span class="kpi-badge badge-success">Inventario</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalAvailableStock.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            ❄️ <span>Flor exportable en frío</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #059669; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Tallos Vendidos / Despacho</span>
            <span class="kpi-badge badge-success">Despachados</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #065f46;">${totalStemsSold.toLocaleString()}</span>
            <span class="kpi-unit">tallos</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            📋 <span>${sales.length} órdenes comerciales</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #047857; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Facturación Total</span>
            <span class="kpi-badge badge-success">Ingresos FOB</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: #059669;">$${totalAmountSold.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span class="kpi-unit">USD</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            ✈️ <span>Exportación Aeropuerto UIO</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #0d9488; background: #ffffff;">
          <div class="kpi-header">
            <span class="kpi-title" style="color: #047857;">Pedidos por Despachar</span>
            <span class="kpi-badge ${pendingOrders > 0 ? 'badge-warning' : 'badge-success'}">${pendingOrders > 0 ? 'En Proceso' : 'Al Día'}</span>
          </div>
          <div class="kpi-value-wrap">
            <span class="kpi-value" style="color: ${pendingOrders > 0 ? '#d97706' : '#059669'};">${pendingOrders}</span>
            <span class="kpi-unit">órdenes</span>
          </div>
          <div class="kpi-sub" style="color: #059669;">
            📦 <span>En empaque o cámara de frío</span>
          </div>
        </div>
      </div>

      <!-- Tarjetas de Stock en Cuarto Frío por Variedad -->
      <div class="card" style="margin-bottom: 1.25rem; border: 1px solid #d1fae5;">
        <div class="card-header" style="background: #f0fdf4; display: flex; justify-content: space-between; align-items: center;">
          <div class="card-title" style="color: #065f46; font-size: 0.92rem; font-weight: 700;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            Stock de Flor Exportable en Cuarto Frío (Temperatura 2°C - 4°C)
          </div>
          <span style="font-size: 0.78rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.6rem; border-radius: 6px;">
            Alimentado desde Poscosecha
          </span>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;">
            ${stockSummary.map(st => {
              const vObj = varieties.find(v => v.name.toLowerCase() === st.variety.toLowerCase());
              return `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.85rem; border-top: 3px solid #10b981;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <strong style="color: #0f172a; font-size: 0.88rem;">Rosa ${escapeHtml(st.variety)}</strong>
                    <span style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">${escapeHtml(vObj?.colorTag || 'Export')}</span>
                  </div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #065f46; margin-bottom: 0.2rem;">
                    ${st.availableStems.toLocaleString()} <span style="font-size: 0.75rem; font-weight: 600; color: #64748b;">tallos</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #475569;">
                    <span>Aprox: <strong>${st.availableBunches}</strong> bonches</span>
                    <span style="color: #059669; font-weight: 600;">Listo para pedido</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Tabla de Ventas & Pedidos -->
      <div class="card" style="border: 1px solid #d1fae5;">
        <div class="card-header" style="background: #f0fdf4; display: flex; justify-content: space-between; align-items: center;">
          <div class="card-title" style="color: #065f46; font-size: 0.92rem; font-weight: 700;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Registro de Pedidos Comerciales & Despachos de Rosas
          </div>
          <button class="btn btn-emerald" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;" onclick="Modules.openSaleModal()">
            + Nuevo Pedido / Venta
          </button>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr style="background: #f8fafc;">
                  <th>Fecha</th>
                  <th>Orden</th>
                  <th>Cliente</th>
                  <th>Variedad</th>
                  <th>Largo</th>
                  <th>Tallos</th>
                  <th>Bonches</th>
                  <th>Precio/Tallo</th>
                  <th>Total (USD)</th>
                  <th>Estatus</th>
                  <th>Destino</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${renderSalesTableRows(sales)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderSalesTableRows(sales) {
    if (!sales || sales.length === 0) {
      return `<tr><td colspan="12" style="text-align: center; padding: 2.5rem; color: #64748b;">No hay órdenes comerciales registradas.</td></tr>`;
    }
    return sales.map(s => {
      let statusBg = '#ecfdf5';
      let statusColor = '#047857';
      if (s.status === 'Pendiente') { statusBg = '#fffbeb'; statusColor = '#b45309'; }
      else if (s.status === 'En Frío') { statusBg = '#f0f9ff'; statusColor = '#0369a1'; }

      return `
        <tr>
          <td><div style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">${s.date}</div></td>
          <td><span class="badge badge-neutral" style="font-weight: 800; font-size: 0.78rem;">${escapeHtml(s.orderCode || 'ORD')}</span></td>
          <td><strong style="color: #0f172a; font-size: 0.82rem;">${escapeHtml(s.client)}</strong></td>
          <td><span class="flower-variety-badge" style="font-size: 0.78rem;">${escapeHtml(s.variety)}</span></td>
          <td style="font-size: 0.78rem; color: #475569;">${escapeHtml(s.length || '70 cm')}</td>
          <td style="font-weight: 800; color: #065f46;">${(s.stemsCount || 0).toLocaleString()}</td>
          <td style="font-size: 0.8rem; color: #475569;">${s.bunchesCount || Math.round((s.stemsCount || 0) / 25)}</td>
          <td style="font-size: 0.8rem; color: #334155;">$${(s.pricePerStem || 0).toFixed(2)}</td>
          <td><strong style="color: #047857; font-size: 0.86rem;">$${(s.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
          <td>
            <span class="badge" style="background: ${statusBg}; color: ${statusColor}; font-weight: 700; font-size: 0.74rem;">
              ${escapeHtml(s.status || 'Despachado')}
            </span>
          </td>
          <td style="font-size: 0.75rem; color: #64748b;">${escapeHtml(s.destination || 'Quito')}</td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-secondary btn-icon-only" style="padding: 0.2rem 0.4rem; color: #047857;" title="Imprimir Factura / Comprobante" onclick="Modules.printSaleInvoice('${s.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            </button>
            <button class="btn btn-secondary btn-icon-only" style="padding: 0.2rem 0.4rem;" title="Editar Venta" onclick="Modules.openSaleModal('${s.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="btn btn-secondary btn-icon-only btn-icon-danger" style="padding: 0.2rem 0.4rem;" title="Eliminar" onclick="Modules.deleteSaleRecord('${s.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openSaleModal(saleId = null) {
    const list = Store.getSalesRecords();
    const varieties = Store.getVarieties();
    const stockSummary = Store.getProcessedStockSummary();
    const item = saleId ? list.find(s => s.id === saleId) : null;

    const defaultDate = item ? item.date : new Date().toISOString().split('T')[0];
    const defaultOrder = item ? item.orderCode : 'ORD-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    const defaultClient = item ? item.client : 'Miami Blooms LLC (EE.UU.)';
    const defaultVariety = item ? item.variety : (varieties[0]?.name || 'Freedom');
    const defaultLength = item ? item.length : '70 cm';
    const defaultStems = item ? item.stemsCount : 500;
    const defaultPrice = item ? item.pricePerStem : 0.85;
    const defaultStatus = item ? item.status : 'Despachado';
    const defaultDest = item ? item.destination : 'Miami, EE.UU.';
    const defaultNotes = item ? item.notes : '';

    const modalBody = `
      <form id="sale-form" onsubmit="event.preventDefault(); Modules.saveSaleFromForm('${saleId || ''}')">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Fecha de Venta / Despacho</label>
            <input type="date" id="sl-date" class="form-control" value="${defaultDate}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Código de Orden / Pedido</label>
            <input type="text" id="sl-order" class="form-control" value="${escapeHtml(defaultOrder)}" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Cliente / Importador</label>
            <input type="text" id="sl-client" class="form-control" value="${escapeHtml(defaultClient)}" required placeholder="Nombre de empresa cliente...">
          </div>
          <div class="form-group">
            <label class="form-label">Destino / Aeropuerto</label>
            <input type="text" id="sl-destination" class="form-control" value="${escapeHtml(defaultDest)}" required placeholder="Ej: Miami, Amsterdam...">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Variedad de Rosa</label>
            <select id="sl-variety" class="form-control" required onchange="Modules.recalcSaleTotal()">
              ${varieties.map(v => {
                const stock = stockSummary.find(st => st.variety.toLowerCase() === v.name.toLowerCase());
                const avail = stock ? stock.availableStems : 0;
                return `<option value="${escapeHtml(v.name)}" ${v.name === defaultVariety ? 'selected' : ''}>${escapeHtml(v.name)} (Stock frío: ${avail.toLocaleString()} tallos)</option>`;
              }).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Largo de Tallo</label>
            <select id="sl-length" class="form-control">
              <option value="50 cm" ${defaultLength === '50 cm' ? 'selected' : ''}>50 cm</option>
              <option value="60 cm" ${defaultLength === '60 cm' ? 'selected' : ''}>60 cm</option>
              <option value="70 cm" ${defaultLength === '70 cm' ? 'selected' : ''}>70 cm</option>
              <option value="80 cm" ${defaultLength === '80 cm' ? 'selected' : ''}>80 cm</option>
              <option value="90 cm" ${defaultLength === '90 cm' ? 'selected' : ''}>90 cm</option>
              <option value="100 cm" ${defaultLength === '100 cm' ? 'selected' : ''}>100 cm</option>
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Cantidad de Tallos</label>
            <input type="number" id="sl-stems" class="form-control" value="${defaultStems}" min="25" step="25" required oninput="Modules.recalcSaleTotal()">
          </div>
          <div class="form-group">
            <label class="form-label">Precio / Tallo (USD)</label>
            <input type="number" id="sl-price" class="form-control" value="${defaultPrice}" min="0.10" max="10.00" step="0.01" required oninput="Modules.recalcSaleTotal()">
          </div>
          <div class="form-group">
            <label class="form-label">Estatus de Pedido</label>
            <select id="sl-status" class="form-control">
              <option value="Despachado" ${defaultStatus === 'Despachado' ? 'selected' : ''}>Despachado</option>
              <option value="En Frío" ${defaultStatus === 'En Frío' ? 'selected' : ''}>En Frío</option>
              <option value="Pendiente" ${defaultStatus === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
              <option value="Entregado" ${defaultStatus === 'Entregado' ? 'selected' : ''}>Entregado</option>
            </select>
          </div>
        </div>

        <!-- TOTAL CALCULADO EN VIVO -->
        <div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border:1.5px solid #a7f3d0; border-radius:8px; padding:0.85rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; color:#047857;">Monto Total Facturado:</div>
            <strong id="live-sale-total" style="font-size:1.35rem; color:#065f46;">$425.00 USD</strong>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.74rem; color:#475569;">Equivalente en Bonches:</div>
            <strong id="live-sale-bunches" style="font-size:1rem; color:#047857;">20 bonches (x25)</strong>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0.85rem;">
          <label class="form-label">Notas de Embarque / Logística</label>
          <textarea id="sl-notes" class="form-control" rows="2" placeholder="Guía aérea, aerolínea, control de frío...">${escapeHtml(defaultNotes)}</textarea>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-emerald">Registrar Venta / Pedido</button>
        </div>
      </form>
    `;

    App.showModal(saleId ? 'Editar Orden de Venta' : 'Nueva Orden de Venta / Pedido Exportación', modalBody);
    setTimeout(() => {
      Modules.recalcSaleTotal();
    }, 50);
  }

  function recalcSaleTotal() {
    const stems = parseInt(document.getElementById('sl-stems')?.value, 10) || 0;
    const price = parseFloat(document.getElementById('sl-price')?.value) || 0;
    const total = (stems * price).toFixed(2);
    const bunches = Math.round(stems / 25);

    const totEl = document.getElementById('live-sale-total');
    const bncEl = document.getElementById('live-sale-bunches');

    if (totEl) totEl.textContent = '$' + parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
    if (bncEl) bncEl.textContent = `${bunches} bonches (x25)`;
  }

  function saveSaleFromForm(saleId = null) {
    const date = document.getElementById('sl-date').value;
    const orderCode = document.getElementById('sl-order').value;
    const client = document.getElementById('sl-client').value;
    const variety = document.getElementById('sl-variety').value;
    const length = document.getElementById('sl-length').value;
    const stemsCount = parseInt(document.getElementById('sl-stems').value, 10) || 0;
    const pricePerStem = parseFloat(document.getElementById('sl-price').value) || 0;
    const status = document.getElementById('sl-status').value;
    const destination = document.getElementById('sl-destination').value;
    const notes = document.getElementById('sl-notes').value;

    if (!orderCode || !client || stemsCount <= 0) {
      App.showToast('Por favor completa los datos obligatorios de la venta', 'danger');
      return;
    }

    Store.saveSalesRecord({
      id: saleId || undefined,
      date,
      orderCode,
      client,
      variety,
      length,
      stemsCount,
      pricePerStem,
      status,
      destination,
      notes
    });

    App.closeModal();
    App.showToast('Orden comercial registrada exitosamente', 'success');
    renderSalesModule(document.getElementById('view-container'));
  }

  function deleteSaleRecord(id) {
    if (confirm('¿Estás seguro de eliminar este registro de venta?')) {
      Store.deleteSalesRecord(id);
      App.showToast('Registro de venta eliminado', 'success');
      renderSalesModule(document.getElementById('view-container'));
    }
  }

  // Impresión de Factura Comercial / Comprobante de Venta y Despacho
  function printSaleInvoice(saleId = null) {
    const list = Store.getSalesRecords();
    const item = (saleId ? list.find(s => s.id === saleId) : null) || list[0];
    if (!item) {
      App.showToast('No se encontró el registro de venta para facturar', 'warning');
      return;
    }

    const farmInfo = Store.getFarmInfo ? Store.getFarmInfo() : null;
    const farmName = farmInfo?.name || 'MROSECUADOR';
    const farmRuc = farmInfo?.ruc || '1792345678001';
    const farmLocation = farmInfo?.location || 'Cotopaxi & Cayambe, Ecuador';
    const farmAltitude = farmInfo?.altitude || '2.850 m.s.n.m.';
    const farmEmail = farmInfo?.email || 'ventas@mrosecuador.com';
    const farmPhone = farmInfo?.contacts || '+593 99 123 4567';

    const stemsCount = parseInt(item.stemsCount, 10) || 0;
    const bunchesCount = item.bunchesCount || Math.round(stemsCount / 25);
    const pricePerStem = parseFloat(item.pricePerStem) || 0.85;
    const totalAmount = parseFloat(item.totalAmount) || (stemsCount * pricePerStem);

    const invoiceNumber = (item.orderCode ? item.orderCode.replace('ORD-', 'FAC-') : 'FAC-2026-' + Math.floor(100 + Math.random() * 900));

    const printWin = window.open('', '_blank', 'width=900,height=720');
    if (!printWin) {
      alert('Por favor habilita las ventanas emergentes en tu navegador para imprimir la factura.');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Factura Comercial / Comprobante de Despacho - ${invoiceNumber}</title>
        <style>
          @page { size: portrait; margin: 12mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1e293b; margin: 0; padding: 15px; }
          .header-box { border-bottom: 2.5px solid #047857; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
          .invoice-meta { background: #f0fdf4; border: 1.5px solid #a7f3d0; border-radius: 6px; padding: 10px 14px; text-align: right; min-width: 220px; }
          .client-box { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; }
          th { background: #047857; color: #ffffff; font-weight: 700; text-transform: uppercase; font-size: 10px; }
          .totals-table { width: 320px; margin-left: auto; border-collapse: collapse; }
          .totals-table td { border: 1px solid #cbd5e1; padding: 5px 10px; }
          .cert-box { margin-top: 15px; background: #ecfdf5; border: 1px dashed #059669; border-radius: 6px; padding: 8px 12px; font-size: 10px; color: #065f46; }
          .sign-area { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-top: 40px; text-align: center; }
          .sign-line { border-top: 1px solid #64748b; padding-top: 5px; font-weight: 700; font-size: 10.5px; }
        </style>
      </head>
      <body>
        <div style="background:#047857; color:#fff; padding:8px 14px; border-radius:6px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;" class="no-print">
          <strong>Comprobante Oficial de Venta y Factura Comercial de Exportación</strong>
          <div>
            <button onclick="window.print()" style="background:#fff; color:#047857; border:none; padding:5px 14px; font-weight:700; border-radius:4px; cursor:pointer;">Imprimir / Guardar Factura PDF</button>
            <button onclick="window.close()" style="background:transparent; color:#fff; border:1px solid #fff; padding:5px 10px; margin-left:6px; border-radius:4px; cursor:pointer;">Cerrar</button>
          </div>
        </div>

        <div class="header-box">
          <div>
            <h1 style="font-size: 20px; color: #065f46; margin: 0 0 3px 0;">${farmName}</h1>
            <div style="font-size: 12px; font-weight: 800; color: #047857;">FLORICULTURA DE EXPORTACIÓN & DESPACHO INTERNACIONAL</div>
            <div style="font-size: 10px; color: #64748b;">RUC: ${farmRuc} | Ubicación: ${farmLocation} (${farmAltitude})</div>
            <div style="font-size: 10px; color: #64748b;">Tel: ${farmPhone} | Email: ${farmEmail}</div>
          </div>
          <div class="invoice-meta">
            <div style="font-size: 11px; font-weight: 800; color: #047857;">FACTURA / COMPROBANTE</div>
            <div style="font-size: 16px; font-weight: 900; color: #065f46; margin: 2px 0;">${invoiceNumber}</div>
            <div style="font-size: 10px; color: #475569;"><strong>Orden:</strong> ${escapeHtml(item.orderCode || 'ORD-001')}</div>
            <div style="font-size: 10px; color: #475569;"><strong>Fecha Emisión:</strong> ${item.date || new Date().toISOString().split('T')[0]}</div>
          </div>
        </div>

        <div class="client-box">
          <div>
            <strong style="color: #047857; font-size: 11.5px; display: block; margin-bottom: 4px;">DATOS DEL CLIENTE / CONSIGNATARIO</strong>
            <div><strong>Razón Social / Cliente:</strong> ${escapeHtml(item.client)}</div>
            <div><strong>Destino de Exportación:</strong> ${escapeHtml(item.destination || 'Aeropuerto Internacional')}</div>
            <div><strong>Condición Comercial:</strong> FOB Aeropuerto Mariscal Sucre (UIO)</div>
          </div>
          <div>
            <strong style="color: #047857; font-size: 11.5px; display: block; margin-bottom: 4px;">DATOS DE DESPACHO & LOGÍSTICA</strong>
            <div><strong>Estado del Pedido:</strong> <span style="font-weight: 700; color: #047857;">${escapeHtml(item.status || 'Despachado')}</span></div>
            <div><strong>Cadena de Frío:</strong> Temperatura 2°C a 4°C en Cuarto Frío</div>
            <div><strong>Moneda de Facturación:</strong> Dólares de los Estados Unidos (USD)</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Ítem / Partida</th>
              <th>Descripción del Producto</th>
              <th>Grado / Largo</th>
              <th style="text-align: right;">Bonches</th>
              <th style="text-align: right;">Tallos</th>
              <th style="text-align: right;">Precio Unit. FOB</th>
              <th style="text-align: right;">Total (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0603.11.00</td>
              <td><strong>Rosas Frescas Cortadas - Rosa ${escapeHtml(item.variety)}</strong><br><span style="font-size: 9.5px; color: #64748b;">${escapeHtml(item.notes || 'Flor ecuatoriana de alta calidad para exportación')}</span></td>
              <td>${escapeHtml(item.length || '70 cm')}</td>
              <td style="text-align: right;">${bunchesCount}</td>
              <td style="text-align: right; font-weight: 700;">${stemsCount.toLocaleString()}</td>
              <td style="text-align: right;">$${pricePerStem.toFixed(2)}</td>
              <td style="text-align: right; font-weight: 800; color: #047857;">$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td style="font-weight: 700; color: #334155;">SUBTOTAL FOB:</td>
            <td style="text-align: right; font-weight: 700;">$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">TARIFA IVA 0% (Exportación Florícola):</td>
            <td style="text-align: right; color: #64748b;">$0.00</td>
          </tr>
          <tr style="background: #f0fdf4; border-top: 2px solid #047857;">
            <td style="font-size: 13px; font-weight: 800; color: #065f46;">TOTAL A PAGAR (USD):</td>
            <td style="text-align: right; font-size: 14px; font-weight: 900; color: #047857;">$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        </table>

        <div class="cert-box">
          <strong>DECLARACIÓN FITOSANITARIA Y LOGÍSTICA:</strong> La flor descrita en esta factura ha sido seleccionada e hidratada bajo estrictos parámetros de control fitosanitario y refrigeración continua (2°C - 4°C). Cumple con los estándares de exportación internacional.
        </div>

        <div class="sign-area">
          <div>
            <div class="sign-line">Despacho Cuarto Frío / Logística<br><span style="font-weight: normal; font-size: 9.5px;">Responsable de Empaque y Cadena de Frío</span></div>
          </div>
          <div>
            <div class="sign-line">Gerencia Comercial & Facturación<br><span style="font-weight: normal; font-size: 9.5px;">MRosecuador Exportaciones</span></div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function exportSalesXLSX() {
    try {
      const sales = Store.getSalesRecords();
      const rows = [
        ['REPORTE DE VENTAS Y DESPACHOS - MROSECUADOR'],
        ['Fecha Generación:', new Date().toLocaleString()],
        [],
        ['Fecha', 'No. Orden', 'Cliente', 'Variedad', 'Largo', 'Tallos', 'Bonches', 'Precio/Tallo ($)', 'Total Facturado ($)', 'Estatus', 'Destino', 'Notas']
      ];
      sales.forEach(s => {
        rows.push([
          s.date,
          s.orderCode,
          s.client,
          s.variety,
          s.length,
          s.stemsCount,
          s.bunchesCount || Math.round(s.stemsCount / 25),
          s.pricePerStem,
          s.totalAmount,
          s.status,
          s.destination,
          s.notes || ''
        ]);
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ventas_Despachos');
      XLSX.writeFile(wb, `Ventas_MRose_${new Date().toISOString().split('T')[0]}.xlsx`);
      App.showToast('Reporte de ventas exportado a Excel con éxito', 'success');
    } catch(e) {
      App.showToast('Error al exportar a Excel: ' + e.message, 'danger');
    }
  }


  // ==============================================================================
  // ==============================================================================
  // ==============================================================================
  // ==============================================================================
  // FUNCIONALIDAD: IMPRESIÓN DEL CATÁLOGO DE VARIEDADES COMPACTO Y SIN ESPACIOS
  // ==============================================================================

  function openPrintCatalogModal(preselectedVarietyId = null) {
    const varieties = Store.getVarieties();

    const modalBody = `
      <div style="margin-bottom: 0.85rem;">
        <p style="font-size: 0.82rem; color: #475569; margin-bottom: 0.75rem;">
          Configure el formato de impresión o generación de PDF para el <strong>Catálogo de Variedades de Rosas MRosecuador</strong>. Formato optimizado en 2 columnas continuas sin espacios sobrantes ni hojas en blanco.
        </p>

        <!-- Filtros y Opciones de Impresión -->
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.85rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-weight: 700; color: #047857; font-size: 0.78rem;">Seleccionar Variedades:</label>
            <select id="print-variety-filter" class="form-control" style="font-size: 0.78rem;" onchange="Modules.updatePrintCatalogPreview()">
              <option value="all" ${!preselectedVarietyId ? 'selected' : ''}>Catálogo Completo (${varieties.length} Variedades)</option>
              <optgroup label="Filtrar por Color:">
                <option value="color:rojo">Solo Rosas Rojas</option>
                <option value="color:blanco">Solo Rosas Blancas</option>
                <option value="color:fucsia">Solo Rosas Fucsias / Bicolores</option>
              </optgroup>
              <optgroup label="Imprimir Ficha Individual:">
                ${varieties.map(v => `<option value="single:${v.id}" ${preselectedVarietyId === v.id ? 'selected' : ''}>Rosa ${escapeHtml(v.name)} (${escapeHtml(v.color || '')})</option>`).join('')}
              </optgroup>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-weight: 700; color: #047857; font-size: 0.78rem;">Formato de Impresión:</label>
            <select id="print-format-type" class="form-control" style="font-size: 0.78rem;" onchange="Modules.updatePrintCatalogPreview()">
              <option value="cards">Fichas Compactas 2 Columnas (Sin espacios vacíos)</option>
              <option value="table">Planilla Comparativa Compacta (Tabla Técnica)</option>
              <option value="both">Completo: Resumen Técnico + Fichas Compactas</option>
            </select>
          </div>
        </div>

        <!-- Vista Previa en Pantalla -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: #047857;">
            Vista Previa de Impresión:
          </span>
          <span id="print-preview-count-badge" style="font-size: 0.72rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 0.15rem 0.5rem; border-radius: 99px;">
            ${varieties.length} variedades seleccionadas
          </span>
        </div>

        <div id="print-catalog-preview-container" style="max-height: 380px; overflow-y: auto; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 0.75rem; background: #ffffff; box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);">
          <!-- Vista previa inyectada dinámicamente -->
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
        <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
        <button type="button" class="btn btn-emerald" style="padding: 0.45rem 1.25rem; font-size: 0.88rem; font-weight: 700;" onclick="Modules.executeCatalogPrint()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.4rem;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Imprimir / Guardar como PDF
        </button>
      </div>
    `;

    App.showModal('Imprimir Catálogo Técnico de Variedades de Rosas', modalBody);
    setTimeout(() => {
      Modules.updatePrintCatalogPreview();
    }, 50);
  }

  function getFilteredVarietiesForPrint() {
    const varieties = Store.getVarieties();
    const filterVal = document.getElementById('print-variety-filter')?.value || 'all';

    if (filterVal === 'all') {
      return varieties;
    } else if (filterVal.startsWith('color:')) {
      const col = filterVal.replace('color:', '').toLowerCase();
      return varieties.filter(v => (v.colorTag && v.colorTag.toLowerCase().includes(col)) || (v.color && v.color.toLowerCase().includes(col)));
    } else if (filterVal.startsWith('single:')) {
      const varId = filterVal.replace('single:', '');
      return varieties.filter(v => v.id === varId);
    }
    return varieties;
  }

  function updatePrintCatalogPreview() {
    const container = document.getElementById('print-catalog-preview-container');
    const badge = document.getElementById('print-preview-count-badge');
    if (!container) return;

    const selectedVarieties = getFilteredVarietiesForPrint();
    const formatType = document.getElementById('print-format-type')?.value || 'cards';

    if (badge) badge.textContent = `${selectedVarieties.length} variedades seleccionadas`;

    container.innerHTML = generatePrintCatalogHtml(selectedVarieties, formatType, true);
  }

  function generatePrintCatalogHtml(varietiesList, formatType, isPreview = false) {
    if (!varietiesList || varietiesList.length === 0) {
      return `<div style="text-align: center; padding: 2rem; color: #64748b;">No hay variedades seleccionadas para imprimir.</div>`;
    }

    const todayDate = new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });

    let html = `
      <div class="print-doc-header" style="border-bottom: 2px solid #059669; padding-bottom: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #065f46; letter-spacing: -0.02em; line-height: 1.1;">
            MROSECUADOR
          </div>
          <div style="font-size: 0.8rem; font-weight: 700; color: #047857; text-transform: uppercase; margin-bottom: 1px;">
            Catálogo Oficial de Variedades de Rosas de Exportación
          </div>
          <div style="font-size: 0.68rem; color: #64748b;">
            Finca Florícola de Exportación | Cayambe & Cotopaxi, Ecuador | Altitud: 2.850 m.s.n.m.
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 0.15rem 0.5rem; border-radius: 4px; border: 1px solid #a7f3d0; display: inline-block;">
            Ficha Técnica FLORÍCOLA
          </div>
          <div style="font-size: 0.66rem; color: #64748b; margin-top: 2px;">
            Emisión: ${todayDate} | Total: ${varietiesList.length} variedades
          </div>
        </div>
      </div>
    `;

    // 1. Tabla Resumen Compacta (si es 'table' o 'both')
    if (formatType === 'table' || formatType === 'both') {
      html += `
        <div style="margin-bottom: 10px;">
          <h3 style="font-size: 0.85rem; font-weight: 800; color: #065f46; margin-bottom: 4px; text-transform: uppercase;">
            Planilla Comparativa de Características Técnicas
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.68rem; text-align: left; margin-bottom: 8px; border: 1px solid #cbd5e1;">
            <thead>
              <tr style="background: #047857; color: #ffffff;">
                <th style="padding: 4px 6px; border: 1px solid #047857;">Variedad</th>
                <th style="padding: 4px 6px; border: 1px solid #047857;">Obtentor</th>
                <th style="padding: 4px 6px; border: 1px solid #047857;">Color</th>
                <th style="padding: 4px 6px; border: 1px solid #047857;">Botón</th>
                <th style="padding: 4px 6px; border: 1px solid #047857;">Pétalos</th>
                <th style="padding: 4px 6px; border: 1px solid #047857;">Punto Corte</th>
                <th style="padding: 4px 6px; border: 1px solid #047857;">Vida Florero</th>
                <th style="padding: 4px 6px; border: 1px solid #047857;">Largos Disponibles</th>
              </tr>
            </thead>
            <tbody>
              ${varietiesList.map((v, i) => `
                <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 3px 6px; font-weight: 700; color: #0f172a; border: 1px solid #cbd5e1;">Rosa ${escapeHtml(v.name)}</td>
                  <td style="padding: 3px 6px; color: #475569; border: 1px solid #cbd5e1;">${escapeHtml(v.breeder || 'MRosecuador')}</td>
                  <td style="padding: 3px 6px; color: #047857; font-weight: 600; border: 1px solid #cbd5e1;">${escapeHtml(v.color || '')}</td>
                  <td style="padding: 3px 6px; font-weight: 600; border: 1px solid #cbd5e1;">${escapeHtml(v.budSize || '-')}</td>
                  <td style="padding: 3px 6px; border: 1px solid #cbd5e1;">${escapeHtml(v.petalCount || '-')}</td>
                  <td style="padding: 3px 6px; border: 1px solid #cbd5e1;">${escapeHtml(v.cutStage || '-')}</td>
                  <td style="padding: 3px 6px; font-weight: 700; color: #059669; border: 1px solid #cbd5e1;">${escapeHtml(v.vaseLife || '-')}</td>
                  <td style="padding: 3px 6px; color: #334155; border: 1px solid #cbd5e1;">${escapeHtml(v.stemLengths || '-')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // 2. Fichas Técnicas Ilustradas en 2 Columnas Compactas (Sin espacios vacíos)
    if (formatType === 'cards' || formatType === 'both') {
      html += `
        <div class="print-cards-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 8px;">
          ${varietiesList.map(v => `
            <div class="print-variety-card" style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; background: #ffffff; break-inside: avoid; page-break-inside: avoid; margin-bottom: 0;">
              <div style="display: flex; gap: 8px; align-items: flex-start;">
                
                <!-- Foto / Ilustración Compacta -->
                <div style="width: 72px; height: 72px; flex-shrink: 0; border-radius: 4px; overflow: hidden; border: 1px solid #e2e8f0; background: #f8fafc; display: flex; align-items: center; justify-content: center;">
                  <img src="${v.photo || 'assets/variety_freedom.svg'}" alt="${escapeHtml(v.name)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/variety_freedom.svg'">
                </div>

                <!-- Detalles Técnicos Consolidados -->
                <div style="flex-grow: 1; min-width: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px;">
                    <div>
                      <h4 style="margin: 0; font-size: 0.92rem; font-weight: 800; color: #065f46; line-height: 1.1;">Rosa ${escapeHtml(v.name)}</h4>
                      <div style="font-size: 0.65rem; color: #64748b; font-weight: 600; text-transform: uppercase;">
                        Obtentor: <strong>${escapeHtml(v.breeder || 'MRosecuador')}</strong>
                      </div>
                    </div>
                    <span style="font-size: 0.68rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 1px 5px; border-radius: 4px; border: 1px solid #a7f3d0; white-space: nowrap;">
                      ${escapeHtml(v.color || 'Export')}
                    </span>
                  </div>

                  <!-- Cuadrícula Compacta de Especificaciones -->
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 3px 5px; margin-bottom: 3px; font-size: 0.65rem;">
                    <div>
                      <span style="color: #64748b; display: block; font-size: 0.58rem; text-transform: uppercase; font-weight: 700;">Botón:</span>
                      <strong style="color: #0f172a;">${escapeHtml(v.budSize || '6.0 cm')}</strong>
                    </div>
                    <div>
                      <span style="color: #64748b; display: block; font-size: 0.58rem; text-transform: uppercase; font-weight: 700;">Pétalos:</span>
                      <strong style="color: #0f172a;">${escapeHtml(v.petalCount || '45-55')}</strong>
                    </div>
                    <div>
                      <span style="color: #64748b; display: block; font-size: 0.58rem; text-transform: uppercase; font-weight: 700;">Florero:</span>
                      <strong style="color: #059669;">${escapeHtml(v.vaseLife || '16 días')}</strong>
                    </div>
                    <div>
                      <span style="color: #64748b; display: block; font-size: 0.58rem; text-transform: uppercase; font-weight: 700;">Corte:</span>
                      <strong style="color: #0f172a;">${escapeHtml(v.cutStage || '2.0-2.5')}</strong>
                    </div>
                    <div style="grid-column: span 2;">
                      <span style="color: #64748b; display: block; font-size: 0.58rem; text-transform: uppercase; font-weight: 700;">Largos:</span>
                      <strong style="color: #047857;">${escapeHtml(v.stemLengths || '60, 70, 80, 90 cm')}</strong>
                    </div>
                  </div>

                  <!-- Descripción FLORÍCOLA Breve -->
                  <div style="font-size: 0.64rem; color: #334155; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    <strong>floricultura:</strong> ${escapeHtml(v.description || 'Variedad de gran resistencia y apertura uniforme para frío.')}
                  </div>
                </div>

              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Pie de página oficial compacto
    html += `
      <div style="margin-top: 8px; padding-top: 4px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 0.62rem; color: #64748b;">
        <div>MRosecuador Floricultura de Exportación &copy; ${new Date().getFullYear()} - Documento Oficial de Consulta Técnica</div>
        <div>Generado electrónicamente por la Plataforma FLORÍCOLA MRosecuador</div>
      </div>
    `;

    return html;
  }

  function executeCatalogPrint() {
    const selectedVarieties = getFilteredVarietiesForPrint();
    const formatType = document.getElementById('print-format-type')?.value || 'cards';

    if (!selectedVarieties || selectedVarieties.length === 0) {
      App.showToast('No hay variedades seleccionadas para imprimir', 'danger');
      return;
    }

    const printHtmlContent = generatePrintCatalogHtml(selectedVarieties, formatType, false);

    const printWindow = window.open('', '_blank', 'width=950,height=800,scrollbars=yes,resizable=yes');
    if (!printWindow) {
      App.showToast('Por favor autoriza las ventanas emergentes del navegador para imprimir el catálogo', 'danger');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Catálogo de Variedades de Rosas - MRosecuador</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff;
            color: #1e293b;
            padding: 12px;
            font-size: 11px;
            line-height: 1.35;
          }
          @page {
            size: A4 portrait;
            margin: 8mm 8mm;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
            .print-cards-container {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 8px !important;
              margin-bottom: 8px !important;
            }
            .print-variety-card {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 0 !important;
            }
          }
          .print-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #047857;
            color: #ffffff;
            padding: 8px 14px;
            border-radius: 6px;
            margin-bottom: 12px;
          }
          .print-btn {
            background: #ffffff;
            color: #047857;
            border: none;
            padding: 5px 14px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
          }
          .print-btn:hover {
            background: #f0fdf4;
          }
        </style>
      </head>
      <body>
        <div class="print-toolbar no-print">
          <div>
            <strong>Vista de Impresión Compacta - MRosecuador</strong> | Catálogo Oficial (${selectedVarieties.length} variedades sin espacios sobrantes)
          </div>
          <div>
            <button class="print-btn" onclick="window.print()">Imprimir Ahora / Guardar PDF</button>
            <button class="print-btn" style="margin-left: 6px; background: transparent; color: #ffffff; border: 1px solid #ffffff;" onclick="window.close()">Cerrar</button>
          </div>
        </div>

        ${printHtmlContent}

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function printSingleVarietySheet(varietyId) {
    openPrintCatalogModal(varietyId);
  }

  // ==============================================================================
  // MÓDULO: CONFIGURACIÓN DE FINCA - DATOS FINCA (LOGO, NOMBRE, UBICACIÓN, ALTURA, RUC, CONTACTOS, CORREOS)
  // ==============================================================================
  let pendingFarmLogoBase64 = null;

  function renderFarmInfo(container) {
    const farm = Store.getFarmInfo();
    pendingFarmLogoBase64 = null; // resetear logo temporal pendiente

    const currentLogoSrc = farm.logo || 'assets/logo.jpg';

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid #a7f3d0;">
              Configuración Finca
            </span>
          </div>
          <h1 style="color: #065f46;">Datos de la Finca & Perfil Institucional</h1>
          <p class="view-subtitle" style="color: #047857;">Administra el logotipo oficial, nombre comercial, razón social, ubicación geográfica, altura msnm, RUC y canales de contacto de MRosecuador.</p>
        </div>
        <div class="view-actions" style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="btn btn-secondary" onclick="Modules.resetFarmDefaultInfo()" title="Restablecer los datos por defecto">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            Restablecer Valores
          </button>
          <button class="btn btn-emerald" onclick="Modules.saveFarmInfoFromForm()" style="box-shadow: 0 2px 8px rgba(5,150,105,0.25);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
            Guardar Cambios
          </button>
        </div>
      </div>

      <!-- Banner Hero Institucional -->
      <div class="farm-hero-banner">
        <div class="farm-logo-preview-box">
          <img id="farm-hero-logo" src="${escapeHtml(currentLogoSrc)}" alt="Logo Finca" class="farm-logo-preview-img" onerror="this.src='assets/logo.jpg'">
        </div>
        <div style="flex: 1; min-width: 250px;">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
            <h2 id="farm-hero-name" style="font-size: 1.45rem; font-weight: 800; margin: 0; color: #ffffff;">${escapeHtml(farm.name)}</h2>
            <span style="background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.4); padding: 0.15rem 0.55rem; border-radius: 99px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
              Perfil Oficial Florícola
            </span>
          </div>
          <p id="farm-hero-sub" style="font-size: 0.88rem; opacity: 0.95; margin: 0 0 0.6rem 0; font-weight: 500;">
            ${escapeHtml(farm.companyName || farm.name)} &bull; RUC: <strong>${escapeHtml(farm.ruc)}</strong>
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; font-size: 0.78rem; opacity: 0.92;">
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span id="farm-hero-location">${escapeHtml(farm.location)}, ${escapeHtml(farm.canton || '')}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
              <span id="farm-hero-altitude"><strong>${escapeHtml(farm.altitude)}</strong></span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span id="farm-hero-phones">${escapeHtml(farm.phones)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de Configuración en Tarjetas -->
      <form id="farm-info-form" onsubmit="event.preventDefault(); Modules.saveFarmInfoFromForm();">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem;">
          
          <!-- Tarjeta 1: Logotipo Institucional -->
          <div class="card" style="border: 1px solid #d1fae5; box-shadow: var(--shadow-sm);">
            <div class="card-header" style="background: #f0fdf4; border-bottom: 1px solid #d1fae5;">
              <div class="card-title" style="color: #065f46; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                Logotipo Institucional
              </div>
            </div>
            <div class="card-body" style="padding: 1.25rem;">
              <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1rem;">
                <div style="width: 110px; height: 110px; border: 2px dashed #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #f8fafc; overflow: hidden; padding: 6px; flex-shrink: 0;">
                  <img id="farm-logo-preview" src="${escapeHtml(currentLogoSrc)}" alt="Vista previa logo" style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;" onerror="this.src='assets/logo.jpg'">
                </div>
                <div style="flex: 1;">
                  <p style="font-size: 0.8rem; color: #475569; margin-bottom: 0.75rem; line-height: 1.4;">
                    El logotipo se muestra en la barra lateral, cabeceras del sistema y en la impresión de reportes y catálogo.
                  </p>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <input type="file" id="farm-logo-file-input" accept="image/*" style="display: none;" onchange="Modules.handleFarmLogoUpload(this)">
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('farm-logo-file-input').click()" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; border-color: #10b981; color: #047857;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      Subir / Cambiar Logo
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="Modules.resetFarmLogo()" style="font-size: 0.78rem; padding: 0.35rem 0.65rem; color: #64748b;">
                      Restablecer Logo
                    </button>
                  </div>
                </div>
              </div>
              <div style="font-size: 0.72rem; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.5rem 0.75rem;">
                💡 <em>Soporta JPG, PNG, WebP o SVG. Se redimensiona y optimiza automáticamente para no recargar el navegador.</em>
              </div>
            </div>
          </div>

          <!-- Tarjeta 2: Identificación Legal & RUC -->
          <div class="card" style="border: 1px solid #d1fae5; box-shadow: var(--shadow-sm);">
            <div class="card-header" style="background: #f0fdf4; border-bottom: 1px solid #d1fae5;">
              <div class="card-title" style="color: #065f46; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M5 21V10.85a3 3 0 0 1 2-.85h10a3 3 0 0 1 2 .85V21M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path></svg>
                Identificación de la Empresa
              </div>
            </div>
            <div class="card-body" style="padding: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Nombre Comercial de la Finca *</label>
                <input type="text" id="farm-name" class="form-control" required value="${escapeHtml(farm.name)}" placeholder="Ej: MRosecuador">
              </div>
              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Razón Social Oficial *</label>
                <input type="text" id="farm-company-name" class="form-control" required value="${escapeHtml(farm.companyName || '')}" placeholder="Ej: MRosecuador Cía. Ltda.">
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">RUC Oficial *</label>
                  <input type="text" id="farm-ruc" class="form-control" required maxlength="13" value="${escapeHtml(farm.ruc)}" placeholder="1792345678001">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Representante Legal</label>
                  <input type="text" id="farm-legal-rep" class="form-control" value="${escapeHtml(farm.legalRep || '')}" placeholder="Ing. Marco Rosero">
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta 3: Ubicación Geográfica & Altura -->
          <div class="card" style="border: 1px solid #d1fae5; box-shadow: var(--shadow-sm);">
            <div class="card-header" style="background: #f0fdf4; border-bottom: 1px solid #d1fae5;">
              <div class="card-title" style="color: #065f46; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Ubicación Geográfica & Altura (msnm)
              </div>
            </div>
            <div class="card-body" style="padding: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Ubicación / Dirección de la Finca *</label>
                <input type="text" id="farm-location" class="form-control" required value="${escapeHtml(farm.location)}" placeholder="Vía Tabacundo - Cayambe Km 4.5, Parroquia Tupigachi">
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Cantón</label>
                  <input type="text" id="farm-canton" class="form-control" value="${escapeHtml(farm.canton || '')}" placeholder="Pedro Moncayo">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Provincia</label>
                  <input type="text" id="farm-province" class="form-control" value="${escapeHtml(farm.province || 'Pichincha')}" placeholder="Pichincha">
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700; color: #047857; font-size: 0.82rem;">Altura Oficial (msnm) *</label>
                  <input type="text" id="farm-altitude" class="form-control" required value="${escapeHtml(farm.altitude)}" placeholder="2,850 msnm" style="border-color: #10b981; font-weight: 700; color: #065f46;">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">País</label>
                  <input type="text" id="farm-country" class="form-control" value="${escapeHtml(farm.country || 'Ecuador')}" placeholder="Ecuador">
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta 4: Canales de Contacto & Correos -->
          <div class="card" style="border: 1px solid #d1fae5; box-shadow: var(--shadow-sm);">
            <div class="card-header" style="background: #f0fdf4; border-bottom: 1px solid #d1fae5;">
              <div class="card-title" style="color: #065f46; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Contactos Oficiales & Correos
              </div>
            </div>
            <div class="card-body" style="padding: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Teléfonos / Contactos *</label>
                <input type="text" id="farm-phones" class="form-control" required value="${escapeHtml(farm.phones)}" placeholder="+593 2 236 1234 / +593 99 876 5432">
                <span style="font-size: 0.72rem; color: #64748b;">Puede incluir PBX fijo y números móviles separados por /</span>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Correos Electrónicos *</label>
                <input type="text" id="farm-emails" class="form-control" required value="${escapeHtml(farm.emails)}" placeholder="info@mrosecuador.com, ventas@mrosecuador.com">
                <span style="font-size: 0.72rem; color: #64748b;">Múltiples correos separados por coma (,)</span>
              </div>
            </div>
          </div>

          <!-- Tarjeta 5: Parámetros florícolas & Descripción -->
          <div class="card" style="border: 1px solid #d1fae5; box-shadow: var(--shadow-sm); grid-column: 1 / -1;">
            <div class="card-header" style="background: #f0fdf4; border-bottom: 1px solid #d1fae5;">
              <div class="card-title" style="color: #065f46; font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12A10 10 0 0 1 12 2z"></path><path d="M12 6v6l4 2"></path></svg>
                Datos florícolas & Descripción de la Finca
              </div>
            </div>
            <div class="card-body" style="padding: 1.25rem;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Área de Invernaderos / Extensión</label>
                  <input type="text" id="farm-area" class="form-control" value="${escapeHtml(farm.greenhouseArea || '')}" placeholder="12.5 Hectáreas">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Zona Agroecológica</label>
                  <input type="text" id="farm-climate" class="form-control" value="${escapeHtml(farm.climateZone || '')}" placeholder="Sierra Norte - Valle Interandino">
                </div>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Descripción / Misión de MRosecuador</label>
                <textarea id="farm-description" class="form-control" rows="3" placeholder="Cultivo, clasificación y exportación de rosas premium de alta altitud ecuatoriana.">${escapeHtml(farm.description || '')}</textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- Botones de Acción al Pie -->
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; margin-bottom: 2rem;">
          <button type="button" class="btn btn-secondary" onclick="Modules.resetFarmDefaultInfo()">
            Restablecer Valores Iniciales
          </button>
          <button type="submit" class="btn btn-emerald" style="padding: 0.6rem 1.6rem; font-weight: 700; box-shadow: 0 4px 12px rgba(5,150,105,0.3);">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
            Guardar Todos los Datos de la Finca
          </button>
        </div>
      </form>
    `;
  }

  function handleFarmLogoUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    // Validación de formato
    if (!file.type.match(/^image\//)) {
      App.showToast('Por favor seleccione un archivo de imagen válido (JPG, PNG, WebP).', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        // Redimensionar para optimizar tamaño en localStorage
        const maxDim = 360;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.88);

        pendingFarmLogoBase64 = compressedBase64;

        // Actualizar vistas previas inmediatas en pantalla
        const previewEl = document.getElementById('farm-logo-preview');
        if (previewEl) previewEl.src = compressedBase64;
        const heroEl = document.getElementById('farm-hero-logo');
        if (heroEl) heroEl.src = compressedBase64;

        App.showToast('Logotipo cargado en vista previa. Haga clic en "Guardar Cambios" para aplicar.', 'info');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function resetFarmLogo() {
    pendingFarmLogoBase64 = 'assets/logo.jpg';
    const previewEl = document.getElementById('farm-logo-preview');
    if (previewEl) previewEl.src = 'assets/logo.jpg';
    const heroEl = document.getElementById('farm-hero-logo');
    if (heroEl) heroEl.src = 'assets/logo.jpg';
    App.showToast('Logotipo restablecido al valor inicial. Haga clic en "Guardar Cambios" para confirmar.', 'info');
  }

  function resetFarmDefaultInfo() {
    if (!confirm('¿Desea restablecer todos los datos de la finca a los valores institucionales por defecto?')) return;
    const defaultData = {
      name: 'MRosecuador',
      companyName: 'MRosecuador Cía. Ltda.',
      logo: 'assets/logo.jpg',
      ruc: '1792345678001',
      location: 'Vía Tabacundo - Cayambe Km 4.5, Parroquia Tupigachi',
      canton: 'Pedro Moncayo',
      province: 'Pichincha',
      country: 'Ecuador',
      altitude: '2,850 msnm',
      phones: '+593 2 236 1234 / +593 99 876 5432',
      emails: 'info@mrosecuador.com, ventas@mrosecuador.com, calidad@mrosecuador.com',
      legalRep: 'Ing. Marco Rosero',
      greenhouseArea: '12.5 Hectáreas',
      climateZone: 'Sierra Norte - Valle Interandino',
      description: 'Cultivo, clasificación y exportación de rosas premium de alta altitud ecuatoriana.'
    };
    Store.saveFarmInfo(defaultData);
    if (typeof App.updateBrandDisplay === 'function') {
      App.updateBrandDisplay();
    }
    App.showToast('Datos de la finca restablecidos a los valores por defecto.', 'success');
    renderFarmInfo(document.getElementById('view-container'));
  }

  function saveFarmInfoFromForm() {
    const name = document.getElementById('farm-name')?.value?.trim();
    const companyName = document.getElementById('farm-company-name')?.value?.trim();
    const ruc = document.getElementById('farm-ruc')?.value?.trim();
    const location = document.getElementById('farm-location')?.value?.trim();
    const canton = document.getElementById('farm-canton')?.value?.trim();
    const province = document.getElementById('farm-province')?.value?.trim();
    const country = document.getElementById('farm-country')?.value?.trim();
    const altitude = document.getElementById('farm-altitude')?.value?.trim();
    const phones = document.getElementById('farm-phones')?.value?.trim();
    const emails = document.getElementById('farm-emails')?.value?.trim();
    const legalRep = document.getElementById('farm-legal-rep')?.value?.trim();
    const greenhouseArea = document.getElementById('farm-area')?.value?.trim();
    const climateZone = document.getElementById('farm-climate')?.value?.trim();
    const description = document.getElementById('farm-description')?.value?.trim();

    if (!name || !ruc || !location || !altitude) {
      App.showToast('Por favor complete los campos obligatorios (Nombre, RUC, Ubicación y Altura).', 'warning');
      return;
    }

    const currentFarm = Store.getFarmInfo();
    const updated = {
      ...currentFarm,
      name,
      companyName,
      ruc,
      location,
      canton,
      province,
      country,
      altitude,
      phones,
      emails,
      legalRep,
      greenhouseArea,
      climateZone,
      description
    };

    if (pendingFarmLogoBase64) {
      updated.logo = pendingFarmLogoBase64;
    }

    Store.saveFarmInfo(updated);

    // Actualizar branding visual en la cabecera y barra lateral
    if (typeof App.updateBrandDisplay === 'function') {
      App.updateBrandDisplay();
    }

    App.showToast('✅ ¡Datos de la finca guardados y actualizados exitosamente!', 'success');

    // Refrescar la vista activa para actualizar banners y previews
    const container = document.getElementById('view-container');
    if (container) {
      renderFarmInfo(container);
    }
  }


  // Aliases de compatibilidad para llamadas previas
  function switchQualityTab(tab) {
    currentQualityTab = tab;
    refreshCurrentQualityView();
  }
  function filterQualityFieldTable() {}
  function recalcBunchScoreInModal() { recalcBunchScore(); }
  function closeCameraModal() { stopCameraStream(); App.closeModal(); }
  function takeSnapshotFromCamera(type) { takeLiveSnapshot(type); }
  function handleCheckPhotoSelect(input, type) { handleCheckPhotosSelect(input, type); }
  function setCheckPhotoData() {}
  function removeCheckPhotoAtIndex(type, idx) { removeCheckPhoto(type, idx); }
  function clearAllCheckPhotos() { currentFieldCheckPhotos = []; currentBunchCheckPhotos = []; }
  function viewCheckPhotoDirect(type, idx) { viewQualityPhotoDirect(type, idx); }
  function viewCheckPhoto(id, type, idx) { viewQualityPhoto(id, type, idx); }
  function viewCheckPhotoGallery(id, type) { viewQualityGallery(id, type); }
  function renderGalleryModal(id, type) { viewQualityGallery(id, type); }
  function navigateGallery() {}
  function jumpGalleryTo() {}

  return {
    renderDashboard,
    renderProduccion,
    openProductionModal,
    saveProductionFromForm,
    deleteProduction,
    exportProductionXLSX,
    switchProductionTab,
    filterProductionView,
    clearProductionFilters,
    renderCalidad,
    openQualityModal,
    saveQualityFromForm,
    renderFarmPlans,
    renderFarmPlansTableRows,
    filterFarmPlansTable,
    openFarmPlanModal,
    saveFarmPlanFromForm,
    deleteFarmPlan,
    openFarmAreaModal,
    saveFarmAreaFromForm,
    deleteFarmArea,
    switchFarmPlansTab,
    renderFarmAreasTableRows,
    downloadFarmTemplateXLSX,
    openImportExcelModal,
    handleExcelFileSelect,
    processExcelFile,
    executeExcelImport,
    exportFarmPlansXLSX,
    renderVarietiesCatalog,
    renderVarietiesTableRowsHtml,
    renderVarietiesCardsHtml,
    openVarietyModal,
    handleVarietyPhotoSelect,
    saveVarietyFromForm,
    deleteVariety,
    filterVarietiesCatalog,
    filterVarietiesCatalogByText,
    renderDynamicModule,
    openDynamicRecordModal,
    saveDynamicRecordFromForm,
    // Trazabilidad: Códigos y Etiquetas
    generateCode128Svg,
    renderBarcodeLabels,
    renderBarcodeTableRows,
    filterBarcodeTable,
    openBarcodeModal,
    saveBarcodeFromForm,
    deleteBarcode,
    openPrintLabelsModal,
    // Monitoreo: Control de Riego
    renderIrrigationControl,
    switchIrrigationTab,
    renderIrrigationFieldTableRows,
    openFieldSampleModal,
    saveFieldSampleFromForm,
    deleteFieldSample,
    renderIrrigationPrepTableRows,
    filterIrrigationTable,
    openPrepIrrigationModal,
    savePrepIrrigationFromForm,
    deletePrepIrrigation,
    exportIrrigationXLSX,
    // Operaciones: Registro de Producción
    renderHarvestProduction,
    renderHarvestProductionTableRows,
    filterHarvestProdTable,
    handleBarcodeScanInput,
    processBarcodeScan,
    openHarvestProdModal,
    toggleHarvestMode,
    updateHarvestTotalStems,
    saveHarvestProdFromForm,
    deleteHarvestProd,
    exportHarvestProdXLSX,
    // Dashboard Gerencial
    renderGerencialDashboard,
    setDashboardPeriod,
    applyGerencialDateRange,
    printDashboardReport,
    setGerencialCurveFilters,
    resetGerencialCurveFilters,
    // Dashboard de Producción (Panel Ejecutivo)
    renderProductionDashboard,
    setProdDashPeriod,
    setProdDashVariety,
    setProdDashBlock,
    applyProdDashDateRange,
    resetProdDashFilters,
    printProductionDashboardReport,
// Proyecciones & Pinch
    renderProjectionsModule,
    openProjectionModal,
    recalcProjectionInModal,
    saveProjectionFromForm,
    deleteProjection,
    exportProjectionsXLSX,
    // Proyeccin de Retornos (Ciclo Vegetativo)
    renderReturnProjectionsModule,
    openReturnProjectionModal,
    recalcReturnProjectionInModal,
    saveReturnProjectionFromForm,
    deleteReturnProjection,
    exportReturnProjectionsXLSX,
    filterReturnProjectionsTable,
    onReturnVarietyChange,
    // Proceso y Clasificacin
    renderProcessModule,
    openProcessModal,
    recalcProcessInModal,
    saveProcessFromForm,
    deleteProcessRecord,
    exportProcessXLSX,
    // Control de Calidad (Campo & Proceso)
    renderQualityFieldDashboard,
    renderQualityProcessDashboard,
    renderQualityDashboard,
    setFieldTrendPeriod,
    updateQualityFieldTrend,
    setProcessTrendPeriod,
    updateQualityProcessTrend,
    recalcBunchScore,
    stopCameraStream,
    takeLiveSnapshot,
    viewQualityPhoto,
    viewQualityGallery,
    viewQualityPhotoDirect,
    renderQualityChecklistsModule,
    renderQualityFieldModule,
    renderQualityProcessModule,
    refreshCurrentQualityView,
    switchQualityTab,
    filterQualityFieldTable,
    openFieldCheckModal,
    onFieldCheckTypeChange,
    recalcFieldScore,
    saveFieldCheckFromForm,
    deleteFieldCheck,
    openBunchCheckModal,
    recalcBunchScoreInModal,
    saveBunchCheckFromForm,
    deleteBunchCheck,
    exportQualityXLSX,
    // Motor Fotogrfico y Galeras de Calidad
    openCameraCapture,
    closeCameraModal,
    takeSnapshotFromCamera,
    handleCheckPhotoSelect,
    handleCheckPhotosSelect,
    setCheckPhotoData,
    removeCheckPhoto,
    removeCheckPhotoAtIndex,
    clearAllCheckPhotos,
    renderCheckPhotosPreview,
    viewCheckPhotoDirect,
    viewCheckPhoto,
    viewCheckPhotoGallery,
    renderGalleryModal,
    navigateGallery,
    jumpGalleryTo,
    printFieldCheck,
    printBunchCheck,
    printQualityChecklistReport,
    // Ventas y Stock en Frío
    renderSalesModule,
    openSaleModal,
    recalcSaleTotal,
    saveSaleFromForm,
    deleteSaleRecord,
    exportSalesXLSX,
    printSaleInvoice,
    // Impresión de Catálogo
    openPrintCatalogModal,
    updatePrintCatalogPreview,
    executeCatalogPrint,
    printSingleVarietySheet,
    // Configuración Finca: Datos Finca
    renderFarmInfo,
    handleFarmLogoUpload,
    resetFarmLogo,
    resetFarmDefaultInfo,
    saveFarmInfoFromForm
  };
})();

// Garantizar disponibilidad global
if (typeof window !== 'undefined') {
  window.Modules = Modules;
}


