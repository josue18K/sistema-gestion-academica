<?php

namespace Database\Factories;

use App\Models\Inscripcion;
use Illuminate\Database\Eloquent\Factories\Factory;

class AsistenciaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'inscripcion_id' => Inscripcion::factory(),
            'fecha' => fake()->dateTimeBetween('-3 months', 'now'),
            'estado' => fake()->randomElement(['presente', 'ausente', 'tardanza', 'justificado']),
            'observaciones' => fake()->optional()->sentence(),
        ];
    }
}
