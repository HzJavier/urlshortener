$(document).ready(function(){
  $('#btnHome').click(function(){
    window.location = "/";
  });
  $('#btnDeleteEmpty').on("click", function(){
    $.ajax({
      'method': 'POST',
      'url': '/deleteEmpty',
      'success': function(){
        loadUrls();
      }
    });
  });
  $(document).on("click", '.btnDelete', function(){
    var fullUrl = $(this).closest('tr').find('.fullUrl').html();
    $.ajax({
      'method': 'POST',
      'url': '/deleteUrl',
      'data': { 'fullUrl': fullUrl },
      'success': function(){
        loadUrls();
      }
    });
  });
  loadUrls();
});

function loadUrls(){
  $.ajax({
    'method': 'POST',
    'url': '/getUrls',
    'success': function(data){
      var table = new Array();
      table.push('<table class="table">');
      table.push('<thead>');
      table.push('<th></th>');
      table.push('<th>#</th>');
      table.push('<th>Long</th>');
      table.push('<th>Short</th>');
      table.push('<th>Clicks</th>');
      table.push('</thead>');
      table.push('<tbody>');
      var cont = 1;
      if (data.length == 0){
        table.push('<tr>');
        table.push('<td colspan=5 class="alert">No records found</td>');
        table.push('</tr>');
      }
      $.each(data, function(idx, item){
        table.push('<tr id="'+item._id+'">')
        table.push('<td><div class="btnDelete"></div></td>');
        table.push('<td>'+cont+'</td>');
        table.push('<td><div class="fullUrl">'+item.fullUrl+'</div></td>');
        table.push('<td><a href="http://localhost:3000/'+item.shortUrl+'">http://localhost:3000/'+item.shortUrl+'</a></td>');
        table.push('<td>'+item.count+'</td>');
        table.push('</tr>');
        cont++;
      });
      table.push('</tbody>');
      table.push('</table>');
      $('#divTable').empty().append(table.join(''));
    }
  });
}
