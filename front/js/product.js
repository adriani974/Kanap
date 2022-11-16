let id_product = null;
/**
 * essais de se connecter à l'api et récupère un seul élément.
 * 
 */
function connectToApiForOneProducts(){
let str = window.location.href;
let url = new URL(str);
id_product = url.searchParams.get("id");

    fetch("http://localhost:3000/api/products/"+id_product)
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(value){
            //console.log(value);
            addInformation(value);
            updateInformation(value);
        })
        .catch(function(err){
            console.log("Une erreur c'est produite lors du chargements des produits :"+err);
        });
    }

/**
 * Ajoute chaque element de products.
 * @param { any } value
 */
function addInformation(value){
    for(let i in value){
        console.log("addInformation: n°"+i+" ->"+value[i]); 
    }   
}

/**
 * Crée un element à partir des données de products.
 * @param { any } value
 */
function updateInformation(value){
const item_img = document.getElementsByClassName("item__img");

const h1_title = document.getElementById("title");
const p_description = document.getElementById("description");
const span_price = document.getElementById("price");
const select_colors = document.getElementById("colors");
const input_quantity = document.getElementById("quantity");
const button_addToCart = document.getElementById("addToCart");
const select_color = document.getElementsByName("color-select");

let valueColor = null;


const element_img = document.createElement("img");
// gestion du choix des couleurs
const array_colors = value.colors;
let text = null;
let element_option = [];
for(let i in array_colors){
 text =  document.createTextNode(array_colors[i]);
 element_option[i] = document.createElement("option");
 element_option[i].setAttribute("value", array_colors[i]);
 element_option[i].appendChild(text);
 select_colors.appendChild(element_option[i]);
}

select_colors.addEventListener("click",function(event){    
valueColor = select_colors.options[select_colors.selectedIndex].value;

    event.stopPropagation();
}, false);

let attribute_value = input_quantity.getAttribute('value');
let attribute_max = input_quantity.getAttribute('max');
let attribute_min = input_quantity.getAttribute('min');
let inputField_value = 0;

console.log("attribute_value: --> "+attribute_value);
console.log("attribute_max: --> "+attribute_max);
console.log("attribute_min: --> "+attribute_min);

input_quantity.addEventListener("click",function(event){
    updateQuantity();
    event.stopPropagation();
}, false);


function updateQuantity(){
    inputField_value = getQuantity();
    console.log("inputField_value: --> "+inputField_value);
}

//Correspond aux critères de validation requise pour les champs à renseigner.
function conditionValidation(){
    if( inputField_value > 100){
        MessageInformation();
        setQuantity();
    }else if ( inputField_value <= 0){
        MessageInformation2();
        setQuantity();
    }else if (select_colors.value == ""){
        MessageInformation4();
    }else{
       // MessageInformation3();
        updateButton(); 
    }
    
}

//recoit la valeur de quantity
function getQuantity(){
    return document.getElementById("quantity").value;   
}

//met à jour la valeur de quantity
function setQuantity(){
    document.getElementById("quantity").value = 0;   
}

function updateButton(){
    let post_id = id_product;
    let post_colors = valueColor;
    let post_quantity = getQuantity();
    console.log("post_id : "+post_id);
    console.log("post_colors : "+post_colors);
    console.log("post_quantity : "+post_quantity);
    
    window.location = "./cart.html?id="+post_id+"&color="+post_colors+"&quantity="+post_quantity;
}



//un écouteur d'évenement pour le button
button_addToCart.addEventListener("click",function(event){
    conditionValidation();
    event.stopPropagation();
}, false);

const title = document.createTextNode(value.name);
const description = document.createTextNode(value.description);
const price = document.createTextNode(value.price);

element_img.setAttribute("src", value.imageUrl);
element_img.setAttribute("alt", value.altTxt);

item_img[0].appendChild(element_img);
h1_title.appendChild(title);
p_description.appendChild(description);
span_price.appendChild(price);
}

function MessageInformation() {
    var msg="la quantité limite de produits selectionnable est de 100, veuillez le modifiez afin de pouvoir l'ajouter au panier.";
    console.log(msg)
    alert(msg);
}

function MessageInformation2() {
    var msg="la quantité limite de produits selectionnable ne peut-être inférieur ou égale à 0, veuillez le modifiez afin de pouvoir l'ajouter au panier.";
    console.log(msg)
    alert(msg);
}

function MessageInformation3() {
    var msg="tout est prêt !";
    console.log(msg)
    alert(msg);
}

function MessageInformation4() {
    var msg="Veuillez selectionnez une couleur";
    console.log(msg)
    alert(msg);
}

let allProducts = connectToApiForOneProducts();
    