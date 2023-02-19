$(document).ready(function () {
  var today = new Date();
  var year = today.getFullYear();
  $("#copyright_year").html(year);

  $.ajax({
    url: "https://millenniumwebworks.com/wp-json/wp/v2/portfolio?_embed&orderby=menu_order&order=asc",
    type: "GET",
    success: (result) => {
      var imgs = "";
      for (var i = 0; i < result.length; i++) {
        var altdata = result[i]["_embedded"]["wp:featuredmedia"][0]["alt_text"];
        var imgpath = result[i]["_embedded"]["wp:featuredmedia"][0]["media_details"]["sizes"]["large"]["source_url"];
        var active = i == 0 ? " active" : "";
        imgs += '<div class="carousel-item' + active + '"><img src="' + imgpath + '" class="img-fluid" alt="' + altdata + '" /></div>';
      }
      $("#portfolio__contents > .carousel-inner").html(imgs);
      $("#portfolio__contents").carousel();
    },
  });
});

$("#contact-form").submit(function (event) {
  event.preventDefault(); // Prevent direct form submission
  $("#alert").text("Processing...").fadeIn(400); // Display "Processing" to let the user know that the form is being submitted
  grecaptcha.ready(function () {
    grecaptcha
      .execute("6LctkFcbAAAAAFrqgbEkafkgpnr2Vj9gvmD7GsvW", {
        action: "contact",
      })
      .then(function (token) {
        var recaptchaResponse = document.getElementById("recaptchaResponse");
        recaptchaResponse.value = token;
        // Make the Ajax call here
        $.ajax({
          url: "mail.php",
          type: "post",
          data: $("#contact-form").serialize(),
          dataType: "json",
          success: function (_response) {
            // The Ajax request is a success. _response is a JSON object
            var error = _response.error;
            var success = _response.success;
            if (error != "") {
              // In case of error, display it to user
              $("#alert").html(error);
            } else {
              // In case of success, display it to user and remove the submit button
              $("#alert").html(success);
              $("#submit-button").remove();
            }
          },
          error: function (jqXhr, json, errorThrown) {
            // In case of Ajax error too, display the result
            var error = jqXhr.responseText;
            $("#alert").html(error);
          },
        });
      });
  });
});
