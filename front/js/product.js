let str = window.location.href;
let url = new URL(str);
let id_product = url.searchParams.get("id");

/**
 * essais de se connecter à l'api et récupère un seul élément.
 * 
 */
 function connectToApiProducts(){
    fetch("http://localhost:3000/api/products/"+id_product)
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(value){
            console.log(value);
        })
        .catch(function(err){
            console.log("Une erreur c'est produite lors du chargements des produits :"+err);
        });
    }

    let allProducts = connectToApiProducts();
    