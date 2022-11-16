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