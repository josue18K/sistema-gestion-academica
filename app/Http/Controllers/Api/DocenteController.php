<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Docente;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DocenteController extends Controller
{
    public function index()
    {
        $docentes = Docente::with('user')->get();
        return response()->json($docentes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'codigo_docente' => 'required|string|unique:docentes',
            'especialidad' => 'nullable|string',
            'documento_identidad' => 'required|string|unique:docentes',
            'telefono' => 'nullable|string',
        ]);

        // Crear usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'docente',
            'active' => true,
        ]);

        // Crear docente
        $docente = Docente::create([
            'user_id' => $user->id,
            'codigo_docente' => $request->codigo_docente,
            'especialidad' => $request->especialidad,
            'documento_identidad' => $request->documento_identidad,
            'telefono' => $request->telefono,
        ]);

        return response()->json($docente->load('user'), 201);
    }

    public function show($id)
    {
        $docente = Docente::with(['user', 'grupos.materia'])->findOrFail($id);
        return response()->json($docente);
    }

    public function update(Request $request, $id)
    {
        $docente = Docente::findOrFail($id);

        $request->validate([
            'codigo_docente' => 'string|unique:docentes,codigo_docente,' . $id,
            'especialidad' => 'nullable|string',
            'documento_identidad' => 'string|unique:docentes,documento_identidad,' . $id,
            'telefono' => 'nullable|string',
        ]);

        $docente->update($request->all());

        return response()->json($docente->load('user'));
    }

    public function destroy($id)
    {
        $docente = Docente::findOrFail($id);
        $user = $docente->user;

        $docente->delete();
        $user->delete();

        return response()->json([
            'message' => 'Docente eliminado exitosamente'
        ]);
    }
}
