<?php

namespace Database\Factories;

use App\Models\Semestre;
use Illuminate\Database\Eloquent\Factories\Factory;

class MateriaFactory extends Factory
{
    public function definition(): array
    {
        $materias = [
            'Programación I',
            'Programación II',
            'Base de Datos',
            'Desarrollo Web',
            'Estructuras de Datos',
            'Redes I',
            'Sistemas Operativos',
            'Matemáticas I',
            'Matemáticas II',
            'Inglés Técnico'
        ];

        return [
            'semestre_id' => Semestre::factory(),
            'nombre' => fake()->unique()->randomElement($materias),
            'codigo' => strtoupper(fake()->unique()->lexify('???-###')),
            'descripcion' => fake()->paragraph(),
            'creditos' => fake()->numberBetween(2, 4),
            'horas_semanales' => fake()->numberBetween(3, 6),
        ];
    }
}
