<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tarea;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    public function index()
    {
        $tareas = Tarea::with([
            'grupo.materia',
            'grupo.docente.user'
        ])->get();

        return response()->json($tareas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'grupo_id' => 'required|exists:grupos,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha_asignacion' => 'required|date',
            'fecha_entrega' => 'required|date|after:fecha_asignacion',
            'puntaje_maximo' => 'required|numeric|min:0',
            'archivo_adjunto' => 'nullable|string',
        ]);

        $tarea = Tarea::create($request->all());

        return response()->json($tarea->load([
            'grupo.materia',
            'grupo.docente.user'
        ]), 201);
    }

    public function show($id)
    {
        $tarea = Tarea::with([
            'grupo.materia',
            'grupo.docente.user',
            'entregas.estudiante.user'
        ])->findOrFail($id);

        return response()->json($tarea);
    }

    public function update(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);

        $request->validate([
            'titulo' => 'string|max:255',
            'descripcion' => 'string',
            'fecha_asignacion' => 'date',
            'fecha_entrega' => 'date|after:fecha_asignacion',
            'puntaje_maximo' => 'numeric|min:0',
            'archivo_adjunto' => 'nullable|string',
        ]);

        $tarea->update($request->all());

        return response()->json($tarea->load([
            'grupo.materia'
        ]));
    }

    public function destroy($id)
    {
        $tarea = Tarea::findOrFail($id);
        $tarea->delete();

        return response()->json([
            'message' => 'Tarea eliminada exitosamente'
        ]);
    }

    // Obtener tareas por grupo
    public function byGrupo($grupoId)
    {
        $tareas = Tarea::where('grupo_id', $grupoId)
            ->orderBy('fecha_entrega', 'asc')
            ->get();

        return response()->json($tareas);
    }
}
