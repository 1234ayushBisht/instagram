import React, { Component } from 'react'
import Posts from './Posts'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Container } from '@material-ui/core'

export class LikedPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            posts: null
        }
    }

    componentDidMount = () => {
        fetch('/api/post/getLikedPost', {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ posts: data.success.reverse() })
                fetch('/api/profile/get-user', {
                    method: 'get',
                    headers: {
                        'Content-type': 'application/json',
                        'authorization': localStorage.getItem('jwtToken')
                    }
                })
                    .then(res => res.json())
                    .then(data_2 => {
                        this.setState({ user: data_2.success.user })
                    })
            })
            .catch(err => console.error(err));
    }

    render() {
        return (
            this.state.user !== null ?
                <Container maxWidth="sm">
                    <div className="d-flex-c">
                        <div>
                            {
                                this.state.posts.length !== 0 ?
                                    this.state.posts.map(post => <Posts key={post._id} post={post} user={this.state.user} />)
                                    :
                                    <div>
                                        <br />
                                        <h6 style={{ textAlign: 'center' }}><b>-No Post liked-</b></h6>
                                    </div>
                            }
                        </div>
                    </div>
                </Container>
                :
                <div className="app-progress">
                    <CircularProgress color="secondary" />
                </div>
        )
    }
}

export default LikedPost
