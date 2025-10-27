<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CarreraSeeder::class,
            SemestreSeeder::class,
            MateriaSeeder::class,
            UserSeeder::class,
            DocenteSeeder::class,
            EstudianteSeeder::class,
            GrupoSeeder::class,
            InscripcionSeeder::class,
            TareaSeeder::class,
        ]);
    }
}
