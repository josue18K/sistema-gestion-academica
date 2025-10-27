<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntregaTarea extends Model
{
    use HasFactory;

    protected $table = 'entregas_tareas';

    protected $fillable = [
        'tarea_id',
        'estudiante_id',
        'fecha_entrega',
        'archivo_url',
        'comentarios',
        'calificacion',
        'retroalimentacion'
    ];

    protected $casts = [
        'fecha_entrega' => 'datetime',
        'calificacion' => 'decimal:2',
    ];

    // Relaciones
    public function tarea()
    {
        return $this->belongsTo(Tarea::class);
    }

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class);
    }
}
