var id_product = null;
var sofa_product = null;
var item_product = null;
var listOfItems_fromApiProduct = [];
var listOfItems_ProductItem = [];
var listOfID = [];
var totalPrice = 0;
var totalQuantity = 0;

/**
 * Essais de se connecter à l'api products et récupère un produit à partir de son id.
 * @param { any } _produit Un modèle de produit issue de localStorage.
 * @param { any } _position Correspond au tour actuel à l'intérieur d'une boucle.
 * @param { any } _positionFinal Correspond au dernier tour à l'intérieur d'une boucle.
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

            //Effectue une boucle afin de crée tous les éléments html pour chaque produit d'un même catégorie "id"
            for(let i = 0; i < _produit.length; i++){
                produit_id = _produit[i].id;
                produit_color = _produit[i].color;
                produit_quantity = _produit[i].quantity;
                createElementHtml(sofa_product, produit_id, produit_color, produit_quantity);

                //Crée une instance de ProductItem que l'on ajoute ensuite au tableau listOfItems_ProductItem
                item_product = new ProductItem(sofa_product.getName(), produit_id, produit_color, Number(produit_quantity), sofa_product.getPrice());
                listOfItems_ProductItem.push(item_product);
            }

            //Ajoute l'identifiant du produit dans le tableau listOfID, ajoute le tableau produit_list au tableau listOfItems_ProductItem
            listOfID.push(produit_id);

            //Une fois la condition exact, ont ajoute des écouteurs d'événements aux élements html conserné puis met à jour le prix final ainsi que la quantité.
            if(_position == _positionFinal){
                setTimeout(() => {
                    try {
                        addListenersToManageQuantity();
                        addListenersToManageDelete();
                        validAnOrder();
                        countTotalPrice();
                        updateTotalPrice();
                        updateTotalQuantity();
                    } catch (error) {
                        console.log("Une erreur c'est produite dans l'ecouteur de quantity :"+error);
                    } 
                  }, 500) 
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
            for (const key in listOfItems_fromApiProduct) {
                let product = JSON.parse(listOfItems_fromApiProduct[key]);

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
            for (const key in listOfItems_fromApiProduct) {
                let product = JSON.parse(listOfItems_fromApiProduct[key]);

                //parcourent product afin de trouver le produit ayant le même id et color que celle récupérer juste en haut
                for (const key in product) {
                    if (product[key].id === produit_id && product[key].color === produit_color){
                        //supprime le produit et met à jour la suppression dans la page html
                        updateDelete(produit, product[key].id, product[key].color);
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
    }
}

/**
 * Met à jour la suppression d'un produit.
 * @param { ProductItem } _produit Une instance du produit.
 * @param { String } _id l'identifiant du produit.
 * @param { String } _color la couleur du produit.
 */
 function updateDelete(_produit, _id, _color){   
    removeItemFromLocalStorage(_id, _color);
    removeItemFromListOfProduits(_id, _color);
    removeItemFromHtml(_produit);
}

/**
 * Supprime un produit du localStorage.
 * @param { String } _id l'identifiant du produit.
 * @param { String } _color la couleur du produit.
 */
function removeItemFromLocalStorage(_id, _color){
    let position = 0;
    let items = localStorage.getItem(_id);
    let itemsJson = JSON.parse(items);
    let itemList = [];
    let itemListFinal = [];
    
    if(itemsJson.length == 1){// ont retire directement l'item de localStorage
        localStorage.removeItem(_id);
       
    }else{
        //ont récupère la position de l'item
        for(let i = 0; i < itemsJson.length; i++){
            
            if(itemsJson[i].color === _color){//Si un produit correspond aux paramètres id et color, alors l'ignore.
                
            }else{//Sinon on enregistre le produit dans une nouvelle liste temporaire
                itemListFinal.push(itemsJson[i]);
            }   
        }
        
        itemList.clear;

        //ont transforme la liste obtenue en format Json
        localStorage.setItem(_id, JSON.stringify(itemListFinal));
    }
    
}

/**
 Supprime un produit de listOfItems_ProductItem.
 * @param { String } _id l'identifiant du produit.
 * @param { String } _color la couleur du produit.
 */
function removeItemFromListOfProduits(_id, _color){
   let newList = [];

    listOfItems_ProductItem.forEach(produit => {
        if(produit.getID() == _id && produit.getColor() == _color){//Si la condition est vraie, ont fait rien
            
        }else{//sinon on enregistre le produit dans une liste temporaire
            newList.push(produit);
        } 
    });
    //Puis je modifie listOfItems_ProductItem avec la nouvelle liste temporaire
    listOfItems_ProductItem = newList;
    newList.clear;
}

