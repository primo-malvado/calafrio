<?php


$req = $_SERVER["REDIRECT_URL"];


//'\/fatima\/www\/tiles\/(?P<a>\d+)\/(?P<b>\d+)\/(?P<c>\d+)\.png'

preg_match('/\/fatima\/www\/tiles\/(?P<a>\d+)\/(?P<b>\d+)\/(?P<c>\d+)\.png/', $req, $matches);
 

$dir = "tiles/".$matches["a"]."/".$matches["b"];

;


if (!file_exists($dir)) {

    if (!mkdir($dir, 0777, true)) {
        die('Failed to create folders...');
    }
}

$url = "http://b.tile.openstreetmap.org/".$matches["a"]."/".$matches["b"]."/".$matches["c"].".png";

$content = file_get_contents($url);
//var_dump($content);


if ($content === false) {
    die('Failed to load image:'. $url);
}



file_put_contents($dir ."/".$matches["c"].".png", $content);

echo($content);
