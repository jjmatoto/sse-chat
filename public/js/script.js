$(document).ready(function(){

	var src = new EventSource("api/chat/stream"),
	out = $("#out"),
	form = $("#chat_form");
	src.onmessage = function(e) {
		console.log("ha llegado un paqute! " + e);

		var data = JSON.parse(e.data);
		data.forEach(function(item){
			var spanAut = "<span>"+item.autor+"</span>",
			spanTxt = "<span>"+item.text+"</span>",
			spanDate = "<span>"+item.date+"</span>",
			divMsg = "<div>"+spanAut+spanTxt+spanDate+"</div>";
			out.append(divMsg);
		});
	};

	$.ajax('api/chat').done(function(data){
		var data = JSON.parse(data);
		data.forEach(function(item){
			var spanAut = "<span>"+item.autor+"</span>",
			spanTxt = "<span>"+item.text+"</span>",
			spanDate = "<span>"+item.date+"</span>",
			divMsg = "<div>"+spanAut+spanTxt+spanDate+"</div>";
			out.append(divMsg);
		});
	})

	form.on("submit", function(e){
		e.preventDefault();
		$.post(	"api/chat/", form.serialize())
		.done(function( msg ) {
			console.log( "Data Saved: " + msg );
		});
	});
});