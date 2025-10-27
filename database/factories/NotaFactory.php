<?php

namespace Database\Factories;

use App\Models\Inscripcion;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'inscripcion_id' => Inscripcion::factory(),
            'tipo_evaluacion' => fake()->randomElement(['parcial', 'final', 'tarea', 'proyecto', 'quiz']),
            'nota' => fake()->randomFloat(2, 0, 20),
            'porcentaje' => fake()->randomElement([10, 15, 20, 25, 30]),
            'fecha_evaluacion' => fake()->dateTimeBetween('-3 months', 'now'),
            'observaciones' => fake()->optional()->sentence(),
        ];
    }
}
