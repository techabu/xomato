var apiUrl = "http://localhost:5000/api/1.0/"
var getCities = apiUrl+"city";
var getRestaurants = apiUrl+"search";
var cityId;
var redirectPage = true;

$.typeahead({
    input: '.location',
    minLength: 2,
    dynamic: true,
    cancelButton: false,
    backdrop: {
        "background-color": "#fff"
    },
    template: function (query, item) {
        return '<span class="row">' +
            '<span class="item-name">{{name}}</span>'
            "</span>"
    },
    emptyTemplate: "no result for {{query}}",
    source: {
        location_suggestions: {
            display: "name",
            ajax: function (query) {
                return {
                    url: getCities,
                    dataType: 'jsonp',
                    cache: false,
                    path: "data.location_suggestions",
                    data: {
                        q: "{{query}}"
                    }
                }
            }
 
        }
    },
    callback: {
        onClick: function (node, a, item, event) { 
            cityId = item['id']; 
            sessionStorage.setItem("cityId", cityId);
            sessionStorage.removeItem("restaurantId");
            $(".restaurant").val("");
        }
    }
});

$.typeahead({
    input: '.restaurant',
    minLength: 3,
    order: "asc",
    dynamic: true,
    cancelButton: false,
    backdrop: {
        "background-color": "#fff"
    },
    template: function (query, item) {
 
        return '<span class="row">' +
            '<span class="thumbnail"><img src="{{restaurant.thumb}}" class="img-thumbnail typeahead-thumbnail"></span>' +
            '<span>'+
            '<span class="restaurant-name">{{restaurant.name}}</span><br>' +
            '<span class="restaurant-loc">{{restaurant.location.locality}}</span>' +
            '</span>'+
            "</span>"
    },
    emptyTemplate: "no result for {{query}}",
    source: {
        restaurants: {
            display: "restaurant.name",            
            ajax: function (query) {
                return {
                    type: "GET",
                    url: getRestaurants,
                    dataType: 'jsonp',
                    path: "data.restaurants",
                    cache: false,
                    data: {
                        q: "{{query}}",
                        cityId: sessionStorage.getItem("cityId"),
                        start: 0,
                        count: 10
                    }
                }
            }
 
        }
    },
    callback: {
        onClick: function (node, a, item, event) {
            var restaurantId = item.restaurant.id;
            sessionStorage.setItem("restaurantId", restaurantId);
            if(redirectPage){
                location.href = 'restaurant.html';
            }
            else{
                loadRestaurant();
            }
        }
    }
});


function loadRestaurant(){
    var restaurantId = sessionStorage.getItem("restaurantId");

    var restaurantUrl = apiUrl+"restaurant/"+restaurantId;
    $('.loader').addClass('is-active');
    $.ajax({
        url: restaurantUrl,
        method: 'GET',
        dataType: 'json',
        success: function(resp){
            let restData = resp.data;
            let restaurantName = restData['name'];
            let location = restData['location']['locality_verbose'];
            let resImage = restData['featured_image'];
            let rating = restData['user_rating']['aggregate_rating'];
            let ratingColor = restData['user_rating']['rating_color'];
            let costForTwo = restData['average_cost_for_two'];
            let currency = restData['currency'];
            let timings = restData['timings'];
            let cuisines = restData['cuisines'];
            let reviews = restData['all_reviews']['reviews'];

            $("#res-name").html(restaurantName);
            $("#res-loc").html(location);
            $("#res-img").attr("src", resImage);
            $("#res-rating").html(rating);
            $("#res-cost").html(currency+costForTwo);
            $("#res-rating").css("background-color", "#"+ratingColor);
            $("#res-rating").css("color", "#fff");
            $("#res-time").html(timings);
            $("#res-cuisines").html(cuisines);

            builReviewsSection(reviews);
            $('.loader').removeClass('is-active');
        }
    })
}

function builReviewsSection(reviewsObj){
    let reviewHtml = "";
    let defaultReview = "";
    $.each(reviewsObj, function(key, value){
        let reviews = value['review'];
        let reviewText = (reviews['review_text'] != undefined && reviews['review_text'] != '') ? reviews['review_text'] : defaultReview;
        let reviewRating = reviews['rating'];

        let bgClass = getRatingColor(reviewRating);
        let ratingClass = 'border pl-1 pr-1 '+bgClass;
        reviewHtml += "<div class='card'>";
        reviewHtml += "<div class='card-body'>";
        reviewHtml += "<p>Rated: <span class='border pl-1 pr-1 text-white "+bgClass+"'>"+reviewRating+"</span></p><br>";
        reviewHtml += "<p>"+reviewText+"</p>";
        reviewHtml += "</div>";
        reviewHtml += "</div>";
    })

    $("#res-reviews").html(reviewHtml)
}

function getRatingColor(rating){
    if(rating > 3){
        return "bg-success";
    }
    else if (rating >= 2 && rating <= 3 ) {
        return "bg-warning";
    }
    else{
        return "bg-danger";
    }
}
