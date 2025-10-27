<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grupos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materia_id')->constrained('materias')->onDelete('cascade');
            $table->foreignId('docente_id')->constrained('docentes')->onDelete('cascade');
            $table->string('nombre_grupo');
            $table->integer('cupo_maximo')->default(30);
            $table->string('horario')->nullable();
            $table->string('aula')->nullable();
            $table->year('anio');
            $table->enum('periodo', ['primer_semestre', 'segundo_semestre'])->default('primer_semestre');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grupos');
    }
};
