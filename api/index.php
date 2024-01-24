<?php

require_once 'database.php';
require_once 'requestHandler.php';


$db = new Database();
$requestHandler = new RequestHandler($db);
$requestHandler->handleRequest();