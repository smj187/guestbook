<?php

use Illuminate\Database\Capsule\Manager as Capsule;

require 'vendor/autoload.php';

class Database
{
    function __construct()
    {
        $capsule = new Capsule;

        // ensure sqlite file must exist
        $sqliteFile = '/var/www/html/database/database.sqlite';
        if (!file_exists($sqliteFile)) {
            touch($sqliteFile);
        }

        $capsule->addConnection([
            'driver' => 'sqlite',
            'database' => '/var/www/html/database/database.sqlite',
            'prefix' => '',
        ]);

        $capsule->setAsGlobal();
        $capsule->bootEloquent();

        $this->initialize();
    }

    private function initialize()
    {
        if (!Capsule::schema()->hasTable('entries')) {
            Capsule::schema()->create('entries', function ($table) {
                $table->increments('id');
                $table->string('name');
                $table->text('message');
                $table->timestamps();
            });
        }
    }
}
