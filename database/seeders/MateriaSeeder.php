<?php

namespace Database\Seeders;

use App\Models\Semestre;
use App\Models\Materia;
use Illuminate\Database\Seeder;

class MateriaSeeder extends Seeder
{
    public function run(): void
    {
        $materiasPorCarrera = [
            'Desarrollo de Software' => [
                1 => ['Introducción a la Programación', 'Matemáticas I', 'Inglés Técnico I'],
                2 => ['Programación Orientada a Objetos', 'Base de Datos I', 'Inglés Técnico II'],
                3 => ['Estructuras de Datos', 'Base de Datos II', 'Desarrollo Web I'],
                4 => ['Algoritmos Avanzados', 'Desarrollo Web II', 'Desarrollo Móvil I'],
                5 => ['Arquitectura de Software', 'Desarrollo Móvil II', 'Metodologías Ágiles'],
                6 => ['Proyecto Final', 'Seguridad Informática', 'Cloud Computing'],
            ],
            'Redes y Telecomunicaciones' => [
                1 => ['Fundamentos de Redes', 'Matemáticas I', 'Electricidad Básica'],
                2 => ['Redes LAN', 'Sistemas Operativos', 'Cableado Estructurado'],
                3 => ['Redes WAN', 'Protocolos de Red', 'Seguridad de Redes I'],
                4 => ['Redes Inalámbricas', 'Administración de Servidores', 'Seguridad de Redes II'],
                5 => ['Telefonía IP', 'Redes Convergentes', 'Virtualización'],
                6 => ['Proyecto Final', 'Administración de Redes', 'Cloud Networking'],
            ],
        ];

        $carreras = \App\Models\Carrera::whereIn('nombre', array_keys($materiasPorCarrera))->get();

        foreach ($carreras as $carrera) {
            $semestres = $carrera->semestres;

            foreach ($semestres as $semestre) {
                $numeroSemestre = $semestre->numero_semestre;

                if (isset($materiasPorCarrera[$carrera->nombre][$numeroSemestre])) {
                    foreach ($materiasPorCarrera[$carrera->nombre][$numeroSemestre] as $index => $nombreMateria) {
                        Materia::create([
                            'semestre_id' => $semestre->id,
                            'nombre' => $nombreMateria,
                            'codigo' => strtoupper(substr($carrera->nombre, 0, 3)) . '-' . $numeroSemestre . sprintf('%02d', $index + 1),
                            'descripcion' => 'Materia del semestre ' . $numeroSemestre,
                            'creditos' => rand(3, 4),
                            'horas_semanales' => rand(4, 6),
                        ]);
                    }
                }
            }
        }
    }
}
