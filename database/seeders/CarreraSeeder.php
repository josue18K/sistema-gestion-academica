<?php

namespace Database\Seeders;

use App\Models\Carrera;
use Illuminate\Database\Seeder;

class CarreraSeeder extends Seeder
{
    public function run(): void
    {
        $carreras = [
            [
                'nombre' => 'Desarrollo de Software',
                'descripcion' => 'Carrera técnica enfocada en el desarrollo de aplicaciones web y móviles',
                'duracion_semestres' => 6,
                'activo' => true,
            ],
            [
                'nombre' => 'Redes y Telecomunicaciones',
                'descripcion' => 'Carrera técnica especializada en infraestructura de redes',
                'duracion_semestres' => 6,
                'activo' => true,
            ],
            [
                'nombre' => 'Administración de Empresas',
                'descripcion' => 'Carrera técnica en gestión empresarial',
                'duracion_semestres' => 5,
                'activo' => true,
            ],
            [
                'nombre' => 'Contabilidad',
                'descripcion' => 'Carrera técnica en contabilidad y finanzas',
                'duracion_semestres' => 5,
                'activo' => true,
            ],
        ];

        foreach ($carreras as $carrera) {
            Carrera::create($carrera);
        }
    }
}
