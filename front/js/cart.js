let str = window.location.href;
let url = new URL(str);
let get_id = url.searchParams.get("id");
let get_color = url.searchParams.get("color");
let get_quantity = url.searchParams.get("quantity");

console.log("post_id : "+get_id);
console.log("post_colors : "+get_color);
console.log("post_quantity : "+get_quantity);

