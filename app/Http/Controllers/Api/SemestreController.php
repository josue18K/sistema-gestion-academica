<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Semestre;
use Illuminate\Http\Request;

class SemestreController extends Controller
{
    public function index()
    {
        $semestres = Semestre::with('carrera')->get();
        return response()->json($semestres);
    }

    public function store(Request $request)
    {
        $request->validate([
            'carrera_id' => 'required|exists:carreras,id',
            'nombre' => 'required|string|max:255',
            'numero_semestre' => 'required|integer|min:1',
        ]);

        $semestre = Semestre::create($request->all());

        return response()->json($semestre->load('carrera'), 201);
    }

    public function show($id)
    {
        $semestre = Semestre::with(['carrera', 'materias'])->findOrFail($id);
        return response()->json($semestre);
    }

    public function update(Request $request, $id)
    {
        $semestre = Semestre::findOrFail($id);

        $request->validate([
            'carrera_id' => 'exists:carreras,id',
            'nombre' => 'string|max:255',
            'numero_semestre' => 'integer|min:1',
        ]);

        $semestre->update($request->all());

        return response()->json($semestre->load('carrera'));
    }

    public function destroy($id)
    {
        $semestre = Semestre::findOrFail($id);
        $semestre->delete();

        return response()->json([
            'message' => 'Semestre eliminado exitosamente'
        ]);
    }
}
