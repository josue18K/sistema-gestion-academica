<?php

namespace Database\Factories;

use App\Models\Grupo;
use Illuminate\Database\Eloquent\Factories\Factory;

class TareaFactory extends Factory
{
    public function definition(): array
    {
        $fechaAsignacion = fake()->dateTimeBetween('-2 months', 'now');
        $fechaEntrega = fake()->dateTimeBetween($fechaAsignacion, '+2 weeks');

        return [
            'grupo_id' => Grupo::factory(),
            'titulo' => fake()->sentence(4),
            'descripcion' => fake()->paragraph(),
            'fecha_asignacion' => $fechaAsignacion,
            'fecha_entrega' => $fechaEntrega,
            'puntaje_maximo' => fake()->randomElement([10, 15, 20, 25]),
            'archivo_adjunto' => fake()->optional()->url(),
        ];
    }
}
