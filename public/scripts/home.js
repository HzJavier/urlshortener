function init() {
  $(".chk").change(function(){
    if ($('.chk').is(':checked')){
      $('.divAdvanced').css('display', 'block');
    }else{
      $('.divAdvanced').css('display', 'none');
      $('#txtCustom').val('');
    }
  });

  $('#btnAdmin').on("click", function(){
    window.location = "/admin";
  });

  $('#txtCustom').keyup(function(){
    if ($(this).val().length == 0){
      $('.div').html('');
      $('#hf').val(true);
      return false;
    }
    if ($(this).val() == 'admin'){
      $('.div').html('<img src="cancel.png" />');
      return false;
    }
    $.ajax({
      'method': 'POST',
      'url': '/custom',
      'data': { 'text': $(this).val() },
      'success': function(data){
        $('.div').html('<img src="' + (data ? 'accept.png' : 'cancel.png') + '" />');
        $('#hf').val(data);
      }
    });
  });

  $('#btnShorten').on("click", function(){
    var hf = $('#hf').val();
    if (hf == 'false'){
      alert('The custum value you are trying to use is invalid');
      return false;
    }
    if ($('#txtCustom').val() == 'admin'){
      alert('Custom value cannot be admin');
      return false;
    }

    var text = $('#txt').val();
    var regex = new RegExp("((http|ftp|https)://)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?")
    if (text.length == 0){
      alert('You must write an url');
      return false;
    }
    if (!regex.test(text)){
      alert('Not a valid url');
      return false;
    }

    $.ajax({
      'method': 'post',
      'url': '/shorten',
      'data': { 'url': text, 'chk': $('#hf').val(), 'custom': $('#txtCustom').val() },
      'beforeSend': function(){
        $(".divResult").empty().append('<img src="images/loading.gif" />');
      },
      'success': function(data){
        $(".divResult").empty().append('<a href="'+data.url+'">'+data.url+'</a>').show();
      }
    });
  });
}

$(document).ready(init);
