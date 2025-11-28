// cart.js - funciones comunes de carrito (añadir, ver, enviar pedido)
function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); } // obtiene carrito
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); } // guarda carrito

function addToCart(product){ // añade producto al carrito
  const c = getCart(); // carrito actual
  const existing = c.find(i=>i.id===product.id); // buscamos si existe
  if(existing){ existing.cantidad += 1; } else { c.push({id:product.id,nombre:product.nombre,precio:product.precio,cantidad:1}); } // incrementamos o añadimos
  saveCart(c); // guardamos
  alert('Producto añadido al carrito'); // aviso simple
}

// Si estamos en cart.html, renderizamos contenido y permitimos comprar
if(document.body && location.pathname.endsWith('cart.html')) {
  const listEl = document.createElement('div'); listEl.id='cartList'; document.querySelector('main').appendChild(listEl); // contenedor
  function renderCart(){ // pinta carrito
    const c = getCart(); if(c.length===0){ listEl.innerHTML='<p>Carrito vacío</p>'; return; } // vacio
    listEl.innerHTML = ''; let total=0; // limpiar
    c.forEach(item=>{ // cada item
      const div = document.createElement('div'); div.className='card'; div.innerHTML=`<h3>${item.nombre}</h3><p>Cantidad: ${item.cantidad} - Precio: € ${item.precio}</p><div class="kv"><div>Subtotal: € ${item.cantidad*item.precio}</div></div>`; listEl.appendChild(div); total += item.cantidad*item.precio; }); // añadir
    const buy = document.createElement('button'); buy.textContent='Realizar pedido'; buy.className='btn'; buy.addEventListener('click', checkout); listEl.appendChild(document.createElement('hr')); listEl.appendChild(document.createTextNode('Total: € ' + total)); listEl.appendChild(document.createElement('br')); listEl.appendChild(buy); // boton compra
  }
  async function checkout(){ // envía carrito al servidor para validar precios
    const token = localStorage.getItem('token'); // token autenticacion
    const res = await fetch('../api/carrito.php', {method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body: JSON.stringify({cart:getCart()})}); // enviamos carrito
    const data = await res.json(); // parse
    if(!res.ok){ alert('Error: ' + (data.error||'No autorizado')); return; } // error
    alert('Pedido validado. Total: € ' + data.total); // ok
    localStorage.setItem('cart', JSON.stringify([])); // limpiamos carrito
    renderCart(); // re-render
  }
  renderCart(); // primera carga
}

// global handlers: logout + cart button (used on dashboard, cart and other pages)
document.getElementById('logout')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('store');
  localStorage.removeItem('cart');
  localStorage.removeItem('productos_vistos');
  window.location.href = 'login.html';
});

document.getElementById('cartBtn')?.addEventListener('click', () => location.href = 'cart.html');
