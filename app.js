(function(window) {
	
	// zalożenia:
	// 2 okienka czatu // DONE
	// 2 userow z name i id // DONE
	// daty wiadomosci // DONE
	// 2 inputy // DONE
	// na enter wysyla sie to co wpisales i pojawia w okienkach obu userow - message + kto wyslal - user.name
	// czat - rozmowa - jest tylko 1 - w danej chwili //DONE
	// skrypt powoduje, że okienka się same pojawiają na stronie i sa zafixowane do bottom; jedno z lewej - drugie z prawej //DONE

	//BUGI:
	// - pierwsze okno czatu tworzy się 2 razy //DONE
	// - event listener wywoluje sie trzy razy // DONE
	// - poprawne synchro nowych wiadomosci między oknami
	// - poprawne wyswietlanie sender nameow (wszędzie jest johnny)

	// dodać bazę z session storage

	const model = {
		chatStorage: localStorage,
		chats: [
			{
				id: 'a',
			}
		],
		//Local Storage API
		fetchMessagesFromStorage: function() {
			return JSON.parse(this.chatStorage.getItem('messages')) || [];
		},
		setMessagesToStorage: function(messages) {
			this.chatStorage.setItem('messages', JSON.stringify(messages));
		},
		fetchUsersFromStorage: function() {
			return JSON.parse(this.chatStorage.getItem('users')) || [];
		},
		setUsersToStorage: function(users) {
			this.chatStorage.setItem('users', JSON.stringify(users));
		},

		// Model API
		setMessage: function(message) {
			var messageData = this.fetchMessagesFromStorage();

			messageData.push(message);
			this.setMessagesToStorage(messageData);
		},
		getMessages: function(chatId) {
			var messageData = this.fetchMessagesFromStorage();
			var messages = messageData ? messageData.filter(function(message) {
				return message.chatId === chatId;
			}) : [];

			return messages;
		},
		getUsers: function() {
			var userData = this.fetchUsersFromStorage();
			var users = userData ? userData : [];

			return users;
		},
 		getUserById: function(userId) {
			var userData = this.fetchUsersFromStorage();

			return userData.find(function(user) {
				return user.id === userId;
			})
		},
		setUser: function(name) {
			var userData = this.fetchUsersFromStorage();
			var user = {
				id: userData.length,
				name: name
			}

			userData.push(user);
			this.setUsersToStorage(userData);
		}
	};

	const chatController = {
		fetchChatMessages: function(chatId) {
			return model.getMessages(chatId);
		},
		fetchUsers: function() {
			return model.getUsers();
		},
		fetchUserById: function(userId) {
			return model.getUserById(userId);
		},
		addMessage: function(message) {
			model.setMessage(message);
		},
		addUser: function(name) {
			model.setUser(name); 
		}
	};

	function Chat(userId, recipientId) {
		this.userId = userId;
		this.recipientId = recipientId;
	}

	Chat.prototype.getMessageInput = function() {
		return document.querySelector('#chat-input-' + this.userId);
	};
		
	Chat.prototype.renderChatWindow = function(userId, recipientId) {
		var chatMessages = chatController.fetchChatMessages('a');
		var html = '';
		var chatContainer = document.getElementById("chat-container") ? document.getElementById("chat-container") : createChatContainer();

		function createChatContainer() {
			var node = document.createElement("div");
			node.setAttribute("id", "chat-container");
			document.body.appendChild(node);

			return node;
		}

		html += '<div class="chat-window chat-window-' + userId + '">';
		html += '	<div class="chat-recipient">' + chatController.fetchUserById(recipientId).name + '</div>';
		html += '	<div class="chat-messages" id="chat-messages-' + userId + '">' + this.buildMessages(chatMessages) + '</div>';
		html += '	<input type="text" id="chat-input-' + userId + '" class="chat-input"/>';
		html += '</div>';

		chatContainer.innerHTML += html;
	};
	
	Chat.prototype.buildMessage = function(message) {
		var sender = chatController.fetchUserById(message.senderId);

		var date = message.createDate;
		var html = '';

		html += '<div class="message">';
		html += '	<p class="message-sender">' + sender.name + '</p>';
		html += '	<p class="message-content">'+ message.message + '</p>';
		html += '	<p class="message-date">On: '+ date + '</p>';
		html += '</div>';

		return html;
	};

	Chat.prototype.buildMessages = function(messages) {
		var html = '';
		var _this = this;

		messages && messages.forEach(function(message) {
			html += '<div>' + this.buildMessage(message) + '</div>';	
		}, _this);

		return html;
	};

	Chat.prototype.bindEvents = function() {
		console.log('wywoluje bind events dla:' + this.userId);

		var _this = this;
		document.addEventListener("keydown", messageSendHandle, false);

		function messageSendHandle(e) {
			console.log('message send wywola?');

			var input = document.querySelector('#chat-input-' + _this.userId);
			var key = e.which || e.keyCode;
			var message = {
				chatId: model.chats[0].id,
				senderId: _this.userId,
				recipientId: _this.recipientId,
				createDate: new Date(),
				message: input.value
			};

			console.log('odpalam eventa');
			console.log('puszczony key:');
			console.log(e.key);
			console.log('value w inpucie:');
			console.log(input.value);

			if (key === 13 && input.value.length !== 0) {
				chatController.addMessage(message);
				_this.renderNewMessage(message);
				input.value = '';
			}
		}
	};

	Chat.prototype.renderNewMessage = function(message) {
		var node = document.createElement("div");
		node.innerHTML = '<div>' + this.buildMessage(message) + '</div>';
		document.getElementById('chat-messages-' + this.userId).appendChild(node);
	}

	Chat.prototype.render = function() {
		console.log('wywoluje redner okna dla sendera: ' + this.userId + ' i odbiorcy: ' + this.recipientId);
		this.renderChatWindow(this.userId, this.recipientId);		
	};
	
	Chat.prototype.init = function() {
		this.render();
		this.bindEvents();
	};

	const Chats = {
		chatWindows: [],
		create: function() {
			var users = chatController.fetchUsers();
			var _this = this;

			users.forEach(function(user, index) {	
				_this.chatWindows.push(new Chat(user.id, 0));	
			});

			this.render();
		},
		render: function(userId) {
			var _this = this;

			_this.chatWindows.forEach(function(chatWindow) {
				chatWindow.init();
			});
		},
		init: function() {
			this.create();
		}
	};

	const chatApp = {
		init: function() {
			Chats.init();
		}
	};

	chatApp.init();

	// API
	window.addUser = chatController.addUser;

})(window);