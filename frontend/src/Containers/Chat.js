import React from "react";
import WebSocketInstance from "../websocket";
import { connect } from 'react-redux';
import Hoc from '../hoc/hoc';


class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {message: ''}
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
                }else {WebSocketInstance.connect();
                    console.log("waiting for connection....");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    scrollToBottom = () => {
        this.messageEnd.scrollIntoView({behavior: "smooth"});
    }

    componentDidUpdate () {
        this.scrollToBottom();
    }

    componentDidMount() {
        this.scrollToBottom();
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



    renderTimestamp = timestamp => {
        let prefix = "";
        const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/600000)
        if (timeDiff < 60 && timeDiff > 1) {
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24*60 && timeDiff > 60) {
            prefix = `${Math.round(timeDiff/60)} hours ago`;
        } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
            prefix = `${Math.round(timeDiff/60*24)} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix;
    }

    renderMessages = (messages) => {
        const currentUser = this.props.username;
        return messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{marginBottom: arr.length - 1 === i ? '300px' : '15px'}}
                className={message.author === currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>
                    {message.content}
                    <br/>
                    <small>
                        {this.renderTimestamp(message.timestamp)}
                    </small>
                </p>
            </li>
        ));
    }

    render(){
        const messages = this.state.messages;
        return(
            <Hoc>
                <div className="messages">
                    <ul id="chat-log">
                    { 
                        messages && 
                        this.renderMessages(messages) 
                    }
                    <div style={{ float: "left", clear: "both"}}
                        ref={(el) => {this.messageEnd = el; }}>
                    </div>
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
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        username: state.username
    }
}

export default connect(mapStateToProps)(Chat); 
