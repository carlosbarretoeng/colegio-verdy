<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'avatar_url' => 'https://ui-avatars.com/api/?name=Admin',
        ]);

        User::create([
            'name' => 'Professor João',
            'email' => 'professor@example.com',
            'password' => Hash::make('password123'),
            'role' => 'teacher',
            'avatar_url' => 'https://ui-avatars.com/api/?name=Professor+Joao',
        ]);

        User::create([
            'name' => 'Aluno Maria',
            'email' => 'aluno@example.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'avatar_url' => 'https://ui-avatars.com/api/?name=Aluno+Maria',
        ]);
    }
}
