import React from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'

class App extends React.Component{

    constructor() {
        super();
        this.state = {
            roomID: null,
            messages:[],
            joinableRooms: [],
            joinedRooms: []
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.subscribeToRoom = this.subscribeToRoom.bind(this);
        this.getRooms = this.getRooms.bind(this);
    }

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId:'JoDavis1992',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })
        });

        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser;
            this.getRooms();
        })
        .catch(err => {
            console.log('Error on connection', err);
        })
    }

    getRooms()
    {
        this.currentUser.getJoinableRooms()
            .then(joinableRooms => {
                this.setState({
                    joinableRooms,
                    joinedRooms: this.currentUser.rooms
                })
            })
            .catch(err => console.log('error on joinableRooms', err));
    }

    subscribeToRoom(roomID)
    {
        this.setState({ messages: [] , roomID: roomID});
        this.currentUser.subscribeToRoom({
            roomId:roomID,
            messageLimit:100,
            hooks: {
                onMessage: message => {
                    this.setState({
                        messages:[...this.state.messages, message]
                    })
                }
            }
        }).then(room => {
            this.getRooms()
        }).catch(err => console.log('error on subscribing to room: ', err))
    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId:this.state.roomID
        })
    }

    createRoom(name) {
        this.currentUser.createRoom({
            name
        })
            .then(room => this.subscribeToRoom(room.id))
            .catch(err => console.log('error with createRoom: ', err))
    }

    render() {
        return (
            <div className="app">
                <RoomList
                    roomID = {this.state.roomID}
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.joinableRooms,...this.state.joinedRooms]}/>
                <MessageList messages={this.state.messages}/>
                <NewRoomForm createRoom={this.createRoom}/>
                <SendMessageForm sendMessage={this.sendMessage}/>
            </div>
        );
    }
}

export default App