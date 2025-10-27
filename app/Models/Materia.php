<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;

    protected $fillable = [
        'semestre_id',
        'nombre',
        'codigo',
        'descripcion',
        'creditos',
        'horas_semanales'
    ];

    // Relaciones
    public function semestre()
    {
        return $this->belongsTo(Semestre::class);
    }

    public function grupos()
    {
        return $this->hasMany(Grupo::class);
    }
}
