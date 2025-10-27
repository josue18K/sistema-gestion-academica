<?php

namespace Database\Factories;

use App\Models\Estudiante;
use App\Models\Grupo;
use Illuminate\Database\Eloquent\Factories\Factory;

class InscripcionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'estudiante_id' => Estudiante::factory(),
            'grupo_id' => Grupo::factory(),
            'fecha_inscripcion' => fake()->dateTimeBetween('-6 months', 'now'),
            'estado' => fake()->randomElement(['activo', 'retirado', 'finalizado']),
        ];
    }
}
