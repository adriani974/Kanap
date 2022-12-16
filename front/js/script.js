
/**
 * Classe modélisant les produits de type sofa.
 * @param { object } sofa modèle de sofa.
 */
class ProductSofa{
    constructor(_sofa){
        this.sofa = _sofa;
    }

    /**
     * Retourne un tableau de type String contenant les différents couleur disponible pour le sofa.
     * @return { Array } Les differents couleurs disponible.
     */
    getColors(){return this.sofa.colors;}

    /**
     * Retourne l'identifiant du sofa.
     * @return { String } L'identifiant.
     */
    getID(){return this.sofa._id;}

    /**
     * Retourne le nom du sofa.
     * @return { String } Le nom.
     */
    getName(){return this.sofa.name;}

    /**
     * Retourne le prix du sofa.
     * @return { Number } Le prix.
     */
    getPrice(){return this.sofa.price;}

    /**
     * Retourne l'image du sofa.
     * @return { String } L'image.
     */
    getImageURL(){return this.sofa.imageUrl;}

    /**
     * Retourne la description du sofa.
     * @return { String } La description.
     */
    getDescription(){return this.sofa.description;}

    /**
     * Retourne le texte alternative associer à l'image du sofa.
     * @return { String } Le texte alternative.
     */
    getAltTxt(){return this.sofa.altTxt;}  
}

/**
 * Essais de se connecter à l'api products et récupèrent tous les produits de se dernier.
 * 
 */
async function connectToApiForAllProducts(){
    await fetch("http://localhost:3000/api/products")
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(value){
            addElementHtml(value);
        })
        .catch(function(err){
            messageInformations();
            console.log("Une erreur c'est produite lors du chargements des produits :"+err);
        });
}

/**
 * Affiche un message d'information à l'intention de l'utilisateur.
 * @param { int } number correspond au message que l'ont souhaite afficher.
 */
function messageInformations(number) {
    let message = "";
    switch (number) {
        case 0:
            message = "La quantité possible de produits selectionnable est compris entre 1 et 100, veuillez le modifiez afin de pouvoir l'ajouter au panier.";
            break;

        case 1:
            message = "Veuillez selectionnez une couleur";
            break;
        
        default:
            message = "Le chargement des produits à rencontrer un problème inattendu \n"+ 
                      "nous mettons tout en oeuvre pour résoudre ce problème.";
            break;
    }
    alert(message);
}

/**
 * Ajoute chaque element de products dans la page index.html.
 * @param { array } products Corresponds au produit de type canapé.
 */
function addElementHtml(products){
    let element = null;
  
    for(let i in products){
        element = products[i];
        createElementHtml(new ProductSofa(element));   
    }   
}

/**
 * Crée et assemble plusieurs composants html pour l'affichage d'un produit.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 */
function createElementHtml(sofa){
    const product = document.getElementById("items");
    const element_a = document.createElement("a");
    const element_article = document.createElement("article");
    const element_img = document.createElement("img");
    const element_h3 = document.createElement("h3");
    const element_p = document.createElement("p");

    const textFor_h3 = document.createTextNode(sofa.getName());
    const textFor_p = document.createTextNode(sofa.getDescription());

    element_p.classList.add("productDescription");
    element_h3.classList.add("productName"); 

    element_img.setAttribute("src", sofa.getImageURL());
    element_img.setAttribute("alt", sofa.getAltTxt());
    element_a.setAttribute("href","./product.html?id="+sofa.getID());

    element_p.appendChild(textFor_p);
    element_h3.appendChild(textFor_h3);
    element_article.appendChild(element_img);
    element_article.appendChild(element_h3);
    element_article.appendChild(element_p); 
    element_a.appendChild(element_article);
    product.appendChild(element_a);
}
/************************************************************************* */
let allProducts = connectToApiForAllProducts();
