<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarreraController;
use App\Http\Controllers\Api\EstudianteController;
use App\Http\Controllers\Api\DocenteController;
use App\Http\Controllers\Api\SemestreController;
use App\Http\Controllers\Api\MateriaController;
use App\Http\Controllers\Api\GrupoController;
use App\Http\Controllers\Api\InscripcionController;
use App\Http\Controllers\Api\AsistenciaController;
use App\Http\Controllers\Api\NotaController;
use App\Http\Controllers\Api\TareaController;
use App\Http\Controllers\Api\EntregaTareaController;

// Rutas públicas (sin autenticación)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {

    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Carreras
    Route::apiResource('carreras', CarreraController::class);

    // Semestres
    Route::apiResource('semestres', SemestreController::class);

    // Estudiantes
    Route::apiResource('estudiantes', EstudianteController::class);

    // Docentes
    Route::apiResource('docentes', DocenteController::class);

    // Materias
    Route::apiResource('materias', MateriaController::class);

    // Grupos
    Route::apiResource('grupos', GrupoController::class);

    // Inscripciones
    Route::apiResource('inscripciones', InscripcionController::class);
    Route::get('inscripciones/estudiante/{estudianteId}', [InscripcionController::class, 'byEstudiante']);
    Route::get('inscripciones/grupo/{grupoId}', [InscripcionController::class, 'byGrupo']);

    // Asistencias
    Route::apiResource('asistencias', AsistenciaController::class);
    Route::get('asistencias/inscripcion/{inscripcionId}', [AsistenciaController::class, 'byInscripcion']);
    Route::post('asistencias/masivo', [AsistenciaController::class, 'registrarMasivo']);

    // Notas
    Route::apiResource('notas', NotaController::class);
    Route::get('notas/inscripcion/{inscripcionId}', [NotaController::class, 'byInscripcion']);
    Route::get('notas/promedio/{inscripcionId}', [NotaController::class, 'calcularPromedio']);

    // Tareas
    Route::apiResource('tareas', TareaController::class);
    Route::get('tareas/grupo/{grupoId}', [TareaController::class, 'byGrupo']);

    // Entregas de Tareas
    Route::apiResource('entregas-tareas', EntregaTareaController::class);
    Route::post('entregas-tareas/{id}/calificar', [EntregaTareaController::class, 'calificar']);
    Route::get('entregas-tareas/tarea/{tareaId}', [EntregaTareaController::class, 'byTarea']);
    Route::get('entregas-tareas/estudiante/{estudianteId}', [EntregaTareaController::class, 'byEstudiante']);
});
