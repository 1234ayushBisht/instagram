import React, { Component } from 'react'
import Posts from './Posts'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Container } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import GroupIcon from '@material-ui/icons/Group'

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            posts: null
        }
    }

    componentDidMount = () => {
        fetch('/api/post/getPosts', {
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
                <div className="d-flex-r">
                    <Container maxWidth="sm">
                        <div className="d-flex-r">
                            <div className="d-flex-c">
                                <div>
                                    {
                                        this.state.posts.map(post => <Posts key={post._id} post={post} user={this.state.user} />)
                                    }
                                </div>
                            </div>
                            <div className="simple-info">
                                <Card>
                                    <CardContent>
                                        <div className="d-flex-r f-center">
                                            <Link to={`/dashboard`}>
                                                <img style={{margin:"0px"}} src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${this.state.user.userId}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="post-img" className="post-small-img circle" />
                                            </Link>
                                            <div>
                                                <CardHeader
                                                    title={this.state.user.userId}
                                                    subheader={this.state.user.name}
                                                />
                                            </div>
                                        </div>
                                        <Typography color="textSecondary">
                                            You On Instagram
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            {this.state.user.desc}
                                            <br />
                                        </Typography>
                                        <Typography variant="body2" component="h4" className="follow-info">
                                            <GroupIcon fontSize="large"/>{this.state.user.followers.length} follower
                                            <br />
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Link to="/dashboard">
                                            <Button size="large">View Profile</Button>
                                        </Link>
                                    </CardActions>
                                </Card>
                            </div>
                        </div>
                    </Container>
                </div>
                :
                <div className="app-progress">
                    <CircularProgress color="secondary" />
                </div>
        )
    }
}

export default Home
