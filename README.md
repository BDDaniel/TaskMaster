# TaskMaster

TaskMaster es una aplicación móvil y web desarrollada con Ionic y Angular que te permite gestionar tus tareas de manera eficiente.

## ¿Por qué usamos Capacitor y no Cordova?

Aunque Cordova fue durante años el estándar para aplicaciones híbridas, el equipo de Ionic ahora recomienda Capacitor como la solución moderna y oficial para proyectos nuevos. Capacitor ofrece:

- Mejor integración con proyectos Angular modernos (standalone o clásicos)
- Soporte y mantenimiento activo por parte de Ionic
- Compatibilidad con la mayoría de los plugins de Cordova y una API más sencilla
- Mejor experiencia de desarrollo y despliegue multiplataforma

**Por estos motivos, TaskMaster utiliza Capacitor para compilar y exportar la app en Android, iOS y web.**

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- [Ionic CLI](https://ionicframework.com/docs/cli) (`npm install -g @ionic/cli`)
- [Android Studio](https://developer.android.com/studio) (para desarrollo Android)
- [Xcode](https://developer.apple.com/xcode/) (para desarrollo iOS, solo macOS)
- [Git](https://git-scm.com/)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/yourusername/TaskMaster.git
cd TaskMaster
```

2. Instala las dependencias:
```bash
npm install
```

## Desarrollo Local (Web)

Para ejecutar la aplicación en modo desarrollo web:

```bash
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`

## Compilar y Ejecutar en Dispositivos (Capacitor)

### 1. Construir la app web
```bash
ionic build
```

### 2. Sincronizar Capacitor
```bash
npx cap sync
```

### 3. Abrir en Android Studio o Xcode
- **Android:**
  ```bash
  npx cap open android
  ```
- **iOS (solo Mac):**
  ```bash
  npx cap open ios
  ```

### 4. Compilar y exportar
- Desde Android Studio puedes generar el APK o App Bundle (`Build > Build Bundle(s) / APK(s)`).
- Desde Xcode puedes generar el archivo IPA (`Product > Archive`).

## Construcción para Producción

### Web
```bash
ionic build --prod
```
Los archivos de producción se generarán en la carpeta `www/`

### Android/iOS
Sigue los pasos anteriores, pero asegúrate de construir en modo producción:
```bash
ionic build --prod
npx cap sync
```

## Solución de Problemas Comunes

1. Si encuentras errores de compilación:
   - Limpia la caché: `npm cache clean --force`
   - Elimina node_modules: `rm -rf node_modules`
   - Reinstala dependencias: `npm install`

2. Para problemas con Capacitor:
   - Actualiza Capacitor: `npm install @capacitor/core@latest @capacitor/cli@latest`
   - Sincroniza nuevamente: `npx cap sync`

3. Para problemas con Android:
   - Verifica que ANDROID_HOME esté configurado correctamente
   - Asegúrate de tener las últimas versiones del SDK de Android

4. Para problemas con iOS:
   - Verifica que Xcode esté actualizado
   - Ejecuta `pod install` en la carpeta ios/App

## Estructura del Proyecto

```
TaskMaster/
├── src/                    # Código fuente de la aplicación
├── www/                    # Archivos de construcción web
├── android/                # Proyecto Android nativo (Capacitor)
├── ios/                    # Proyecto iOS nativo (Capacitor)
├── capacitor.config.json    # Configuración de Capacitor
└── angular.json            # Configuración de Angular
```

## Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 