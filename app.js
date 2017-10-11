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

	function Chat(userId) {
		this.userId = userId;
	}

	Chat.prototype.getMessageInput = function() {
		return document.querySelector('#chat-input-a');
	};
		
	Chat.prototype.renderChatWindow = function(userId) {
		var chatMessages = chatController.getChatMessages('a');
		var html = '';

		html += '<div class="chat-window chat-window-' + userId + '">';
		html += '	<div class="chat-recipient">dasdsadas</div>';
		html += '	<div class="chat-messages">' + this.renderChatMessages(chatMessages) + '</div>';
		html += '	<input type="text" id="chat-input-' + userId + '" class="chat-input"/>';
		html += '</div>';

		document.body.innerHTML += html;
	};
	
	Chat.prototype.renderMessage = function(message) {
		var sender = chatController.getUserById(message.userId);
		var date = message.createDate;
		var html = '';

		html += '<div class="message">';
		html += '	<p class="message-sender">' + sender.name + '</p>';
		html += '	<p class="message-content">'+ message.message + '</p>';
		html += '	<p class="message-date">On: '+ date + '</p>';
		html += '</div>';

		return html;
	};

	Chat.prototype.renderChatMessages = function(messages) {
		var html = '';
		var _this = this;

		messages.forEach(function(message) {
			html += '<div>' + this.renderMessage(message) + '</div>';	
		}, _this);

		return html;
	};
		
	Chat.prototype.bindEvents = function() {
		document.addEventListener("keypress", function(e) {
			var input = this.getMessageInput();
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
	}

	Chat.prototype.render = function() {
		this.renderChatWindow(this.userId);
	}
	
	Chat.prototype.init = function() {
		this.render();
		this.bindEvents();
	}

	const Chats = {
		chatWindows: [],
		create: function() {
			var users = model.users;
			var _this = this;

			users.forEach(function(user) {				
				_this.chatWindows.push(new Chat(user.id));
				_this.render(user.id);	
			});

			console.log(this.chatWindows);
		},
		render: function(userId) {
			var _this = this;

			_this.chatWindows.forEach(function(chatWindow) {
				chatWindow.render();
			});
		},
		init: function() {
			this.create();
		}
	}

	const chatApp = {
		init: function() {
			this.render();
		},
		render: function() {
			Chats.init();
		}
	};

	chatApp.init();

})(window);