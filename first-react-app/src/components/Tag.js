import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Container, Modal } from '@material-ui/core'
import tagImg from '../images/hashtag.jpg'
import { Link } from 'react-router-dom'
import Posts from './Posts'

export class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            posts: null,
            tag: '',
            tag_followers: null,
            tagModal: false
        }
    }

    componentDidMount = () => {
        this.setState({ tag: `#${this.props.match.params.tag_name}` })
        fetch(`/api/tag/tagPost/${this.props.match.params.tag_name}`, {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ posts: data.success.posts.reverse() })
                this.setState({ tag_followers: { users: data.success.followers, len: data.success.followers.length } })
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

    followTag = () => {
        fetch(`/api/tag/follow/${this.props.match.params.tag_name}`, {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ user: data.success.user })
                this.setState({ tag_followers: data.success.tag_followers })
            })
            .catch(err => console.error(err))
    }

    launch_tagModal = () => {
        this.setState({ tagModal: true })
    }
    close_tagModal = () => {
        this.setState({ tagModal: false })
    }

    render() {
        let tagModalHtml =
            this.state.tagModal ?
                <Modal
                    open={this.state.tagModal}
                    onClose={this.close_tagModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="follow-modal">
                        <h5>Followers</h5>
                        <div className="d-flex-c">
                            {
                                this.state.tag_followers.users.map(f => (
                                    <div key={f._id}>
                                        <div className="d-flex-r f-center">
                                            <Link to={`/profile/${f.userId}`}>
                                                <img src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${f.userId}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="follower" />
                                            </Link>
                                            <h6><strong>{f.userId}</strong></h6>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Modal>
                :
                <></>

        return (
            this.state.user !== null ?
                <div>
                    <Container maxWidth="sm">
                        <div className="d-flex-r">
                            <div className="my-3 d-flex-c">
                                <img src={tagImg} alt="profile_img" className="responsive-img circle profile-img" onClick={this.openModal} />
                                {
                                    this.state.user.tags.includes(this.props.match.params.tag_name) ?
                                        <button onClick={this.followTag} className="my-3 btn waves-effect waves-light red ">UNFOLLOW</button>
                                        :
                                        <button onClick={this.followTag} className="my-3 btn waves-effect waves-light blue ">FOLLOW</button>
                                }
                            </div>

                            <Container maxWidth="lg">
                                <div className="d-flex-c info-box">
                                    <div>
                                        <h3>{this.state.tag}</h3>
                                    </div>
                                    <div className="c-pointer">
                                        <h6 onClick={this.launch_tagModal}><strong>{this.state.tag_followers.len}</strong> followers</h6>
                                    </div>
                                </div>
                            </Container>
                        </div>
                        {tagModalHtml}
                        <div>
                            {
                                this.state.posts.length !== 0 ?
                                    this.state.posts.map(post => <Posts key={post._id} post={post} user={this.state.user} />)
                                    :
                                    <div>
                                        <br />
                                        <h6 style={{ textAlign: 'center' }}><b>-No Post Found For This Tag-</b></h6>
                                    </div>
                            }
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

export default Tag
