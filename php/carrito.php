<?php
// carrito.php - valida precios del carrito para prevenir manipulacion
header('Content-Type: application/json'); // header JSON
$STORE_FILE = __DIR__ . '/../tienda.json'; // ruta a tienda.json
$SECRET_TOKEN = 'MI_TOKEN_PRIVADO_2025'; // token simple del servidor

$headers = getallheaders(); // obtenemos headers
if(!isset($headers['Authorization'])) { http_response_code(401); echo json_encode(['error'=>'Token faltante']); exit; } // control token
$token = trim(str_replace('Bearer','',$headers['Authorization'])); // limpiamos token
if($token !== $SECRET_TOKEN) { http_response_code(403); echo json_encode(['error'=>'Token invalido']); exit; } // token invalido

$input = json_decode(file_get_contents('php://input'), true); // leemos carrito enviado
if(!$input || !isset($input['cart'])) { http_response_code(400); echo json_encode(['error'=>'Carrito no enviado']); exit; } // control

$cart = $input['cart']; // carrito
$store = json_decode(file_get_contents($STORE_FILE), true); // tienda original
$productsIndex = [];
foreach($store['productos'] as $p) { $productsIndex[$p['id']] = $p; } // indice por id

$totalServer = 0.0; // total calculado en servidor
foreach($cart as $item) {
  if(!isset($productsIndex[$item['id']])) { http_response_code(400); echo json_encode(['error'=>'Producto desconocido: ' . $item['id']]); exit; } // producto no existe
  $serverPrice = $productsIndex[$item['id']]['precio']; // precio servidor
  if($serverPrice != $item['precio']) { http_response_code(409); echo json_encode(['error'=>'Precio manipulado en producto: ' . $item['id']]); exit; } // diferencia precio
  $totalServer += $serverPrice * $item['cantidad']; // suma total
}

echo json_encode(['ok'=>true,'total'=>$totalServer]); // si todo correcto devolvemos total
