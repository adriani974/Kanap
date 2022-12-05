var id_product = getIdFromUrlParams();
var select_colors = null;
var valueColor = null;
/**
 * Récupére l'identifiant du produit à partir de l'adresse url de la page.
 * @return { any } id du produit.
 */
function getIdFromUrlParams(){
    let str = window.location.href;
    let url = new URL(str);
    return url.searchParams.get("id");   
}

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
 * Essais de se connecter à l'api products et récupère un produit à partir de son id.
 */
function connectToApiForOneProduct(){
    fetch("http://localhost:3000/api/products/"+id_product)
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(value){
            updateInformations(new ProductSofa(value));
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
 * Met à jour les informations sur le produit selectionner à partir de la page d'acceuil.
 * @param { ProductSofa } sofa Un modèle de produit de type sofa.
 */
function updateInformations(sofa){
    updateDiv_img(sofa);
    updateDiv_titlePrice(sofa);
    updateDiv_description(sofa);
    updateDiv_color(sofa);
    updateDiv_addButton();
}

/**
 * Met à jour les informations pour la div contenant l'image du produit.
 * @param { ProductSofa } sofa Un modèle de produit de type sofa.
 */
function updateDiv_img(sofa){
    //Récupèrent les éléments html à partir de leur id.
    const item_img = document.getElementsByClassName("item__img");
    const element_img = document.createElement("img");

    //modifie les attributs
    element_img.setAttribute("src", sofa.getImageURL());
    element_img.setAttribute("alt", sofa.getAltTxt());

    //ajoute les balises enfants aux balises parents concernée
    item_img[0].appendChild(element_img);
}

/**
 * Met à jour les informations pour la div contenant le titre ainsi que le prix du produit.
 * @param { ProductSofa } sofa Un modèle de produit de type sofa.
 */
function updateDiv_titlePrice(sofa){
    //Récupèrent les éléments html à partir de leur id.
    const h1_title = document.getElementById("title");
    const span_price = document.getElementById("price");

    //Insert un texte entre les balises concernés
    const title = document.createTextNode(sofa.getName());
    const price = document.createTextNode(sofa.getPrice());

    //ajoute les balises enfants aux balises parents concernée
    h1_title.appendChild(title);
    span_price.appendChild(price);
}

/**
 * Met à jour les informations pour la div portant sur la description du produit.
 * @param { ProductSofa } sofa Un modèle de produit de type sofa.
 */
function updateDiv_description(sofa){
    const p_description = document.getElementById("description");
    const description = document.createTextNode(sofa.getDescription());
    p_description.appendChild(description);
}

/**
 * Met à jour les informations pour la div correspondant aux choix de couleurs pour le produit.
 * @param { ProductSofa } sofa Un modèle de produit de type sofa.
 */
function updateDiv_color(sofa){
    select_colors = document.getElementById("colors");
    const array_colors = sofa.getColors();
    let text = null;
    let element_option = [];

    // Rajoutent les données sur les couleurs aux balises options.
    for(let i in array_colors){
        text =  document.createTextNode(array_colors[i]);
        element_option[i] = document.createElement("option");
        element_option[i].setAttribute("value", array_colors[i]);
        element_option[i].appendChild(text);
        select_colors.appendChild(element_option[i]);
    }

    // Ajoute un écouteur d'évènement au dropdown list afin de récupérer la valeur selectionné.
    select_colors.addEventListener("click",function(event){    
        valueColor = select_colors.options[select_colors.selectedIndex].value;
        event.stopPropagation();
    }, false);
}

/**
 * Ajoute un écouteur d'événement au bouton afin de valider les informations et passez à la page suivante.
 */
function updateDiv_addButton(){
    const button_addToCart = document.getElementById("addToCart");

    //un écouteur d'évenement pour le button
    button_addToCart.addEventListener("click",function(event){
        conditionValidation();
        event.stopPropagation();
    }, false);
}

/**
 * Recoit la valeur de quantity.
 */
function getQuantity(){
    return document.getElementById("quantity").value;   
}

/**
 * Met à jour la valeur de quantity.
 */
function setQuantity(){
    document.getElementById("quantity").value = 0;   
}

/**
 * Effectue des vérifications afin de vérifier si les champs colors et quantity ont été correctement rempli par l'utilisateur.
 */
function conditionValidation(){
    if (select_colors.value == ""){
        messageInformations(1);

    }else if( getQuantity() > 100 || getQuantity() == 0){
        messageInformations(0);
        setQuantity();

    }else{
        goToTheNextPage(); 
    }
    
}

/**
 * Ajoute le produit au localStorage puis dirige l'utilisateur vers la page suivante.
 */
function goToTheNextPage(){  
    addProductIntoLocalStorage();
    window.location = "./cart.html";
}

/**
 * Ajoute le produit au localStorage.
 */
function addProductIntoLocalStorage(){
    let manageLocalStorage = new ManageLocalStorage();
    //manageLocalStorage.deleteAllDataInLocalStorage();/*
    manageLocalStorage.setProductKey(id_product);
    manageLocalStorage.getLocalStorageProducts();
    manageLocalStorage.addItemIntoProductList(id_product, valueColor, getQuantity());
    manageLocalStorage.setLocalStorageProducts();
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
                if(newQuantity > 100){
                    newQuantity = 100;
                    this.productList[i].quantity = newQuantity;
                }else if(newQuantity < 1){
                    newQuantity = 1;
                    this.productList[i].quantity = newQuantity;
                }else{
                    this.productList[i].quantity = newQuantity;
                }
                
                console.log("item new quantity : "+this.productList[i].quantity);
                return false;
            }
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

let product = connectToApiForOneProduct();
    