import React from 'react'

class NewRoomForm extends React.Component {
    render () {
        return (
            <div>
                <form className="new-room-form">
                    <input
                        type="text"
                        placeholder="Create a room"
                        required />
                    <button id="create-room-btn" type="submit">+</button>
                </form>
            </div>
        )
    }
}

export default NewRoomForm