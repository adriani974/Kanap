
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
   
    product.appendChild(elementHtml_a(sofa));
}

/**
 * Crée un element html de type 'a' qui permettra de renvoyer l'utilisateur sur la page produit correspondant .
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 * @return { any } Une balise html de type a.
 */
function elementHtml_a(sofa){
    const element_a = document.createElement("a");
    
    element_a.setAttribute("href","./product.html?id="+sofa.getID());
    element_a.appendChild(elementHtml_article(sofa));

    return element_a;
}

/**
 * Crée un element html de type 'article' qui contiendra l'image, le nom ainsi que la description du produit.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 * @return { any } Une balise html de type article.
 */
function elementHtml_article(sofa){
    const element_article = document.createElement("article");

    element_article.appendChild(elementHtml_img(sofa));
    element_article.appendChild(elementHtml_h3(sofa));
    element_article.appendChild(elementHtml_p(sofa));

    return element_article;
}

/**
 * Crée un element html de type 'img' contenant l'image du produit.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 * @return { any } Une balise html de type img.
 */
function elementHtml_img(sofa){
    const element_img = document.createElement("img");

    element_img.setAttribute("src", sofa.getImageURL());
    element_img.setAttribute("alt", sofa.getAltTxt());

    return element_img;
}

/**
 * Crée un element html de type 'h3' contenant le nom du produit.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 * @return { any } Une balise html de type h3.
 */
function elementHtml_h3(sofa){
    const element_h3 = document.createElement("h3");
    const textFor_h3 = document.createTextNode(sofa.getName());

    element_h3.classList.add("productName");
    element_h3.appendChild(textFor_h3);

    return element_h3;
}

/**
 * Crée un element html de type 'p' contenant la description du produit.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 * @return { any } Une balise html de type p.
 */
function elementHtml_p(sofa){
    const element_p = document.createElement("p");
    const textFor_p = document.createTextNode(sofa.getDescription());

    element_p.classList.add("productDescription");
    element_p.appendChild(textFor_p);
    return element_p;
}
 
let allProducts = connectToApiForAllProducts();
