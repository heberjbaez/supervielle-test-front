# Supervielle Test Front

Mini aplicación en Angular para explorar usuarios y sus publicaciones, consumiendo la API pública de JSONPlaceholder.

## Descripción del Proyecto

Esta aplicación permite a los usuarios iniciar sesión y explorar un listado de usuarios obtenido desde [JSONPlaceholder](https://jsonplaceholder.typicode.com/). La aplicación incluye funcionalidades de filtrado, paginación y visualización detallada de información de usuarios con sus publicaciones más recientes.

## Tecnologías Utilizadas

- **Angular 21.0.0** - Framework principal
- **Angular Material 21.0.2** - Componentes de UI
- **RxJS 7.8.0** - Programación reactiva
- **Vitest 4.0.8** - Testing unitario
- **TypeScript 5.9.2** - Lenguaje de programación

## Características Implementadas

### 1. Sistema de Login

Sistema de autenticación con validaciones del lado del cliente:

- Campo de email con validación de formato
- Campo de contraseña con validación de longitud mínima (6 caracteres)
- Mensajes de error descriptivos
- Redirección automática al listado de usuarios tras login exitoso
- Guard de autenticación para proteger rutas privadas

**Ubicación**: [src/app/features/auth/login/](src/app/features/auth/login/)

### 2. Listado de Usuarios

Visualización de usuarios consumiendo la API de JSONPlaceholder:

- Muestra 5 usuarios por página
- Información mostrada: username, nombre, email y compañía
- Tabla responsive con Angular Material
- Indicador de carga durante la obtención de datos
- Manejo de errores

**Ubicación**: [src/app/features/users/users.component.ts](src/app/features/users/users.component.ts)

### 3. Sistema de Filtros

Funcionalidad de búsqueda y filtrado avanzado:

- **Búsqueda por texto**: Filtra por nombre o email del usuario
- **Filtro por compañía**: Dropdown con lista de compañías únicas
- **Botón de limpieza**: Resetea todos los filtros aplicados
- **Reseteo automático de paginación**: Al aplicar filtros, vuelve a la primera página

### 4. Paginación

Sistema de navegación entre páginas:

- 5 usuarios por página
- Botones de navegación (anterior/siguiente)
- Indicador de página actual y total de páginas
- Navegación directa a páginas específicas

### 5. Sidebar Lateral

Modal lateral que muestra información detallada del usuario:

**Información del usuario**:

- Ciudad
- Código postal
- Teléfono
- Email
- Compañía
- Sitio web

**Últimas publicaciones**:

- Muestra las últimas 5 publicaciones del usuario
- Incluye título y cuerpo de cada publicación
- Tarjetas estilizadas para mejor legibilidad

**Ubicación**: [src/app/features/users/components/user-sidebar/](src/app/features/users/components/user-sidebar/)

### 6. Tests Unitarios (Bonus Track)

Implementación de tests unitarios para componentes principales:

- **LoginComponent**: Tests de validación de formularios y comportamiento del componente
- **UsersComponent**: Tests de filtrado, paginación y gestión de usuarios
- **UserSidebarComponent**: Tests de carga de datos y visualización

**Ejecutar tests**:

```bash
ng test
```

## Arquitectura del Proyecto

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts          # Guard de autenticación
│   ├── interceptors/
│   │   └── error.interceptor.ts   # Interceptor de errores HTTP
│   ├── models/
│   │   ├── user.model.ts          # Modelo de Usuario
│   │   └── post.model.ts          # Modelo de Publicación
│   └── services/
│       ├── api.service.ts         # Servicio base para API
│       ├── auth.service.ts        # Servicio de autenticación
│       ├── users.service.ts       # Servicio de usuarios
│       └── posts.service.ts       # Servicio de publicaciones
├── features/
│   ├── auth/
│   │   └── login/                 # Componente de login
│   └── users/
│       ├── components/
│       │   └── user-sidebar/      # Componente de sidebar
│       └── users.component.*      # Componente principal de usuarios
└── app.routes.ts                  # Configuración de rutas
```

### Principios de Diseño

- **Componentes Standalone**: Todos los componentes utilizan la API standalone de Angular 21
- **Signals**: Uso de signals para gestión reactiva de estado
- **Computed Values**: Cálculos reactivos para filtros y paginación
- **Lazy Loading**: Carga diferida de componentes en las rutas
- **Inyección de Dependencias**: Uso de `inject()` function-based injection
- **Programación Reactiva**: RxJS para operaciones asíncronas

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm 10.9.3 o superior

### Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd supervielle-test-front
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm start
```

4. Abrir el navegador en `http://localhost:4200/`

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm test` - Ejecuta los tests unitarios
- `npm run watch` - Compila en modo watch para desarrollo

## Flujo de la Aplicación

1. **Login**: El usuario ingresa credenciales (email válido y contraseña de 6+ caracteres)
2. **Autenticación**: El sistema valida el formato y guarda el estado de autenticación
3. **Redirección**: Automáticamente redirige al listado de usuarios
4. **Listado**: Muestra los usuarios paginados (5 por página)
5. **Filtrado**: El usuario puede buscar por nombre/email o filtrar por compañía
6. **Detalle**: Al hacer clic en un usuario, se abre el sidebar con información detallada
7. **Publicaciones**: El sidebar muestra las últimas 5 publicaciones del usuario seleccionado

## API Utilizada

**Base URL**: `https://jsonplaceholder.typicode.com/`

### Endpoints Consumidos

- `GET /users` - Obtiene el listado completo de usuarios
- `GET /posts?userId={id}` - Obtiene las publicaciones de un usuario específico

## Gestión del Repositorio

- **Rama principal**: `master`
- **Rama de desarrollo**: `desa`
- **Estrategia de commits**: Commits incrementales por funcionalidad implementada
- **Merge final**: Al completar todas las funcionalidades, merge de `desa` a `master`

## Desarrollo Futuro

Posibles mejoras y extensiones:

- Implementación de tests end-to-end
- Caché de datos para optimizar llamadas a la API
- Modo offline con Service Workers
- Filtros adicionales (por ciudad, teléfono, etc.)
- Exportación de datos a CSV/Excel
- Internacionalización (i18n)

## Recursos Adicionales

- [Angular Documentation](https://angular.dev/)
- [Angular Material Components](https://material.angular.io/)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)
- [RxJS Documentation](https://rxjs.dev/)

## Comentarios y/o mejoras

- Se pudo haber mejorado la UI pero por cuestiones de tiempo decidi priorizar funcionalidad y dejar los componentes acomodados
- Habia compoenentes de Angular Material que no se renderizaban correctamente como por ejemplo el boton de "Iniciar Sesion", que si bien esta deshabilitado hasta que el usuario no ingrese correctamente los campos, esto no se refleja visualmente de manera correcta.
