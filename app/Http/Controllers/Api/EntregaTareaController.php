<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EntregaTarea;
use Illuminate\Http\Request;

class EntregaTareaController extends Controller
{
    public function index()
    {
        $entregas = EntregaTarea::with([
            'tarea.grupo.materia',
            'estudiante.user'
        ])->get();

        return response()->json($entregas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tarea_id' => 'required|exists:tareas,id',
            'estudiante_id' => 'required|exists:estudiantes,id',
            'fecha_entrega' => 'required|date',
            'archivo_url' => 'nullable|string',
            'comentarios' => 'nullable|string',
        ]);

        // Verificar que no exista ya la entrega
        $existe = EntregaTarea::where('tarea_id', $request->tarea_id)
            ->where('estudiante_id', $request->estudiante_id)
            ->exists();

        if ($existe) {
            return response()->json([
                'message' => 'Ya existe una entrega para esta tarea'
            ], 422);
        }

        $entrega = EntregaTarea::create($request->all());

        return response()->json($entrega->load([
            'tarea',
            'estudiante.user'
        ]), 201);
    }

    public function show($id)
    {
        $entrega = EntregaTarea::with([
            'tarea.grupo.materia',
            'estudiante.user'
        ])->findOrFail($id);

        return response()->json($entrega);
    }

    public function update(Request $request, $id)
    {
        $entrega = EntregaTarea::findOrFail($id);

        $request->validate([
            'fecha_entrega' => 'date',
            'archivo_url' => 'nullable|string',
            'comentarios' => 'nullable|string',
            'calificacion' => 'nullable|numeric|min:0',
            'retroalimentacion' => 'nullable|string',
        ]);

        $entrega->update($request->all());

        return response()->json($entrega->load([
            'tarea',
            'estudiante.user'
        ]));
    }

    public function destroy($id)
    {
        $entrega = EntregaTarea::findOrFail($id);
        $entrega->delete();

        return response()->json([
            'message' => 'Entrega eliminada exitosamente'
        ]);
    }

    // Calificar una entrega
    public function calificar(Request $request, $id)
    {
        $entrega = EntregaTarea::findOrFail($id);

        $request->validate([
            'calificacion' => 'required|numeric|min:0',
            'retroalimentacion' => 'nullable|string',
        ]);

        $entrega->update([
            'calificacion' => $request->calificacion,
            'retroalimentacion' => $request->retroalimentacion,
        ]);

        return response()->json($entrega);
    }

    // Obtener entregas por tarea
    public function byTarea($tareaId)
    {
        $entregas = EntregaTarea::with('estudiante.user')
            ->where('tarea_id', $tareaId)
            ->orderBy('fecha_entrega', 'desc')
            ->get();

        return response()->json($entregas);
    }

    // Obtener entregas por estudiante
    public function byEstudiante($estudianteId)
    {
        $entregas = EntregaTarea::with('tarea.grupo.materia')
            ->where('estudiante_id', $estudianteId)
            ->orderBy('fecha_entrega', 'desc')
            ->get();

        return response()->json($entregas);
    }
}
