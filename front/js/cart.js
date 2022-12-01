var id_product = null;
var sofa_product = null;
var item_product = null;
var listOfProducts = [];
var itemProductList = [];
var listOfID = [];
var totalPrice = 0;
var totalQuantity = 0;

/**
 * Essais de se connecter à l'api products et récupère un produit à partir de son id.
 * @param { any } _produit un modèle de produit issue de localStorage.
 * @param { any } _position correspond au tour actuel à l'intérieur d'une boucle.
 * @param { any } _positionFinal correspond au dernier tour à l'intérieur d'une boucle.
 */
function connectToApiForOneProduct(_produit, _position, _positionFinal){
    let produit_id = null;
    let produit_color = null;
    let produit_quantity = null;
    let produit_list = [];
   
    fetch("http://localhost:3000/api/products/"+this.id_product)
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(value){
            //Crée une instance de ProductSofa
            sofa_product = new ProductSofa(value);

            //Effectue une boucle afin de crée tous les éléments html pour chaque produit
            for(let i = 0; i < _produit.length; i++){
                produit_id = _produit[i].id;
                produit_color = _produit[i].color;
                produit_quantity = _produit[i].quantity;
                createElementHtml(sofa_product, produit_id, produit_color, produit_quantity);

                //Crée une instance de ProductItem que l'on ajoute ensuite au array produit_list
                item_product = new ProductItem(sofa_product.getName(), produit_id, produit_color, Number(produit_quantity), sofa_product.getPrice());
                produit_list.push(item_product);
            }

            //Ajoute l'identifiant du produit dans le tableau listOfID, ajoute le tableau produit_list au tableau itemProductList
            listOfID.push(produit_id);
            itemProductList.push(produit_list);
            produit_list.clear;

            //Une fois la condition exact, ont ajoute des écouteurs d'événements aux élements html conserné puis met à jour le prix final ainsi que la quantité.
            if(_position == _positionFinal){
                setTimeout(() => {
                    try {
                        addListenersToManageQuantity();
                        addListenersToManageDelete();
                        countTotalPrice();
                        updateTotalPrice();
                        updateTotalQuantity();
                    } catch (error) {
                        console.log("Une erreur c'est produite dans l'ecouteur de quantity :"+error);
                    } 
                  }, 1000) 
            }
        })
        .catch(function(err){    
            console.log("Une erreur c'est produite lors du chargements des produits :"+err);
        });
}

/**
 * Ajoutent des écouteurs d'évenement à chaque button modifiant la quantité du produit associer.
 */
function addListenersToManageQuantity(){
    //Récuperent tous les balises html ayant pour classe cart__item
    let button_quantity = document.querySelectorAll(".cart__item");

    //Pour chaque élément récuperer, j'ajoute un listener qui permettra d'executer l'action de modifier la quantité du produit concerner
    button_quantity.forEach((button_quantity)=>{
        button_quantity.addEventListener("change", (event) => {

            //Récupèrent l'id et la couleur issue des données dataset de l'élement
            let produit = button_quantity.closest("article");
            let produit_id = produit.dataset.id;
            let produit_color = produit.dataset.color;

            //Parcourent la liste des produits issue de l'api products
            for (const key in listOfProducts) {
                let product = JSON.parse(listOfProducts[key]);

                //Parcourent product afin de trouver le produit ayant le même id et color que celle récupérer juste en haut
                for (const key in product) {
                    if (product[key].id === produit_id && product[key].color === produit_color){
                        //console.log("product:id --> "+product[key].id);
                        //console.log("product:color --> "+product[key].color);
                    
                        if(event.target.value > 100){//Si la valeur actuel de la quantité est supérieur à 100, on l'initialisent à 100 puis on l'enregistre dans le localStorage
                            event.target.value = 100;
                            product[key].quantity = 100;
                            localStorage.setItem(produit_id, JSON.stringify(product));
                            updateQuantity(product[key].id, product[key].color, product[key].quantity);

                        }else if(event.target.value < 1){//Si la valeur actuel de la quantité est inférieur à 1, on l'initialisent à 1 puis on l'enregistre dans le localStorage
                            event.target.value = 1;
                            product[key].quantity = 1;
                            localStorage.setItem(produit_id, JSON.stringify(product));
                            updateQuantity(product[key].id, product[key].color, product[key].quantity);

                        }else{//Sinon on enregistre la valeur actuel dans le localStorage
                            product[key].quantity = Number(event.target.value);
                            localStorage.setItem(produit_id, JSON.stringify(product));
                            updateQuantity(product[key].id, product[key].color, product[key].quantity);
                        }   
                    }
                }
            }

            //initialisent les variables totalPrice et totalQuantity puis remet à jour les nouvelles données
            totalPrice = 0;
            totalQuantity = 0;
            countTotalPrice();
            updateTotalPrice();
            updateTotalQuantity();
        });
    });    
}

