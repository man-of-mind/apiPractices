import React from "react";
import WebSocketInstance from "../websocket";


class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.waitForSocketConnection(() => {
            WebSocketInstance.addCallbacks(
                this.setMessages.bind(this),
                this.addmessasge.bind(this));
            WebSocketInstance.fetchMessages(this.props.currentUser);
        });
    }

    setMessages(messages) {
        this.setState({messages: messages.reverse()});
    }

    addmessasge(message) {
        this.setState({
            messages: [...this.state.messages, message]
        });
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function() {
                if (WebSocketInstance.state() === 1) {
                    console.log("connection is secure");
                    callback();
                    return;
                }else {
                    console.log("waiting for connection....");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    componentDidMount() {
        WebSocketInstance.connect();
    }

    changeMessagehandler = event => {
        this.setState({
            message: event.target.value
        });
    }

    sendMessageHandler = e => {
        e.preventDefault();
        const messageObject = {
            from: 'admin',
            content: this.state.message
        }
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({
            message: ''
        });
    }

    renderMessages = (messages) => {
        const currentUser = "admin";
        return messages.map(message => (
            <li
                key={message.id}
                className={message.author === currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>
                    {message.content}
                    <br/>
                    <small>
                        {Math.round((new Date().getTime() - new Date(message.timestamp).getTime())/600000)} minutes ago
                    </small>
                </p>
            </li>
        ));
    }

    render(){
        const messages = this.state.messages;
        return(
            <div>
                <div className="messages">
                    <ul id="chat-log">
                    { 
                        messages && 
                        this.renderMessages(messages) 
                    }
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input 
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required 
                                id="chat-message-input" 
                                type="text" 
                                placeholder="Write your message..." />
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Chat; 