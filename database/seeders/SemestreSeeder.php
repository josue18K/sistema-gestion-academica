<?php

namespace Database\Seeders;

use App\Models\Carrera;
use App\Models\Semestre;
use Illuminate\Database\Seeder;

class SemestreSeeder extends Seeder
{
    public function run(): void
    {
        $carreras = Carrera::all();

        foreach ($carreras as $carrera) {
            for ($i = 1; $i <= $carrera->duracion_semestres; $i++) {
                Semestre::create([
                    'carrera_id' => $carrera->id,
                    'numero_semestre' => $i,
                    'nombre' => 'Semestre ' . $i,
                ]);
            }
        }
    }
}
