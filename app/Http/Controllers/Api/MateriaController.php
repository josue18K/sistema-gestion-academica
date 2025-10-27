<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    public function index()
    {
        $materias = Materia::with(['semestre.carrera'])->get();
        return response()->json($materias);
    }

    public function store(Request $request)
    {
        $request->validate([
            'semestre_id' => 'required|exists:semestres,id',
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string|unique:materias',
            'descripcion' => 'nullable|string',
            'creditos' => 'required|integer|min:1',
            'horas_semanales' => 'required|integer|min:1',
        ]);

        $materia = Materia::create($request->all());

        return response()->json($materia->load('semestre'), 201);
    }

    public function show($id)
    {
        $materia = Materia::with(['semestre.carrera', 'grupos.docente'])->findOrFail($id);
        return response()->json($materia);
    }

    public function update(Request $request, $id)
    {
        $materia = Materia::findOrFail($id);

        $request->validate([
            'semestre_id' => 'exists:semestres,id',
            'nombre' => 'string|max:255',
            'codigo' => 'string|unique:materias,codigo,' . $id,
            'descripcion' => 'nullable|string',
            'creditos' => 'integer|min:1',
            'horas_semanales' => 'integer|min:1',
        ]);

        $materia->update($request->all());

        return response()->json($materia->load('semestre'));
    }

    public function destroy($id)
    {
        $materia = Materia::findOrFail($id);
        $materia->delete();

        return response()->json([
            'message' => 'Materia eliminada exitosamente'
        ]);
    }
}
