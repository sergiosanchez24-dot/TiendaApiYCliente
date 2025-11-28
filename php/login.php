<?php
// login.php - recibe usuario y contraseña por POST y devuelve token + tienda
header('Content-Type: application/json'); // header JSON
$USERS_FILE = __DIR__ . '/../usuarios.json'; // ruta a usuarios.json
$STORE_FILE = __DIR__ . '/../tienda.json'; // ruta a tienda.json
$SECRET_TOKEN = 'MI_TOKEN_PRIVADO_2025'; // token simple del servidor

$input = json_decode(file_get_contents('php://input'), true); // leemos JSON recibido
if(!$input || !isset($input['username']) || !isset($input['password'])) {
  http_response_code(400); // bad request
  echo json_encode(['error'=>'Credenciales incompletas']); // respuesta de error
  exit;
}

$username = $input['username']; // usuario recibido
$password = $input['password']; // contraseña recibida

$users = json_decode(file_get_contents($USERS_FILE), true); // cargamos usuarios
$found = false; // flag busqueda
foreach($users as $u) {
  if($u['username']==$username && $u['password']==$password) { $found = true; break; } // comparamos
}

if(!$found) {
  http_response_code(401); // no autorizado
  echo json_encode(['error'=>'Credenciales invalidas']); // respuesta
  exit;
}

// Si es correcto devolvemos token y la tienda
$store = json_decode(file_get_contents($STORE_FILE), true); // cargamos tienda
echo json_encode(['token'=>$SECRET_TOKEN,'store'=>$store]); // enviamos token y tienda
