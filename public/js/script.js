var src, chat, login, out, form, textarea, h = 1, inputNickName, nickNameError;

$(document).ready(function(){

	var LS_KEY_NICKNAME = "nickname";
	
	src = new EventSource("api/chat/stream");
	out = $("#out");
	login = $("#login");
	chat = $("#chat");
	form = $("#chat_form");
	textarea = $("#input textarea[name='txt']");
	inputNickName = $("#login input[name='nickname']");
	nickNameError = $("#login #error");

	$("textarea[name=txt]").keypress(function(e) {
		if(!e.shiftKey && e.which==13){
			form.submit();
		}
	});
	
	function renderMsg(data){
		var spanAut = "<strong>"+data.autor+":</strong>",
		spanTxt = "<span>"+data.text+"</span>",
		spanDate = "<span class=\"date\">"+new Date(data.date).toLocaleTimeString()+"</span>",
		divMsg = "<div id=\"msg\">"+spanAut+spanTxt+spanDate+"</div>";
		out.append(divMsg);
		out.scrollTop(document.getElementById("out").scrollHeight);
	}

	src.onmessage = function(e) {
		var data = JSON.parse(e.data);
		renderMsg(data);
	};

	inputNickName.keypress(function(e) {
		if(e.which==13){
			if (inputNickName.val().length>=3){
				localStorage.setItem(LS_KEY_NICKNAME, inputNickName.val());
				inputNickName.val("");
				nickNameError.html("")			
				chat.toggle();
				login.toggle();
			} else {
				nickNameError.html("<p>El nick debe ser mas de 3 caracteres!!</p>");
			}
		}
	});


	textarea.keypress(function(e) {
		if(e.shiftKey && e.which==13){			
			textarea.css('height', (h++)+'em');
		}
		else if(!e.shiftKey && e.which==13){
			// form.submit();
			restTextArea();
		}
		// else if(e.which==27){ esc keycode
		// 	restTextArea();
		// }
	});

	function restTextArea(){
		h= 1;
		textarea.css('height', h+'em');
		textarea[0].value = "";
		textarea.focus();
	}

	function renderMsg(data){
		var spanAut = "<strong>"+data.autor+":</strong>",
		spanTxt = "<span>"+data.text+"</span>",
		spanDate = "<span class=\"date\">"+new Date(data.date).toLocaleTimeString()+"</span>",
		divMsg = "<div id=\"msg\">"+spanAut+spanTxt+spanDate+"</div>";
		out.append(divMsg);
	}

	form.on("submit", function(e){
		e.preventDefault();
		form[0][1].value = localStorage.getItem(LS_KEY_NICKNAME);
		$.post(	"/api/chat", form.serialize())
		.done(function( msg ) {
			console.log( "Data Saved: " + msg );
		});
	});

	$.ajax("api/chat").done(function(data){
		var data = JSON.parse(data);
		data.forEach(function(item){
			renderMsg(item);
		});
	})
});
