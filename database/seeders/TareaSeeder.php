<?php

namespace Database\Seeders;

use App\Models\Tarea;
use App\Models\Grupo;
use Illuminate\Database\Seeder;

class TareaSeeder extends Seeder
{
    public function run(): void
    {
        $grupos = Grupo::all();

        foreach ($grupos as $grupo) {
            // Crear 3-5 tareas por grupo
            for ($i = 1; $i <= rand(3, 5); $i++) {
                $fechaAsignacion = now()->subDays(rand(10, 60));

                Tarea::create([
                    'grupo_id' => $grupo->id,
                    'titulo' => 'Tarea ' . $i . ' - ' . $grupo->materia->nombre,
                    'descripcion' => 'Descripción de la tarea ' . $i,
                    'fecha_asignacion' => $fechaAsignacion,
                    'fecha_entrega' => $fechaAsignacion->copy()->addDays(rand(7, 14)),
                    'puntaje_maximo' => rand(10, 20),
                    'archivo_adjunto' => null,
                ]);
            }
        }
    }
}