/**
 * Supprime un produit de la page html.
 * @param { ProductItem } _produit Une instance du produit.
 */
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
    //Pour chaque produit de listOfItems_ProductItem on vérifie si l'identifiant du produit est la même que celle de listOfID
    for (let index = 0; index < listOfID.length; index++) {
        const elementID = listOfID[index];

        listOfItems_ProductItem.forEach(produit => {
            
            if(produit.getID() == elementID){//Si l'identifiant du produit est la même que celle de listOfID, alors ont additionnent tous les quantité des produits ayant la même id et on récupere le prix
                quantity = quantity + Number(produit.getQuantity());
                price = Number(produit.getPrice());
            }
            
        });
        //ont enregistre les nouvelle données pour le priceList et quantityList
        priceList.push(price);
        quantityList.push(quantity);
        //ont initialise les vaiable price et quantity à zero
        price = 0;
        quantity = 0;
    }
    

    //ont additionnent chaque quantité afin d'obtenir la quantité total de produit
    quantityList.forEach(element => {
        totalQuantity = totalQuantity + Number(element);
    });

    //ont fait l'addition du prix x la quantité de produit issue d'un même catégorie  afin d'obtenir le prix total de tous les produits
    for(let i = 0; i < priceList.length; i++){
        newTotalPrice = Number(priceList[i]) * Number(quantityList[i]);
        totalPrice = totalPrice + newTotalPrice;
    }

}

/**
 * Met à jour la quantié d'un produit.
 * @param { String } _id l'id du produit.
 * @param { String } _color la couleur du produit.
 * @param { Number } _quantity la quantité du produit.
 */
function updateQuantity(_id, _color, _quantity){
    //Pour chaque produit de listOfItems_ProductItem on vérifie si l'identifiant et la couleur du produit est la même que ceux recu en paramétre 
    listOfItems_ProductItem.forEach(produit => {
        if(produit.getID() == _id && produit.getColor() == _color){//Si la condition est vraie, alors on appelle la fonction setQuantity qui modifira la quantité du produit concerner
            produit.setQuantity(Number(_quantity));
        } 
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
 * Effectuent une vérification pour chaque champs du formulaire.
 * @param { String } _firstName Le prénom de l'utilisateur.
 * @param { String } _lastName Le nom de l'utilisateur.
 * @param { String } _address L'adresse de l'utilisateur.
 * @param { String } _city La ville de l'utilisateur.
 * @param { String } _email L'email de l'utilisateur.
 * @return { Boolean } renvoie true si tout les champs sont valide, sinon renvoie false.
 */
function checkInputForm(_firstName, _lastName, _address, _city, _email){
    //Ici je récupèrent tous les éléments html permettant d'afficher un message d'erreur relatif au champs du formulaire associé
    let firstName_errorMessage = document.getElementById('firstNameErrorMsg');
    let lastName_errorMessage = document.getElementById('lastNameErrorMsg');
    let address_errorMessage = document.getElementById('addressErrorMsg');
    let city_errorMessage = document.getElementById('cityErrorMsg');
    let email_errorMessage = document.getElementById('emailErrorMsg');

    //Je crée les filtres pour champs du formulaire
    const firstNameRGEX = /^([A-Za-z-\s]{3,})+$/;
    const lastNameRGEX = firstNameRGEX;
    const addressRGEX = /^([A-Za-z0-9]+( [A-Za-z0-9]+)+)+$/ ;
    const cityRGEX = firstNameRGEX;
    const emailRGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //Test chaque champ afin de vérifier leur validité
    let firstNameResult = firstNameRGEX.test(_firstName);
    if(!firstNameResult)
    {
      firstName_errorMessage.innerHTML = 'Veuillez entrez un prénom valide';
    }else{
      firstName_errorMessage.innerHTML = ' '; 
    }

    let lastNameResult = lastNameRGEX.test(_lastName);
    if(!lastNameResult)
    {
      lastName_errorMessage.innerHTML = 'Veuillez entrez un nom valide';
    }else{
      lastName_errorMessage.innerHTML = ' ';
    }

    let addressResult = addressRGEX.test(_address);
    if(!addressResult)
    {
      address_errorMessage.innerHTML = 'Veuillez entrez une adresse valide';
    }else{
        address_errorMessage.innerHTML = ' '; 
    }

    let cityResult = cityRGEX.test(_city);
    if(!cityResult)
    {
      city_errorMessage.innerHTML = 'Veuillez entrez le nom d\'une ville valide';
    }else{
      city_errorMessage.innerHTML = ' '; 
    }

    let emailResult = emailRGEX.test(_email);
    if(!emailResult)
    {
      email_errorMessage.innerHTML = 'Veuillez entrez un email valide';
    }else{
      email_errorMessage.innerHTML = ' '; 
    }


    //Si tous les champs sont valide ont renvoie true, sinon ont renvoie false
    if(firstNameResult == true && lastNameResult == true && addressResult == true && cityResult == true && emailResult == true){
        console.log("tout les champs sont valide");
        return true;
    }else{
        console.log("tout les champs sont pas valide");
        return false;
    }
    
}

/**
 * Vérifient les données du formulaire puis, envoie l'utilisateur vers la page de confirmation.
 */
function validAnOrder(){
    //Je récupèrent tous les champs du formulaire
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let address = document.getElementById('address');
    let city = document.getElementById('city');
    let email = document.getElementById('email');
    
    
    let button_order = document.querySelector("#order");

    button_order.addEventListener("click", (event) => {
        event.preventDefault();
        //Si tout les données du formulaire sont valide
        if(checkInputForm(firstName.value, lastName.value, address.value, city.value, email.value)){
            //alert("tout les champs sont valident !");
            //On crée un objet de Contact auquel ont ajoutera comme paramètre les données du formulaire validé
            const contact = new Contact(firstName.value, lastName.value, address.value, city.value, email.value);
            connectToApiForPost(contact);
        }
       
    });
}

/**
 * Tente une connection à l'api pour effectuer un post.
 * @param { Contact } _contact objet de la classe Contact.
 */
async function connectToApiForPost(_contact){
    try {
        let response = await fetch("http://localhost:3000/api/products/order", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                contact: _contact,
                products: listOfID,
              }),
          });
          
          let result = await response.json();
          //alert(" post :"+result);
          let orderId = result.orderId;
          manageLocalStorage.deleteAllDataInLocalStorage();
          window.location.assign("confirmation.html?id=" + orderId); 
    } catch (error) {
        console.log("erreur à l\'envoie de donnee post : "+error);
    }
    
}

