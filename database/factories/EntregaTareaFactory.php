<?php

namespace Database\Factories;

use App\Models\Tarea;
use App\Models\Estudiante;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntregaTareaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tarea_id' => Tarea::factory(),
            'estudiante_id' => Estudiante::factory(),
            'fecha_entrega' => fake()->dateTimeBetween('-1 month', 'now'),
            'archivo_url' => fake()->url(),
            'comentarios' => fake()->optional()->paragraph(),
            'calificacion' => fake()->optional()->randomFloat(2, 0, 20),
            'retroalimentacion' => fake()->optional()->sentence(),
        ];
    }
}
