<?php

namespace Database\Seeders;

use App\Models\Grupo;
use App\Models\Materia;
use App\Models\Docente;
use Illuminate\Database\Seeder;

class GrupoSeeder extends Seeder
{
    public function run(): void
    {
        $materias = Materia::all();
        $docentes = Docente::all();
        $grupos = ['A', 'B'];

        $horarios = [
            'Lunes y Miércoles 8:00-10:00',
            'Martes y Jueves 10:00-12:00',
            'Miércoles y Viernes 14:00-16:00',
            'Lunes y Viernes 16:00-18:00'
        ];

        foreach ($materias as $materia) {
            foreach ($grupos as $nombreGrupo) {
                Grupo::create([
                    'materia_id' => $materia->id,
                    'docente_id' => $docentes->random()->id,
                    'nombre_grupo' => $nombreGrupo,
                    'cupo_maximo' => 30,
                    'horario' => $horarios[array_rand($horarios)],
                    'aula' => 'Aula ' . rand(101, 505),
                    'anio' => 2025,
                    'periodo' => 'primer_semestre',
                ]);
            }
        }
    }
}
