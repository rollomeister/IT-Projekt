var url = "https://ecom-test.itpr.eu/api/products";
var url2 = "https://ecom-test.itpr.eu/api/product/";
var xhr = new XMLHttpRequest();
var xhr2 = new XMLHttpRequest();
var all_products_data;
var product_data;
var uuids = [];
var reviews = ["Hea materjal. Ilus muster."];
var users = ["Kati"];
var submit_times = ["22:53 9-11-2021"]
var product;
var products;
var cart_value = 0;
var quantity = 0;

xhr.open("GET", url);
xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Authorization", "Bearer x0E0TmEpvZabHdGzRvCi62RPAKf8qLcH");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        //console.log(xhr.responseText);
        all_products_data = JSON.parse(xhr.responseText);        
        products = all_products_data.products;      
        for (let element of products) uuids.push(element.uuid); 
        url2 += uuids[0];
        phase2();
    }};
xhr.send();

function phase2() {
    xhr2.open("GET", url2);
    xhr2.setRequestHeader("Accept", "application/json");
    xhr2.setRequestHeader("Authorization", "Bearer x0E0TmEpvZabHdGzRvCi62RPAKf8qLcH");
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState === 4) {
            product_data = JSON.parse(xhr2.responseText);
            product = product_data.product;
            document.getElementById("product-name").innerHTML = product.name;
            document.getElementById("product-price").innerHTML = product.price + "€";
            document.getElementById("product-description").innerHTML = product.description;
            document.getElementById("product-description-small").innerHTML = product.description_small;
            document.getElementById("product-SKU").innerHTML += product.SKU;
            document.getElementById("product-tags").innerHTML += setTags();
            document.getElementById("product-categories").innerHTML += setCategories();
            document.getElementById("product-quantity-wrapper").innerHTML = '<input class="product-quantity" min="0" max="' + product.quantity +  '" name="quantity" id="quantity" value="1" type="number" required>';
            document.getElementById("breadcrumbs").innerHTML = "Home / " + setCategories() + " / " + product.name;
            document.getElementById("reviews-link").innerHTML = 'Reviews (' + reviews.length + ')';
            setImages();
            setFooterTags();
            setProperties();
        }
    }
    xhr2.send();
}

function setTags() {
    var tags = "";
    for (let i = 0; i < product.tags.length; i++) {
       if (i < product.tags.length - 1) {tags += product.tags[i] + ", "; } 
       else { tags += product.tags[i]; }
    }
    
    return tags;
}

function setFooterTags() {
    var tags = [];
    for (let product of products) {for (let tag of product.tags) {tags.push(tag)}}
    var x = 0;
    for (let tag of tags) {
        if (x<30) {
            let next_tag = document.createElement("a");
            next_tag.innerHTML += '<a href="#" class="text-decoration-none text-white border p-1 px-2">' + tag + '</a>';
            document.getElementById("tags").appendChild(next_tag);
        }
        x++;
    }
}

function setProperties() {
    for(let element of product.properties) {
        let next_property = document.createElement('p');
        next_property.innerHTML = "<i class=\"bi bi-check pe-2\"></i>" + element;
        document.getElementById("product-properties").appendChild(next_property);
    } 
}

function setCategories() {
    var categories = "";
    for (let i = 0; i < product.categories.length; i++) {
       if (i < product.categories.length - 1) {categories += product.categories[i] + ", "; } 
       else { categories += product.categories[i]; }
    }
    
    return categories;
}

function setImages() {
    var image_id;
    for (let i=0; i < product.images.length; i++) {
        image_id = "product-image" + (i+1);
        document.getElementById(image_id).src = product.images[i];
        document.getElementById(image_id).style.display = "block"
    }
}

function closeCheckout() {
    //document.getElementById("checkout-wrapper").style.display = "none";
    document.getElementById("checkout-wrapper").classList.remove("slide-in");
    document.getElementById("checkout-wrapper").classList.add("slide-out");
    setTimeout(function removeCheckoutWrapper () {document.getElementById("checkout-wrapper").style.display = "none";}, 200);
}

function openCheckout() {
    document.getElementById("checkout-wrapper").style.display = "block";
    document.getElementById("checkout-wrapper").classList.remove("slide-out");
    document.getElementById("checkout-wrapper").classList.add("slide-in");
}

