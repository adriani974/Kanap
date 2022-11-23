var id_product = null;
var sofa_product = null;

/**
 * Essais de se connecter à l'api products et récupère un produit à partir de son id.
 */
function connectToApiForOneProduct(_produit){
    let produit_color = null;
    let produit_quantity = null;
        
    fetch("http://localhost:3000/api/products/"+this.id_product)
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(value){
            this.sofa_product = new ProductSofa(value);
            for(let i = 0; i < _produit.length; i++){
                produit_color = _produit[i].color;
                produit_quantity = _produit[i].quantity;
                createElementHtml(new ProductSofa(value), produit_color, produit_quantity);
            }
            
            //console.log(this.sofa_product);
            console.log("--------------end-------thenfunction");
        })
        .catch(function(err){
            
            console.log("Une erreur c'est produite lors du chargements des produits :"+err);
        });
}

/**
 * Classe modélisant les produits de type sofa.
 * @param { object } sofa modèle de sofa.
 */
 class ProductSofa{
    constructor(_sofa){
        this.sofa = _sofa;
    }

    getName(){return this.sofa.name;}

    getDescription(){return this.sofa.description;}

    getID(){return this.sofa._id;}

    getImageURL(){return this.sofa.imageUrl;}

    getAltTxt(){return this.sofa.altTxt;}

    getPrice(){return this.sofa.price;}

    getColors(){return this.sofa.colors;}
}

/**
 * Classe permettant de gérer les données du localStorage.
 * @param { any } _id l'identifiant du produit.
 * @param { any } _color la couleur du produit.
 * @param { any } _quantity la quantité du produit.
 */
class ManageLocalStorage{
    productList = [];
    productAllList = [];
    productKey = "";
    constructor(){
        
    }

    /**
     * Efface toute les données contenue dans le localStorage.
     */
    deleteAllDataInLocalStorage(){localStorage.clear();}
    
    /**
    * Vérifie si le produit et la même couleur est déjà enregistrer dans le localStorage dans ce cas ont enregistre seulement la quantité.
    * @param { Array } item Correspond au produit actuel de la page.
    * @return { Boolean } Renvoie false si le même produit et la même couleur existe dans le localStorage sinon renvoie true.
    */
    checkSameIDAndColor(item){
        for (let i in this.productList) {
            if(this.productList[i].id == item.id && this.productList[i].color == item.color){
                let newQuantity = Number(this.productList[i].quantity) + Number(getQuantity());
                this.productList[i].quantity = newQuantity;
                console.log("item new quantity : "+this.productList[i].quantity);
                return false;
            }
            console.log("item id : "+this.productList[i].id);
            console.log("item color : "+this.productList[i].color);
            console.log("item quantity : "+this.productList[i].quantity);
        }
        return true;
    }

    /**
     * Ajoute le produit dans la liste.
     * @param { any } _id l'identifiant du produit.
     * @param { any } _color la couleur du produit.
     * @param { any } _quantity la quantité du produit.
     */
    addItemIntoProductList(_id, _color, _quantity){
        let item = {id: _id, color: _color, quantity: _quantity};
        
        if(this.checkSameIDAndColor(item)){
            this.productList.push(item);
        }
    }

    /**
     * Enregistre la liste actuel du produit dans le localStorage.
     */
    setLocalStorageProducts(){
        try { 
            let listProductsInPanier = JSON.stringify(this.productList);
            localStorage.setItem(this.productKey, listProductsInPanier);

        } catch (error) {
             console.log(" un erreur c'est produite lors du sauvegarde dans le localStorage "+error);
        }
        
    }

    /**
     * Modifie la variable productKey.
     * @param { String } _productKey  L'identifiant d'un produit.
     */
    setProductKey(_productKey){ this.productKey = _productKey;}

    
    /**
     * Récupère la liste du produit depuis le localStorage.
     */
    getLocalStorageProducts(){ 
        try {
            let getAllProducts = localStorage.getItem(this.productKey);
            if(getAllProducts != null){ 
                this.productList =  JSON.parse(getAllProducts);   
            }
        } catch (error) {
            console.log(" un erreur c'est produite lors du chargement du localStorage "+error);
        }   
    }

    /**
     * Récupèrent tous les données situé dans le localStorage.
     */
    getAllLocalStorage(){
        return this.productAllList = { ...localStorage };
    }

    /**
     * Retourne l'array productList.
     */
    getProductList(){ return this.productList;}

    /**
    * Retourne la variable productKey.
    * @return { String } L'identifiant d'un produit.
    */
    getProductKey(){ return this.productKey;}

    /**
    * Retire un produit de la liste.
    * @param { any } value  L'index du produit que l'ont souhaite retirer.
    */
    setLocalStorage_RemoveItem(value){localStorage.removeItem(value);}
   
    getLocalStorage_Length(){return localStorage.length;}


    getLocalStorage_key(value){return localStorage.key(value);}
}

/**
 * Crée et assemble plusieurs composants html pour l'affichage d'un produit.
 */
function createElementHtml(_sofa, _produit_color, _produit_quantity){
    const element_section = document.getElementById("cart__items");
    try {
        element_section.appendChild(elementHtml_Div__cartItem(_sofa, _produit_color, _produit_quantity));
    } catch (error) {
        console.log(" Une erreur détécter lors de la création d'élément html "+error);
    }   
}

/**
 * Crée un element html de type 'article' contenant l'image, le nom, la description et les options de modification du produit.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 */
