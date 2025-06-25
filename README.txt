# 💬 Advanced Real-Time Chat Room

A feature-rich, modern real-time chat application built with **Node.js**, **Express**, and **Socket.IO**. This application provides a professional chat experience with advanced features like private messaging, user management, and real-time interactions.

## ✨ Features

### 🎯 Core Chat Features
- **Real-time messaging** with instant message delivery
- **Nickname system** with validation and duplicate prevention
- **Smart message handling** - messages appear immediately for sender
- **Message timestamps** for all conversations
- **Connection/disconnection broadcasts** with system notifications

### 👥 User Management
- **Online users display** with real-time user count
- **User join/leave notifications** with system messages
- **Click-to-chat** - click users in sidebar to start private conversations
- **User status tracking** with proper cleanup on disconnect

### 💌 Private Messaging
- **Public/Private message toggle** with dropdown recipient selection
- **Private message styling** with special visual indicators
- **User-to-user private conversations** with secure delivery
- **Recipient validation** with error handling

### 🎨 User Experience
- **Dark/Light mode toggle** with theme persistence
- **Typing indicators** showing when users are typing
- **Responsive design** that works on desktop and mobile
- **Modern UI** with smooth animations and transitions
- **Real-time typing status** with automatic timeout

### 🔧 Technical Features
- **Modular code structure** with separated CSS, JS, and HTML
- **Error handling** with user-friendly error messages
- **Input validation** for nicknames and messages
- **Automatic scrolling** to latest messages
- **Cross-browser compatibility**

### Usage

1. **Enter your nickname** when prompted (2-20 characters)
2. **Start chatting** in the public room
3. **Use the sidebar** to see online users
4. **Send private messages** by selecting "Private" and choosing a recipient
5. **Toggle dark/light mode** using the button in the header
6. **Watch for typing indicators** when others are typing

## 📁 Project Structure

```
chat-room/
├── server.js              # Main server file with Socket.IO logic
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── README.txt            # This documentation file
└── public/               # Frontend assets
    ├── index.html        # Main HTML file
    ├── styles.css        # All CSS styles and theming
    └── script.js         # Client-side JavaScript logic
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Styling with CSS variables for theming
- **Vanilla JavaScript** - Client-side functionality
- **Socket.IO Client** - Real-time communication

## 🎨 Features in Detail

### Nickname System
- Users must enter a unique nickname to join
- Validation prevents duplicate nicknames
- Nickname length validation (2-20 characters)
- Error messages for invalid nicknames

### Real-Time Features
- **Instant messaging** with no page refresh needed
- **Live typing indicators** showing who's currently typing
- **Real-time user list** updates when users join/leave
- **Connection status** with automatic reconnection

### Private Messaging
- Toggle between public and private message modes
- Dropdown selection for private message recipients
- Special styling for private messages
- Click users in sidebar to quickly start private conversations

### Theme System
- Dark and light mode support
- Theme persistence across browser sessions
- Smooth transitions between themes
- CSS variables for easy theme customization

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Adaptive layout that hides sidebar on small screens
- Touch-friendly interface elements
- Optimized for different screen sizes

## 🔧 Customization

### Adding New Themes
Edit the CSS variables in `public/styles.css`:
```css
:root {
    --bg-color: #your-color;
    --text-color: #your-color;
    /* Add more variables as needed */
}
```

### Modifying Server Logic
The main server logic is in `server.js`:
- User management in the `users` Map
- Message handling in socket event listeners
- Broadcasting logic for real-time updates

### Styling Changes
All styles are in `public/styles.css`:
- CSS variables for easy theming
- Responsive breakpoints for mobile
- Component-specific styling sections

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `server.js` (line 29)
   - Or kill the process using the current port

2. **Socket.IO connection issues**
   - Check if the server is running
   - Ensure no firewall is blocking the connection
   - Verify the correct URL in the browser

3. **Nickname not working**
   - Ensure nickname is 2-20 characters
   - Check that the nickname isn't already taken
   - Refresh the page if needed

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation


## 🙏 Acknowledgments

- Built with Socket.IO for real-time communication
- Inspired by modern chat applications
- Uses modern web technologies for optimal performance

---

**Happy Chatting! 💬✨**