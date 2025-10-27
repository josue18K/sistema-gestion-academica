<?php

namespace Database\Factories;

use App\Models\Carrera;
use Illuminate\Database\Eloquent\Factories\Factory;

class SemestreFactory extends Factory
{
    public function definition(): array
    {
        $numero = fake()->numberBetween(1, 6);

        return [
            'carrera_id' => Carrera::factory(),
            'numero_semestre' => $numero,
            'nombre' => 'Semestre ' . $numero,
        ];
    }
}
