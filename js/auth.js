/**
 * ==============================================================================
 * MRosecuador - Producción y Calidad
 * CONTROLADOR DE AUTENTICACIÓN Y SESIONES
 * ==============================================================================
 */

const Auth = (function () {
  const SESSION_KEY = 'mrose_session_v1';

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      const sessionUser = JSON.parse(data);
      // Sincronizar con el store para obtener datos actualizados (permisos o estado más reciente)
      const freshUser = Store.getUser(sessionUser.id || sessionUser.username);
      if (freshUser) {
        if (freshUser.status !== 'active') {
          logout();
          return null;
        }
        return freshUser;
      }
      return sessionUser;
    } catch (e) {
      return null;
    }
  }

  function isAuthenticated() {
    return getCurrentUser() !== null;
  }

  function isAdmin() {
    const user = getCurrentUser();
    return user && (user.role === 'admin' || (user.permissions && user.permissions.includes('*')));
  }

  function login(identifier, password, remember = true) {
    if (!identifier || !password) {
      throw new Error('Por favor ingresa usuario y contraseña');
    }

    const trimmedId = identifier.trim().toLowerCase();
    const users = Store.getUsers();

    // Búsqueda por username o email (case insensitive)
    const user = users.find(u => 
      (u.username && u.username.toLowerCase() === trimmedId) || 
      (u.email && u.email.toLowerCase() === trimmedId)
    );

    if (!user) {
      throw new Error('Usuario o correo no encontrado en el sistema');
    }

    if (user.status !== 'active') {
      throw new Error('Tu cuenta se encuentra inactiva. Contacta al Administrador.');
    }

    if (user.password !== password) {
      throw new Error('Contraseña incorrecta. Verifica tus datos.');
    }

    // Actualizar última fecha de conexión
    user.lastLogin = new Date().toISOString();
    Store.saveUser(user);

    // Guardar sesión
    const sessionData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      roleName: user.roleName,
      avatar: user.avatar,
      permissions: user.permissions || [],
      loginAt: new Date().toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    Store.logActivity('Acceso al Sistema', `Inicio de sesión exitoso`, user.name);

    return sessionData;
  }

  function logout() {
    const user = getCurrentUser();
    if (user) {
      Store.logActivity('Salida del Sistema', `Cierre de sesión`, user.name);
    }
    localStorage.removeItem(SESSION_KEY);
  }

  function hasAccess(moduleKey) {
    const user = getCurrentUser();
    if (!user) return false;

    // Admin total
    if (user.role === 'admin' || (user.permissions && user.permissions.includes('*'))) {
      return true;
    }

    // Comprobación de permiso individual
    if (Array.isArray(user.permissions)) {
      if (user.permissions.includes(moduleKey)) return true;
      if ((moduleKey === 'dashboard-calidad-campo' || moduleKey === 'dashboard-calidad-proceso') && user.permissions.includes('dashboard-calidad')) return true;
      return false;
    }

    return false;
  }

  function getAllowedModules() {
    const user = getCurrentUser();
    if (!user) return [];

    const allModules = Store.getModules().filter(m => m.status === 'active');

    if (user.role === 'admin' || (user.permissions && user.permissions.includes('*'))) {
      return allModules;
    }

    const userPerms = Array.isArray(user.permissions) ? user.permissions : [];
    return allModules.filter(m => userPerms.includes(m.key));
  }

  return {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
    hasAccess,
    getAllowedModules
  };
})();

// Garantizar disponibilidad global
if (typeof window !== 'undefined') {
  window.Auth = Auth;
}

