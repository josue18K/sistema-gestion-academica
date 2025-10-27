<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Estudiante;
use App\Models\Carrera;
use Illuminate\Database\Seeder;

class EstudianteSeeder extends Seeder
{
    public function run(): void
    {
        $usuariosEstudiantes = User::where('role', 'estudiante')->get();
        $carreras = Carrera::all();

        foreach ($usuariosEstudiantes as $index => $user) {
            Estudiante::create([
                'user_id' => $user->id,
                'carrera_id' => $carreras->random()->id,
                'codigo_estudiante' => 'EST' . sprintf('%05d', 10000 + $index),
                'documento_identidad' => '4' . sprintf('%07d', 5000000 + $index),
                'fecha_nacimiento' => now()->subYears(rand(18, 25))->format('Y-m-d'),
                'telefono' => '9' . sprintf('%08d', 50000000 + $index),
                'direccion' => 'Dirección ' . ($index + 1),
            ]);
        }
    }
}
