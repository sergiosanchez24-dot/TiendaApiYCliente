<?php
// productos_vistos.php - endpoint para recibir lista de productos vistos (opcional)
header('Content-Type: application/json'); // header JSON
$SECRET_TOKEN = 'MI_TOKEN_PRIVADO_2025'; // token simple
$headers = getallheaders();
if(!isset($headers['Authorization'])) { http_response_code(401); echo json_encode(['error'=>'Token faltante']); exit; } // verificar token
$token = trim(str_replace('Bearer','',$headers['Authorization']));
if($token !== $SECRET_TOKEN) { http_response_code(403); echo json_encode(['error'=>'Token invalido']); exit; } // token invalido

$input = json_decode(file_get_contents('php://input'), true); // leemos JSON recibido
// En este ejemplo guardamos en un archivo local (en entornos reales usar BD)
if(!$input || !isset($input['productos'])) { echo json_encode(['ok'=>true,'msg'=>'No hay productos']); exit; }
file_put_contents(__DIR__.'/../productos_vistos_server.json', json_encode($input['productos'])); // guardamos visto
echo json_encode(['ok'=>true]); // respuesta OK
