<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('estudiantes')->onDelete('cascade');
            $table->foreignId('grupo_id')->constrained('grupos')->onDelete('cascade');
            $table->date('fecha_inscripcion');
            $table->enum('estado', ['activo', 'retirado', 'finalizado'])->default('activo');
            $table->timestamps();

            $table->unique(['estudiante_id', 'grupo_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscripciones');
    }
};
