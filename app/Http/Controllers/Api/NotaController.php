<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nota;
use Illuminate\Http\Request;

class NotaController extends Controller
{
    public function index()
    {
        $notas = Nota::with([
            'inscripcion.estudiante.user',
            'inscripcion.grupo.materia'
        ])->get();

        return response()->json($notas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'inscripcion_id' => 'required|exists:inscripciones,id',
            'tipo_evaluacion' => 'required|string|max:255',
            'nota' => 'required|numeric|min:0|max:20',
            'porcentaje' => 'required|numeric|min:0|max:100',
            'fecha_evaluacion' => 'required|date',
            'observaciones' => 'nullable|string',
        ]);

        $nota = Nota::create($request->all());

        return response()->json($nota->load([
            'inscripcion.estudiante.user',
            'inscripcion.grupo.materia'
        ]), 201);
    }

    public function show($id)
    {
        $nota = Nota::with([
            'inscripcion.estudiante.user',
            'inscripcion.grupo.materia'
        ])->findOrFail($id);

        return response()->json($nota);
    }

    public function update(Request $request, $id)
    {
        $nota = Nota::findOrFail($id);

        $request->validate([
            'tipo_evaluacion' => 'string|max:255',
            'nota' => 'numeric|min:0|max:20',
            'porcentaje' => 'numeric|min:0|max:100',
            'fecha_evaluacion' => 'date',
            'observaciones' => 'nullable|string',
        ]);

        $nota->update($request->all());

        return response()->json($nota->load([
            'inscripcion.estudiante.user',
            'inscripcion.grupo.materia'
        ]));
    }

    public function destroy($id)
    {
        $nota = Nota::findOrFail($id);
        $nota->delete();

        return response()->json([
            'message' => 'Nota eliminada exitosamente'
        ]);
    }

    // Obtener notas por inscripción
    public function byInscripcion($inscripcionId)
    {
        $notas = Nota::where('inscripcion_id', $inscripcionId)
            ->orderBy('fecha_evaluacion', 'desc')
            ->get();

        return response()->json($notas);
    }

    // Calcular promedio de un estudiante en una inscripción
    public function calcularPromedio($inscripcionId)
    {
        $notas = Nota::where('inscripcion_id', $inscripcionId)->get();

        if ($notas->isEmpty()) {
            return response()->json([
                'promedio' => 0,
                'mensaje' => 'No hay notas registradas'
            ]);
        }

        $promedioFinal = 0;
        foreach ($notas as $nota) {
            $promedioFinal += ($nota->nota * $nota->porcentaje) / 100;
        }

        return response()->json([
            'promedio' => round($promedioFinal, 2),
            'notas' => $notas
        ]);
    }
}