/**
 * Ajoutent des écouteurs d'évenement à chaque button pour supprimer le produit associer.
 */
function addListenersToManageDelete(){
    //Récuperent tous les balises html ayant pour classe cart__item et deleteItem
    let button_delete = document.querySelectorAll(".cart__item .deleteItem");

    //Pour chaque élément récuperer, j'ajoute un listener qui permettra d'executer l'action de supprimer le produit concerner
    for (let i = 0; i < button_delete.length; i++) {
        button_delete[i].addEventListener("click", () => {
             //récupèrent l'id et la couleur de l'élement
             let produit = button_delete[i].closest("article");
             let produit_id = produit.dataset.id;
             let produit_color = produit.dataset.color;

             //parcourent la liste des produits issue de l'api products
            for (const key in listOfProducts) {
                let product = JSON.parse(listOfProducts[key]);

                //parcourent product afin de trouver le produit ayant le même id et color que celle récupérer juste en haut
                for (const key in product) {
                    if (product[key].id === produit_id && product[key].color === produit_color){
                        //supprime le produit et met à jour la suppression dans la page html
                        updateDelete(produit, product[key].id, product[key].color);
                    }
                }
            }
        });
    }
}

/**
 * Met à jour la suppression d'un produit de la liste itemProductList.
 * @param { String } _id l'id du produit.
 * @param { String } _color la couleur du produit.
 */
 function updateDelete(_produit, _id, _color){
    
    //removeItemFromLocalStorage(_produit, _id, _color);
    removeItemFromListOfProduits();
    //removeItemFromHtml(_id, _color);
}

function removeItemFromLocalStorage(_id, _color){
    console.log("<-- removeItemFromLocalStorage -->");
    let position = 0;
    let items = localStorage.getItem(_id);
    let itemsJson = JSON.parse(items);
    let itemList = [];
    let itemListFinal = [];
    
    if(items.length == 1){// ont retire directement l'item de localStorage
        localStorage.removeItem(_id);
        console.log("items == 1 --> true");
    }else{
        //ont récupère la position de l'item
        for(let i = 0; i < itemsJson.length; i++){
            console.log(" items.color : "+itemsJson[i].color); 
            console.log(" _color : "+_color); 
            if(itemsJson[i].color === _color){//ont enregistrent tout les produits sauf celui que l'ont à supprimer.
                
                
                console.log(" ok ");   
            }else{
                itemListFinal.push(itemsJson[i]);
                console.log(" pas ok "); 
            }
            console.log(" itemlistfinal  --> "+i);
            console.log(itemListFinal);    
        }
       
        
        itemList.clear;

        //ont transforme la liste obtenue en format Json
        
        localStorage.setItem(_id, JSON.stringify(itemListFinal));

        console.log("item trouvé à la position --> "+position);
        console.log(JSON.stringify(itemListFinal));
      
        console.log("items != 1 --> true");
    }
    
}

