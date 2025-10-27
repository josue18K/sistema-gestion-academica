<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entregas_tareas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tarea_id')->constrained('tareas')->onDelete('cascade');
            $table->foreignId('estudiante_id')->constrained('estudiantes')->onDelete('cascade');
            $table->dateTime('fecha_entrega');
            $table->text('archivo_url')->nullable();
            $table->text('comentarios')->nullable();
            $table->decimal('calificacion', 5, 2)->nullable();
            $table->text('retroalimentacion')->nullable();
            $table->timestamps();

            $table->unique(['tarea_id', 'estudiante_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entregas_tareas');
    }
};
