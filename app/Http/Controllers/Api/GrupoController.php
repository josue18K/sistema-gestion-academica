<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grupo;
use Illuminate\Http\Request;

class GrupoController extends Controller
{
    public function index()
    {
        $grupos = Grupo::with(['materia.semestre.carrera', 'docente.user'])->get();
        return response()->json($grupos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'materia_id' => 'required|exists:materias,id',
            'docente_id' => 'required|exists:docentes,id',
            'nombre_grupo' => 'required|string|max:255',
            'cupo_maximo' => 'required|integer|min:1',
            'horario' => 'nullable|string',
            'aula' => 'nullable|string',
            'anio' => 'required|integer',
            'periodo' => 'required|in:primer_semestre,segundo_semestre',
        ]);

        $grupo = Grupo::create($request->all());

        return response()->json($grupo->load(['materia', 'docente']), 201);
    }

    public function show($id)
    {
        $grupo = Grupo::with([
            'materia.semestre.carrera',
            'docente.user',
            'inscripciones.estudiante.user'
        ])->findOrFail($id);

        return response()->json($grupo);
    }

    public function update(Request $request, $id)
    {
        $grupo = Grupo::findOrFail($id);

        $request->validate([
            'materia_id' => 'exists:materias,id',
            'docente_id' => 'exists:docentes,id',
            'nombre_grupo' => 'string|max:255',
            'cupo_maximo' => 'integer|min:1',
            'horario' => 'nullable|string',
            'aula' => 'nullable|string',
            'anio' => 'integer',
            'periodo' => 'in:primer_semestre,segundo_semestre',
        ]);

        $grupo->update($request->all());

        return response()->json($grupo->load(['materia', 'docente']));
    }

    public function destroy($id)
    {
        $grupo = Grupo::findOrFail($id);
        $grupo->delete();

        return response()->json([
            'message' => 'Grupo eliminado exitosamente'
        ]);
    }
}
