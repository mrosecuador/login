# MRosecuador - Configuración de Finca

Sistema especializado de gestión florícola desarrollado con la identidad visual corporativa de **MRosecuador** (paleta blanco y verde esmeralda con acentos de rosa rubí), sistema de inicio de sesión adaptable a cualquier tamaño de pantalla (móvil, tablet, PC), enfocado exclusivamente en la **Configuración de Finca** y operado mediante la cuenta del **Administrador**.

---

## 🌹 Identidad y Módulos Principales

1. **Diseño Verde y Blanco Corporativo**:
   - Inspirado directamente en el logotipo de **MRosecuador**.
   - Colores principales: Verde Esmeralda (`#059669` / `#13774b`), Blanco Puro y acentos Rubí (`#be123c`) en alusión a las rosas ecuatorianas.
   - Tipografía moderna (*Outfit* y *Plus Jakarta Sans*).

2. **Login Adaptativo Multi-Pantalla**:
   - Ajuste óptimo en teléfonos móviles, tablets y computadoras de escritorio.
   - Botón para mostrar u ocultar contraseña.
   - Acceso rápido de un solo clic para la cuenta del **Administrador** (`admin` / `admin`).
   - Persistencia de sesión segura en navegador.

3. **Configuración de Finca**:
   - 🗺️ **Planos de Finca**:
     - Registro y control agronómico de: **Número de bloque**, **Variedad**, **Camas**, **Fecha de siembra**, **Ciclo productivo**, **Plantas estimadas** y **Estado**.
     - Opciones para **Agregar**, **Modificar** y **Eliminar** bloques con confirmación.
     - **Descargar Plantilla .xlsx**: Genera y descarga el archivo Excel modelo con formato de bloques y ejemplos de fincas florícolas.
     - **Subir Plantilla .xlsx**: Lector y parser de archivos Excel en el navegador que importa y valida registros masivamente sin conexión a internet.
     - **Exportar a Excel**: Descarga de los bloques vigentes a un archivo `.xlsx`.
   - 🌹 **Catálogo de Variedades**:
     - Ficha técnica completa de rosas de exportación con:
       - **Fotografía de la variedad**: Subida de foto desde el dispositivo con preview instantáneo y almacenamiento local.
       - **Tamaño de botón**: Ej: *6.0 - 6.8 cm (Grande)*, *Jumbo*.
       - **Largos de tallos**: Ej: *60, 70, 80, 90, 100 cm*.
       - **Punto de corte**: Ej: *Punto 2.5 - 3.0 (Copa semi-abierta)*.
       - **Prueba de florero (vida en florero)**: Ej: *14 - 18 días*.
       - **Número de pétalos**: Ej: *45 - 55 pétalos*, *50 - 60 pétalos terciopelo*.
       - Casa obtentora (Breeder) y descripción agronómica.
     - Galería de tarjetas visuales, filtros por color y opciones para crear, modificar y eliminar variedades.

---

## 🔑 Credenciales Iniciales de Acceso

| Rol | Usuario | Contraseña | Permisos |
|---|---|---|---|
| 👑 **Administrador** | `admin` | `admin` | **Acceso Total (*)** a Planos de Finca y Catálogo de Variedades |

---

## 🚀 Cómo Iniciar el Software

### Opción 1: Servidor Local con Acceso Wi-Fi (Recomendado)
Haz doble clic en:
```
start_server.bat
```
O desde PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File start_server.ps1
```
El servidor se iniciará en `http://localhost:8085` y se abrirá automáticamente en tu navegador. Además, mostrará la dirección IP de tu red para abrirlo desde tu teléfono celular o tablet conectado al mismo Wi-Fi.

### Opción 2: Abrir Directamente en el Navegador
También puedes hacer doble clic directamente sobre:
```
index.html
```
*(Funciona de manera 100% autónoma y offline con biblioteca SheetJS local incluida).*
