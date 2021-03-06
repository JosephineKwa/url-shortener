$(document).ready(function () {
  $("#status-success .close").click(function() {
    $("#status-success").addClass("d-none");
  });

  $("#shorten-button").click(function() {
    var url = $("#url-input").val();
    var exp = $("#exp-input").val() === "" ? 86400 : Math.floor($("#exp-input").val());
    $.post("http://urlshortener.com/api/urls", { url: url, exp: exp },
    function(data, status, xhr) {
      if (xhr.status !== 201) {
        
      }

      $("#url-input").val("");
      $("#exp-input").val("");
      $("#status-success").removeClass("d-none");
      var shortUrl = "http://zen.xyz/" + data.url.shortid;
      $("#result").append('<li class="list-group-item"><a href="' + shortUrl + '">' + shortUrl + '</a> (' + url + ')</li>');
    });
  });
});