function showDescription() {
    let review_link = document.getElementById("reviews-link");
    let description_link = document.getElementById("description-link");
    review_link.classList.add("text-dark");
    review_link.classList.remove("disabled");
    description_link.classList.add("disabled");
    description_link.classList.remove("text-dark");
    document.getElementById("description-review-title").innerHTML = "Description";
    document.getElementById("review-wrapper").style.display = "none";
    document.getElementById("description-wrapper").style.display = "block";
}

function showReviews(is_second_execution) {
    let review_link = document.getElementById("reviews-link");
    let description_link = document.getElementById("description-link");
    review_link.classList.add("disabled");
    review_link.classList.remove("text-dark");
    description_link.classList.add("text-dark");
    description_link.classList.remove("disabled");
    document.getElementById("review-wrapper").style.display = "block";

    var submit_review = document.getElementById("review").value = "";
    var user_name = document.getElementById("user-name").value = "";
    document.getElementById("user-reviews-wrapper").innerHTML = "";
    
    document.getElementById("description-review-title").innerHTML = "Leave a review";
    document.getElementById("description-wrapper").style.display = "none";
    document.getElementById("review-wrapper").style.display = "block";
    for (let i =0; i <reviews.length; i++) {
        document.getElementById("user-reviews-wrapper").innerHTML += '<p>'+reviews[i]+'</p><p> - ' + users[i] + '<span class="ms-3">' + submit_times[i] + '</span></p>';
        if (i < reviews.length-1) document.getElementById("user-reviews-wrapper").innerHTML += '<hr>';
    }
}

function submitReview() {
    var submit_review = document.getElementById("review").value;
    var user_name = document.getElementById("user-name").value;
    if (submit_review != "") {
        reviews.push(submit_review);
        if (user_name == "") {users.push("Anonymous");} else {users.push(user_name);}
        let current = new Date();
        let current_date = current.getDate() + '-' + (current.getMonth() + 1) + '-' + current.getFullYear();
        let current_time = current.getHours() + ":" + current.getMinutes();
        let current_date_time = current_time + ' ' + current_date;
        submit_times.push(current_date_time);
        document.getElementById("reviews-link").innerHTML = 'Reviews (' + reviews.length + ')';
        showReviews(true);
    }
}

function clickImage(image_nr) {
    var temp = document.getElementById("product-image1").src
    document.getElementById("product-image1").src = document.getElementById("product-image" + image_nr).src
    document.getElementById("product-image" + image_nr).src = temp  
}

function addToCart() {
    quantity = document.getElementById("quantity").value;
    cart_value += quantity * product.price;
    //console.log(cart_value);
    document.getElementById("cart-button-navbar").innerHTML = "CART " + cart_value + " €";
    
    let added_product_img = document.createElement("div");
    let added_product_name = document.createElement("div");
    let added_product_quantity = document.createElement("div");
    let added_product_price = document.createElement("div");
    let added_product_trash = document.createElement("div");
    
    added_product_img.innerHTML = '<div class="col"><img class="checkout-image" src="' + product.images[0] + '"></div>';
    added_product_name.innerHTML = '<div class="col"><p class="fw-bold">' + product.name + '</p></div>';
    added_product_quantity.innerHTML = '<div class="col"><p class="fw-bold"> - ' + quantity + ' + </p></div>';
    added_product_price.innerHTML = '<div class="col"><p class="fw-bold">' + cart_value + ' €</p></div>';
    added_product_trash.innerHTML = '<div class="col"><a href="#" onclick="deleteItem()"><i class="bi bi-trash"></i></div>';
     
    document.getElementById("checkout-list").appendChild(added_product_img);
    document.getElementById("checkout-list").appendChild(added_product_name);
    document.getElementById("checkout-list").appendChild(added_product_quantity);
    document.getElementById("checkout-list").appendChild(added_product_price);
    document.getElementById("checkout-list").appendChild(added_product_trash);

    document.getElementById("price").innerHTML = cart_value + " €";
}


// QUANTITY PICKER - SEE ON NETIST VÕETUD
(function($) {
$.fn.spinner = function() {
this.each(function() {
var el = $(this);

// add elements
el.wrap('<span class="spinner"></span>');     
el.before('<span class="sub">-</span>');
el.after('<span class="add">+</span>');

// substract
el.parent().on('click', '.sub', function () {
if (el.val() > parseInt(el.attr('min')))
el.val( function(i, oldval) { return --oldval; });
});

// increment
el.parent().on('click', '.add', function () {
if (el.val() < parseInt(el.attr('max')))
el.val( function(i, oldval) { return ++oldval; });
});
    });
};
})(jQuery);

$('input[type=number]').spinner();
