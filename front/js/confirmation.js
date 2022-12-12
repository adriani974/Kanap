//Récupèratioon de l'id
let orderId = new URLSearchParams(window.location.search).get("id");

let id_order = document.getElementById("orderId");
id_order.textContent = orderId;