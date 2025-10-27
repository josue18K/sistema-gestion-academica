<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asistencia;
use Illuminate\Http\Request;

class AsistenciaController extends Controller
{
    public function index()
    {
        $asistencias = Asistencia::with([
            'inscripcion.estudiante.user',
            'inscripcion.grupo.materia'
        ])->get();

        return response()->json($asistencias);
    }

    public function store(Request $request)
    {
        $request->validate([
            'inscripcion_id' => 'required|exists:inscripciones,id',
            'fecha' => 'required|date',
            'estado' => 'required|in:presente,ausente,tardanza,justificado',
            'observaciones' => 'nullable|string',
        ]);

        $asistencia = Asistencia::create($request->all());

        return response()->json($asistencia->load([
            'inscripcion.estudiante.user',
            'inscripcion.grupo.materia'
        ]), 201);
    }

    public function show($id)
    {
        $asistencia = Asistencia::with([
            'inscripcion.estudiante.user',
            'inscripcion.grupo.materia'
        ])->findOrFail($id);

        return response()->json($asistencia);
    }

    public function update(Request $request, $id)
    {
        $asistencia = Asistencia::findOrFail($id);

        $request->validate([
            'fecha' => 'date',
            'estado' => 'in:presente,ausente,tardanza,justificado',
            'observaciones' => 'nullable|string',
        ]);

        $asistencia->update($request->all());

        return response()->json($asistencia->load([
            'inscripcion.estudiante.user',
            'inscripcion.grupo.materia'
        ]));
    }

    public function destroy($id)
    {
        $asistencia = Asistencia::findOrFail($id);
        $asistencia->delete();

        return response()->json([
            'message' => 'Asistencia eliminada exitosamente'
        ]);
    }

    // Obtener asistencias por inscripción
    public function byInscripcion($inscripcionId)
    {
        $asistencias = Asistencia::where('inscripcion_id', $inscripcionId)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json($asistencias);
    }

    // Registrar asistencia masiva para un grupo en una fecha
    public function registrarMasivo(Request $request)
    {
        $request->validate([
            'grupo_id' => 'required|exists:grupos,id',
            'fecha' => 'required|date',
            'asistencias' => 'required|array',
            'asistencias.*.inscripcion_id' => 'required|exists:inscripciones,id',
            'asistencias.*.estado' => 'required|in:presente,ausente,tardanza,justificado',
        ]);

        $asistenciasCreadas = [];

        foreach ($request->asistencias as $item) {
            $asistencia = Asistencia::create([
                'inscripcion_id' => $item['inscripcion_id'],
                'fecha' => $request->fecha,
                'estado' => $item['estado'],
                'observaciones' => $item['observaciones'] ?? null,
            ]);

            $asistenciasCreadas[] = $asistencia;
        }

        return response()->json([
            'message' => 'Asistencias registradas exitosamente',
            'asistencias' => $asistenciasCreadas
        ], 201);
    }
}
