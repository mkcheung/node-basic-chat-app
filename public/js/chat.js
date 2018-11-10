let socket = io();

function scrollToBottom(){
	let messages = jQuery('#messages');
	let newMessage = messages.children('li:last-child');

	let clientHeight = messages.prop('clientHeight');
	let scrollTop = messages.prop('scrollTop');
	let scrollHeight = messages.prop('scrollHeight');
	let newMessageHeight = newMessage.innerHeight();
	let lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
		messages.scrollTop(scrollHeight); //set height to bottom of container to scroll to bottom
	}
}


socket.on('connect', function(){
	let params = jQuery.deparam(window.location.search);
	socket.emit('join', params, function(err){
		if(err){
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
});

socket.on('disconnect', function(){
	console.log('disconnected to server');
});

socket.on('updateUserList', function(users){
	let ol = jQuery('<ol></ol>');

	users.forEach(function(user) {
		ol.append(jQuery('<li></li>').text(user))
	});

	jQuery('#users').html(ol);
});

socket.on('newMessage', function(data){

	let formattedTime = moment(data.createdAt).format('h:mm a');

	let template = jQuery('#message-template').html();
	let html = Mustache.render(template, {
		text:data.text,
		from:data.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function(msg){
	let formattedTime = moment(msg.createdAt).format('h:mm a');

	let template = jQuery('#location-message-template').html();
	let html = Mustache.render(template, {
		url:msg.url,
		from:msg.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
});

jQuery('#message-form').on('submit', function(e){
	e.preventDefault();

	let msgBox = jQuery('[name=message]');

	socket.emit('createMessage',{
		"text":msgBox.val()
	}, function(){
		msgBox.val('');
	});
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function(){

	if(!navigator.geolocation){
		return alert('geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled');

	navigator.geolocation.getCurrentPosition(function(position){
		locationButton.removeAttr('disabled');
		socket.emit('createLocationMessage', {
			latitude:position.coords.latitude,
			longitude:position.coords.longitude,
		});
		console.log(position);
	}, function(){
		locationButton.removeAttr('disabled');
		alert('unable to get location');
	});
});