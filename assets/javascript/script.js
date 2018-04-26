

$(document).ready(function () {

    // var apiKey = 'ef5b1abf524ce5d1f47b5b0f797a9d72';
     var apiKey = '3d79c0c33955e5e3d00c6de1cec0d473';
     var citySearchURL = "https://developers.zomato.com/api/v2.1/cities";
     var cuisineSearchURL = "https://developers.zomato.com/api/v2.1/cuisines";
     var searchURL = "https://developers.zomato.com/api/v2.1/search";
     var apiData;
     var cuisine;
     var cuisineId;
     var city;
     var cityId;
 
    
 
     $(document).on("click", ".api-call", function (event) {
 
         event.preventDefault();
 
         $("#hits").empty();
 
         city = $("#city-input").val().trim().replace(/\s+/g, ''); // Remove ALL spaces
 
        
         console.log("[In api-call] cuisine: " + cuisine);
 
         $.ajax({
             type: "GET",
             headers: {
                 'X-Zomato-API-Key': apiKey //only allowed non-standard header
             },
             url: citySearchURL,
             dataType: 'json',
             data: {
                 q: city
             },
             processData: true, // Converts data to query string
             success: function (data) {



                
 
                 console.log("City apiData: ", data);
 
                 var message = $("<span>");
                 message.text("Select Your City:");
                 $("#head").html(message);
 
                 if (data.location_suggestions.length === 0) {
 
                     $("#hits").html("<p>Unable to locate specified city name. Please check your spelling and try again.</p>");
                     return;
 
                 }
                 else {
 
                     apiData = data;
 
                     console.log("[api-Call] option: ", $("#cuisine-input option:selected").val());
 
                     if ($("#cuisine-input option:selected").val() === "null") {
 
                         for (let i = 0; i < data.location_suggestions.length; i++) {
 
                             var button = $("<button>");
                             button.text(data.location_suggestions[i].name);
                             button.val(data.location_suggestions[i].name);
                             button.attr('id', i);
                             button.attr('class', 'buttons cities');
                             $("#hits").append(button);
 
                         }
                     }
 
                 }
             }
         })
     });
 
     $(document).on("click", ".cities", function (event) {
 
         event.preventDefault();
 
         $("#head").empty();
         $("#hits").empty();
 
         $("#city-input").val($(this).val());
         console.log("City button 'this': ", $(this).val());
 
         $("#cuisine-input").css("display", "inline");
 
         var index = $(this).attr('id');
         cityId = apiData.location_suggestions[index].id;
 
         console.log("[In cities] index: " + index);
         console.log("[In cities] cityId: ", cityId);
 
         $.ajax({
             type: "GET",
             headers: {
                 'X-Zomato-API-Key': apiKey //only allowed non-standard header
             },
             url: cuisineSearchURL,
             dataType: 'json',
             data: {
                 city_id: cityId
             },
             processData: true, // Converts data to query string
             success: function (data) {
 
                 console.log("Cuisine apiData: ", data);
 
                 if (data.cuisines.length === 0) {
 
                     $("#hits").html("<p>Unable to locate restaurants serving " + cuisine + ". Please check your spelling and try again, or try a different cuisine and/or city.</p>");
                     return;
 
                 }
                 else {
 
                     for (let i = 0; i < data.cuisines.length; i++) {
 
                         var option = $("<option>");
                         option.val(data.cuisines[i].cuisine.cuisine_name);
                         option.text(data.cuisines[i].cuisine.cuisine_name);
                         option.attr("data-cuisineId", data.cuisines[i].cuisine.cuisine_id);
                         $("#cuisine-input").append(option);
 
                     }
 
                 }
             }
         });
     });
 
     $("#cuisine-input").on("change", function (event) {
 
         event.preventDefault();
         cuisine = $("#cuisine-input option:selected").val();
         city = $("#city-input").val();
 
         var message = $("<span>");
         message.text(cuisine + " Restaurants in " + city);
         $("#head").html(message);
 
         cuisineId = $("#cuisine-input option:selected").attr("data-cuisineId");
         console.log("[In Select handler] cuisineId: ", cuisineId);
 
         $.ajax({
             type: "GET",
             headers: {
                 'X-Zomato-API-Key': apiKey //only allowed non-standard header
             },
             url: searchURL,
             dataType: 'json',
             data: {
                 cuisines: cuisineId,
                 entity_id: cityId,
                 entity_type: 'city'
             },
             processData: true, // Converts data to query string
             success: function (data) {
 
                 console.log("Search apiData: ", data);
 
                 $("#hits").empty();
 
                 if (data.restaurants.length === 0) {
                     $("#hits").html("<p>Unable to locate restaurants serving " + cuisine + ". Please check your spelling and try again, or try a different cuisine and/or city.</p>");
                     return;
                 }
                 else if ($("#cuisine-input option:selected").val() === "null") {
                     return;
                 }
                 else {
 
                     // Display Restaurant Data
                     // Venue Info: Name, City, Address, <hr>, cuisines, cost, zomato url
 
                     for (let i = 0; i < data.restaurants.length; i++) {
 
                         var anchor = $("<a>");
                         var mainDiv = $("<div>");
                         var p = $("<p>");
                         var priceRange = data.restaurants[i].restaurant.price_range;
                         var span = $("<span>");
                         var subDiv1 = $("<div>");
                         var subDiv2 = $("<div>");
                         var subDiv3 = $("<div>");
 
                         subDiv1.append(data.restaurants[i].restaurant.name);
                         subDiv1.addClass("venueName");
                         subDiv2.append(data.restaurants[i].restaurant.location.city);
                         subDiv2.addClass("venueCity");
                         subDiv3.append(data.restaurants[i].restaurant.location.address + "<hr>");
                         p.append("Cuisines: " + data.restaurants[i].restaurant.cuisines + "<br>");
                         for (var cost = 0; cost < priceRange; cost++) {
                             span.append("$%");
                         }
                         p.append("Cost: ", span);
                         anchor.attr("href", data.restaurants[i].restaurant.url);
                         anchor.attr("target", "_blank");
                         anchor.text("Visit Zomato Restaurant Page");
                         p.append("<br>");
                         p.append(anchor);
                         subDiv3.append(p);
                         mainDiv.append(subDiv1);
                         mainDiv.append(subDiv2);
                         mainDiv.append(subDiv3);
                         mainDiv.addClass("venues");
 
                         $("#hits").append(mainDiv);
 
                     }
 
                     
                 }
             }
         });
     });
 });
 