<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carrera;
use Illuminate\Http\Request;

class CarreraController extends Controller
{
    public function index()
    {
        $carreras = Carrera::with('semestres')->where('activo', true)->get();
        return response()->json($carreras);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'duracion_semestres' => 'required|integer|min:1',
            'activo' => 'boolean',
        ]);

        $carrera = Carrera::create($request->all());

        return response()->json($carrera, 201);
    }

    public function show($id)
    {
        $carrera = Carrera::with(['semestres.materias', 'estudiantes'])->findOrFail($id);
        return response()->json($carrera);
    }

    public function update(Request $request, $id)
    {
        $carrera = Carrera::findOrFail($id);

        $request->validate([
            'nombre' => 'string|max:255',
            'descripcion' => 'nullable|string',
            'duracion_semestres' => 'integer|min:1',
            'activo' => 'boolean',
        ]);

        $carrera->update($request->all());

        return response()->json($carrera);
    }

    public function destroy($id)
    {
        $carrera = Carrera::findOrFail($id);
        $carrera->delete();

        return response()->json([
            'message' => 'Carrera eliminada exitosamente'
        ]);
    }
}
