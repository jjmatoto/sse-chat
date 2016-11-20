var src, out, form, textarea, h = 1;
$(document).ready(function(){
	
	src = new EventSource("api/chat/stream");
	out = $("#out");
	form = $("#chat_form");
	textarea = $("#input textarea[name='txt']");

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

	textarea.keypress(function(e) {
		if(e.shiftKey && e.which==13){			
			textarea.css('height', (h++)+'em');
		}
		else if(!e.shiftKey && e.which==13){
			form.submit();
			restTextArea();
		}
		// else if(e.which==27){ esc keycode
		// 	restTextArea();
		// }
	});

	function restTextArea(){
		h= 1;
		textarea.css('height', h+'em');
		textarea.value = "";
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
