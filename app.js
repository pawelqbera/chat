(function(window) {
	
	// zalożenia:
	// 2 okienka czatu // DONE
	// 2 userow z name i id // DONE
	// daty wiadomosci // DONE
	// 2 inputy // DONE
	// na enter wysyla sie to co wpisales i pojawia w okienkach obu userow - message + kto wyslal - user.name
	// czat - rozmowa - jest tylko 1 - w danej chwili //DONE
	// skrypt powoduje, że okienka się same pojawiają na stronie i sa zafixowane do bottom; jedno z lewej - drugie z prawej //DONE

	const model = {
		chats: [
			{
				id: 'a',
			}
		],
		users: [
			{
				name: 'johnny',
				id: 'a',
			}, {
				name: 'paul',
				id: 'b',
			}
		],
		messages: [
			{
				chatId: 'a',
				userId: 'b',
				createDate: 1507672886403,
				message: 'Hello Johhny!',
			}, {
				chatId: 'a',
				userId: 'a',
				createDate: 1507672937750,
				message: 'Hi paul. Whats up?',
			}, {
				chatId: 'a',
				userId: 'b',
				createDate: 1507673000694,
				message: 'Howr you doing Johnny?',
			}, {
				chatId: 'a',
				userId: 'a',
				createDate: 1507673014063,
				message: 'Great! Thanks!',
			},
		]
	};

	const chatController = {
		getChatMessages: function(chatId) {
			return model.messages.filter(function(message) {
				return message.chatId === chatId;
			});
		},
		getUserById: function(userId) {
			return model.users.find(function(user) {
				return user.id = userId;
			})
		},
		setMessage: function(message) {
			model.messages.push(message);
			chat.render();
		}
	};

	const bindEvents = function() {
		document.addEventListener("keypress", function(e) {
			var input = chatView.getMessageInput();

			messageSendHandle(e);
		}, false);

		function messageSendHandle(e) {
			var input = e.currentTarget.querySelector('#chat-input-a');
			var key = e.which || e.keyCode;
			var message = {
				chatId: model.chats[0].id,
				userId: 'a',
				createDate: new Date(),
				message: input.value
			};
			var chatMessagesContainer = document.querySelector('.chat-messages');

			console.log('odpalam eventa');
			console.log(input.value);

			if (key === 13 && input.value.length !== 0) {
				chatController.setMessage(message);
			}
		}
	};

	const chatView = {
		getMessageInput: function() {
			return document.querySelector('#chat-input-a');
		},
		renderChatWindow: function(userId) {
			var chatMessages = chatController.getChatMessages('a');
			var html = '';

			html += '<div class="chat-window chat-window-' + userId + '">';
			html += '	<div class="chat-recipient">dasdsadas</div>';
			html += '	<div class="chat-messages">' + this.renderChatMessages(chatMessages) + '</div>';
			html += '	<input type="text" id="chat-input-' + userId + '" class="chat-input"/>';
			html += '</div>';

			document.body.innerHTML += html;
		},
		renderMessage: function(message) {
			var sender = chatController.getUserById(message.userId);
			var date = message.createDate;
			var html = '';

			html += '<div class="message">';
			html += '	<p class="message-sender">' + sender.name + '</p>';
			html += '	<p class="message-content">'+ message.message + '</p>';
			html += '	<p class="message-date">On: '+ date + '</p>';
			html += '</div>';

			return html;
		},
		renderChatMessages: function(messages) {
			var html = '';
			var _this = this;

			messages.forEach(function(message) {
				html += '<div>' + this.renderMessage(message) + '</div>';	
			}, _this);

			return html;
		},
		render: function() {
			// TODO: zamienić na render chat windows
			this.renderChatWindow('a');
			this.renderChatWindow('b');
		}
	};

	const chat = {
		init: function() {
			this.render();
			bindEvents();
		},
		render: function() {
			chatView.render();
		}
	};

	chat.init();


})(window);