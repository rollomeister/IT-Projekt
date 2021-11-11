var url = "https://ecom-test.itpr.eu/api/products";
var url2 = "https://ecom-test.itpr.eu/api/product/";
var xhr = new XMLHttpRequest();
var all_products_data;
var uuids = [];
var product;

xhr.open("GET", url);
xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Authorization", "Bearer x0E0TmEpvZabHdGzRvCi62RPAKf8qLcH");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        //console.log(xhr.responseText);
        all_products_data = JSON.parse(xhr.responseText);        
        var products = all_products_data.products;      
        for (let element of products) uuids.push(element.uuid); 
        url2 += uuids[0];
        
        // Populate footer tags
        var tags = [];
        
        for (let product of products) {for (let tag of product.tags) {tags.push(tag)}}
        //console.log(tags);
        
        var x = 0;
        for (let tag of tags) {
            if (x<30) {
                let next_tag = document.createElement("a");
                next_tag.innerHTML += '<a href="#" class="text-decoration-none text-white border p-1 px-2">' + tag + '</a>';
                document.getElementById("tags").appendChild(next_tag);
            }
            x++;
        }
        
        
        // Populate products page
        for (let product of products) {
            let next_product = document.createElement("div");
            next_product.innerHTML += '<div class="card text-center"><a class="text-decoration-none" href="#"><img class="card-img mx-auto text-center" src="' + product.images[0] + '" alt="Product 1 image"><div class="card-body"><h5 class="card-title text-center text-decoration-none text-dark">' + product.name + '</h5></div></a></div>';
            document.getElementById("products-area").appendChild(next_product);
            
        }
        
    }};
xhr.send();


function clickProduct() {
    
}