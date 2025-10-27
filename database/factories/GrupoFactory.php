<?php

namespace Database\Factories;

use App\Models\Materia;
use App\Models\Docente;
use Illuminate\Database\Eloquent\Factories\Factory;

class GrupoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'materia_id' => Materia::factory(),
            'docente_id' => Docente::factory(),
            'nombre_grupo' => fake()->randomElement(['A', 'B', 'C', 'D']),
            'cupo_maximo' => fake()->numberBetween(25, 35),
            'horario' => fake()->randomElement([
                'Lunes y Miércoles 8:00-10:00',
                'Martes y Jueves 10:00-12:00',
                'Miércoles y Viernes 14:00-16:00',
                'Lunes y Viernes 16:00-18:00'
            ]),
            'aula' => 'Aula ' . fake()->numberBetween(101, 505),
            'anio' => fake()->numberBetween(2024, 2025),
            'periodo' => fake()->randomElement(['primer_semestre', 'segundo_semestre']),
        ];
    }
}
