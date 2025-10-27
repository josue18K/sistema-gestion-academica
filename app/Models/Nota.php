<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    use HasFactory;

    protected $fillable = [
        'inscripcion_id',
        'tipo_evaluacion',
        'nota',
        'porcentaje',
        'fecha_evaluacion',
        'observaciones'
    ];

    protected $casts = [
        'nota' => 'decimal:2',
        'porcentaje' => 'decimal:2',
        'fecha_evaluacion' => 'date',
    ];

    // Relaciones
    public function inscripcion()
    {
        return $this->belongsTo(Inscripcion::class);
    }
}
