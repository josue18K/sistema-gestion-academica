# Sistema de Gestión Académica

Sistema completo de gestión académica desarrollado con Laravel 12 y React + Tailwind CSS.

## 🚀 Características

- ✅ Gestión de usuarios con roles (Administrador, Docente, Estudiante)
- ✅ Administración de carreras, semestres y materias
- ✅ Gestión de grupos y asignación de docentes
- ✅ Control de inscripciones estudiantiles
- ✅ Registro de asistencias
- ✅ Gestión de notas y calificaciones
- ✅ Sistema de tareas y entregas
- ✅ API RESTful completa
- ✅ Autenticación con Laravel Sanctum

## 🛠️ Tecnologías

### Backend
- Laravel 12
- MySQL / MariaDB
- Laravel Sanctum (Autenticación)
- Eloquent ORM

### Frontend (Próximamente)
- React.js
- Tailwind CSS
- Axios
- Vite

## 📋 Requisitos

- PHP >= 8.2
- Composer
- MySQL >= 8.0
- Node.js >= 18.x (para el frontend)

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/josue18K/sistema-gestion-academica.git
cd sistema-gestion-academica
```

### 2. Instalar dependencias
```bash
composer install
```

### 3. Configurar el archivo .env
```bash
cp .env.example .env
php artisan key:generate
```

Edita el archivo `.env` con tus credenciales de base de datos:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistema_academico
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Ejecutar migraciones y seeders
```bash
php artisan migrate:fresh --seed
```

### 5. Iniciar el servidor
```bash
php artisan serve
```

El servidor estará disponible en: `http://127.0.0.1:8000`

## 👤 Usuarios de Prueba

Después de ejecutar los seeders, tendrás acceso a:

### Administrador
- **Email:** admin@sistema.com
- **Password:** password

### Docentes
- **Email:** docente1@sistema.com a docente10@sistema.com
- **Password:** password

### Estudiantes
- **Email:** estudiante1@sistema.com a estudiante50@sistema.com
- **Password:** password

## 📚 Documentación de la API

### Base URL
```
http://127.0.0.1:8000/api
```

### Autenticación

#### Login
```http
POST /api/login
Content-Type: application/json

{
    "email": "admin@sistema.com",
    "password": "password"
}
```

