/**
 * Correspond au produit sofa.
 * 
 */
class ProductSofa{
    constructor(sofa){
        this.sofa = sofa;
    }

    getName(){return this.sofa.name;}

    getDescription(){return this.sofa.description;}

    getID(){return this.sofa._id;}

    getImageURL(){return this.sofa.imageUrl;}

    getAltTxt(){return this.sofa.altTxt;}

    getPrice(){return this.sofa.price;}
}

/**
 * essais de se connecter à l'api et récupèrent tous les éléments.
 * 
 */
function connectToApiForAllProducts(){
fetch("http://localhost:3000/api/products")
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    })
    .then(function(value){
        addElement(value);
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
        createElement(new ProductSofa(element));
      }, delay);
    });
} 

/**
 * Crée un ensemble de balises ainsi que leur mise à jour pour l'affichage html d'un produit.
 * @param { ProductSofa } sofa
 */
function createElement(sofa){
const product = document.getElementById("items");
const element_a = document.createElement("a");
const element_article = document.createElement("article");
const element_img = document.createElement("img");
const element_h3 = document.createElement("h3");
const element_p = document.createElement("p");

//Insert un texte entre les balises concernés
const textFor_h3 = document.createTextNode(sofa.getName());
const textFor_p = document.createTextNode(sofa.getDescription());

//ajoute une nouvelle classe
element_h3.classList.add("productName");
element_p.classList.add("productDescription");

//modifie les attributs
element_a.setAttribute("href","./product.html?id="+sofa.getID());
element_img.setAttribute("src", sofa.getImageURL());
element_img.setAttribute("alt", sofa.getAltTxt());

//ajoute l'enfant aux parents
product.appendChild(element_a);
element_a.appendChild(element_article);
element_h3.appendChild(textFor_h3);
element_p.appendChild(textFor_p);
element_article.appendChild(element_img);
element_article.appendChild(element_h3);
element_article.appendChild(element_p);
}
 

let allProducts = connectToApiForAllProducts();
