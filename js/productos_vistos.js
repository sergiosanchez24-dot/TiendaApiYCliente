// Este archivo puede usarse para enviar al servidor la lista de productos vistos
async function sendViewedToServer(){ // envia productos vistos al endpoint
  const arr = JSON.parse(localStorage.getItem('productos_vistos')||'[]'); // obtenemos vistos
  const token = localStorage.getItem('token'); // token
  try {
    await fetch('../api/productos_vistos.php', {method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body: JSON.stringify({productos:arr})}); // enviamos
  } catch(e){ console.warn('No se pudo enviar productos vistos'); } // no crítico
}