**Respuesta:**
```json
{
    "access_token": "1|xxxxxxxxxxxx",
    "token_type": "Bearer",
    "user": { ... }
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

#### Usuario Actual
```http
GET /api/me
Authorization: Bearer {token}
```

### Endpoints Principales

Todos los endpoints requieren autenticación excepto `/login` y `/register`.

#### Carreras
- `GET /api/carreras` - Listar carreras
- `POST /api/carreras` - Crear carrera
- `GET /api/carreras/{id}` - Ver detalle
- `PUT /api/carreras/{id}` - Actualizar
- `DELETE /api/carreras/{id}` - Eliminar

#### Estudiantes
- `GET /api/estudiantes` - Listar estudiantes
- `POST /api/estudiantes` - Crear estudiante
- `GET /api/estudiantes/{id}` - Ver detalle
- `PUT /api/estudiantes/{id}` - Actualizar
- `DELETE /api/estudiantes/{id}` - Eliminar

#### Docentes
- `GET /api/docentes` - Listar docentes
- `POST /api/docentes` - Crear docente
- `GET /api/docentes/{id}` - Ver detalle
- `PUT /api/docentes/{id}` - Actualizar
- `DELETE /api/docentes/{id}` - Eliminar

#### Materias
- `GET /api/materias` - Listar materias
- `POST /api/materias` - Crear materia
- `GET /api/materias/{id}` - Ver detalle
- `PUT /api/materias/{id}` - Actualizar
- `DELETE /api/materias/{id}` - Eliminar

#### Grupos
- `GET /api/grupos` - Listar grupos
- `POST /api/grupos` - Crear grupo
- `GET /api/grupos/{id}` - Ver detalle
- `PUT /api/grupos/{id}` - Actualizar
- `DELETE /api/grupos/{id}` - Eliminar

#### Inscripciones
- `GET /api/inscripciones` - Listar inscripciones
- `POST /api/inscripciones` - Crear inscripción
- `GET /api/inscripciones/{id}` - Ver detalle
- `PUT /api/inscripciones/{id}` - Actualizar
- `DELETE /api/inscripciones/{id}` - Eliminar
- `GET /api/inscripciones/estudiante/{estudianteId}` - Inscripciones por estudiante
- `GET /api/inscripciones/grupo/{grupoId}` - Inscripciones por grupo

#### Asistencias
- `GET /api/asistencias` - Listar asistencias
- `POST /api/asistencias` - Registrar asistencia
- `GET /api/asistencias/{id}` - Ver detalle
- `PUT /api/asistencias/{id}` - Actualizar
- `DELETE /api/asistencias/{id}` - Eliminar
- `GET /api/asistencias/inscripcion/{inscripcionId}` - Asistencias por inscripción
- `POST /api/asistencias/masivo` - Registro masivo

#### Notas
- `GET /api/notas` - Listar notas
- `POST /api/notas` - Crear nota
- `GET /api/notas/{id}` - Ver detalle
- `PUT /api/notas/{id}` - Actualizar
- `DELETE /api/notas/{id}` - Eliminar
- `GET /api/notas/inscripcion/{inscripcionId}` - Notas por inscripción
- `GET /api/notas/promedio/{inscripcionId}` - Calcular promedio

#### Tareas
- `GET /api/tareas` - Listar tareas
- `POST /api/tareas` - Crear tarea
- `GET /api/tareas/{id}` - Ver detalle
- `PUT /api/tareas/{id}` - Actualizar
- `DELETE /api/tareas/{id}` - Eliminar
- `GET /api/tareas/grupo/{grupoId}` - Tareas por grupo

#### Entregas de Tareas
- `GET /api/entregas-tareas` - Listar entregas
- `POST /api/entregas-tareas` - Crear entrega
- `GET /api/entregas-tareas/{id}` - Ver detalle
- `PUT /api/entregas-tareas/{id}` - Actualizar
- `DELETE /api/entregas-tareas/{id}` - Eliminar
- `POST /api/entregas-tareas/{id}/calificar` - Calificar entrega
- `GET /api/entregas-tareas/tarea/{tareaId}` - Entregas por tarea
- `GET /api/entregas-tareas/estudiante/{estudianteId}` - Entregas por estudiante

## 🗂️ Estructura del Proyecto
```
sistema-gestion-academica/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php
│   │           ├── CarreraController.php
│   │           ├── EstudianteController.php
│   │           ├── DocenteController.php
│   │           ├── MateriaController.php
│   │           ├── GrupoController.php
│   │           ├── InscripcionController.php
│   │           ├── AsistenciaController.php
│   │           ├── NotaController.php
│   │           ├── TareaController.php
│   │           └── EntregaTareaController.php
│   └── Models/
│       ├── User.php
│       ├── Carrera.php
│       ├── Estudiante.php
│       ├── Docente.php
│       ├── Semestre.php
│       ├── Materia.php
│       ├── Grupo.php
│       ├── Inscripcion.php
│       ├── Asistencia.php
│       ├── Nota.php
│       ├── Tarea.php
│       └── EntregaTarea.php
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── README.md
```

## 🔐 Seguridad

- Todas las contraseñas están hasheadas con bcrypt
- Autenticación mediante tokens JWT con Laravel Sanctum
- Validación de datos en todos los endpoints
- Protección CSRF
- Relaciones de base de datos con integridad referencial

## 📝 Base de Datos

### Diagrama de Relaciones
```
users (1) ──── (1) estudiantes ──── (N) inscripciones
users (1) ──── (1) docentes ──── (N) grupos

carreras (1) ──── (N) semestres ──── (N) materias ──── (N) grupos

grupos (1) ──── (N) inscripciones
grupos (1) ──── (N) tareas

inscripciones (1) ──── (N) asistencias
inscripciones (1) ──── (N) notas

tareas (1) ──── (N) entregas_tareas
estudiantes (1) ──── (N) entregas_tareas
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 👨‍💻 Autor

**josue18K**
- GitHub: [@josue18K](https://github.com/josue18K)

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en GitHub.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
