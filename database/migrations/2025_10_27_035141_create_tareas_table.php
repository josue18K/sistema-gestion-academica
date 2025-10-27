<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grupo_id')->constrained('grupos')->onDelete('cascade');
            $table->string('titulo');
            $table->text('descripcion');
            $table->dateTime('fecha_asignacion');
            $table->dateTime('fecha_entrega');
            $table->decimal('puntaje_maximo', 5, 2)->default(100);
            $table->text('archivo_adjunto')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tareas');
    }
};
