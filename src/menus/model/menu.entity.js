export class Menu {
   constructor(id='', name='', description='', price=0, image='',
               quantity=0, foods=[], comments=[],scores=[]) {
         this.id = id;
         this.name = name;
         this.description = description;
         this.price = price;
         this.image = image;
         this.quantity = quantity;
         this.foods = foods;
         this.comments = comments;
         this.scores = scores;
   }
   static fromDisplayableMenu(displayableMenu){
         return new Menu(
             displayableMenu.id,
             displayableMenu.name,
             displayableMenu.description,
             displayableMenu.price,
             displayableMenu.image,
             displayableMenu.quantity,
             displayableMenu.foods,
             displayableMenu.comments,
             displayableMenu.scores
         );
   }
   static toDisplayableMenu(menu){
         return {
             id: menu._id,
             name: menu.name,
             description: menu.description,
             price: menu.price,
             image: menu.image,
             quantity: menu.quantity,
             foods: menu.foods,
             comments: menu.comments,
             scores: menu.scores
         }
   }
}