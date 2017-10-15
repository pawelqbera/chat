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
	// - poprawne synchro nowych wiadomosci między oknami //DONE
	// - poprawne wyswietlanie sender nameow (wszędzie jest johnny) // DONE

	// dodać bazę z session storage // DONE
	// dodać API, wystawić API z metodą dodawania usera na zewnątrz // DONE
	// wystawić metodę dodawania chatu na zewnątrz // DONE
	// dodać scroll to Botoom, gdy render i nowa wiadomosc // DONE


	const model = {
		chatStorage: localStorage,
		//Local Storage API
		fetchChatsFromStorage: function() {
			return JSON.parse(this.chatStorage.getItem('chats')) || [];
		},
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
		setChatsToStorage: function(chats) {
			this.chatStorage.setItem('chats', JSON.stringify(chats));
		},

		// Model API
		getChats: function() {
			var chatData = this.fetchChatsFromStorage();
			var chats = chatData ? chatData : [];

			return chats;
		},
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
			});
		},
		setUser: function(name) {
			var userData = this.fetchUsersFromStorage();
			var user = {
				id: userData.length,
				name: name
			};

			userData.push(user);
			this.setUsersToStorage(userData);
		},
		setChat: function(userId, recipientId) {
			var chatData = this.fetchChatsFromStorage();
			var chat = {
				id: chatData.length,
				userId: userId,
				recipientId: recipientId,
			};

			chatData.push(chat);
			this.setChatsToStorage(chatData);
		},
		deleteChat: function(chatId) {
			var chatData = this.fetchChatsFromStorage();

			chatData.splice(chatId, 1);
			this.setChatsToStorage(chatData);
		}
	};

	const chatController = {
		fetchChats: function() {
			return model.getChats();
		},
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
		},
		addChat: function(userId, recipientId) {
			model.setChat(userId, recipientId);
			view.render();
		},
		removeChat: function(chatId) {
			model.deleteChat(chatId);
			view.render();
		}
	};

	function Chat(chat) {
		this.chatId = chat.id;
		this.userId = chat.userId;
		this.recipientId = chat.recipientId;
	}

	Chat.prototype.getMessageInput = function() {
		return document.querySelector('#chat-input-' + this.userId);
	};
		
	Chat.prototype.renderChatWindow = function() {
		var chatMessages = chatController.fetchChatMessages(this.chatId);
		var html = '';
		var chatContainer = document.getElementById("chat-container") ? document.getElementById("chat-container") : createChatContainer();

		html += '<div class="chat-window chat-window-' + this.userId + '">';
		html += '	<div class="chat-recipient">' + chatController.fetchUserById(this.recipientId).name + '</div>';
		html += '	<div class="chat-messages" id="chat-messages-' + this.userId + '">' + this.buildMessages(chatMessages) + '</div>';
		html += '	<input type="text" id="chat-input-' + this.userId + '" class="chat-input"/>';
		html += '	<div class="chat-window-sender">Message Sender: <strong>' + chatController.fetchUserById(this.userId).name + '</strong></div>';
		html += '</div>';

		chatContainer.innerHTML += html;
		this.scrollToBottom();

		function createChatContainer() {
			var node = document.createElement("div");
			node.setAttribute("id", "chat-container");
			document.body.appendChild(node);

			return node;
		}
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
				chatId: _this.chatId,
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

	Chat.prototype.scrollToBottom = function() {
		var chatMessages = document.getElementById("chat-messages-" + this.userId);
		return chatMessages.scrollTop = chatMessages.scrollHeight;
	}

	Chat.prototype.renderNewMessage = function(message) {
		var node = document.createElement("div");
		node.innerHTML = '<div>' + this.buildMessage(message) + '</div>';
		document.getElementById('chat-messages-' + this.userId).appendChild(node);

		this.scrollToBottom();
	}

	Chat.prototype.render = function() {
		console.log('wywoluje redner okna dla sendera: ' + this.userId + ' i odbiorcy: ' + this.recipientId);

		this.renderChatWindow();	
	};
	
	Chat.prototype.init = function() {
		this.render();
		this.bindEvents();
	};

	const view = {
		chatWindows: [],
		render: function(userId) {
			var chats = chatController.fetchChats();
			var _this = this;

			// sprawdzenie czy 
			this.chatWindows.forEach(chatWindow => {
				chats.forEach(chat => {
					if (chatWindow.chatId === chat.id) {
						console.log('splicuje');
						chats.splice(chatWindow.id, 1);
					}
				});
				chatWindow.init();
			});

			console.log('powinny byc wywalone chats: ');
			console.log(chats);

			chats.forEach(function(chat) {
				console.log('nowa instacja' + chat);
				_this.chatWindows.push(new Chat(chat));
			});

			// render ale tylko te co nie są już rendered

			// render chat windows for instantiated Chat objects
			this.chatWindows.forEach(function(chatWindow) {
				console.log('init');
				chatWindow.init();
			});
		},
		init: function() {
			this.render();
		}
	};

	const chatApp = {
		init: function() {
			view.init();
		}
	};

	chatApp.init();

	// API
	window.addUser = chatController.addUser;
	window.addChat = chatController.addChat;
	window.removeChat = chatController.removeChat;
	window.chatWindows = view.chatWindows;

})(window);