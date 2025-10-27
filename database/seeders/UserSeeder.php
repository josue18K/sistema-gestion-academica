<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuarios administradores
        User::create([
            'name' => 'Administrador Principal',
            'email' => 'admin@sistema.com',
            'password' => Hash::make('password'),
            'role' => 'administrador',
            'active' => true,
        ]);

        // Crear usuarios docentes
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => 'Docente ' . $i,
                'email' => 'docente' . $i . '@sistema.com',
                'password' => Hash::make('password'),
                'role' => 'docente',
                'active' => true,
            ]);
        }

        // Crear usuarios estudiantes
        for ($i = 1; $i <= 50; $i++) {
            User::create([
                'name' => 'Estudiante ' . $i,
                'email' => 'estudiante' . $i . '@sistema.com',
                'password' => Hash::make('password'),
                'role' => 'estudiante',
                'active' => true,
            ]);
        }
    }
}
