<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    use HasFactory;

    protected $fillable = [
        'materia_id',
        'docente_id',
        'nombre_grupo',
        'cupo_maximo',
        'horario',
        'aula',
        'anio',
        'periodo'
    ];

    // Relaciones
    public function materia()
    {
        return $this->belongsTo(Materia::class);
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class);
    }

    public function tareas()
    {
        return $this->hasMany(Tarea::class);
    }
}
