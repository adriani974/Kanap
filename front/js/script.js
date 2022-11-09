const product = document.getElementById("items");

/**
 * essais de se connecter à l'api.
 * 
 */
function connectToApiProducts(){
fetch("http://localhost:3000/api/products")
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    })
    .then(function(value){
        addElement(value);
        console.log(value);
    })
    .catch(function(err){
        console.log("Une erreur c'est produite lors du chargements des produits :"+err);
    });
}

/**
 * Ajoute chaque element de products.
 * @param { any } value
 */
function addElement(value){
    let y = 500;
    let z = 0;
    for(let i in value){
         asyncCall(z, value[i]);
        z = z + y;
    }   
}

/**
 * Retourne une promise avec un delai.
 * @param { any } delay
 * @param { any } element
 * @return { Promise } 
 */
async function asyncCall(delay, element) {   
    return await delayBeforeCreateElement(delay, element);
}

/**
 * Retourne une promise avec un delai.
 * @param { any } delay
 * @param { any } element
 * @return { Promise } 
 */
function delayBeforeCreateElement(delay, element) {
    return new Promise(() => {
      setTimeout(() => {
        createElement(element);
      }, delay);
    });
} 

/**
 * Crée un element à partir des données de products.
 * @param { any } value
 */
function createElement(value){

const element_a = document.createElement("a");
const element_article = document.createElement("article");
const element_img = document.createElement("img");
const element_h3 = document.createElement("h3");
const element_p = document.createElement("p");

const textFor_h3 = document.createTextNode(value.name);
const textFor_p = document.createTextNode(value.description);

element_h3.classList.add("productName");
element_p.classList.add("productDescription");

element_a.setAttribute("href","./product.html?id="+value._id);
element_img.setAttribute("src", value.imageUrl);
element_img.setAttribute("alt", value.altTxt);


product.appendChild(element_a);
element_a.appendChild(element_article);
element_h3.appendChild(textFor_h3);
element_p.appendChild(textFor_p);
element_article.appendChild(element_img);
element_article.appendChild(element_h3);
element_article.appendChild(element_p);
}
 

let allProducts = connectToApiProducts();