function removeItemFromListOfProduits(_id, _color){
    console.log("itemProductList.length --> "+itemProductList.length);
    /*if(itemProductList.length == 1){
       
        console.log("items == 1 --> true");
    }else{
        //ont récupère la position de l'item
       
        console.log("items != 1 --> true");
    }*/
    itemProductList.forEach(element => {
        console.log(" element taille -->"+element.length);
        if(element.length == 1){
            if(produit.getID() == _id && produit.getColor() == _color){//ont additionnent tous les quantité des produits ayant la même id
                console.log("produit trouvé -> "+produit.getName());
                
            } 
        }else if (element.length > 1){
            /*
            element.forEach(produit => {
                console.log("name -> "+produit.getName());
                console.log("color -> "+produit.getColor());
                if(produit.getID() == _id && produit.getColor() == _color){//ont additionnent tous les quantité des produits ayant la même id
                    console.log("produit trouvé -> "+produit.getName());
                }     
            });*/
        }
        
    });
    
}

function removeItemFromHtml(_produit){
    _produit.remove();
}


/**
 * Additionnent tous les produits de la même catégorie pour avoir la quantité et le prix total de l'ensemble des produits
 */
function countTotalPrice(){
    let quantity = 0;
    let quantityList = [];
    let priceList = [];
    let price = 0;
    let newTotalPrice = 0;
    let positionId = 0;
    priceList.clear;
    quantityList.clear;
    //Pour chaque produit de chaque element de itemProductList on vérifie si l'identifiant du produit est la même que celle de listOfID
    itemProductList.forEach(element => {
        //console.log(" element taille -->"+element.length);
        element.forEach(produit => {
            if(produit.getID() == listOfID[positionId]){//Si l'identifiant du produit est la même que celle de listOfID, alors ont additionnent tous les quantité des produits ayant la même id et on récupere le prix
                quantity = quantity + Number(produit.getQuantity());
                price = price + Number(produit.getPrice());
            }
            console.log("name -> "+produit.getName());
            console.log("color -> "+produit.getColor());
            console.log("quantity -> "+produit.getQuantity());
        });

        priceList.push(price);
        quantityList.push(quantity);
        positionId++;
        quantity = 0;
        price = 0;
    });

    //ont additionnent chaque quantité afin d'obtenir la quantité total de produit
    quantityList.forEach(element => {
        console.log(" quantityInList --> "+element);
        totalQuantity = totalQuantity + Number(element);
    });

    //ont fait l'addition du prix x la quantité de produit issue d'un même catégorie  afin d'obtenir le prix total de tous les produits
    for(let i = 0; i < priceList.length; i++){
        newTotalPrice = Number(priceList[i]) * Number(quantityList[i]);
        totalPrice = totalPrice + newTotalPrice;
    }

    priceList.forEach(element => {
        console.log(" priceInList --> "+element);
    });

    console.log(">-- countTotalPrice --<");
}

/**
 * Met à jour la quantié d'un produit.
 * @param { String } _id l'id du produit.
 * @param { String } _color la couleur du produit.
 * @param { Number } _quantity la quantité du produit.
 */
function updateQuantity(_id, _color, _quantity){
    //Pour chaque produit de chaque element de itemProductList on vérifie si l'identifiant et la couleur du produit est la même que ceux recu en paramétre 
    itemProductList.forEach(element => {

        element.forEach(produit => {
            if(produit.getID() == _id && produit.getColor() == _color){//Si la condition est vraie, alors on appelle la fonction setQuantity qui modifira la quantité du produit concerner
                produit.setQuantity(Number(_quantity));
            } 
        });
    });
}

/**
 * Met à jour le prix dans la page html.
 */
function updateTotalPrice(){
    document.querySelector("#totalPrice").innerHTML = totalPrice; 
}

/**
 * Met à jour la quantité dans la page html.
 */
function updateTotalQuantity(){
    document.querySelector("#totalQuantity").innerHTML = totalQuantity; 
}

