<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => fake()->randomElement(['administrador', 'docente', 'estudiante']),
            'active' => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function administrador(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'administrador',
        ]);
    }

    public function docente(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'docente',
        ]);
    }

    public function estudiante(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'estudiante',
        ]);
    }
}
