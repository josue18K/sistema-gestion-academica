<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inscripcion;
use Illuminate\Http\Request;

class InscripcionController extends Controller
{
    public function index()
    {
        $inscripciones = Inscripcion::with([
            'estudiante.user',
            'estudiante.carrera',
            'grupo.materia',
            'grupo.docente.user'
        ])->get();

        return response()->json($inscripciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'estudiante_id' => 'required|exists:estudiantes,id',
            'grupo_id' => 'required|exists:grupos,id',
            'fecha_inscripcion' => 'required|date',
            'estado' => 'required|in:activo,retirado,finalizado',
        ]);

        // Verificar que no exista ya la inscripción
        $existe = Inscripcion::where('estudiante_id', $request->estudiante_id)
            ->where('grupo_id', $request->grupo_id)
            ->exists();

        if ($existe) {
            return response()->json([
                'message' => 'El estudiante ya está inscrito en este grupo'
            ], 422);
        }

        $inscripcion = Inscripcion::create($request->all());

        return response()->json($inscripcion->load([
            'estudiante.user',
            'grupo.materia'
        ]), 201);
    }

    public function show($id)
    {
        $inscripcion = Inscripcion::with([
            'estudiante.user',
            'grupo.materia.semestre.carrera',
            'grupo.docente.user',
            'asistencias',
            'notas'
        ])->findOrFail($id);

        return response()->json($inscripcion);
    }

    public function update(Request $request, $id)
    {
        $inscripcion = Inscripcion::findOrFail($id);

        $request->validate([
            'fecha_inscripcion' => 'date',
            'estado' => 'in:activo,retirado,finalizado',
        ]);

        $inscripcion->update($request->all());

        return response()->json($inscripcion->load([
            'estudiante.user',
            'grupo.materia'
        ]));
    }

    public function destroy($id)
    {
        $inscripcion = Inscripcion::findOrFail($id);
        $inscripcion->delete();

        return response()->json([
            'message' => 'Inscripción eliminada exitosamente'
        ]);
    }

    // Obtener inscripciones de un estudiante específico
    public function byEstudiante($estudianteId)
    {
        $inscripciones = Inscripcion::with([
            'grupo.materia.semestre',
            'grupo.docente.user'
        ])
        ->where('estudiante_id', $estudianteId)
        ->get();

        return response()->json($inscripciones);
    }

    // Obtener inscripciones de un grupo específico
    public function byGrupo($grupoId)
    {
        $inscripciones = Inscripcion::with([
            'estudiante.user',
            'estudiante.carrera'
        ])
        ->where('grupo_id', $grupoId)
        ->get();

        return response()->json($inscripciones);
    }
}
