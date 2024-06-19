export class Food{
    constructor(id='' , name='', image='', category='', price=0,quantity=0) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
    }
    static fromDisplayableFood(displayableFood){
        return new Food(
            displayableFood.id,
            displayableFood.name,
            displayableFood.image,
            displayableFood.category,
            displayableFood.price,
            displayableFood.quantity);
    }
    static toDisplayableFood(food){
        return {
            id: food._id,
            name: food.name,
            image: food.image,
            category: food.category,
            price: food.price,
            quantity: food.quantity
        }
    }
}