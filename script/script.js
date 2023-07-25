const imgSrc = 'assets/images/products/';

const dialogWindow = document.querySelector('.dialogWindow');
const overlay =document.getElementById('overlay');

const mainPage = document.getElementById('main-page');
const alertMsg = document.getElementById('alert-msg');
const topProductsRow = document.getElementById('topProducts-row');
const offersRow = document.getElementById('offers-row');
const newArrivalsRow = document.getElementById('newArrivals-row');

const categoriesMenu = [...document.getElementsByClassName('categoriesList')];
const shoppingCartBtn = document.getElementById('shopping-cart-btn');
const dialogExitBtn = document.getElementById('dialog-exit');
const numOfCartItems = document.getElementById('numOf-cartItems');


class userData{
    shoppingCart = [];
    orders = [];
    wishList = [];
    constructor(email,firstName,lastName){
        this.userID = 'u' + Math.round(Math.random()*1000000);
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    addToCart(prod){
        if(!this.shoppingCart.find(e => e.prodID === prod.prodID)){
            this.shoppingCart.push(prod);
            numOfCartItems.textContent = `${this.shoppingCart.length}`;
            numOfCartItems.classList.replace('d-none','d-block');
        }

    }
    addToWishList(prod){
        this.wishList.push(prod);
    }

}

const categories = {
    all: 'All',
    clothing:'Clothing',
    technology:'Technology',
    furniture:'Furniture',
    automotive: 'Automotives'
}

class Category{
    constructor(categoryName,productsList){
        this.categoryName = categoryName;
        this.productsList = productsList;
    }

}

const maghUser = new userData("mahmoud.elmaghraby11@gmail.com","Mahmoud","Elmaghraby");

if(maghUser.shoppingCart.length === 0){
    numOfCartItems.classList.add('d-none');
}else{
    numOfCartItems.classList.add('d-block');
}

class ShoppingCart{
     renderToCart(){
        const dialogTitle = dialogWindow.querySelector('.dialog-header .dialog-title h4');
        const dialogBody = dialogWindow.querySelector('.dialog-body');
        const dialogFooter = dialogWindow.querySelector('.dialog-footer');
        dialogTitle.textContent = 'Shopping Cart';
        dialogBody.innerHTML = '';
        const subtotalPrices = maghUser.shoppingCart.reduce((a,b)=>{
          return a +  (b['hasOffer'] ? b['productPrice']*(b['offerValue']/100) : b['productPrice'])},0);
            maghUser.shoppingCart.length > 0 ? maghUser.shoppingCart.forEach(prod=>{
            const cartProductItem = document.createElement('div');
            cartProductItem.classList.add('cartProduct');
            cartProductItem.innerHTML = 
            `
            <div class="product d-flex mb-3">
            <div class="product-img-container d-flex justify-content-center rounded-4">
              <img src="${imgSrc}${prod.imgName}" alt="${prod.productTitle}" class="product-image">
              ${prod.hasOffer? `<div class="offer-detail">${prod.offerValue}% off</div>`: ''}
              </div>
              <div class="product-info">
              <div class="product-title">
                  <h3>${prod.productTitle}</h3>
              </div>
              <div class="product-description">
                  <p class="mt-0 mb-0">${prod.productDescription}</p>
              </div>
              <div class="product-price d-flex gap-2">
              ${prod.hasOffer? `<h5 class="before-offer">${prod.productPrice} EGP</h5>`: ''}
              <h5 class="current-price">${prod.hasOffer?(prod.productPrice*(prod.offerValue/100)) :prod.productPrice} EGP</h5>
              </div>
              <div class="product-rating mb-2" id ="prodRating">
                    ${prod.ratingsToStars()[0].outerHTML}
                    ${prod.ratingsToStars()[1].outerHTML}
                    ${prod.ratingsToStars()[2].outerHTML}
                    ${prod.ratingsToStars()[3].outerHTML}
                    ${prod.ratingsToStars()[4].outerHTML}
                  <span class="num-of-rattings">(${prod.numOfRatings})</span>
              </div>
              </div>
          </div>
          <div class="cartProduct-actions">
            <div class="removeProduct" id="remove-from-cart"><i class="fa-solid fa-trash fa-5x"></i></div>
          </div>
            `;

            dialogBody.append(cartProductItem);
            const removeFromCartBtn = cartProductItem.querySelector('.removeProduct');
            removeFromCartBtn.addEventListener('click',this.removeFromCart.bind(this,prod.prodID));
            cartProductItem.addEventListener('click',()=>{
                cartProductItem.classList.toggle('toggleCartProductAction');
                const cartItems = document.querySelectorAll('.cartProduct');
                cartItems.forEach(cartItem=>{
                    if(cartItem !== cartProductItem){
                        cartItem.classList.remove('toggleCartProductAction');
                    }
                });
            });
        }): dialogBody.innerHTML =                    
         `
        <h3 class='text-center'>It's empty in here. </h3>
        <img src="assets/images/doge.png" alt="not found doge" width = "320" class"img-fluid">
        `;
        dialogFooter.innerHTML = maghUser.shoppingCart.length > 0?
        `
        <h6>Subtotal: <span class="fw-bold">${subtotalPrices} EGP</span></h6>
        <button class="btn btn-outline-secondary">Proceed purchase</button>
        `: '';
    }
    removeFromCart(selectedProdID){
        const currentProdIndex = maghUser.shoppingCart.findIndex(currentProd=>currentProd.prodID === selectedProdID);
        maghUser.shoppingCart.splice(currentProdIndex,1);
        numOfCartItems.textContent = `${maghUser.shoppingCart.length}`;
        if(maghUser.shoppingCart.length < 1){
            numOfCartItems.classList.replace('d-block','d-none');
        }
        this.renderToCart();
        }
}



class Product{
    constructor(productTitle,productDescription,productPrice,productCategory,imgName,productRating,numOfRatings,hasOffer,offerValue){
        this.prodID = 'p' + Math.round(Math.random()*1000000);
        this.productTitle = productTitle;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productCategory = productCategory;
        this.imgName = imgName;
        this.productRating = productRating;
        this.numOfRatings = numOfRatings;
        this.hasOffer = hasOffer;
        this.offerValue = offerValue;
    }
    ratingsToStars(){
        const ratingStars = [];
        for(let i = 0; i < this.productRating; i++){
            const solidStar = document.createElement('i');
            solidStar.classList.add('fa-solid','fa-star');
            ratingStars.push(solidStar);
        }
        for(let i = this.productRating; i < 5; i++){
            const regularStar = document.createElement('i');
            regularStar.classList.add('fa-regular','fa-star');
            ratingStars.push(regularStar);
        }
        return ratingStars;
    }
    addToCart(){
        if(!maghUser.shoppingCart.find(e => e.prodID === this.prodID)){
            console.log('Adding to Cart...');
            console.log(this);
            console.log('Added to Cart');
            maghUser.addToCart(this);
            alertMsg.lastElementChild.textContent = `${this.productTitle} is added to your shopping cart.`;
            alertMsg.style.transform = "translate(-50%,0)";
            const infoInterval = setInterval(()=>{
                alertMsg.style.transform = "translate(-50%,150%)";
                clearInterval(infoInterval);                
            },3000);
           new ShoppingCart().renderToCart();
        }
        else{
            console.log('This item is already added to the shoppping cart.')
        }
    }
    
