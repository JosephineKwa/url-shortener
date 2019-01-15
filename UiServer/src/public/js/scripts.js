$(document).ready(function () {
  $("#status-success .close").click(function() {
    $("#status-success").addClass("d-none");
  });

  $("#shorten-button").click(function() {
    var url = $("#url-input").val();
    var exp = $("#exp-input").val() === "" ? 86400 : Math.floor($("#exp-input").val());
    $.post("http://http://zen.xyz/api/urls", { url: url, exp: exp },
    function(data, status, xhr) {
      if (xhr.status !== 201) {
        
      }

      $("#url-input").val("");
      $("#exp-input").val("");
      $("#status-success").removeClass("d-none");
      $("#result").append('<li class="list-group-item">http://zen.xyz/' + data.url.shortid + '</li>');
    });
  });
});