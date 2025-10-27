<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Docente;
use Illuminate\Database\Seeder;

class DocenteSeeder extends Seeder
{
    public function run(): void
    {
        $usuariosDocentes = User::where('role', 'docente')->get();

        $especialidades = [
            'Programación',
            'Base de Datos',
            'Redes',
            'Matemáticas',
            'Inglés',
            'Desarrollo Web',
            'Desarrollo Móvil',
            'Seguridad Informática'
        ];

        foreach ($usuariosDocentes as $index => $user) {
            Docente::create([
                'user_id' => $user->id,
                'codigo_docente' => 'DOC' . sprintf('%04d', $index + 1),
                'especialidad' => $especialidades[array_rand($especialidades)],
                'documento_identidad' => '7' . sprintf('%07d', 1000000 + $index),
                'telefono' => '9' . sprintf('%08d', 10000000 + $index),
            ]);
        }
    }
}
