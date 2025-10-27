<?php

namespace Database\Seeders;

use App\Models\Inscripcion;
use App\Models\Estudiante;
use App\Models\Grupo;
use Illuminate\Database\Seeder;

class InscripcionSeeder extends Seeder
{
    public function run(): void
    {
        $estudiantes = Estudiante::all();
        $grupos = Grupo::all();

        foreach ($estudiantes as $estudiante) {
            // Cada estudiante se inscribe en 4-6 grupos aleatorios
            $gruposAleatorios = $grupos->random(rand(4, 6));

            foreach ($gruposAleatorios as $grupo) {
                // Verificar que no exista ya la inscripción
                $existe = Inscripcion::where('estudiante_id', $estudiante->id)
                    ->where('grupo_id', $grupo->id)
                    ->exists();

                if (!$existe) {
                    Inscripcion::create([
                        'estudiante_id' => $estudiante->id,
                        'grupo_id' => $grupo->id,
                        'fecha_inscripcion' => now()->subDays(rand(1, 60)),
                        'estado' => 'activo',
                    ]);
                }
            }
        }
    }
}