function elementHtml_Div__cartItem(_sofa, _produit_color, _produit_quantity){
    const element_article = document.createElement("article");
    element_article.classList.add("cart__item");

    element_article.appendChild(elementHtml_Div__cartItem_img(_sofa));
    element_article.appendChild(elementHtml_Div__cartItem_content(_sofa, _produit_color, _produit_quantity));

    return element_article;
}

/**
 * Crée un element html de type 'img' pour l'image du produit.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 * @return { any } Une balise html de type div.
 */
 function elementHtml_Div__cartItem_img(_sofa){
    const element_div = document.createElement("div");
    const element_img = document.createElement("img");

    element_div.classList.add("cart__item__img");

    //modifie les attributs
    element_img.setAttribute("src", _sofa.getImageURL());
    element_img.setAttribute("alt", _sofa.getAltTxt());

    //ajoute les balises enfants aux balises parents concernée
    element_div.appendChild(element_img);

    return element_div;
}

/**
 * Crée un element html de type 'div' contenant la description du produit ainsi que la possibiliter de modifier sa quantité ou l'effacer.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 * @return { any } Une balise html de type div.
 */
function elementHtml_Div__cartItem_content(_sofa, _produit_color, _produit_quantity){
    const element_div = document.createElement("div");

    element_div.classList.add("cart__item__content");
    element_div.appendChild(elementHtml_Div__cartItem_contentDescription(_sofa, _produit_color));
    element_div.appendChild(elementHtml_Div__cartItem_contentSettings(_produit_quantity));

    return element_div;
}

/**
 * Crée un element html de type 'div' contenant la description du produit ainsi que la possibiliter de modifier sa quantité ou l'effacer.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 * @return { any } Une balise html de type div.
 */
function elementHtml_Div__cartItem_contentDescription(_sofa, _produit_color){
    const element_div = document.createElement("div");
    const element_h2 = document.createElement("h2");
    const element_p1 = document.createElement("p");
    const element_p2 = document.createElement("p");

    //Insert un texte entre les balises concernés
    const textFor_h2 = document.createTextNode(_sofa.getName());
    const textFor_p1 = document.createTextNode(_produit_color);
    const textFor_p2 = document.createTextNode(_sofa.getPrice()+" €");

    element_div.classList.add("cart__item__content__description");

    element_h2.appendChild(textFor_h2);
    element_p1.appendChild(textFor_p1);
    element_p2.appendChild(textFor_p2);
    element_div.appendChild(element_h2);
    element_div.appendChild(element_p1);
    element_div.appendChild(element_p2);

    return element_div;
}

/**
 * Crée un element html de type 'div' contenant la possibiliter de modifier sa quantité ou l'effacer .
 * @return { any } Une balise html de type div.
 */
function elementHtml_Div__cartItem_contentSettings(_produit_quantity){
    const element_div = document.createElement("div");

    element_div.classList.add("cart__item__content__settings");
    element_div.appendChild(elementHtml_Div__cartItem_contentSettings_quantity(_produit_quantity));
    element_div.appendChild(elementHtml_Div__cartItem_contentSettings_delete(_produit_quantity));

    return element_div;
}

/**
 * Crée un element html de type 'div' permettant de modifier la quantité actuel du produit selectionné .
 * @return { any } Une balise html de type div.
 */
function elementHtml_Div__cartItem_contentSettings_quantity(_produit_quantity){
    const element_div = document.createElement("div");
    const element_p = document.createElement("p");
    const element_input = document.createElement("input");

    element_div.classList.add("cart__item__content__settings__quantity");
    element_input.classList.add("itemQuantity");

    const textFor_p = document.createTextNode("Qté : ");

    //modifie les attributs
    element_input.setAttribute("type", "number");
    element_input.setAttribute("name", "itemQuantity");
    element_input.setAttribute("min", "1");
    element_input.setAttribute("max", "100");
    element_input.setAttribute("value", _produit_quantity);

    element_p.appendChild(textFor_p);
    element_div.appendChild(element_p);
    element_div.appendChild(element_input);

    return element_div;
}

/**
 * Crée un element html de type 'div' permettant de supprimé le produit actuel selectionné .
 * @return { any } Une balise html de type div.
 */
function elementHtml_Div__cartItem_contentSettings_delete(_produit_quantity){
    const element_div = document.createElement("div");
    const element_p = document.createElement("p");

    element_div.classList.add("cart__item__content__settings__delete");
    element_p.classList.add("deleteItem");

    const textFor_p = document.createTextNode("Supprimer");
    
    element_p.appendChild(textFor_p);
    element_div.appendChild(element_p);

    return element_div;
}

/**
 * Affichent tout les produits contenu dans le panier.
 * @param { ManageLocalStorage } _manageLocalStorage instance de la classe ManageLocalStorage.
 */
class LoadEveryProducts {
    constructor(_manageLocalStorage) {
        var fois = 1;
        let list = _manageLocalStorage.getAllLocalStorage();
        for (let id in list) {
            let produit = JSON.parse(list[id]);
            this.id_product = id;
            connectToApiForOneProduct(produit);
            //console.log(" list : "+id+" --> "+list[id]); 
            console.log(" --------------------iteration---------------- " + fois);
            //console.log(this.sofa_product);
            fois++;
        }
    }
}

let manageLocalStorage = new ManageLocalStorage();
//let loadEveryProducts = new LoadEveryProducts(manageLocalStorage);
var fois = 1;
let list = manageLocalStorage.getAllLocalStorage();
for (let id in list) {
    let produit = JSON.parse(list[id]);
    this.id_product = id;
    connectToApiForOneProduct(produit);
    //console.log(" list : "+id+" --> "+list[id]); 
    console.log(" --------------------iteration---------------- " + fois);
    //console.log(this.sofa_product);
    fois++;
}






