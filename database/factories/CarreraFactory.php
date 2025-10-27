<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CarreraFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->randomElement([
                'Desarrollo de Software',
                'Redes y Telecomunicaciones',
                'Administración de Empresas',
                'Contabilidad',
                'Marketing Digital',
                'Enfermería',
                'Gastronomía',
                'Diseño Gráfico'
            ]),
            'descripcion' => fake()->paragraph(),
            'duracion_semestres' => fake()->numberBetween(4, 6),
            'activo' => true,
        ];
    }
}
