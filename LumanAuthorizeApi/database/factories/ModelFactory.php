<?php
$factory->define(App\Models\Author::class, function (Facker\Generator $facker) {
    return [
        'gender' => $gender = $facker->randomElement(['male', 'female']),
        'name' => $facker->name($gender),
        'country' => $facker->country()
    ];
});