<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    use HasFactory;

    protected $fillable = [
        'grupo_id',
        'titulo',
        'descripcion',
        'fecha_asignacion',
        'fecha_entrega',
        'puntaje_maximo',
        'archivo_adjunto'
    ];

    protected $casts = [
        'fecha_asignacion' => 'datetime',
        'fecha_entrega' => 'datetime',
        'puntaje_maximo' => 'decimal:2',
    ];

    // Relaciones
    public function grupo()
    {
        return $this->belongsTo(Grupo::class);
    }

    public function entregas()
    {
        return $this->hasMany(EntregaTarea::class);
    }
}
