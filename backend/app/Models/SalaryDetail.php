<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaryDetail extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'salary_in_local_currency',
        'salary_in_euros',
        'commission',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['displayed_salary'];

    /**
     * Get the user's displayed salary.
     *
     * This accessor calculates the sum of salary in euros and the commission.
     */
    protected function displayedSalary(): Attribute
    {
        return Attribute::make(
            get: fn () => ($this->salary_in_euros ?? 0) + ($this->commission ?? 0),
        );
    }
}