/**
 * Classe modélisant un produit.
 * @param { String } _name le nom du produit.
 * @param { String } _id l'identifiant du produit.
 * @param { String } _color la couleur du produit.
 * @param { Number } _quantity la quantité du produit.
 * @param { Number } _price le prix produit.
 */
 class ProductItem{
    constructor(_name, _id, _color, _quantity, _price){
        this.name = _name;
        this.id = _id;
        this.color = _color;
        this.quantity = _quantity;
        this.price = _price;
    }

    /**
     * Retourne le nom du produit.
     * @return { String } Le nom du produit.
     */
    getName(){return this.name;}

    /**
     * Retourne l'identifiant du produit.
     * @return { String } L'identifiant du produit.
     */
    getID(){return this.id;}

    /**
     * Retourne la couleur du produit.
     * @return { String } La couleur du produit.
     */
    getColor(){return this.color;}

    /**
     * Retourne la quantité du produit.
     * @return { String } La quantité du produit.
     */
    getQuantity(){return this.quantity;}

    /**
     * Retourne le prix du produit.
     * @return { String } Le prix du produit.
     */
    getPrice(){return this.price;}

    /**
     * Modifie la quantité du produit.
     * @param { Number } _quantity la quantité du produit.
     */
    setQuantity(_quantity){this.quantity = _quantity;}
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
    * Vérifie si le produit avec la même couleur est déjà enregistrer dans le localStorage dans ce cas ont enregistre seulement la quantité, sinon on enregistre le nouveau produit dans le localStorage
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

/********************************************************************************************* */
/**
 * Crée et assemble plusieurs composants html pour l'affichage d'un produit.
 */
function createElementHtml(_sofa, _produit_id, _produit_color, _produit_quantity){
    const element_section = document.getElementById("cart__items");
    try {
        element_section.appendChild(elementHtml_Div__cartItem(_sofa, _produit_id, _produit_color, _produit_quantity));
    } catch (error) {
        console.log(" Une erreur détécter lors de la création d'élément html "+error);
    }   
}

/**
 * Crée un element html de type 'article' contenant l'image, le nom, la description et les options de modification du produit.
 * @param { ProductSofa } sofa modèle représentant un produit de type canapé.
 */
function elementHtml_Div__cartItem(_sofa, _produit_id, _produit_color, _produit_quantity){
    const element_article = document.createElement("article");
    element_article.classList.add("cart__item");

    element_article.dataset.id = _produit_id;
    element_article.dataset.color = _produit_color; 

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
function elementHtml_Div__cartItem_contentSettings_delete(){
    const element_div = document.createElement("div");
    const element_p = document.createElement("p");

    element_div.classList.add("cart__item__content__settings__delete");
    element_p.classList.add("deleteItem");

    const textFor_p = document.createTextNode("Supprimer");
    
    element_p.appendChild(textFor_p);
    element_div.appendChild(element_p);

    return element_div;
}

/****************************************************************************************** */
//Crée une instance de la classe
var manageLocalStorage = new ManageLocalStorage();

//Récupèrent tous les items contenue dans le localStorage
listOfProducts = manageLocalStorage.getAllLocalStorage();

//Récupèrent une Promise pour l'ensemble de produit issue du panier et donc du localStorage
Promise.all([listOfProducts])
  .then(response => {
        let position = 1;
        let positionFinal = 0;
        itemProductList.clear;
        listOfID.clear;
        totalPrice = 0;
        totalQuantity = 0;
        //Comptent le nombre d'élément qui se trouvent dans listOfProducts
        for (let i in listOfProducts) {
            positionFinal++;
        }
        //On récupère un element de listOfProducts que l'on envoie comme paramètre pour la fonction connectToApiForOneProduct
        for (let id in listOfProducts) {
            let produit = JSON.parse(listOfProducts[id]);
            this.id_product = id;
            connectToApiForOneProduct(produit, position, positionFinal);
            position++;
        };
        
    }).catch(error => {
        console.log(`Erreur pour la Promise : ${error}`);
});