/**
 * Enregistrent les informations de l'utilisateur via le formulaire de la page cart.html.
 * @param { String } _firstName Le prénom de l'utilisateur.
 * @param { String } _lastName Le nom de l'utilisateur.
 * @param { String } _address L'adresse de l'utilisateur.
 * @param { String } _city La ville de l'utilisateur.
 * @param { String } _email L'email de l'utilisateur.
 */
class Contact{
    constructor(_firstName, _lastName, _address, _city, _email){
        this.firstName = _firstName;
        this.lastName = _lastName;
        this.address = _address;
        this.city = _city;
        this.email = _email;
    }

    /**
     * Retourne le prénom de l'utilisateur.
     * @return { String } Le prénom de l'utilisateur.
     */
     getFirstName(){return this.firstName;}

     /**
     * Retourne le nom de l'utilisateur.
     * @return { String } Le nom de l'utilisateur.
     */
      getLastName(){return this.lastName;}

    /**
     * Retourne l'adresse de l'utilisateur.
     * @return { String } L'adresse de l'utilisateur.
     */
     getAdress(){return this.adress;}

     /**
     * Retourne la ville de l'utilisateur.
     * @return { String } La ville de l'utilisateur.
     */
      getCity(){return this.city;}
    
    /**
     * Retourne l'email de l'utilisateur.
     * @return { String } L'email de l'utilisateur.
     */
     getEmail(){return this.email;}
}

/**
 * Classe modélisant un produit.
 * @param { String } _name Le nom du produit.
 * @param { String } _id L'identifiant du produit.
 * @param { String } _color La couleur du produit.
 * @param { Number } _quantity La quantité du produit.
 * @param { Number } _price Le prix produit.
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
 * @param { object } sofa Modèle de sofa.
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
 * @param { any } _id L'identifiant du produit.
 * @param { any } _color La couleur du produit.
 * @param { any } _quantity La quantité du produit.
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
               
                return false;
            }
        }
        return true;
    }

    /**
     * Ajoute le produit dans la liste.
     * @param { any } _id L'identifiant du produit.
     * @param { any } _color La couleur du produit.
     * @param { any } _quantity La quantité du produit.
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

//Récupèrent tous les items contenue dans le localStorage et les ajoutent au tableau listOfItems_fromApiProduct 
listOfItems_fromApiProduct = manageLocalStorage.getAllLocalStorage();

//Récupèrent une Promise pour l'ensemble de produit issue du panier et donc du localStorage
Promise.all([listOfItems_fromApiProduct])
  .then(response => {
        let position = 1;
        let positionFinal = 0;
        listOfItems_ProductItem.clear;
        listOfID.clear;
        totalPrice = 0;
        totalQuantity = 0;
        //Comptent le nombre d'élément qui se trouvent dans listOfItems_fromApiProduct
        for (let i in listOfItems_fromApiProduct) {
            positionFinal++;
        }
        //On récupère un element de listOfItems_fromApiProduct que l'on envoie comme paramètre pour la fonction connectToApiForOneProduct
        for (let id in listOfItems_fromApiProduct) {
            let produit = JSON.parse(listOfItems_fromApiProduct[id]);
            this.id_product = id;
            connectToApiForOneProduct(produit, position, positionFinal);
            position++;
        };
        
    }).catch(error => {
        console.log(`Erreur pour la Promise : ${error}`);
});











