<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocenteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->docente(),
            'codigo_docente' => 'DOC' . fake()->unique()->numberBetween(1000, 9999),
            'especialidad' => fake()->randomElement([
                'Programación',
                'Bases de Datos',
                'Redes',
                'Matemáticas',
                'Administración',
                'Contabilidad',
                'Marketing'
            ]),
            'documento_identidad' => fake()->unique()->numerify('########'),
            'telefono' => fake()->phoneNumber(),
        ];
    }
}
