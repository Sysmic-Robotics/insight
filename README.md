# 🛰️ CondorSSL - Electron GUI

Interfaz gráfica para CondorSSL, desarrollada con **Electron**, **React**, **Vite** y **TailwindCSS**.

---

## 📦 Requisitos

- Node.js >= 18
- npm >= 9
- Git
- (Windows) Para ejecutar el backend: `SysmicSoftware.exe` debe estar disponible

---

## 🧱 Estructura del proyecto

```
electron-gui/
├── electron/            # Lógica principal de Electron (main.ts)
├── src/                 # Código React + Tailwind
├── dist/                # Build frontend de Vite
├── dist-electron/       # Archivos JS compilados de Electron (main + preload)
├── preload.ts           # Script seguro de comunicación entre renderer y main
├── vite.config.ts       # Configuración de Vite
├── tsconfig.json        # Configuración de TypeScript
├── package.json         # Scripts, dependencias y config de build
```

---

## 🚀 Scripts de desarrollo

| Comando                  | Descripción                                      |
|--------------------------|--------------------------------------------------|
| `npm install`            | Instala todas las dependencias                  |
| `npm run dev`            | Inicia Vite + Electron en modo desarrollo       |
| `npm run build`          | Genera el build del frontend (Vite)             |
| `npm run build-electron` | Compila los archivos TypeScript de Electron     |
| `npm run dist`           | Crea el `.exe` instalable con Electron Builder  |
| `npm run lint`           | Lint con ESLint                                 |
| `npm run preview`        | Previsualiza el frontend generado por Vite      |

---

## 🧪 Desarrollo local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/electron-gui.git
   cd electron-gui
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

> Esto iniciará Vite (`localhost:5173`) y abrirá una ventana de Electron con hot reload.

---

## 🛠️ Compilación para producción

1. Generar build del frontend:
   ```bash
   npm run build
   ```

2. Compilar los scripts de Electron:
   ```bash
   npm run build-electron
   ```

3. Generar instalador para Windows:
   ```bash
   npm run dist
   ```

> El instalador final se guardará en `release/`.

---

## 🧩 Notas

- El backend `SysmicSoftware.exe` no se incluye por defecto. Asegúrate de tenerlo si es necesario.
- Por ahora, la comunicación con el backend está deshabilitada, pero puede habilitarse vía IPC cuando se necesite.
- Los estilos se manejan completamente con TailwindCSS.
- Los íconos vienen de `@radix-ui/react-icons`.

---

## 👤 Autor

**GersonHMG**  
GitHub: [@GersonHMG](https://github.com/GersonHMG)

---

## 📄 Licencia

Este proyecto es privado o de uso interno. Asegúrate de contar con autorización antes de distribuir.