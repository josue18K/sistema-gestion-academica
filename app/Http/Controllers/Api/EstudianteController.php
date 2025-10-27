<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Estudiante;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EstudianteController extends Controller
{
    public function index()
    {
        $estudiantes = Estudiante::with(['user', 'carrera'])->get();
        return response()->json($estudiantes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'carrera_id' => 'required|exists:carreras,id',
            'codigo_estudiante' => 'required|string|unique:estudiantes',
            'documento_identidad' => 'required|string|unique:estudiantes',
            'fecha_nacimiento' => 'nullable|date',
            'telefono' => 'nullable|string',
            'direccion' => 'nullable|string',
        ]);

        // Crear usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'estudiante',
            'active' => true,
        ]);

        // Crear estudiante
        $estudiante = Estudiante::create([
            'user_id' => $user->id,
            'carrera_id' => $request->carrera_id,
            'codigo_estudiante' => $request->codigo_estudiante,
            'documento_identidad' => $request->documento_identidad,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
        ]);

        return response()->json($estudiante->load(['user', 'carrera']), 201);
    }

    public function show($id)
    {
        $estudiante = Estudiante::with(['user', 'carrera', 'inscripciones.grupo.materia'])->findOrFail($id);
        return response()->json($estudiante);
    }

    public function update(Request $request, $id)
    {
        $estudiante = Estudiante::findOrFail($id);

        $request->validate([
            'carrera_id' => 'exists:carreras,id',
            'codigo_estudiante' => 'string|unique:estudiantes,codigo_estudiante,' . $id,
            'documento_identidad' => 'string|unique:estudiantes,documento_identidad,' . $id,
            'fecha_nacimiento' => 'nullable|date',
            'telefono' => 'nullable|string',
            'direccion' => 'nullable|string',
        ]);

        $estudiante->update($request->all());

        return response()->json($estudiante->load(['user', 'carrera']));
    }

    public function destroy($id)
    {
        $estudiante = Estudiante::findOrFail($id);
        $user = $estudiante->user;

        $estudiante->delete();
        $user->delete();

        return response()->json([
            'message' => 'Estudiante eliminado exitosamente'
        ]);
    }
}
