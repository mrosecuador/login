/**
 * ==============================================================================
 * MRosecuador - Producción y Calidad
 * STORE & GESTIÓN DE ESTADO (LocalStorage)
 * ==============================================================================
 */

const Store = (function () {
  const STORAGE_KEYS = {
    USERS: 'mrose_users_v1',
    MODULES: 'mrose_modules_v1',
    PRODUCTION: 'mrose_production_v1',
    QUALITY: 'mrose_quality_v1',
    FARM_PLANS: 'mrose_farm_plans_v1',
    FARM_AREAS: 'mrose_farm_areas_v1',
    VARIETIES: 'mrose_varieties_catalog_v1',
    BARCODES: 'mrose_barcodes_v1',
    IRRIGATION_PREP: 'mrose_irrigation_prep_v1',
    IRRIGATION_FIELD: 'mrose_irrigation_field_v1',
    HARVEST_PROD: 'mrose_harvest_prod_v1',
    PROCESS_RECORDS: 'mrose_process_records_v1',
    QUALITY_FIELD_CHECKS: 'mrose_quality_field_v1',
    QUALITY_BUNCH_CHECKS: 'mrose_quality_bunch_v1',
    SALES_RECORDS: 'mrose_sales_records_v1',
    PROJECTIONS: 'mrose_projections_v1',
    RETURN_PROJECTIONS: 'mrose_return_projections_v1',
    DYNAMIC_DATA: 'mrose_dynamic_records_v1',
    ACTIVITY_LOGS: 'mrose_activity_logs_v1',
    SESSION: 'mrose_session_v1',
    CONFIG: 'mrose_config_v1',
    FARM_INFO: 'mrose_farm_info_v1'
  };

  // Módulos del Sistema Florícola en el orden solicitado por el usuario
  const INITIAL_MODULES = [
    {
      id: 'mod_dashboard_gerencial',
      key: 'dashboard-gerencial',
      name: 'Dashboard Gerencial',
      category: 'gerencia',
      icon: 'trending-up',
      description: 'Resumen ejecutivo con líneas de tendencia de Producción diaria, Control de Riego (pH y CE) y Ventas.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_dashboard_produccion',
      key: 'dashboard-produccion',
      name: 'Dashboard de Producción',
      category: 'gerencia',
      icon: 'chart',
      description: 'Línea de tendencia neta de producción diaria, semanal (Lunes a Domingo), mensual, anual o por rango de fechas con filtros por Bloque y Variedad.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_dashboard_calidad_campo',
      key: 'dashboard-calidad-campo',
      name: 'Dashboard Calidad Campo',
      category: 'gerencia',
      icon: 'clipboard',
      description: 'Tablero ejecutivo de calidad en cultivo: labores culturales, mallas por cosechador, ranking de bloques y defectos en campo.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_dashboard_calidad_proceso',
      key: 'dashboard-calidad-proceso',
      name: 'Dashboard Calidad Proceso',
      category: 'gerencia',
      icon: 'award',
      description: 'Tablero ejecutivo de calidad en poscosecha: calificación de bonches por mesa, sanidad vegetal, armado y rechazos.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_dashboard_calidad',
      key: 'dashboard-calidad',
      name: 'Dashboard de Calidad (General)',
      category: 'gerencia',
      icon: 'award',
      description: 'Tablero ejecutivo de calidad florícola: índice global IQG, comparativa campo vs poscosecha, ranking de bloques y defectos.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_finca_datos',
      key: 'config-finca-datos',
      name: 'Datos Finca',
      category: 'finca',
      icon: 'building',
      description: 'Configuración institucional de la finca: logotipo, nombre, ubicación geográfica, altura msnm, RUC, contactos y correos.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_finca_cat',
      key: 'config-finca-catalogo',
      name: 'Catálogo de Variedades',
      category: 'finca',
      icon: 'flower',
      description: 'Catálogo de rosas con foto, tamaño de botón, largos de tallos, punto de corte, florero y pétalos.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_finca_planos',
      key: 'config-finca-planos',
      name: 'Plano de Finca',
      category: 'finca',
      icon: 'map',
      description: 'Bloques, variedades, camas, fecha de siembra, ciclos productivos y gestión con plantillas Excel .xlsx.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_etiquetas',
      key: 'etiquetas-codigos',
      name: 'Códigos y Etiquetas',
      category: 'trazabilidad',
      icon: 'barcode',
      description: 'Generación e impresión de etiquetas con código de barras Code 128 por Bloque, Variedad y Cosechador.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_riego',
      key: 'riego-control',
      name: 'Control de Riego (pH y CE)',
      category: 'campo',
      icon: 'drop',
      description: 'Control de pH y CE desde preparación en cabezal y monitoreo de muestras en campo por Bloque, Variedad y Válvula.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_produccion',
      key: 'produccion-cosecha',
      name: 'Registro de Producción',
      category: 'campo',
      icon: 'sprout',
      description: 'Registro de producción de cultivo por bloque y variedad en mallas o tallos, o mediante escaneo de código de barras.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_proyecciones',
      key: 'proyecciones-pinch',
      name: 'PlanificaciÃ³n de Pinch',
      category: 'planificacion',
      icon: 'calendar',
      description: 'PlanificaciÃ³n de cosecha dÃ­a + pinch para proyectar la fecha de corte requerida segÃºn ciclo productivo.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_proy_retornos',
      key: 'proyeccion-retornos',
      name: 'Proyección de Retornos',
      category: 'proyeccion',
      icon: 'trending-up',
      description: 'Proyección de cosechas futuras y retornos de flor según el ciclo vegetativo por variedad (días de ciclo).',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_proceso',
      key: 'proceso-postcosecha',
      name: 'Proceso y Clasificación',
      category: 'poscosecha',
      icon: 'process',
      description: 'Recepción y proceso en sala de poscosecha, registro de tallos clasificados por mesa, flor nacional y exportable.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_calidad_campo',
      key: 'calidad-campo',
      name: 'Calidad Campo',
      category: 'calidad',
      icon: 'sprout',
      description: 'Auditorías de calidad en cultivo: labores culturales (desyeme, capuchón, tutoraje) y mallas de corte con múltiples fotos.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_calidad_proceso',
      key: 'calidad-proceso',
      name: 'Calidad Proceso',
      category: 'calidad',
      icon: 'award',
      description: 'Auditorías en poscosecha: inspección técnica de bonches armados (sanidad, maltrato y estándares de armado) con múltiples fotos.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_ventas',
      key: 'ventas-stock',
      name: 'Ventas y Stock',
      category: 'ventas',
      icon: 'cart',
      description: 'Monitoreo de stock procesado en frío por variedad y registro de órdenes de venta con despacho.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_accesos',
      key: 'accesos-usuarios',
      name: 'Gestión de Usuarios & Accesos',
      category: 'accesos',
      icon: 'shield',
      description: 'Creación de nuevos usuarios, asignación de credenciales y configuración de permisos de acceso a las plataformas del sistema.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    },
    {
      id: 'mod_accesos_perm',
      key: 'accesos-permisos',
      name: 'Matriz de Permisos',
      category: 'accesos',
      icon: 'check',
      description: 'Matriz visual para habilitar o restringir el acceso a plataformas por usuario en tiempo real.',
      isSystem: true,
      status: 'active',
      defaultRoles: ['admin']
    }
  ];

  // Usuarios iniciales predefinidos (exclusivamente Administrador)
  const INITIAL_USERS = [
    {
      id: 'usr_admin',
      name: 'Administrador General',
      username: 'admin',
      email: 'admin@mrosecuador.com',
      password: 'admin',
      role: 'admin',
      roleName: 'Administrador',
      status: 'active',
      avatar: 'AD',
      permissions: ['*'], // '*' indica acceso total
      createdAt: '2026-10-01T08:00:00Z',
      lastLogin: '2026-10-08T14:00:00Z'
    }
  ];

  // Datos iniciales de la finca (perfil institucional y florícola oficial)
  const INITIAL_FARM_INFO = {
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

  // Datos iniciales de Áreas e Instalaciones de la Finca
  const INITIAL_FARM_AREAS = [
    {
      id: 'area_1',
      code: 'SEC-NTE',
      name: 'Sector Norte - Invernaderos',
      type: 'Cultivo / Producción',
      surfaceHa: 4.5,
      surfaceM2: 45000,
      supervisor: 'Ing. Mateo Proaño',
      status: 'Activa',
      description: 'Naves de invernadero para variedades rojas Freedom y Explorer con riego por goteo.'
    },
    {
      id: 'area_2',
      code: 'SEC-SUR',
      name: 'Sector Sur - Invernaderos',
      type: 'Cultivo / Producción',
      surfaceHa: 3.8,
      surfaceM2: 38000,
      supervisor: 'Ing. Mateo Proaño',
      status: 'Activa',
      description: 'Naves de invernadero para variedades blancas y bicolores (Mondial, Playa Blanca, Pink Floyd).'
    },
    {
      id: 'area_3',
      code: 'POS-01',
      name: 'Nave de Poscosecha y Empaque',
      type: 'Poscosecha / Proceso',
      surfaceHa: 0.6,
      surfaceM2: 6000,
      supervisor: 'Elena Rosero',
      status: 'Activa',
      description: 'Línea de recepción de flor, tinas de hidratación y 4 mesas de clasificación y bonchado.'
    },
    {
      id: 'area_4',
      code: 'FRIO-01',
      name: 'Área de Cuartos Fríos',
      type: 'Refrigeración / Almacén',
      surfaceHa: 0.25,
      surfaceM2: 2500,
      supervisor: 'Elena Rosero',
      status: 'Activa',
      description: 'Cámaras frías a 2°C - 3°C para conservación y reposo de flor de exportación.'
    },
    {
      id: 'area_5',
      code: 'RIEGO-01',
      name: 'Cabezal de Riego y Fertirriego',
      type: 'Infraestructura / Riego',
      surfaceHa: 0.35,
      surfaceM2: 3500,
      supervisor: 'Ing. Mateo Proaño',
      status: 'Activa',
      description: 'Estación de preparación de soluciones nutritivas, tanques de mezcla A+B y bombas.'
    }
  ];

  // Datos iniciales de planos de finca (ciclo en días y área asociada)
  const INITIAL_FARM_PLANS = [
    {
      id: 'fp_101',
      block: 'Bloque 1',
      responsible: 'Ing. Mateo Proaño',
      variety: 'Freedom',
      beds: '24',
      plantingDate: '2025-06-15',
      cycle: '75 días',
      plantsTotal: '4800',
      status: 'Activo',
      notes: 'Rosas rojas premium para exportación regular a EE.UU.'
    },
    {
      id: 'fp_102',
      block: 'Bloque 2',
      responsible: 'Ing. Marco Silva',
      variety: 'Mondial',
      beds: '20',
      plantingDate: '2025-08-20',
      cycle: '80 días',
      plantsTotal: '4000',
      status: 'Activo',
      notes: 'Variedad blanca, alta demanda en bodas y mercado europeo'
    },
    {
      id: 'fp_103',
      block: 'Bloque 3',
      responsible: 'Ing. Carlos Tipán',
      variety: 'Explorer',
      beds: '28',
      plantingDate: '2025-04-10',
      cycle: '70 días',
      plantsTotal: '5600',
      status: 'Activo',
      notes: 'Rojo terciopelo botón grande de alta durabilidad'
    },
    {
      id: 'fp_104',
      block: 'Bloque 4A',
      responsible: 'Ing. Andrea Paredes',
      variety: 'Playa Blanca',
      beds: '18',
      plantingDate: '2026-01-12',
      cycle: '90 días',
      plantsTotal: '3600',
      status: 'Activo',
      notes: 'Siembra reciente en desarrollo vegetativo óptimo'
    },
    {
      id: 'fp_105',
      block: 'Bloque 4B',
      responsible: 'Ing. Mateo Proaño',
      variety: 'Pink Floyd',
      beds: '16',
      plantingDate: '2024-11-05',
      cycle: '65 días',
      plantsTotal: '3200',
      status: 'En Poda',
      notes: 'Poda de sincronización para temporada alta'
    }
  ];

  // Datos iniciales del catálogo de variedades de rosas
  const INITIAL_VARIETIES = [
    {
      id: 'var_1',
      name: 'Freedom',
      color: 'Rojo Clásico Ecuatoriano',
      colorTag: 'rojo',
      budSize: '6.0 - 6.8 cm (Grande)',
      stemLengths: '60, 70, 80, 90 cm',
      cutStage: 'Punto 2.5 - 3.0 (Copa semi-abierta)',
      vaseLife: '14 - 18 días en florero',
      petalCount: '45 - 55 pétalos',
      breeder: 'Rosen Tantau',
      description: 'La rosa roja insignia del Ecuador. Pétalos gruesos de apertura suave y gran resistencia en tránsito marítimo y aéreo.',
      photo: 'assets/variety_freedom.svg'
    },
    {
      id: 'var_2',
      name: 'Mondial',
      color: 'Blanco Puro / Marfil',
      colorTag: 'blanco',
      budSize: '5.8 - 6.5 cm',
      stemLengths: '60, 70, 80, 90, 100 cm',
      cutStage: 'Punto 2.0 - 2.5 (Apertura temprana)',
      vaseLife: '16 - 20 días en florero',
      petalCount: '40 - 48 pétalos',
      breeder: 'Kordes Rosen',
      description: 'La consentida para bodas y recepciones de gala. Follaje verde esmeralda y tallos extremadamente firmes y derechos.',
      photo: 'assets/variety_mondial.svg'
    },
    {
      id: 'var_3',
      name: 'Explorer',
      color: 'Rojo Oscuro Terciopelo',
      colorTag: 'rojo',
      budSize: '6.5 - 7.2 cm (Jumbo)',
      stemLengths: '70, 80, 90, 100+ cm',
      cutStage: 'Punto 2.8 - 3.2',
      vaseLife: '15 - 19 días en florero',
      petalCount: '50 - 60 pétalos',
      breeder: 'Interplant',
      description: 'Botón profundo con textura de terciopelo. Ideal para mercados exigentes de lujo en Norteamérica y Medio Oriente.',
      photo: 'assets/variety_explorer.svg'
    },
    {
      id: 'var_4',
      name: 'Playa Blanca',
      color: 'Blanco Nieve Puro',
      colorTag: 'blanco',
      budSize: '6.2 - 6.8 cm',
      stemLengths: '60, 70, 80 cm',
      cutStage: 'Punto 2.5',
      vaseLife: '14 - 17 días en florero',
      petalCount: '45 - 50 pétalos',
      breeder: 'De Ruiter',
      description: 'Floración simétrica con pétalos de textura cerosa y ondulación suave en la apertura, sin tonos verdosos.',
      photo: 'assets/variety_playa_blanca.svg'
    },
    {
      id: 'var_5',
      name: 'Pink Floyd',
      color: 'Fucsia Neón Intenso',
      colorTag: 'fucsia',
      budSize: '6.5 - 7.0 cm',
      stemLengths: '60, 70, 80, 90 cm',
      cutStage: 'Punto 2.5 - 3.0',
      vaseLife: '14 - 18 días en florero',
      petalCount: '48 - 58 pétalos',
      breeder: 'Rosen Tantau',
      description: 'Color fucsia hipnótico que no pierde saturación. Posee una ligera fragancia dulce y follaje muy vigoroso.',
      photo: 'assets/variety_pink_floyd.svg'
    }
  ];

  // Datos iniciales de producción florícola
  const INITIAL_PRODUCTION = [
    {
      id: 'prod_101',
      date: '2026-10-08',
      block: 'Bloque 1',
      bed: 'Camas 01-12',
      variety: 'Freedom',
      stems: 4200,
      grade: 'Exportación Alta',
      harvester: 'Juan Tipán',
      responsible: 'Juan Tipán',
      notes: 'Corte matutino en óptimo punto de apertura'
    },
    {
      id: 'prod_102',
      date: '2026-10-08',
      block: 'Bloque 2',
      bed: 'Camas 15-20',
      variety: 'Mondial',
      stems: 3850,
      grade: 'Exportación Selecta',
      harvester: 'Carlos Mendoza',
      responsible: 'Carlos Mendoza',
      notes: 'Variedad blanca pura, botón uniforme'
    },
    {
      id: 'prod_103',
      date: '2026-10-07',
      block: 'Bloque 3',
      bed: 'Camas 05-18',
      variety: 'Explorer',
      stems: 5120,
      grade: 'Exportación Premium',
      harvester: 'Byron Guamán',
      responsible: 'Byron Guamán',
      notes: 'Rosas rojas terciopelo de alta demanda'
    },
    {
      id: 'prod_104',
      date: '2026-10-07',
      block: 'Bloque 4A',
      bed: 'Camas 02-14',
      variety: 'Playa Blanca',
      stems: 2900,
      grade: 'Exportación Selecta',
      harvester: 'María Toapanta',
      responsible: 'María Toapanta',
      notes: 'Control de apertura estricto para mercado europeo'
    },
    {
      id: 'prod_105',
      date: '2026-10-06',
      block: 'Bloque 4B',
      bed: 'Camas 01-10',
      variety: 'Pink Floyd',
      stems: 3400,
      grade: 'Exportación Estándar',
      harvester: 'Luis Chiluisa',
      responsible: 'Luis Chiluisa',
      notes: 'Tonalidad fucsia vibrante en plena floración'
    }
  ];

  // Datos iniciales de inspección de calidad
  const INITIAL_QUALITY = [
    {
      id: 'cal_201',
      date: '2026-10-08',
      batch: 'LOTE-20261008-FRD',
      variety: 'Freedom',
      sampleSize: 200,
      stemLengthAvg: '70 cm',
      exportablePercent: 96.5,
      defectsFound: 7,
      mainDefect: 'Curvatura ligera de tallo',
      status: 'Aprobado Exportación',
      inspector: 'Elena Rosero'
    },
    {
      id: 'cal_202',
      date: '2026-10-08',
      batch: 'LOTE-20261008-MON',
      variety: 'Mondial',
      sampleSize: 150,
      stemLengthAvg: '80 cm',
      exportablePercent: 98.0,
      defectsFound: 3,
      mainDefect: 'Punto de pétalo exterior',
      status: 'Aprobado Premium',
      inspector: 'Elena Rosero'
    },
    {
      id: 'cal_203',
      date: '2026-10-07',
      batch: 'LOTE-20261007-EXP',
      variety: 'Explorer',
      sampleSize: 250,
      stemLengthAvg: '60 cm',
      exportablePercent: 94.0,
      defectsFound: 15,
      mainDefect: 'Botón con calibre heterogéneo',
      status: 'Aprobado Estándar',
      inspector: 'Elena Rosero'
    }
  ];

  // Datos iniciales de etiquetas y códigos de barras generados
  const INITIAL_BARCODES = [
    {
      id: 'lbl_101',
      code: 'MR-B01-FRD-C01-261008',
      block: 'Bloque 1',
      variety: 'Freedom',
      harvester: 'Juan Tipán',
      harvesterCode: 'C-01',
      date: '2026-10-08',
      batch: 'LOTE-B1-0810',
      count: 20,
      createdAt: '2026-10-08T07:15:00Z',
      notes: 'Corte matutino mallas de exportación'
    },
    {
      id: 'lbl_102',
      code: 'MR-B02-MON-C02-261008',
      block: 'Bloque 2',
      variety: 'Mondial',
      harvester: 'Carlos Mendoza',
      harvesterCode: 'C-02',
      date: '2026-10-08',
      batch: 'LOTE-B2-0810',
      count: 25,
      createdAt: '2026-10-08T07:30:00Z',
      notes: 'Flor blanca premium'
    },
    {
      id: 'lbl_103',
      code: 'MR-B03-EXP-C03-261009',
      block: 'Bloque 3',
      variety: 'Explorer',
      harvester: 'Byron Guamán',
      harvesterCode: 'C-03',
      date: '2026-10-09',
      batch: 'LOTE-B3-0910',
      count: 30,
      createdAt: '2026-10-09T06:45:00Z',
      notes: 'Rojo terciopelo tallo 80cm'
    }
  ];

  // Datos iniciales de Riego - Preparación en Cabezal
  const INITIAL_IRRIGATION_PREP = [
    {
      id: 'irrp_101',
      date: '2026-10-09',
      time: '06:30',
      tank: 'Tanque A + B (Mezcla General)',
      ph: 5.95,
      ec: 1.45,
      volume: '15,000 L',
      formula: 'Fórmula Vegetativa Alta (N-P-K + Micro)',
      responsible: 'Ing. Mateo Proaño',
      status: 'Óptimo',
      notes: 'Ajuste con ácido fosfórico al 85%'
    },
    {
      id: 'irrp_102',
      date: '2026-10-08',
      time: '07:00',
      tank: 'Tanque Ácido + Mezcla C',
      ph: 6.05,
      ec: 1.50,
      volume: '18,000 L',
      formula: 'Fórmula Calcio-Potasio Floración',
      responsible: 'Ing. Mateo Proaño',
      status: 'Óptimo',
      notes: 'Preparación para bloques 1 al 4'
    }
  ];

  // Datos iniciales de Riego - Muestras en Campo por Válvula
  const INITIAL_IRRIGATION_FIELD = [
    {
      id: 'irrf_101',
      date: '2026-10-09',
      time: '08:15',
      block: 'Bloque 1',
      variety: 'Freedom',
      valve: 'Válvula 1',
      sampleType: 'Gotero emisor',
      ph: 6.00,
      ec: 1.48,
      temperature: '18.5 °C',
      status: 'Óptimo',
      evaluator: 'Carlos Viteri',
      notes: 'Presión en gotero 1.2 bar, caudal uniforme'
    },
    {
      id: 'irrf_102',
      date: '2026-10-09',
      time: '08:35',
      block: 'Bloque 1',
      variety: 'Freedom',
      valve: 'Válvula 2',
      sampleType: 'Drenaje de cama',
      ph: 6.15,
      ec: 1.62,
      temperature: '19.0 °C',
      status: 'Óptimo',
      evaluator: 'Carlos Viteri',
      notes: 'Drenaje del 18%, absorción balanceada'
    },
    {
      id: 'irrf_103',
      date: '2026-10-08',
      time: '09:00',
      block: 'Bloque 2',
      variety: 'Mondial',
      valve: 'Válvula 1',
      sampleType: 'Gotero emisor',
      ph: 5.90,
      ec: 1.42,
      temperature: '18.2 °C',
      status: 'Óptimo',
      evaluator: 'Carlos Viteri',
      notes: 'Monitoreo preventivo en camas 01 a 10'
    },
    {
      id: 'irrf_104',
      date: '2026-10-08',
      time: '09:20',
      block: 'Bloque 3',
      variety: 'Explorer',
      valve: 'Válvula 3',
      sampleType: 'Drenaje de cama',
      ph: 6.45,
      ec: 1.78,
      temperature: '19.5 °C',
      status: 'Alerta pH',
      evaluator: 'Carlos Viteri',
      notes: 'pH ligeramente elevado en salida de drenaje'
    }
  ];

  // Datos iniciales de Registro de Producción de Cosecha
  const INITIAL_HARVEST_PROD = [
    // Lunes 2026-10-05
    {
      id: 'hrv_051',
      date: '2026-10-05',
      time: '07:30',
      block: 'Bloque 1',
      variety: 'Freedom',
      harvester: 'Juan Tipán',
      mode: 'mallas',
      mallas: 60,
      stemsPerMalla: 25,
      totalStems: 1500,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B01-FRD-C01-261005',
      notes: 'Corte de apertura semanal, botón uniforme punto 2.5'
    },
    {
      id: 'hrv_052',
      date: '2026-10-05',
      time: '08:45',
      block: 'Bloque 2',
      variety: 'Mondial',
      harvester: 'Carlos Mendoza',
      mode: 'mallas',
      mallas: 58,
      stemsPerMalla: 25,
      totalStems: 1450,
      grade: 'Exportación Selecta',
      shift: 'Mañana',
      barcode: 'MR-B02-MON-C02-261005',
      notes: 'Tallo vigoroso, sanidad excelente'
    },
    // Martes 2026-10-06
    {
      id: 'hrv_061',
      date: '2026-10-06',
      time: '07:40',
      block: 'Bloque 3',
      variety: 'Explorer',
      harvester: 'Byron Guamán',
      mode: 'mallas',
      mallas: 64,
      stemsPerMalla: 25,
      totalStems: 1600,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B03-EXP-C03-261006',
      notes: 'Rojo aterciopelado, corte según estándar de supervisor'
    },
    {
      id: 'hrv_062',
      date: '2026-10-06',
      time: '08:50',
      block: 'Bloque 4',
      variety: 'Playa Blanca',
      harvester: 'Luis Morales',
      mode: 'mallas',
      mallas: 63,
      stemsPerMalla: 25,
      totalStems: 1580,
      grade: 'Exportación Selecta',
      shift: 'Mañana',
      barcode: 'MR-B04-PBL-C04-261006',
      notes: 'Blanco puro, sin trips ni velloso'
    },
    // Miércoles 2026-10-07
    {
      id: 'hrv_071',
      date: '2026-10-07',
      time: '07:35',
      block: 'Bloque 1',
      variety: 'Freedom',
      harvester: 'Juan Tipán',
      mode: 'mallas',
      mallas: 68,
      stemsPerMalla: 25,
      totalStems: 1700,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B01-FRD-C01-261007',
      notes: 'Pico intermedio de semana con alta calidad'
    },
    {
      id: 'hrv_072',
      date: '2026-10-07',
      time: '09:00',
      block: 'Bloque 5',
      variety: 'Pink Floyd',
      harvester: 'Ángel Pilataxi',
      mode: 'mallas',
      mallas: 66,
      stemsPerMalla: 25,
      totalStems: 1650,
      grade: 'Exportación Especial',
      shift: 'Mañana',
      barcode: 'MR-B05-PKF-C05-261007',
      notes: 'Fucsia intenso de gran tamaño'
    },
    // Jueves 2026-10-08
    {
      id: 'hrv_081',
      date: '2026-10-08',
      time: '07:45',
      block: 'Bloque 2',
      variety: 'Mondial',
      harvester: 'Carlos Mendoza',
      mode: 'mallas',
      mallas: 60,
      stemsPerMalla: 25,
      totalStems: 1500,
      grade: 'Exportación Selecta',
      shift: 'Mañana',
      barcode: 'MR-B02-MON-C02-261008',
      notes: 'Corte programado para hidratación rápida'
    },
    {
      id: 'hrv_082',
      date: '2026-10-08',
      time: '08:30',
      block: 'Bloque 3',
      variety: 'Explorer',
      harvester: 'Byron Guamán',
      mode: 'mallas',
      mallas: 59,
      stemsPerMalla: 25,
      totalStems: 1480,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B03-EXP-C03-261008',
      notes: 'Conteo en mallas validadas con etiqueta'
    },
    // Viernes 2026-10-09 (Hoy)
    {
      id: 'hrv_101',
      date: '2026-10-09',
      time: '07:45',
      block: 'Bloque 1',
      variety: 'Freedom',
      harvester: 'Juan Tipán',
      mode: 'mallas',
      mallas: 35,
      stemsPerMalla: 25,
      totalStems: 875,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B01-FRD-C01-261009',
      notes: 'Corte matutino, botón cerrado punto 2.5 solicitado por supervisor'
    },
    {
      id: 'hrv_102',
      date: '2026-10-09',
      time: '08:10',
      block: 'Bloque 2',
      variety: 'Mondial',
      harvester: 'Carlos Mendoza',
      mode: 'mallas',
      mallas: 40,
      stemsPerMalla: 25,
      totalStems: 1000,
      grade: 'Exportación Selecta',
      shift: 'Mañana',
      barcode: 'MR-B02-MON-C02-261009',
      notes: 'Flor blanca impecable sin manchas'
    },
    {
      id: 'hrv_103',
      date: '2026-10-09',
      time: '11:15',
      block: 'Bloque 4',
      variety: 'Playa Blanca',
      harvester: 'Luis Morales',
      mode: 'mallas',
      mallas: 48,
      stemsPerMalla: 25,
      totalStems: 1200,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B04-PBL-C04-261009',
      notes: 'Corte de mediodía bajo sombra'
    },
    {
      id: 'hrv_104',
      date: '2026-10-09',
      time: '14:20',
      block: 'Bloque 5',
      variety: 'Pink Floyd',
      harvester: 'Ángel Pilataxi',
      mode: 'mallas',
      mallas: 35,
      stemsPerMalla: 25,
      totalStems: 875,
      grade: 'Exportación Especial',
      shift: 'Tarde',
      barcode: 'MR-B05-PKF-C05-261009',
      notes: 'Turno de tarde, hidratación en tinas con bactericida'
    },
    // Sábado 2026-10-10
    {
      id: 'hrv_105',
      date: '2026-10-10',
      time: '07:30',
      block: 'Bloque 1',
      variety: 'Freedom',
      harvester: 'Juan Tipán',
      mode: 'mallas',
      mallas: 56,
      stemsPerMalla: 25,
      totalStems: 1400,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B01-FRD-C01-261010',
      notes: 'Corte de fin de semana para cumplir órdenes de vuelo'
    },
    {
      id: 'hrv_106',
      date: '2026-10-10',
      time: '08:40',
      block: 'Bloque 3',
      variety: 'Explorer',
      harvester: 'Byron Guamán',
      mode: 'mallas',
      mallas: 56,
      stemsPerMalla: 25,
      totalStems: 1400,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B03-EXP-C03-261010',
      notes: 'Revisión fitosanitaria previa aprobada'
    },
    // Domingo 2026-10-11
    {
      id: 'hrv_107',
      date: '2026-10-11',
      time: '07:45',
      block: 'Bloque 2',
      variety: 'Mondial',
      harvester: 'Carlos Mendoza',
      mode: 'mallas',
      mallas: 40,
      stemsPerMalla: 25,
      totalStems: 1000,
      grade: 'Exportación Selecta',
      shift: 'Mañana',
      barcode: 'MR-B02-MON-C02-261011',
      notes: 'Cierre de ciclo semanal dominical'
    },
    {
      id: 'hrv_108',
      date: '2026-10-11',
      time: '08:30',
      block: 'Bloque 4',
      variety: 'Playa Blanca',
      harvester: 'Luis Morales',
      mode: 'mallas',
      mallas: 38,
      stemsPerMalla: 25,
      totalStems: 950,
      grade: 'Exportación Premium',
      shift: 'Mañana',
      barcode: 'MR-B04-PBL-C04-261011',
      notes: 'Floración limpia para despacho lunes temprano'
    }
  ];

  // Datos iniciales de Proceso y Clasificación (Mesas y Flor Nacional)
  const INITIAL_PROCESS_RECORDS = [
    {
      id: 'proc_101',
      date: '2026-10-09',
      time: '09:30',
      tableCode: 'M-01',
      tableName: 'Mesa 1 (Clasificación A)',
      variety: 'Freedom',
      block: 'Bloque 1',
      stemsHarvested: 875,
      stemsProcessed: 875,
      nationalStems: 70,
      exportStems: 805,
      pctNational: 8.0,
      pctExport: 92.0,
      pctVsHarvest: 100.0,
      responsible: 'Marta Pillajo',
      shift: 'Mañana',
      notes: 'Buen calibre de botón, 70 tallos nacionales por torcedura menor'
    },
    {
      id: 'proc_102',
      date: '2026-10-09',
      time: '10:15',
      tableCode: 'M-02',
      tableName: 'Mesa 2 (Clasificación B)',
      variety: 'Mondial',
      block: 'Bloque 2',
      stemsHarvested: 1000,
      stemsProcessed: 980,
      nationalStems: 98,
      exportStems: 882,
      pctNational: 10.0,
      pctExport: 90.0,
      pctVsHarvest: 98.0,
      responsible: 'Gladys Chusin',
      shift: 'Mañana',
      notes: 'Blanco limpio, 98 tallos nacionales por calibre irregular'
    },
    {
      id: 'proc_103',
      date: '2026-10-08',
      time: '11:00',
      tableCode: 'M-03',
      tableName: 'Mesa 3 (Especiales)',
      variety: 'Explorer',
      block: 'Bloque 3',
      stemsHarvested: 1250,
      stemsProcessed: 1250,
      nationalStems: 100,
      exportStems: 1150,
      pctNational: 8.0,
      pctExport: 92.0,
      pctVsHarvest: 100.0,
      responsible: 'Segundo Quishpe',
      shift: 'Mañana',
      notes: 'Rosas rojas premium de 80cm sin defectos'
    }
  ];

  // Datos iniciales de Control de Calidad en Campo (Labores Culturales y Calificación de Mallas)
  const INITIAL_QUALITY_FIELD_CHECKS = [
    {
      id: 'qfc_101',
      date: '2026-10-09',
      time: '08:00',
      block: 'Bloque 1',
      variety: 'Freedom',
      evaluator: 'Ing. Elena Rosero',
      type: 'labores',
      items: {
        desyeme: true,
        sacadaCapuchon: true,
        puestaCapuchon: true,
        manguerasColocadas: true,
        encanasteTutoraje: true,
        escobillado: false
      },
      score: 83,
      status: 'Aceptable',
      notes: 'Escobillado pendiente en cabeceras de camas 03 y 04; resto de labores a conformidad',
      photo: 'assets/rose_watermark.jpg'
    },
    {
      id: 'qfc_102',
      date: '2026-10-09',
      time: '08:45',
      block: 'Bloque 1',
      variety: 'Freedom',
      harvester: 'Juan Tipán',
      harvesterCode: 'C-01',
      meshCode: 'Malla #12',
      stemsAudit: 25,
      evaluator: 'Ing. Elena Rosero',
      type: 'cosecha',
      items: {
        puntosCorte: true,
        maltrato: true,
        botrytis: true,
        acaros: true,
        trips: true,
        velloso: true,
        polvoso: true,
        tallosCortos: true
      },
      score: 100,
      status: 'Excelente',
      notes: 'Malla sin defectos mecánicos ni fitosanitarios. Excelente punto de corte 2.0 y tallos homogéneos',
      photo: 'assets/rose_watermark.jpg'
    },
    {
      id: 'qfc_103',
      date: '2026-10-08',
      time: '09:15',
      block: 'Bloque 2',
      variety: 'Mondial',
      harvester: 'Carlos Mendoza',
      harvesterCode: 'C-02',
      meshCode: 'Malla #07',
      stemsAudit: 25,
      evaluator: 'Ing. Elena Rosero',
      type: 'cosecha',
      items: {
        puntosCorte: true,
        maltrato: false,
        botrytis: true,
        acaros: true,
        trips: true,
        velloso: true,
        polvoso: true,
        tallosCortos: false
      },
      score: 75,
      status: 'Aceptable',
      notes: 'Detectados 2 tallos con roce de espina y 1 tallo corto bajo medida comercial; retroalimentado el cosechador'
    },
    {
      id: 'qfc_104',
      date: '2026-10-08',
      time: '11:00',
      block: 'Bloque 3',
      variety: 'Explorer',
      evaluator: 'Ing. Elena Rosero',
      type: 'labores',
      items: {
        desyeme: true,
        sacadaCapuchon: true,
        puestaCapuchon: true,
        manguerasColocadas: true,
        encanasteTutoraje: true,
        escobillado: true
      },
      score: 100,
      status: 'Excelente',
      notes: 'Todas las labores culturales realizadas al 100% de cumplimiento técnico en el cuadro'
    }
  ];

  // Datos iniciales de Control de Calidad en Proceso (Revisión de Bonches)
  const INITIAL_QUALITY_BUNCH_CHECKS = [
    {
      id: 'qbc_101',
      date: '2026-10-09',
      time: '10:30',
      tableCode: 'M-01',
      variety: 'Freedom',
      bunchNumber: 'B-104',
      bunchSize: 25,
      inspector: 'Elena Rosero',
      items: {
        sinBotrytis: true,
        sinVelloso: true,
        sinOidio: true,
        sinMaltratoPetalos: true,
        sinFollajeDanado: true,
        sinCuelloDoblado: true,
        empateCabezasNivelado: true,
        tensionLigaOptima: true,
        conteoExactoTallos: true,
        largoHomogeneo: true
      },
      diseaseScore: 30,
      damageScore: 30,
      buildScore: 40,
      totalScore: 100,
      status: 'Excelente (Aprobado)',
      notes: 'Bonche perfectamente armado con capuchón y foliar limpio',
      photo: 'assets/rose_watermark.jpg'
    },
    {
      id: 'qbc_102',
      date: '2026-10-09',
      time: '11:15',
      tableCode: 'M-02',
      variety: 'Mondial',
      bunchNumber: 'B-208',
      bunchSize: 25,
      inspector: 'Elena Rosero',
      items: {
        sinBotrytis: true,
        sinVelloso: true,
        sinOidio: true,
        sinMaltratoPetalos: false,
        sinFollajeDanado: true,
        sinCuelloDoblado: true,
        empateCabezasNivelado: true,
        tensionLigaOptima: true,
        conteoExactoTallos: true,
        largoHomogeneo: false
      },
      diseaseScore: 30,
      damageScore: 20,
      buildScore: 30,
      totalScore: 80,
      status: 'Condicionado',
      notes: 'Ligero roce en pétalo exterior y variación de 4cm entre 2 tallos'
    }
  ];

  // Datos iniciales de Ventas y Pedidos de Exportación / Nacional
  const INITIAL_SALES_RECORDS = [
    {
      id: 'sale_101',
      date: '2026-10-09',
      orderCode: 'ORD-2026-001',
      client: 'Miami Blooms LLC (EE.UU.)',
      variety: 'Freedom',
      length: '70 cm',
      stemsCount: 500,
      bunchesCount: 20,
      pricePerStem: 0.85,
      totalAmount: 425.00,
      status: 'Despachado',
      destination: 'Miami, EE.UU.',
      notes: 'Vuelo directo Quito-Miami carga aérea frío'
    },
    {
      id: 'sale_102',
      date: '2026-10-09',
      orderCode: 'ORD-2026-002',
      client: 'FloraHolland Express (Países Bajos)',
      variety: 'Mondial',
      length: '80 cm',
      stemsCount: 500,
      bunchesCount: 20,
      pricePerStem: 0.95,
      totalAmount: 475.00,
      status: 'Reservado',
      destination: 'Aalsmeer, Holanda',
      notes: 'Reserva para subasta europea, preparación en hidrocooler'
    },
    {
      id: 'sale_103',
      date: '2026-10-08',
      orderCode: 'ORD-2026-003',
      client: 'Distribuidora Flor Ecuador (Local)',
      variety: 'Freedom',
      length: 'Flor Nacional',
      stemsCount: 200,
      bunchesCount: 8,
      pricePerStem: 0.35,
      totalAmount: 70.00,
      status: 'Despachado',
      destination: 'Mercado Nacional Quito',
      notes: 'Despacho de flor nacional en bonches de 25'
    }
  ];

  // Datos iniciales de Proyecciones de Cosecha & Pinch
  const INITIAL_PROJECTIONS = [
    {
      id: 'proj_101',
      block: 'Bloque 1',
      variety: 'Freedom',
      date: '2026-10-09',
      dayHarvest: 875,
      pinchStems: 320,
      totalInduced: 1195,
      cycleDays: 75,
      rebudFactor: 1.05,
      projectedStems: 1255,
      projectedHarvestDate: '2026-12-23',
      targetSeason: 'Navidad y Fin de Año',
      responsible: 'Ing. Mateo Proaño',
      notes: 'Pinch sincronizado para ventana comercial de fin de año'
    },
    {
      id: 'proj_102',
      block: 'Bloque 2',
      variety: 'Mondial',
      date: '2026-10-09',
      dayHarvest: 1000,
      pinchStems: 450,
      totalInduced: 1450,
      cycleDays: 80,
      rebudFactor: 1.10,
      projectedStems: 1595,
      projectedHarvestDate: '2026-12-28',
      targetSeason: 'Temporada Festiva Invierno',
      responsible: 'Ing. Mateo Proaño',
      notes: 'Despunte selectivo en tallos ciegos para forzar brotes basales'
    },
    {
      id: 'proj_103',
      block: 'Bloque 3',
      variety: 'Explorer',
      date: '2026-10-08',
      dayHarvest: 1250,
      pinchStems: 600,
      totalInduced: 1850,
      cycleDays: 85,
      rebudFactor: 1.08,
      projectedStems: 1998,
      projectedHarvestDate: '2027-01-01',
      targetSeason: 'San Valentín (Pre-corte)',
      responsible: 'Ing. Mateo Proaño',
      notes: 'Programación hacia la gran curva de San Valentín 2027'
    }
  ];

  // Datos iniciales de ProyecciÃ³n de Retornos por Ciclo de Variedad
  const INITIAL_RETURN_PROJECTIONS = [
    {
      id: 'ret_101',
      block: 'Bloque 1',
      variety: 'Freedom',
      cycleDays: 75,
      baseDate: '2026-11-20',
      baseType: 'Pinch San ValentÃ­n',
      returnDate: '2027-02-03',
      targetWeek: 5,
      season: 'San ValentÃ­n 2027',
      inducedStems: 18500,
      conversionRate: 110,
      projectedStems: 20350,
      status: 'En VegetaciÃ³n',
      responsible: 'Ing. Carlos Medina',
      notes: 'Pinch en cama 1-12. Ciclo estÃ¡ndar de Freedom 75 dÃ­as.'
    },
    {
      id: 'ret_102',
      block: 'Bloque 2',
      variety: 'Mondial',
      cycleDays: 80,
      baseDate: '2026-11-15',
      baseType: 'Pinch San ValentÃ­n',
      returnDate: '2027-02-03',
      targetWeek: 5,
      season: 'San ValentÃ­n 2027',
      inducedStems: 16800,
      conversionRate: 105,
      projectedStems: 17640,
      status: 'En VegetaciÃ³n',
      responsible: 'Ing. Carlos Medina',
      notes: 'Variedad blanca ciclo 80 dÃ­as. ProyecciÃ³n hacia semana 5.'
    },
    {
      id: 'ret_103',
      block: 'Bloque 3',
      variety: 'Explorer',
      cycleDays: 70,
      baseDate: '2026-11-25',
      baseType: 'Pinch RÃ¡pido',
      returnDate: '2027-02-03',
      targetWeek: 5,
      season: 'San ValentÃ­n 2027',
      inducedStems: 14200,
      conversionRate: 108,
      projectedStems: 15336,
      status: 'En VegetaciÃ³n',
      responsible: 'Ing. Elena Rosero',
      notes: 'Ciclo rÃ¡pido 70 dÃ­as con alta tasa de brotaciÃ³n.'
    },
    {
      id: 'ret_104',
      block: 'Bloque 4',
      variety: 'Playa Blanca',
      cycleDays: 90,
      baseDate: '2026-11-05',
      baseType: 'Corte CÃ­clico',
      returnDate: '2027-02-03',
      targetWeek: 5,
      season: 'San ValentÃ­n 2027',
      inducedStems: 12000,
      conversionRate: 102,
      projectedStems: 12240,
      status: 'En VegetaciÃ³n',
      responsible: 'Ing. Marco Rosero',
      notes: 'Ciclo largo 90 dÃ­as para calidad de tallo 70-80cm.'
    },
    {
      id: 'ret_105',
      block: 'Bloque 5',
      variety: 'Pink Floyd',
      cycleDays: 65,
      baseDate: '2026-12-01',
      baseType: 'Pinch Corto',
      returnDate: '2027-02-04',
      targetWeek: 5,
      season: 'San ValentÃ­n 2027',
      inducedStems: 9500,
      conversionRate: 112,
      projectedStems: 10640,
      status: 'En VegetaciÃ³n',
      responsible: 'Ing. Elena Rosero',
      notes: 'Variedad fucsia ciclo de 65 dÃ­as.'
    }
  ];

  // Inicialización de LocalStorage y Sincronización Automática
  function init() {
    // 1. Sincronizar Módulos del Sistema (con el orden y módulos solicitados)
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));

    // 2. Sincronizar Usuarios (asegurar administrador y preservar nuevos usuarios creados)
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    } else {
      try {
        const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        if (Array.isArray(storedUsers)) {
          if (!storedUsers.some(u => u.username === 'admin')) {
            storedUsers.unshift(INITIAL_USERS[0]);
          }
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(storedUsers));
        } else {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        }
      } catch (e) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      }
    }

    // 3. Sincronizar sesión activa sin cerrarla al actualizar la página
    try {
      const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (sessionRaw) {
        const sessionUser = JSON.parse(sessionRaw);
        if (sessionUser) {
          const freshUser = getUser(sessionUser.id || sessionUser.username);
          if (freshUser && freshUser.status === 'active') {
            sessionUser.permissions = freshUser.permissions || [];
            sessionUser.role = freshUser.role;
            sessionUser.roleName = freshUser.roleName;
            sessionUser.name = freshUser.name;
            sessionUser.avatar = freshUser.avatar;
            sessionUser.status = 'active';
            localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
          } else if (sessionUser.username === 'admin') {
            sessionUser.permissions = ['*'];
            sessionUser.role = 'admin';
            sessionUser.status = 'active';
            localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
          } else {
            localStorage.removeItem(STORAGE_KEYS.SESSION);
          }
        }
      }
    } catch (e) {
      console.warn('Error al sincronizar sesión:', e);
    }

    // 3.1 Asegurar Proyecciones de Retornos en localStorage
    if (!localStorage.getItem(STORAGE_KEYS.RETURN_PROJECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.RETURN_PROJECTIONS, JSON.stringify(INITIAL_RETURN_PROJECTIONS));
    }

    // 4. Asegurar Planos de Finca
    if (!localStorage.getItem(STORAGE_KEYS.FARM_PLANS)) {
      localStorage.setItem(STORAGE_KEYS.FARM_PLANS, JSON.stringify(INITIAL_FARM_PLANS));
    }

    // 4.1 Asegurar Áreas e Instalaciones de la Finca
    if (!localStorage.getItem(STORAGE_KEYS.FARM_AREAS)) {
      localStorage.setItem(STORAGE_KEYS.FARM_AREAS, JSON.stringify(INITIAL_FARM_AREAS));
    }

    // Pre-cargar fotos persistentes de IndexedDB
    try { preloadPhotosFromDB(); } catch (_) {}

    // 5. Asegurar Catálogo de Variedades
    if (!localStorage.getItem(STORAGE_KEYS.VARIETIES)) {
      localStorage.setItem(STORAGE_KEYS.VARIETIES, JSON.stringify(INITIAL_VARIETIES));
    }

    // 6. Asegurar Etiquetas y Códigos de Barras
    if (!localStorage.getItem(STORAGE_KEYS.BARCODES)) {
      localStorage.setItem(STORAGE_KEYS.BARCODES, JSON.stringify(INITIAL_BARCODES));
    }

    // 7. Asegurar Control de Riego (Preparación y Muestras de Campo)
    if (!localStorage.getItem(STORAGE_KEYS.IRRIGATION_PREP)) {
      localStorage.setItem(STORAGE_KEYS.IRRIGATION_PREP, JSON.stringify(INITIAL_IRRIGATION_PREP));
    }
    if (!localStorage.getItem(STORAGE_KEYS.IRRIGATION_FIELD)) {
      localStorage.setItem(STORAGE_KEYS.IRRIGATION_FIELD, JSON.stringify(INITIAL_IRRIGATION_FIELD));
    }

    // 8. Asegurar Registro de Producción de Cosecha (Semana completa Lun-Dom)
    try {
      const storedHarvest = JSON.parse(localStorage.getItem(STORAGE_KEYS.HARVEST_PROD));
      if (!Array.isArray(storedHarvest) || storedHarvest.length === 0) {
        localStorage.setItem(STORAGE_KEYS.HARVEST_PROD, JSON.stringify(INITIAL_HARVEST_PROD));
      } else {
        let updatedHarvest = false;
        INITIAL_HARVEST_PROD.forEach(initHrv => {
          if (!storedHarvest.some(h => h.id === initHrv.id)) {
            storedHarvest.push(initHrv);
            updatedHarvest = true;
          }
        });
        if (updatedHarvest) {
          localStorage.setItem(STORAGE_KEYS.HARVEST_PROD, JSON.stringify(storedHarvest));
        }
      }
    } catch (e) {
      localStorage.setItem(STORAGE_KEYS.HARVEST_PROD, JSON.stringify(INITIAL_HARVEST_PROD));
    }

    // 9. Asegurar Proceso y Clasificación (Mesas y Flor Nacional)
    if (!localStorage.getItem(STORAGE_KEYS.PROCESS_RECORDS)) {
      localStorage.setItem(STORAGE_KEYS.PROCESS_RECORDS, JSON.stringify(INITIAL_PROCESS_RECORDS));
    }

    // 10. Asegurar Control de Calidad (Campo y Bonches)
    if (!localStorage.getItem(STORAGE_KEYS.QUALITY_FIELD_CHECKS)) {
      localStorage.setItem(STORAGE_KEYS.QUALITY_FIELD_CHECKS, JSON.stringify(INITIAL_QUALITY_FIELD_CHECKS));
    } else {
      try {
        const qfcData = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUALITY_FIELD_CHECKS));
        if (Array.isArray(qfcData)) {
          let updatedQfc = false;
          qfcData.forEach((q, idx) => {
            if (!q.photo && (idx === 0 || idx === 1)) {
              q.photo = 'assets/rose_watermark.jpg';
              updatedQfc = true;
            }
          });
          if (updatedQfc) localStorage.setItem(STORAGE_KEYS.QUALITY_FIELD_CHECKS, JSON.stringify(qfcData));
        }
      } catch (e) {
        console.warn('Error al verificar fotos de calidad campo:', e);
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.QUALITY_BUNCH_CHECKS)) {
      localStorage.setItem(STORAGE_KEYS.QUALITY_BUNCH_CHECKS, JSON.stringify(INITIAL_QUALITY_BUNCH_CHECKS));
    } else {
      try {
        const qbcData = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUALITY_BUNCH_CHECKS));
        if (Array.isArray(qbcData)) {
          let updatedQbc = false;
          qbcData.forEach((q, idx) => {
            if (!q.photo && idx === 0) {
              q.photo = 'assets/rose_watermark.jpg';
              updatedQbc = true;
            }
          });
          if (updatedQbc) localStorage.setItem(STORAGE_KEYS.QUALITY_BUNCH_CHECKS, JSON.stringify(qbcData));
        }
      } catch (e) {
        console.warn('Error al verificar fotos de calidad bonche:', e);
      }
    }

    // 11. Asegurar Ventas y Stock
    if (!localStorage.getItem(STORAGE_KEYS.SALES_RECORDS)) {
      localStorage.setItem(STORAGE_KEYS.SALES_RECORDS, JSON.stringify(INITIAL_SALES_RECORDS));
    }

    // 12. Asegurar Proyecciones de Cosecha & Pinch
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTIONS, JSON.stringify(INITIAL_PROJECTIONS));
    }

    // 13. Asegurar Datos de la Finca (Perfil Institucional)
    if (!localStorage.getItem(STORAGE_KEYS.FARM_INFO)) {
      localStorage.setItem(STORAGE_KEYS.FARM_INFO, JSON.stringify(INITIAL_FARM_INFO));
    }

    // 9. Producción y Calidad legacy
    try {
      const prodRaw = localStorage.getItem(STORAGE_KEYS.PRODUCTION);
      if (!prodRaw) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(INITIAL_PRODUCTION));
      } else {
        const prodParsed = JSON.parse(prodRaw);
        let updatedProd = false;
        prodParsed.forEach(p => {
          if (!p.harvester) {
            p.harvester = p.responsible || 'Juan Tipán';
            updatedProd = true;
          }
          if (!p.responsible) {
            p.responsible = p.harvester;
            updatedProd = true;
          }
        });
        if (updatedProd) {
          localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(prodParsed));
        }
      }
    } catch (e) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(INITIAL_PRODUCTION));
    }

    if (!localStorage.getItem(STORAGE_KEYS.QUALITY)) {
      localStorage.setItem(STORAGE_KEYS.QUALITY, JSON.stringify(INITIAL_QUALITY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DYNAMIC_DATA)) {
      localStorage.setItem(STORAGE_KEYS.DYNAMIC_DATA, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify([
        {
          id: 'log_1',
          timestamp: new Date().toISOString(),
          user: 'Sistema',
          action: 'Inicio del Sistema',
          details: 'Inicialización de MRosecuador - Floricultura Especializada'
        }
      ]));
    }
  }

  // --- USUARIOS ---
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  }

  function getUser(id) {
    const users = getUsers();
    return users.find(u => u.id === id || u.username === id);
  }

  function saveUser(userData) {
    const users = getUsers();
    if (userData.id) {
      const idx = users.findIndex(u => u.id === userData.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...userData, updatedAt: new Date().toISOString() };
      } else {
        const parts = (userData.name || userData.username || 'User').split(' ');
        const avatar = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substr(0, 2).toUpperCase();
        users.push({
          status: 'active',
          avatar,
          createdAt: new Date().toISOString(),
          ...userData
        });
      }
    } else {
      const newUser = {
        id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        ...userData,
        status: userData.status || 'active',
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      const parts = (newUser.name || 'User').split(' ');
      newUser.avatar = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substr(0, 2).toUpperCase();
      users.push(newUser);
      userData = newUser;
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    logActivity('Gestión de Usuarios', `Usuario ${userData.name} (${userData.username}) guardado`);
    return userData;
  }

  function deleteUser(id) {
    const users = getUsers();
    const target = users.find(u => u.id === id);
    if (!target) return false;
    if (target.username === 'admin') {
      throw new Error('No es posible eliminar al Administrador Principal del sistema');
    }
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
    logActivity('Eliminación de Usuario', `Usuario ${target.name} (${target.username}) eliminado`);
    return true;
  }

  function toggleUserStatus(id) {
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return false;
    if (user.username === 'admin') {
      throw new Error('No es posible deshabilitar al Administrador Principal');
    }
    user.status = user.status === 'active' ? 'inactive' : 'active';
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    logActivity('Cambio de Estado', `Usuario ${user.username} marcado como ${user.status}`);
    return user;
  }

  function updateUserPermissions(userId, permissions) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    user.permissions = permissions;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    logActivity('Permisos', `Permisos actualizados para ${user.name}`);
    return true;
  }

  // --- PLANOS DE FINCA (BLOQUES, VARIEDADES, CAMAS, SIEMBRA, CICLOS) ---
  function getFarmPlans() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FARM_PLANS);
      if (!raw) return INITIAL_FARM_PLANS;
      const list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) return INITIAL_FARM_PLANS;
      return list.map(p => ({
        ...p,
        responsible: p.responsible || p.supervisor || 'Ing. Marco Silva'
      }));
    } catch (e) {
      return INITIAL_FARM_PLANS;
    }
  }

  function getBlocks() {
    try {
      const plans = getFarmPlans();
      const list = Array.from(new Set(plans.map(p => p.block).concat(['Bloque 1', 'Bloque 2', 'Bloque 3', 'Bloque 4A', 'Bloque 4B', 'Bloque 5']))).filter(Boolean);
      return list.map(b => {
        const found = plans.find(p => p.block === b);
        return {
          id: b,
          name: b,
          area: found ? (found.area || 'Sector Norte - Invernaderos') : 'Sector Norte - Invernaderos'
        };
      });
    } catch (e) {
      return [
        { id: 'Bloque 1', name: 'Bloque 1', area: 'Sector Norte - Invernaderos' },
        { id: 'Bloque 2', name: 'Bloque 2', area: 'Sector Sur - Invernaderos' },
        { id: 'Bloque 3', name: 'Bloque 3', area: 'Sector Norte - Invernaderos' },
        { id: 'Bloque 4A', name: 'Bloque 4A', area: 'Sector Sur - Invernaderos' },
        { id: 'Bloque 4B', name: 'Bloque 4B', area: 'Sector Sur - Invernaderos' },
        { id: 'Bloque 5', name: 'Bloque 5', area: 'Sector Sur - Invernaderos' }
      ];
    }
  }

  function getFarmPlan(id) {
    const plans = getFarmPlans();
    return plans.find(p => p.id === id);
  }

  function saveFarmPlan(planData) {
    const plans = getFarmPlans();
    if (planData.id) {
      const idx = plans.findIndex(p => p.id === planData.id);
      if (idx !== -1) {
        plans[idx] = { ...plans[idx], ...planData, updatedAt: new Date().toISOString() };
      }
    } else {
      const newPlan = {
        id: 'fp_' + Date.now().toString(36),
        ...planData,
        status: planData.status || 'Activo',
        createdAt: new Date().toISOString()
      };
      plans.unshift(newPlan);
      planData = newPlan;
    }
    localStorage.setItem(STORAGE_KEYS.FARM_PLANS, JSON.stringify(plans));
    logActivity('Planos de Finca', `Bloque '${planData.block}' (${planData.variety}) guardado`);
    return planData;
  }

  function deleteFarmPlan(id) {
    const plans = getFarmPlans();
    const plan = plans.find(p => p.id === id);
    if (!plan) return false;
    const filtered = plans.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.FARM_PLANS, JSON.stringify(filtered));
    logActivity('Planos de Finca', `Bloque '${plan.block}' eliminado`);
    return true;
  }

  // --- ÁREAS E INSTALACIONES DE LA FINCA ---
  function getFarmAreas() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FARM_AREAS);
      if (!raw) return INITIAL_FARM_AREAS;
      const list = JSON.parse(raw);
      return (Array.isArray(list) && list.length > 0) ? list : INITIAL_FARM_AREAS;
    } catch (e) {
      return INITIAL_FARM_AREAS;
    }
  }

  function getFarmArea(id) {
    const list = getFarmAreas();
    return list.find(a => a.id === id || a.code === id) || null;
  }

  function saveFarmArea(areaData) {
    const list = getFarmAreas();
    const isEdit = areaData.id && list.some(a => a.id === areaData.id);
    let saved;

    if (isEdit) {
      const idx = list.findIndex(a => a.id === areaData.id);
      saved = {
        ...list[idx],
        ...areaData,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      try { logActivity('Planos de Finca', `Área actualizada: ${saved.name}`); } catch (_) {}
    } else {
      saved = {
        id: 'area_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...areaData
      };
      list.push(saved);
      try { logActivity('Planos de Finca', `Nueva área registrada: ${saved.name}`); } catch (_) {}
    }

    localStorage.setItem(STORAGE_KEYS.FARM_AREAS, JSON.stringify(list));
    return saved;
  }

  function deleteFarmArea(id) {
    const list = getFarmAreas();
    const target = list.find(a => a.id === id);
    if (!target) return false;
    const filtered = list.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.FARM_AREAS, JSON.stringify(filtered));
    try { logActivity('Planos de Finca', `Área eliminada: ${target.name}`); } catch (_) {}
    return true;
  }

  function importFarmPlansBatch(newRecords) {
    if (!Array.isArray(newRecords) || newRecords.length === 0) return 0;
    const plans = getFarmPlans();
    let count = 0;
    newRecords.forEach(rec => {
      if (rec.block && rec.variety) {
        plans.unshift({
          id: 'fp_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 3),
          block: rec.block,
          variety: rec.variety,
          beds: String(rec.beds || '20'),
          plantingDate: rec.plantingDate || new Date().toISOString().split('T')[0],
          cycle: rec.cycle || 'Ciclo 1 - Producción',
          plantsTotal: String(rec.plantsTotal || '4000'),
          status: rec.status || 'Activo',
          notes: rec.notes || 'Importado desde archivo Excel .xlsx',
          createdAt: new Date().toISOString()
        });
        count++;
      }
    });
    localStorage.setItem(STORAGE_KEYS.FARM_PLANS, JSON.stringify(plans));
    logActivity('Importación Excel', `Se importaron ${count} bloques a Planos de Finca`);
    return count;
  }

  // --- CATÁLOGO DE VARIEDADES DE ROSAS ---
  function getVarieties() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.VARIETIES)) || INITIAL_VARIETIES;
    } catch (e) {
      return INITIAL_VARIETIES;
    }
  }

  function getVariety(id) {
    const vars = getVarieties();
    return vars.find(v => v.id === id || v.name.toLowerCase() === id.toLowerCase());
  }

  function saveVariety(varietyData) {
    const vars = getVarieties();
    if (varietyData.id) {
      const idx = vars.findIndex(v => v.id === varietyData.id);
      if (idx !== -1) {
        vars[idx] = { ...vars[idx], ...varietyData, updatedAt: new Date().toISOString() };
      }
    } else {
      const newVar = {
        id: 'var_' + Date.now().toString(36),
        ...varietyData,
        createdAt: new Date().toISOString()
      };
      vars.unshift(newVar);
      varietyData = newVar;
    }
    localStorage.setItem(STORAGE_KEYS.VARIETIES, JSON.stringify(vars));
    logActivity('Catálogo de Rosas', `Variedad '${varietyData.name}' guardada`);
    return varietyData;
  }

  function deleteVariety(id) {
    const vars = getVarieties();
    const target = vars.find(v => v.id === id);
    if (!target) return false;
    const filtered = vars.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VARIETIES, JSON.stringify(filtered));
    logActivity('Catálogo de Rosas', `Variedad '${target.name}' eliminada`);
    return true;
  }

  // --- MÓDULOS DEL SISTEMA Y DINÁMICOS ---
  function getModules() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.MODULES));
      if (Array.isArray(stored)) {
        // Garantizar que todos los módulos iniciales del sistema existan
        INITIAL_MODULES.forEach(initMod => {
          if (!stored.some(m => m.key === initMod.key)) {
            stored.push(initMod);
          }
        });
        return stored;
      }
      return INITIAL_MODULES;
    } catch (e) {
      return INITIAL_MODULES;
    }
  }

  function saveModule(moduleData) {
    const modules = getModules();
    if (moduleData.id) {
      const idx = modules.findIndex(m => m.id === moduleData.id);
      if (idx !== -1) {
        modules[idx] = { ...modules[idx], ...moduleData };
      }
    } else {
      let slug = (moduleData.key || moduleData.name)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      if (modules.some(m => m.key === slug)) {
        slug = slug + '-' + Date.now().toString(36).substr(-3);
      }

      const newModule = {
        id: 'mod_' + Date.now().toString(36),
        key: slug,
        name: moduleData.name,
        category: moduleData.category || 'personalizado',
        icon: moduleData.icon || 'puzzle',
        description: moduleData.description || 'Nuevo módulo del sistema MRosecuador',
        isSystem: false,
        status: moduleData.status || 'active',
        defaultRoles: moduleData.defaultRoles || ['admin'],
        createdAt: new Date().toISOString()
      };
      modules.push(newModule);
      moduleData = newModule;

      if (moduleData.defaultRoles && moduleData.defaultRoles.length > 0) {
        const users = getUsers();
        users.forEach(u => {
          if (moduleData.defaultRoles.includes(u.role) || u.role === 'admin') {
            if (!u.permissions) u.permissions = [];
            if (!u.permissions.includes('*') && !u.permissions.includes(newModule.key)) {
              u.permissions.push(newModule.key);
            }
          }
        });
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    }
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
    logActivity('Módulos', `Módulo '${moduleData.name}' guardado`);
    return moduleData;
  }

  function deleteModule(id) {
    const modules = getModules();
    const mod = modules.find(m => m.id === id);
    if (!mod) return false;
    if (mod.isSystem) {
      throw new Error('Los módulos base del sistema no pueden ser eliminados');
    }
    const filtered = modules.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(filtered));

    const users = getUsers();
    users.forEach(u => {
      if (Array.isArray(u.permissions)) {
        u.permissions = u.permissions.filter(p => p !== mod.key);
      }
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    logActivity('Módulos', `Módulo '${mod.name}' eliminado`);
    return true;
  }

  // --- DATOS DINÁMICOS POR MÓDULO ---
  function getDynamicRecords(moduleKey) {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.DYNAMIC_DATA)) || {};
      return all[moduleKey] || [];
    } catch (e) {
      return [];
    }
  }

  function addDynamicRecord(moduleKey, record) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.DYNAMIC_DATA)) || {};
    if (!all[moduleKey]) all[moduleKey] = [];
    const newRecord = {
      id: 'rec_' + Date.now().toString(36),
      fecha: new Date().toLocaleDateString('es-EC'),
      ...record,
      createdAt: new Date().toISOString()
    };
    all[moduleKey].unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.DYNAMIC_DATA, JSON.stringify(all));
    return newRecord;
  }

  // --- PRODUCCIÓN ---
  function getProductionRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTION)) || INITIAL_PRODUCTION;
    } catch (e) {
      return INITIAL_PRODUCTION;
    }
  }

  function getProductionRecord(id) {
    const list = getProductionRecords();
    return list.find(r => r.id === id);
  }

  function addProductionRecord(record) {
    const list = getProductionRecords();
    const newRecord = {
      id: 'prod_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      date: record.date || new Date().toISOString().split('T')[0],
      variety: record.variety || 'Freedom',
      block: record.block || 'Bloque 1',
      bed: record.bed || 'Camas 01',
      harvester: record.harvester || record.responsible || 'Personal de Cosecha',
      responsible: record.responsible || record.harvester || 'Personal de Cosecha',
      stems: parseInt(record.stems) || 0,
      grade: record.grade || 'Exportación Selecta',
      notes: record.notes || '',
      createdAt: new Date().toISOString()
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(list));
    logActivity('Producción', `Cosecha registrada: ${newRecord.stems} tallos (${newRecord.variety} - Bloque ${newRecord.block} - Cortador: ${newRecord.harvester})`);
    return newRecord;
  }

  function updateProductionRecord(id, updatedData) {
    const list = getProductionRecords();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) {
      throw new Error('Registro de producción no encontrado');
    }
    const updated = {
      ...list[idx],
      ...updatedData,
      id,
      stems: parseInt(updatedData.stems !== undefined ? updatedData.stems : list[idx].stems) || 0,
      harvester: updatedData.harvester || updatedData.responsible || list[idx].harvester || list[idx].responsible,
      responsible: updatedData.responsible || updatedData.harvester || list[idx].responsible || list[idx].harvester,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(list));
    logActivity('Producción', `Cosecha actualizada: ${updated.stems} tallos (${updated.variety} - ${updated.harvester})`);
    return updated;
  }

  function deleteProductionRecord(id) {
    const list = getProductionRecords();
    const target = list.find(r => r.id === id);
    if (!target) return false;
    const filtered = list.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(filtered));
    logActivity('Producción', `Registro de cosecha eliminado (${target.variety} - ${target.block} - ${target.harvester || target.responsible})`);
    return true;
  }

  // --- CALIDAD ---
  function getQualityRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUALITY)) || INITIAL_QUALITY;
    } catch (e) {
      return INITIAL_QUALITY;
    }
  }

  function addQualityRecord(record) {
    const list = getQualityRecords();
    const newRecord = {
      id: 'cal_' + Date.now().toString(36),
      ...record
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.QUALITY, JSON.stringify(list));
    logActivity('Calidad', `Inspección de lote ${record.batch} completada (${record.exportablePercent}%)`);
    return newRecord;
  }

  // --- REGISTRO DE ACTIVIDAD (LOGS) ---
  function logActivity(action, details, user = null) {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) || [];
      const currentSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));
      const userName = user || (currentSession ? currentSession.name : 'Sistema');
      logs.unshift({
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        user: userName,
        action,
        details
      });
      if (logs.length > 100) logs.length = 100;
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Error logging activity:', e);
    }
  }

  function getActivityLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) || [];
    } catch (e) {
      return [];
    }
  }

  // --- ETIQUETAS Y CÓDIGOS DE BARRAS ---
  function getBarcodes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BARCODES)) || INITIAL_BARCODES;
    } catch (e) {
      return INITIAL_BARCODES;
    }
  }

  function getBarcode(id) {
    const list = getBarcodes();
    return list.find(b => b.id === id || b.code === id) || null;
  }

  function saveBarcode(barcodeData) {
    const list = getBarcodes();
    const isEdit = barcodeData.id && list.some(b => b.id === barcodeData.id);
    let saved;

    if (isEdit) {
      const idx = list.findIndex(b => b.id === barcodeData.id);
      saved = {
        ...list[idx],
        ...barcodeData,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      logActivity('Etiquetas', `Etiqueta actualizada: ${saved.code} (${saved.variety} - ${saved.block})`);
    } else {
      saved = {
        id: 'lbl_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...barcodeData
      };
      list.unshift(saved);
      logActivity('Etiquetas', `Nueva etiqueta generada: ${saved.code} (${saved.variety} - Cosechador: ${saved.harvester})`);
    }

    localStorage.setItem(STORAGE_KEYS.BARCODES, JSON.stringify(list));
    return saved;
  }

  function deleteBarcode(id) {
    const list = getBarcodes();
    const target = list.find(b => b.id === id);
    if (!target) return false;
    const filtered = list.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BARCODES, JSON.stringify(filtered));
    logActivity('Etiquetas', `Etiqueta eliminada: ${target.code}`);
    return true;
  }

  // --- CONTROL DE RIEGO (PREPARACIÓN Y CAMPO) ---
  function getIrrigationPrep() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.IRRIGATION_PREP)) || INITIAL_IRRIGATION_PREP;
    } catch (e) {
      return INITIAL_IRRIGATION_PREP;
    }
  }

  function saveIrrigationPrep(prepData) {
    const list = getIrrigationPrep();
    const isEdit = prepData.id && list.some(p => p.id === prepData.id);
    let saved;

    if (isEdit) {
      const idx = list.findIndex(p => p.id === prepData.id);
      saved = {
        ...list[idx],
        ...prepData,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      logActivity('Riego', `Preparación cabezal actualizada (${saved.tank} - pH ${saved.ph} / CE ${saved.ec})`);
    } else {
      saved = {
        id: 'irrp_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...prepData
      };
      list.unshift(saved);
      logActivity('Riego', `Preparación de fertirriego registrada: ${saved.tank} (pH: ${saved.ph}, CE: ${saved.ec})`);
    }

    localStorage.setItem(STORAGE_KEYS.IRRIGATION_PREP, JSON.stringify(list));
    return saved;
  }

  function deleteIrrigationPrep(id) {
    const list = getIrrigationPrep();
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.IRRIGATION_PREP, JSON.stringify(filtered));
    logActivity('Riego', `Registro de preparación de cabezal eliminado`);
    return true;
  }

  function getIrrigationField() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.IRRIGATION_FIELD)) || INITIAL_IRRIGATION_FIELD;
    } catch (e) {
      return INITIAL_IRRIGATION_FIELD;
    }
  }

  function saveIrrigationField(fieldData) {
    const list = getIrrigationField();
    const isEdit = fieldData.id && list.some(f => f.id === fieldData.id);
    let saved;

    if (isEdit) {
      const idx = list.findIndex(f => f.id === fieldData.id);
      saved = {
        ...list[idx],
        ...fieldData,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      logActivity('Riego', `Muestra campo actualizada (${saved.block} - ${saved.valve} - pH ${saved.ph})`);
    } else {
      saved = {
        id: 'irrf_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...fieldData
      };
      list.unshift(saved);
      logActivity('Riego', `Muestra de campo registrada: ${saved.block} - ${saved.valve} (${saved.variety}) - pH: ${saved.ph}, CE: ${saved.ec}`);
    }

    localStorage.setItem(STORAGE_KEYS.IRRIGATION_FIELD, JSON.stringify(list));
    return saved;
  }

  function deleteIrrigationField(id) {
    const list = getIrrigationField();
    const filtered = list.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.IRRIGATION_FIELD, JSON.stringify(filtered));
    logActivity('Riego', `Muestra de campo eliminada`);
    return true;
  }

  // --- REGISTRO DE PRODUCCIÓN DE COSECHA ---
  function getHarvestProd() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HARVEST_PROD)) || INITIAL_HARVEST_PROD;
    } catch (e) {
      return INITIAL_HARVEST_PROD;
    }
  }

  function getHarvestProdRecord(id) {
    const list = getHarvestProd();
    return list.find(h => h.id === id) || null;
  }

  function saveHarvestProd(harvestData) {
    const list = getHarvestProd();
    const isEdit = harvestData.id && list.some(h => h.id === harvestData.id);
    let saved;

    if (isEdit) {
      const idx = list.findIndex(h => h.id === harvestData.id);
      saved = {
        ...list[idx],
        ...harvestData,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      logActivity('Producción', `Cosecha actualizada: ${saved.totalStems} tallos (${saved.variety} - ${saved.block})`);
    } else {
      saved = {
        id: 'hrv_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...harvestData
      };
      list.unshift(saved);
      logActivity('Producción', `Cosecha registrada: ${saved.totalStems} tallos (${saved.variety} - ${saved.block} - Cosechador: ${saved.harvester})`);
    }

    localStorage.setItem(STORAGE_KEYS.HARVEST_PROD, JSON.stringify(list));
    return saved;
  }

  function deleteHarvestProd(id) {
    const list = getHarvestProd();
    const target = list.find(h => h.id === id);
    if (!target) return false;
    const filtered = list.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HARVEST_PROD, JSON.stringify(filtered));
    logActivity('Producción', `Cosecha eliminada (${target.totalStems} tallos - ${target.variety} - ${target.block})`);
    return true;
  }

  // --- PROCESO Y CLASIFICACIÓN (MESAS Y FLOR NACIONAL) ---
  function getProcessRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROCESS_RECORDS)) || INITIAL_PROCESS_RECORDS;
    } catch (e) {
      return INITIAL_PROCESS_RECORDS;
    }
  }

  function getProcessRecord(id) {
    const list = getProcessRecords();
    return list.find(p => p.id === id) || null;
  }

  function saveProcessRecord(recordData) {
    const list = getProcessRecords();
    const isEdit = recordData.id && list.some(p => p.id === recordData.id);

    const stemsProcessed = parseInt(recordData.stemsProcessed, 10) || 0;
    const nationalStems = parseInt(recordData.nationalStems, 10) || 0;
    const exportStems = Math.max(0, stemsProcessed - nationalStems);
    const stemsHarvested = parseInt(recordData.stemsHarvested, 10) || stemsProcessed;

    const pctNational = stemsProcessed > 0 ? parseFloat(((nationalStems / stemsProcessed) * 100).toFixed(1)) : 0;
    const pctExport = stemsProcessed > 0 ? parseFloat(((exportStems / stemsProcessed) * 100).toFixed(1)) : 0;
    const pctVsHarvest = stemsHarvested > 0 ? parseFloat(((stemsProcessed / stemsHarvested) * 100).toFixed(1)) : 100;

    const payload = {
      ...recordData,
      stemsProcessed,
      nationalStems,
      exportStems,
      stemsHarvested,
      pctNational,
      pctExport,
      pctVsHarvest
    };

    let saved;
    if (isEdit) {
      const idx = list.findIndex(p => p.id === recordData.id);
      saved = {
        ...list[idx],
        ...payload,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      logActivity('Proceso', `Registro de mesa actualizado: ${saved.tableCode} (${saved.variety} - ${saved.stemsProcessed} tallos)`);
    } else {
      saved = {
        id: 'proc_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...payload
      };
      list.unshift(saved);
      logActivity('Proceso', `Registro mesa clasificada: ${saved.tableCode} (${saved.variety} - ${saved.exportStems} exportables / ${saved.nationalStems} nacional)`);
    }

    localStorage.setItem(STORAGE_KEYS.PROCESS_RECORDS, JSON.stringify(list));
    return saved;
  }

  function deleteProcessRecord(id) {
    const list = getProcessRecords();
    const target = list.find(p => p.id === id);
    if (!target) return false;
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROCESS_RECORDS, JSON.stringify(filtered));
    logActivity('Proceso', `Registro de mesa eliminado (${target.tableCode} - ${target.variety})`);
    return true;
  }

  // ==============================================================================
  // MOTOR DE PERSISTENCIA PERMANENTE DE FOTOGRAFÍAS (IndexedDB + Memoria Local)
  // ==============================================================================
  const _photoCache = new Map();
  let _photoDbPromise = null;

  function getPhotoDB() {
    if (_photoDbPromise) return _photoDbPromise;
    _photoDbPromise = new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        resolve(null);
        return;
      }
      try {
        const req = window.indexedDB.open('MRosePhotoDB_v2', 1);
        req.onupgradeneeded = function(e) {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('quality_photos')) {
            db.createObjectStore('quality_photos', { keyPath: 'id' });
          }
        };
        req.onsuccess = function(e) {
          resolve(e.target.result);
        };
        req.onerror = function() {
          resolve(null);
        };
      } catch (err) {
        resolve(null);
      }
    });
    return _photoDbPromise;
  }

  function savePhotosToDB(recordId, photos) {
    if (!recordId) return;
    const cleanPhotos = Array.isArray(photos) ? photos.filter(Boolean) : (photos ? [photos] : []);
    if (cleanPhotos.length === 0) return;
    
    _photoCache.set(recordId, cleanPhotos);
    
    // Backup en localStorage individual por registro
    try {
      localStorage.setItem(`mrose_photo_${recordId}`, JSON.stringify(cleanPhotos));
    } catch (_) {}

    // Persistencia permanente en IndexedDB (sin límite de 5MB)
    getPhotoDB().then(db => {
      if (!db) return;
      try {
        const tx = db.transaction('quality_photos', 'readwrite');
        const store = tx.objectStore('quality_photos');
        store.put({ id: recordId, photos: cleanPhotos, updatedAt: Date.now() });
      } catch (e) {
        console.warn('Error guardando en IndexedDB:', e);
      }
    });
  }

  function getPhotosFromCache(recordId) {
    if (!recordId) return null;
    if (_photoCache.has(recordId)) {
      return _photoCache.get(recordId);
    }
    try {
      const local = localStorage.getItem(`mrose_photo_${recordId}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          _photoCache.set(recordId, parsed);
          return parsed;
        }
      }
    } catch (_) {}
    return null;
  }

  function preloadPhotosFromDB() {
    getPhotoDB().then(db => {
      if (!db) return;
      try {
        const tx = db.transaction('quality_photos', 'readonly');
        const store = tx.objectStore('quality_photos');
        const req = store.getAll();
        req.onsuccess = function(e) {
          const all = e.target.result || [];
          all.forEach(item => {
            if (item && item.id && Array.isArray(item.photos) && item.photos.length > 0) {
              _photoCache.set(item.id, item.photos);
            }
          });
        };
      } catch (_) {}
    });
  }

  // --- CONTROL DE CALIDAD EN CAMPO ---
  function getQualityFieldChecks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUALITY_FIELD_CHECKS);
      if (!raw) return INITIAL_QUALITY_FIELD_CHECKS;
      const list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) return INITIAL_QUALITY_FIELD_CHECKS;

      return list.map(item => {
        // Normalización si viene en formato antiguo
        if (item.type === 'labores' && item.items && item.items.desbrote !== undefined) {
          return {
            ...item,
            items: {
              desyeme: !!item.items.desbrote,
              sacadaCapuchon: !!item.items.deschuponado,
              puestaCapuchon: true,
              manguerasColocadas: !!item.items.sanidadCama,
              encanasteTutoraje: !!item.items.tutoreo,
              escobillado: !!item.items.deshierbe
            }
          };
        }
        if (item.type === 'cosecha' && item.items && item.items.puntoCorte !== undefined && item.items.botrytis === undefined) {
          return {
            ...item,
            harvester: item.harvester || 'Juan Tipán',
            meshCode: item.meshCode || item.harvesterCode || 'Malla #12',
            stemsAudit: item.stemsAudit || item.stemsChecked || 25,
            items: {
              puntosCorte: !!item.items.puntoCorte,
              maltrato: !!item.items.cuidadoMallas,
              botrytis: true,
              acaros: true,
              trips: true,
              velloso: true,
              polvoso: true,
              tallosCortos: !!item.items.alturaCorte
            }
          };
        }
        let photos = Array.isArray(item.photos) ? item.photos : (item.photo ? [item.photo] : []);
        const cached = getPhotosFromCache(item.id);
        if (cached && cached.length > photos.length) {
          photos = cached;
        } else if (photos.length > 0) {
          _photoCache.set(item.id, photos);
        }
        return {
          ...item,
          photos,
          photo: photos[0] || item.photo || null
        };
      });
    } catch (e) {
      return INITIAL_QUALITY_FIELD_CHECKS;
    }
  }

  function safePersistQualityList(storageKey, list) {
    if (!Array.isArray(list)) return false;

    // 1. Guardar permanentemente todas las fotos de todos los registros en IndexedDB y caché
    list.forEach(item => {
      if (item && item.id) {
        const photos = (Array.isArray(item.photos) && item.photos.length > 0)
          ? item.photos
          : (item.photo ? [item.photo] : []);
        if (photos.length > 0) {
          savePhotosToDB(item.id, photos);
        }
      }
    });

    // 2. Guardar en localStorage SIN podar ni borrar fotos de registros anteriores
    try {
      localStorage.setItem(storageKey, JSON.stringify(list));
      return true;
    } catch (quotaErr) {
      console.warn(`Cuota de localStorage en ${storageKey}. Almacenando de forma protegida en IndexedDB sin pérdida...`, quotaErr);
      try {
        // En caso de cuota excedida en localStorage:
        // Las fotos completas ya están en IndexedDB. En el JSON dejamos la miniatura
        // para que la lista pese muy poco pero NINGÚN registro pierda sus fotos.
        const safeList = list.map(item => {
          const photos = (Array.isArray(item.photos) && item.photos.length > 0)
            ? item.photos
            : (item.photo ? [item.photo] : []);
          if (photos.length > 0) {
            savePhotosToDB(item.id, photos);
          }
          return {
            ...item,
            photo: photos[0] || item.photo || null,
            photos: photos.slice(0, 1)
          };
        });
        localStorage.setItem(storageKey, JSON.stringify(safeList));
        return true;
      } catch (quotaErr2) {
        console.error('Error al persistir lista optimizada:', quotaErr2);
        return false;
      }
    }
  }

  function saveQualityFieldCheck(checkData) {
    const list = getQualityFieldChecks();
    const isEdit = checkData.id && list.some(q => q.id === checkData.id);
    let saved;

    if (isEdit) {
      const idx = list.findIndex(q => q.id === checkData.id);
      saved = {
        ...list[idx],
        ...checkData,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      try { logActivity('Calidad Campo', `Checklist campo actualizado (${saved.block} - ${saved.variety} - ${saved.score}%)`); } catch (_) {}
    } else {
      saved = {
        id: 'qfc_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6),
        createdAt: new Date().toISOString(),
        ...checkData
      };
      list.unshift(saved);
      try { logActivity('Calidad Campo', `Evaluación de campo registrada (${saved.block} - ${saved.variety} - Calificación: ${saved.score}%)`); } catch (_) {}
    }

    safePersistQualityList(STORAGE_KEYS.QUALITY_FIELD_CHECKS, list);
    return saved;
  }

  function deleteQualityFieldCheck(id) {
    const list = getQualityFieldChecks();
    const filtered = list.filter(q => q.id !== id);
    safePersistQualityList(STORAGE_KEYS.QUALITY_FIELD_CHECKS, filtered);
    try { logActivity('Calidad Campo', `Evaluación de campo eliminada`); } catch (_) {}
    return true;
  }

  // --- CONTROL DE CALIDAD EN BONCHES (PROCESO) ---
  function getQualityBunchChecks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUALITY_BUNCH_CHECKS);
      if (!raw) return INITIAL_QUALITY_BUNCH_CHECKS;
      const list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) return INITIAL_QUALITY_BUNCH_CHECKS;
      return list.map(item => {
        let photos = Array.isArray(item.photos) ? item.photos : (item.photo ? [item.photo] : []);
        const cached = getPhotosFromCache(item.id);
        if (cached && cached.length > photos.length) {
          photos = cached;
        } else if (photos.length > 0) {
          _photoCache.set(item.id, photos);
        }
        return {
          ...item,
          photos,
          photo: photos[0] || item.photo || null
        };
      });
    } catch (e) {
      return INITIAL_QUALITY_BUNCH_CHECKS;
    }
  }

  function saveQualityBunchCheck(checkData) {
    const list = getQualityBunchChecks();
    const isEdit = checkData.id && list.some(q => q.id === checkData.id);
    let saved;

    if (isEdit) {
      const idx = list.findIndex(q => q.id === checkData.id);
      saved = {
        ...list[idx],
        ...checkData,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      try { logActivity('Calidad Bonches', `Inspección de bonche actualizada (${saved.tableCode} - Bonche ${saved.bunchNumber} - ${saved.totalScore}%)`); } catch (_) {}
    } else {
      saved = {
        id: 'qbc_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6),
        createdAt: new Date().toISOString(),
        ...checkData
      };
      list.unshift(saved);
      try { logActivity('Calidad Bonches', `Inspección de bonche registrada (${saved.tableCode} - Bonche ${saved.bunchNumber} - Calificación: ${saved.totalScore}%)`); } catch (_) {}
    }

    safePersistQualityList(STORAGE_KEYS.QUALITY_BUNCH_CHECKS, list);
    return saved;
  }

  function deleteQualityBunchCheck(id) {
    const list = getQualityBunchChecks();
    const filtered = list.filter(q => q.id !== id);
    safePersistQualityList(STORAGE_KEYS.QUALITY_BUNCH_CHECKS, filtered);
    try { logActivity('Calidad Bonches', `Inspección de bonche eliminada`); } catch (_) {}
    return true;
  }

  // --- VENTAS Y PEDIDOS ---
  function getSalesRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES_RECORDS)) || INITIAL_SALES_RECORDS;
    } catch (e) {
      return INITIAL_SALES_RECORDS;
    }
  }

  function saveSalesRecord(saleData) {
    const list = getSalesRecords();
    const isEdit = saleData.id && list.some(s => s.id === saleData.id);
    let saved;

    const stemsCount = parseInt(saleData.stemsCount, 10) || 0;
    const pricePerStem = parseFloat(saleData.pricePerStem) || 0;
    const totalAmount = parseFloat((stemsCount * pricePerStem).toFixed(2));
    const bunchesCount = parseInt(saleData.bunchesCount, 10) || Math.round(stemsCount / 25);

    const payload = {
      ...saleData,
      stemsCount,
      bunchesCount,
      pricePerStem,
      totalAmount
    };

    if (isEdit) {
      const idx = list.findIndex(s => s.id === saleData.id);
      saved = {
        ...list[idx],
        ...payload,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      logActivity('Ventas', `Orden actualizada: ${saved.orderCode} (${saved.client} - $${saved.totalAmount})`);
    } else {
      saved = {
        id: 'sale_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...payload
      };
      list.unshift(saved);
      logActivity('Ventas', `Nueva orden registrada: ${saved.orderCode} (${saved.client} - ${saved.stemsCount} tallos - $${saved.totalAmount})`);
    }

    localStorage.setItem(STORAGE_KEYS.SALES_RECORDS, JSON.stringify(list));
    return saved;
  }

  function deleteSalesRecord(id) {
    const list = getSalesRecords();
    const target = list.find(s => s.id === id);
    if (!target) return false;
    const filtered = list.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SALES_RECORDS, JSON.stringify(filtered));
    logActivity('Ventas', `Orden eliminada: ${target.orderCode}`);
    return true;
  }

  // --- BALANCE DE STOCK PROCESADO EN FRÍO ---
  function getProcessedStockSummary() {
    const processList = getProcessRecords();
    const salesList = getSalesRecords();
    const varieties = getVarieties();

    const summaryMap = {};

    varieties.forEach(v => {
      summaryMap[v.name] = {
        variety: v.name,
        color: v.color || '',
        processedExportStems: 0,
        nationalStems: 0,
        soldStems: 0,
        availableStems: 0,
        availableBunches: 0
      };
    });

    processList.forEach(p => {
      if (!summaryMap[p.variety]) {
        summaryMap[p.variety] = {
          variety: p.variety,
          color: '',
          processedExportStems: 0,
          nationalStems: 0,
          soldStems: 0,
          availableStems: 0,
          availableBunches: 0
        };
      }
      summaryMap[p.variety].processedExportStems += (parseInt(p.exportStems, 10) || 0);
      summaryMap[p.variety].nationalStems += (parseInt(p.nationalStems, 10) || 0);
    });

    salesList.forEach(s => {
      if (summaryMap[s.variety] && (s.status === 'Despachado' || s.status === 'Reservado')) {
        summaryMap[s.variety].soldStems += (parseInt(s.stemsCount, 10) || 0);
      }
    });

    return Object.values(summaryMap).map(item => {
      const available = Math.max(0, item.processedExportStems - item.soldStems);
      return {
        ...item,
        availableStems: available,
        availableBunches: Math.floor(available / 25)
      };
    });
  }

  // --- PROYECCIONES DE COSECHA & PINCH ---
  function getProjections() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTIONS)) || INITIAL_PROJECTIONS;
    } catch (e) {
      return INITIAL_PROJECTIONS;
    }
  }

  function getProjection(id) {
    const list = getProjections();
    return list.find(p => p.id === id) || null;
  }

  function saveProjection(projData) {
    const list = getProjections();
    const isEdit = projData.id && list.some(p => p.id === projData.id);

    const dayHarvest = parseInt(projData.dayHarvest, 10) || 0;
    const pinchStems = parseInt(projData.pinchStems, 10) || 0;
    const totalInduced = dayHarvest + pinchStems;
    const cycleDays = parseInt(projData.cycleDays, 10) || 75;
    const rebudFactor = parseFloat(projData.rebudFactor) || 1.05;
    const projectedStems = Math.round(totalInduced * rebudFactor);

    // Calcular fecha futura proyectada = fecha de pinch + ciclo días
    let projectedHarvestDate = projData.projectedHarvestDate;
    if (!projectedHarvestDate && projData.date) {
      const d = new Date(projData.date);
      d.setDate(d.getDate() + cycleDays);
      projectedHarvestDate = d.toISOString().split('T')[0];
    }

    const payload = {
      ...projData,
      dayHarvest,
      pinchStems,
      totalInduced,
      cycleDays,
      rebudFactor,
      projectedStems,
      projectedHarvestDate
    };

    let saved;
    if (isEdit) {
      const idx = list.findIndex(p => p.id === projData.id);
      saved = {
        ...list[idx],
        ...payload,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      logActivity('Proyecciones', `Proyección actualizada: ${saved.block} (${saved.variety} -> ${saved.projectedHarvestDate})`);
    } else {
      saved = {
        id: 'proj_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...payload
      };
      list.unshift(saved);
      logActivity('Proyecciones', `Nueva proyección creada: ${saved.block} (${saved.variety} - ${saved.projectedStems} tallos para ${saved.projectedHarvestDate})`);
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTIONS, JSON.stringify(list));
    return saved;
  }

  function deleteProjection(id) {
    const list = getProjections();
    const target = list.find(p => p.id === id);
    if (!target) return false;
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTIONS, JSON.stringify(filtered));
    logActivity('Proyecciones', `Proyección eliminada (${target.block} - ${target.variety})`);
    return true;
  }

  // --- PROYECCIÃ“N DE RETORNOS POR CICLO DE VARIEDAD ---
  function getReturnProjections() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RETURN_PROJECTIONS);
      if (!raw) return INITIAL_RETURN_PROJECTIONS;
      const list = JSON.parse(raw);
      return (Array.isArray(list) && list.length > 0) ? list : INITIAL_RETURN_PROJECTIONS;
    } catch (e) {
      return INITIAL_RETURN_PROJECTIONS;
    }
  }

  function getReturnProjection(id) {
    const list = getReturnProjections();
    return list.find(r => r.id === id) || null;
  }

  function saveReturnProjection(retData) {
    const list = getReturnProjections();
    const isEdit = retData.id && list.some(r => r.id === retData.id);

    const cycleDays = parseInt(retData.cycleDays, 10) || 75;
    const inducedStems = parseInt(retData.inducedStems, 10) || 0;
    const conversionRate = parseFloat(retData.conversionRate) || 100;
    const projectedStems = parseInt(retData.projectedStems, 10) || Math.round((inducedStems * conversionRate) / 100);

    // Auto-cÃ¡lculo de fecha de retorno: Fecha Base + Ciclo en dÃ­as
    let returnDate = retData.returnDate;
    if ((!returnDate || retData.autoCalcDate) && retData.baseDate) {
      const bDate = new Date(retData.baseDate + 'T12:00:00');
      bDate.setDate(bDate.getDate() + cycleDays);
      returnDate = bDate.toISOString().split('T')[0];
    }

    // Auto-cÃ¡lculo de semana ISO
    let targetWeek = parseInt(retData.targetWeek, 10) || 0;
    if (returnDate && (!targetWeek || retData.autoCalcWeek)) {
      const d = new Date(returnDate + 'T12:00:00');
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
      const week1 = new Date(d.getFullYear(), 0, 4);
      targetWeek = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    const payload = {
      ...retData,
      cycleDays,
      inducedStems,
      conversionRate,
      projectedStems,
      returnDate,
      targetWeek
    };

    let saved;
    if (isEdit) {
      const idx = list.findIndex(r => r.id === retData.id);
      saved = {
        ...list[idx],
        ...payload,
        updatedAt: new Date().toISOString()
      };
      list[idx] = saved;
      logActivity('ProyecciÃ³n Retornos', `Retorno actualizado: ${saved.block} (${saved.variety} -> ${saved.returnDate})`);
    } else {
      saved = {
        id: 'ret_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        ...payload
      };
      list.unshift(saved);
      logActivity('ProyecciÃ³n Retornos', `Nueva proyecciÃ³n de retorno: ${saved.block} (${saved.variety} - ${saved.projectedStems} tallos para Sem ${saved.targetWeek})`);
    }

    localStorage.setItem(STORAGE_KEYS.RETURN_PROJECTIONS, JSON.stringify(list));
    return saved;
  }

  function deleteReturnProjection(id) {
    const list = getReturnProjections();
    const target = list.find(r => r.id === id);
    if (!target) return false;
    const filtered = list.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RETURN_PROJECTIONS, JSON.stringify(filtered));
    logActivity('ProyecciÃ³n Retornos', `ProyecciÃ³n de retorno eliminada (${target.block} - ${target.variety})`);
    return true;
  }

  // --- DATOS DE LA FINCA (LOGO, NOMBRE, UBICACIÓN, ALTURA, RUC, CONTACTOS, CORREOS) ---
  function getFarmInfo() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FARM_INFO);
      if (data) {
        return { ...INITIAL_FARM_INFO, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Error al leer datos de finca:', e);
    }
    return { ...INITIAL_FARM_INFO };
  }

  function saveFarmInfo(info) {
    try {
      const current = getFarmInfo();
      const updated = {
        ...current,
        ...info,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.FARM_INFO, JSON.stringify(updated));
      logActivity('Configuración Finca', `Datos de la Finca actualizados (${updated.name})`);
      return updated;
    } catch (e) {
      console.error('Error al guardar datos de finca:', e);
      throw e;
    }
  }

  init();

  return {
    init,
    getUsers,
    getUser,
    saveUser,
    deleteUser,
    toggleUserStatus,
    updateUserPermissions,
    getFarmInfo,
    saveFarmInfo,
    getFarmPlans,
    getFarmPlan,
    saveFarmPlan,
    deleteFarmPlan,
    importFarmPlansBatch,
    getFarmAreas,
    getFarmArea,
    saveFarmArea,
    deleteFarmArea,
    savePhotosForRecord: savePhotosToDB,
    getPhotosForRecord: getPhotosFromCache,
    getVarieties,
    getVariety,
    saveVariety,
    deleteVariety,
    getModules,
    saveModule,
    deleteModule,
    getDynamicRecords,
    addDynamicRecord,
    getProductionRecords,
    getProductionRecord,
    addProductionRecord,
    updateProductionRecord,
    deleteProductionRecord,
    getQualityRecords,
    addQualityRecord,
    getBarcodes,
    getBarcode,
    saveBarcode,
    deleteBarcode,
    getIrrigationPrep,
    saveIrrigationPrep,
    deleteIrrigationPrep,
    getIrrigationField,
    saveIrrigationField,
    deleteIrrigationField,
    getHarvestProd,
    getHarvestProdRecord,
    saveHarvestProd,
    deleteHarvestProd,
    getProcessRecords,
    getProcessRecord,
    saveProcessRecord,
    deleteProcessRecord,
    getQualityFieldChecks,
    saveQualityFieldCheck,
    deleteQualityFieldCheck,
    getQualityBunchChecks,
    saveQualityBunchCheck,
    deleteQualityBunchCheck,
    getSalesRecords,
    saveSalesRecord,
    deleteSalesRecord,
    getProcessedStockSummary,
    getProjections,
    getProjection,
    saveProjection,
    deleteProjection,
    getReturnProjections,
    getReturnProjection,
    saveReturnProjection,
    deleteReturnProjection,
    getBlocks,
    logActivity,
    getActivityLogs
  };
})();

// Garantizar disponibilidad global
if (typeof window !== 'undefined') {
  window.Store = Store;
}

