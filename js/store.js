// store.js - carga datos de la tienda desde localStorage y pinta UI
// comprobar si existe token (no redirigimos automáticamente para permitir modo invitado)
function hasAuth() {
  return !!localStorage.getItem('token');
}

// intentamos cargar la tienda desde localStorage; si no existe, la cargaremos desde tienda.json
let store = JSON.parse(localStorage.getItem('store') || 'null'); // cargamos tienda guardada o null
const featuredEl = document.getElementById('featured'); // contenedor destacados
const catsEl = document.getElementById('categories'); // contenedor categorias

function createCard(product) { // crea tarjeta de producto
  const el = document.createElement('div'); el.className='card'; // elemento tarjeta
  el.innerHTML = `
    <img src="${product.imagen}" alt="${product.nombre}" /> <!-- imagen -->
    <h3>${product.nombre}</h3> <!-- nombre -->
    <p>${product.descripcion}</p> <!-- descripcion -->
    <div class="kv"><div class="price">€ ${product.precio}</div><button class="btn" data-id="${product.id}">Añadir</button></div>
  `; // estructura
  el.querySelector('button').addEventListener('click', ()=> addToCart(product)); // añadir al carrito
  el.querySelector('img').addEventListener('click', ()=> { // click en imagen abre ficha producto
    saveViewed(product.id); // guardamos producto visto
    location.href = 'product.html?id=' + product.id; // redirigimos a ficha
  });
  return el; // devolvemos el DOM
}

function saveViewed(id) { // guardamos producto visto en localStorage
  const key = 'productos_vistos'; // clave localStorage
  let vistos = JSON.parse(localStorage.getItem(key) || '[]'); // array actuales
  vistos = vistos.filter(x=>x!==id); // eliminamos si ya existe
  vistos.unshift(id); // insertamos al inicio
  if(vistos.length>6) vistos.pop(); // limitamos a 6
  localStorage.setItem(key, JSON.stringify(vistos)); // guardamos
}

function render() { // pinta la UI
  // if there are no products, try to inform present containers (safely)
  if(!store || !store.productos) {
    if (featuredEl) featuredEl.innerHTML = 'No hay datos';
    if (catsEl) catsEl.innerHTML = '';
    return;
  }

  // only update featured / categories if the corresponding elements exist on the page
  if (featuredEl) {
    featuredEl.innerHTML = '';
    // destacados
    store.productos.filter(p=>p.destacado).forEach(p=> featuredEl.appendChild(createCard(p))); // añadimos destacados
  }

  if (catsEl) {
    catsEl.innerHTML = '';
    // categorias
    (store.categorias || []).forEach(cat=>{ // por cada categoria
      const box = document.createElement('div'); box.className='card'; // tarjeta categoria
      box.innerHTML = `<h3>${cat.nombre}</h3><button class="btn secondary" data-cat="${cat.id}">Ver</button>`; // contenido
      box.querySelector('button').addEventListener('click', ()=> { // click ver categoria
        localStorage.setItem('filter_cat', cat.id); // guardamos filtro
        location.href='categories.html'; // redirigimos
      });
      catsEl.appendChild(box); // añadimos al DOM
    });
  }
}

// Inicializamos: si no había tienda en localStorage la cargamos desde el JSON de la app
function initStore() {
  if(!store || !store.productos) {
    // fetch fallback (permite ver la tienda en modo invitado)
    fetch('tienda.json')
      .then(r => r.json())
      .then(json => {
        store = json;
        try { localStorage.setItem('store', JSON.stringify(store)); } catch(e) { console.warn('localStorage completo o bloqueado', e); }
        render();
      })
      .catch(err => {
        console.error('No se pudo cargar tienda.json', err);
        render();
      });
  } else {
    render();
  }
}

initStore(); // arrancamos

/* ------- product page logic (moved from product.html) ------- */
if (document.body && location.pathname.endsWith('product.html')) {
  (async function(){
    // ensure store is available (try localStorage first, then fallback)
    let s = store || JSON.parse(localStorage.getItem('store') || 'null');
    if(!s || !s.productos){
      try { const r = await fetch('tienda.json'); s = await r.json(); } catch(e){ console.error('No se pudo cargar tienda.json', e); }
    }
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get('id'));
    const p = (s && s.productos || []).find(x => x.id === id);
    const el = document.getElementById('productDetail');
    if (p && el) {
      el.innerHTML = `\n    <div class="card">\n      <img src="${p.imagen}" alt="${p.nombre}" />\n      <h2>${p.nombre}</h2>\n      <p>${p.descripcion}</p>\n      <div class="kv"><div class="price">€ ${p.precio}</div><button class="btn" id="add">Añadir al carrito</button></div>\n    </div>\n  `;
      document.getElementById('add')?.addEventListener('click', () => addToCart(p));
      saveViewed && saveViewed(p.id);
    } else if (el) {
      el.innerHTML = 'Producto no encontrado';
    }

    // cart button
    document.getElementById('cartBtn')?.addEventListener('click', () => location.href = 'cart.html');
  })();
}

/* ------- categories page logic (moved from categories.js) ------- */
if (document.body && location.pathname.endsWith('categories.html')) {
  (async function(){
    const catId = parseInt(localStorage.getItem('filter_cat')); // id categoria desde dashboard (parse int)
    const productsEl = document.getElementById('products'); // contenedor

    // load store if missing
    let s = store || JSON.parse(localStorage.getItem('store') || 'null');
    if(!s || !s.productos) {
      try { const r = await fetch('tienda.json'); s = await r.json(); } catch(e){ console.error('No se pudo cargar tienda.json', e); }
    }

    const catTitle = document.getElementById('catTitle');
    if (!s || !s.productos) {
      productsEl.innerHTML = '<div style="padding:20px;color:#e6d5c9">No hay datos de la tienda. Intenta recargar o inicia sesión para obtener la tienda.</div>';
      return;
    }

    if (!catId) {
      catTitle.textContent = 'Categoría no seleccionada';
      productsEl.innerHTML = '<div style="padding:20px;color:#e6d5c9">Selecciona una categoría desde el Dashboard.</div>';
      return;
    }

    const categoria = (s.categorias || []).find(c => c.id === catId);
    if (categoria) catTitle.textContent = 'Categoría — ' + categoria.nombre;
    const prods = s.productos.filter(p => p.id_categoria === catId); // filtramos por número
    if (prods.length === 0) {
      productsEl.innerHTML = '<div style="padding:20px;color:#e6d5c9">No hay productos en esta categoría.</div>';
    } else {
      prods.forEach(p => productsEl.appendChild(createCard(p))); // usamos createCard de store.js
    }

    // cart button (category page)
    document.getElementById('cartBtn')?.addEventListener('click', () => location.href = 'cart.html');
  })();
}
