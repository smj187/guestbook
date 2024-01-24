<?php

use Illuminate\Database\Eloquent\Model;

class Entry extends Model {
    protected $table = 'entries';
    protected $fillable = ['name', 'message'];
    public $timestamps = true; 
}