    renderProduct (){
        const newCol = document.createElement('div');
        newCol.classList.add('col-6','col-md-4','col-lg-3');
        const newProduct = document.createElement('div');
        newProduct.classList.add('product','mb-4');
        newProduct.innerHTML = `
        <div class="product-img-container d-flex justify-content-center rounded-4">
        <img src="${imgSrc}${this.imgName}" alt="${this.productTitle}" class="product-image">
        <div class="add-to-wishlist"><i class="fa-regular fa-heart"></i></div>
        ${this.hasOffer? `<div class="offer-detail">${this.offerValue}% off</div>`: ''}
        <button class="btn btn-secondary" id="add-to-cart-btn">Add to Cart <i class="fa-solid fa-cart-shopping"></i></button>
        </div>
        <div class="product-info">
        <div class="product-title">
            <h3>${this.productTitle}</h3>
        </div>
        <div class="product-description">
            <p class="mt-0 mb-0">${this.productDescription}</p>
        </div>
        <div class="product-price d-flex gap-2">
            ${this.hasOffer? `<h5 class="before-offer">${this.productPrice} EGP</h5>`: ''}
            <h5 class="current-price">${this.hasOffer?(this.productPrice*(this.offerValue/100)) :this.productPrice} EGP</h5>
        </div>
        <div class="product-rating mb-2" id ="prodRating">
        ${this.ratingsToStars()[0].outerHTML}
        ${this.ratingsToStars()[1].outerHTML}
        ${this.ratingsToStars()[2].outerHTML}
        ${this.ratingsToStars()[3].outerHTML}
        ${this.ratingsToStars()[4].outerHTML}
            <span class="num-of-rattings">(${this.numOfRatings})</span>
        </div>
        </div>
        `;
        newCol.append(newProduct);
        const addToCartBtn = newProduct.querySelector('button');
        addToCartBtn.addEventListener('click',this.addToCart.bind(this));
        return newCol;
    }
}


const productsList = [
    new Product('Denim Jacket','Blue loose fit denim jacket.',499,categories.clothing,'denimJacket.png',4,643,false),
    new Product('Air Jordan','Black and white Air Jordan.',899,categories.clothing,'airjordan.png',5,1241,false),
    new Product('Gaming Headset','Gaming headset with a microphone.',699,categories.technology,'gamingheadset.png',5,3343,false),
    new Product('Gaming chair','Black and red comfortable gaming chair.',2499,categories.furniture,'gamingchair.png',5,4302,false),
    new Product('Cargo pants','Khaki loose fit cargo pants.',699,categories.clothing,'cargopants.png',4,320,true, 50),
    new Product('Vans shoes','Black vans shoes.', 599,categories.clothing,'vansshoes.png',5,242,true, 50),
    new Product('Mechanical keyboard.','RGB Mechanical gaming keyboard.',799,categories.technology,'gamingkeyboard.png',4,2130,true, 50),
    new Product('Anker power bank','10,000mAH fast charging power bank.',399,categories.technology,'powerbank.png',5,1503,true, 50),
    new Product('Desk Lamp','Black desk lamp.',249,categories.furniture,'desklamp.png',0,0,false),
    new Product('Xi smart band','Blue Xi smart band.',899,categories.technology,'smartband.png',0,0,false),
    new Product('Black Sweatpants','Black loose fit sweatpants.',499,categories.clothing,'sweatpants.png',0,0,false),
    new Product('Cat bed','Comfy cat bed.',859,categories.furniture,'catbed.png',0,0,false),
]

const categoriesList = [];
 Object.values(categories).forEach(val  => {
    if(val !== 'All'){
        categoriesList.push(new Category(val,productsList.filter(prod=>prod.productCategory === val)));
    }
    else{
        categoriesList.push(new Category(val,productsList));
    }
  });


categoriesMenu.forEach(categoryMenu=> {
    if(categoryMenu.id !== 'searchCategories'){
        categoriesList.forEach(categoryType=>{
            if(categoryType.categoryName !== 'All'){
                const newLi = document.createElement('li');
                const newAnchor = document.createElement('a');
                newAnchor.classList.add('dropdown-item', 'categoryName');
                newAnchor.href = `#${categoryType.categoryName}`;
                newAnchor.textContent = categoryType.categoryName;
                newLi.append(newAnchor);
                categoryMenu.append(newLi);
            };
        });
    }else{
        categoriesList.forEach(categoryType=>{
            const newLi = document.createElement('li');
            const newAnchor = document.createElement('a');
            newAnchor.classList.add('dropdown-item', 'categoryName');
            newAnchor.href = `#${categoryType.categoryName}`;
            newAnchor.textContent = categoryType.categoryName;
            newLi.append(newAnchor);
            categoryMenu.append(newLi);
        });
    }
});


const navCategoriesMenu = [...document.getElementById('navCategories').children];

navCategoriesMenu.forEach(navCategoryBtn=>{
    navCategoryBtn.addEventListener('click',()=>{
        mainPage.innerHTML = '';
        const newContainer = document.createElement('div');
        newContainer.classList.add('container');
        const newRow = document.createElement('div');
        newRow.classList.add('row','products-wrapper');
        newContainer.append(newRow);
        const newCategoryTitle = document.createElement('div');
        newCategoryTitle.classList.add('sectionTitle', 'text-center', 'pb-3');
        newCategoryTitle.innerHTML = ` <h3>${navCategoryBtn.textContent}</h3>`;
        mainPage.append(newCategoryTitle);
        mainPage.append(newContainer);
        categoriesList.forEach(catType=>{
            if(catType.categoryName === navCategoryBtn.textContent){
                if(catType.productsList.length > 0){
                    catType.productsList.forEach(selectedCategoryItem =>{
                        newRow.append(selectedCategoryItem.renderProduct());
                 });      
                }else{
                    const emptyList = document.createElement('div');
                    emptyList.classList.add('text-center')
                    emptyList.innerHTML = 
                    `
                    <h3>It's empty in here. </h3>
                    <img src="assets/images/doge.png" alt="not found doge" width = "320" class"img-fluid">
                    `
                    mainPage.append(emptyList);
                }
            }
        });
    });
});


const searchCategoriesMenu = [...document.getElementById('searchCategories').children];

searchCategoriesMenu.forEach(searchCategoryBtn=>{
    searchCategoryBtn.addEventListener('click',()=>{
        const searchCatDropdownItem = document.querySelector('.categoriesMenu button');
        searchCatDropdownItem.textContent = `${searchCategoryBtn.textContent}`;
        const inputBoxInput = document.querySelector('.input-box input');
        const inputBoxSpan= document.querySelector('.input-box span');
        if(searchCatDropdownItem.textContent.length > 9){
            inputBoxInput.style.paddingLeft = '110px';
            inputBoxSpan.style.left = '115px';
        }else if(searchCatDropdownItem.textContent.length > 7){
            inputBoxInput.style.paddingLeft = '90px';
            inputBoxSpan.style.left = '95px';
        }
        else {
            inputBoxInput.style.paddingLeft = '55px';
            inputBoxSpan.style.left = '60px';
        }

    });
});

const topProdsList = productsList.filter(prod=>prod.numOfRatings > 600 && prod.hasOffer === false);
topProdsList.forEach(topProdItem =>{
    topProductsRow.append(topProdItem.renderProduct());
});

const offersList = productsList.filter(prod=> prod.hasOffer === true);
offersList.forEach(offersItem =>{
    offersRow.append(offersItem.renderProduct());
});

const newArrivalsList = productsList.filter(prod=> prod.numOfRatings === 0);
newArrivalsList.forEach(newArrivalsItem =>{
    newArrivalsRow.append(newArrivalsItem.renderProduct());
});


shoppingCartBtn.addEventListener('click',()=>{
    dialogWindow.classList.replace('d-none','d-block');
    overlay.classList.replace('d-none','d-block');
    new ShoppingCart().renderToCart();
});

dialogExitBtn.addEventListener('click',()=>{
    dialogWindow.classList.replace('d-block','d-none');
    overlay.classList.replace('d-block','d-none');
});

overlay.addEventListener('click',()=>{
    overlay.classList.replace('d-block','d-none');
    dialogWindow.classList.replace('d-block','d-none');
});