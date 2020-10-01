import React, { Component } from 'react'

export class Pusher extends Component {
    componentDidMount() {
        this.props.history.push(`/${this.props.match.params.where}/${this.props.match.params.which}`);
    }
    render() {
        return (
            <div>
                <h1>Error 404</h1>
                <h2>Page Not Found</h2>
            </div>
        )
    }
}

export default Pusher
