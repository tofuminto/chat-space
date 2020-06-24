$(function(){
  function buildHTML(message) {
    if (message.image){
      var html = 
        `<div class="messages" data-message-id=${message.id}>
          <div class="message__user">
            <div class="message__user--name">
              ${message.user_name}
            </div>
            <div class="message__user--posting">
              ${message.created_at}
            </div>
          </div>
          <p class="message__content">
            ${message.content}
          </p>
          <img src="${message.image}" class="message__image" >
        </div>`
      return html;
    } else {
      var html = 
        `<div class="messages" data-message-id=${message.id}>
          <div class="message__user">
            <div class="message__user--name">
              ${message.user_name}
            </div>
            <div class="message__user--posting">
              ${message.created_at}
            </div>
          </div>
          <p class="message__content">
            ${message.content}
          </p>
        </div>`
      return html;
    };
  }

  $('#new_message').on('submit',function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done (function(data){
      var html = buildHTML(data);
      $('.chat__main__message--list').append(html);
      $('.chat__main__message--list').animate({ scrollTop: $('.chat__main__message--list')[0].scrollHeight});
      $('form')[0].reset();
    })
    .fail (function() {
      alert("メッセージ送信に失敗しました");
    })
    .always (function() {
      $('.submit__btn').prop('disabled', false);
    });
  });
  var reloadMessages = function() {
    var last_message_id = $('.messages:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat__main__message--list').append(insertHTML);
        $('.chat__main__message--list').animate({ scrollTop: $('.chat__main__message--list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});