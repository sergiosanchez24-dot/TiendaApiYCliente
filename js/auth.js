// auth.js - maneja login y guardado en localStorage
const API_LOGIN = 'php/login.php'; // endpoint login del servidor
const form = document.getElementById('loginForm'); // form login
const msg = document.getElementById('msg'); // area mensajes

form.addEventListener('submit', async (e) => { // evento submit
  e.preventDefault(); // evitamos recarga
  const username = document.getElementById('username').value; // tomamos usuario
  const password = document.getElementById('password').value; // tomamos contraseña

  try {
    const res = await fetch(API_LOGIN, { // peticion POST al servidor
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username,password})
    });
    const data = await res.json(); // parse JSON
    if(!res.ok) { msg.textContent = data.error || 'Error'; return; } // mostramos error
    // Guardamos token y tienda en localStorage
    localStorage.setItem('token', data.token); // token para autenticacion
    localStorage.setItem('store', JSON.stringify(data.store)); // guardamos tienda completa
    // Inicializamos carrito y productos vistos si no existen
    if(!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([])); // carrito vacio
    if(!localStorage.getItem('productos_vistos')) localStorage.setItem('productos_vistos', JSON.stringify([])); // vistos
    window.location.href = 'dashboard.html'; // redirigimos al dashboard
  } catch(err) {
    console.error(err); // log servidor
    msg.textContent = 'Error de conexión'; // mensaje al usuario
  }
});
