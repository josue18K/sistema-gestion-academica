<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Carrera;
use Illuminate\Database\Eloquent\Factories\Factory;

class EstudianteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->estudiante(),
            'carrera_id' => Carrera::factory(),
            'codigo_estudiante' => 'EST' . fake()->unique()->numberBetween(10000, 99999),
            'documento_identidad' => fake()->unique()->numerify('########'),
            'fecha_nacimiento' => fake()->date('Y-m-d', '-18 years'),
            'telefono' => fake()->phoneNumber(),
            'direccion' => fake()->address(),
        ];
    }
}
