import React, { Component } from 'react'
import M from 'materialize-css'
import { Container, Modal } from '@material-ui/core'
import { Link } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import Posts from './Posts'
import tagImg from '../images/hashtag.jpg'

import firebaseApp from '../firebase';
const db = firebaseApp.firestore()

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curr_user: null,
            user: null,
            posts: [],
            followerModal: false,
            followingModal: false,
            tagModal: false
        }
    }
    componentDidMount = () => {
        fetch(`/api/profile/get-profile/${this.props.match.params.userId}`, {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    return M.toast({ html: data.error })
                }
                fetch(`/api/profile/get-user`, {
                    method: 'get',
                    headers: {
                        'Content-type': 'application/json',
                        'authorization': localStorage.getItem('jwtToken')
                    }
                })
                    .then(res => res.json())
                    .then(data_2 => {
                        if (data_2.success.user.userId === this.props.match.params.userId) {
                            return this.props.history.push('/dashboard')
                        }
                        this.setState({ user: data.success.user })
                        this.setState({ posts: data.success.posts.reverse() })
                        this.setState({ curr_user: data_2.success.user })
                    }).catch(err => console.error(err))
            }).catch(err => console.error(err))
    }

    follow = () => {
        fetch(`/api/profile/follow/${this.state.user.userId}`, {
            method: 'put',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    return M.toast({ html: data.error })
                }
                let date = new Date()
                db.collection('notifications').add({
                    for: this.state.user.userId,
                    from: this.state.curr_user.userId,
                    message: `${this.state.curr_user.name} is following you.`,
                    title: "New Follower",
                    date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
                    post: 'https://cdn.shopify.com/s/files/1/0020/0196/0996/products/follower_191a853b-cc4b-4ba1-b14d-b06fc5455dcb_480x480.png?v=1530412174'
                })
                    .then((doc) => {
                        this.setState({ user: data.success.user })
                    })
                    .catch(err => console.error(err))
            }).catch(err => console.error(err))
    }

    unfollow = () => {
        fetch(`/api/profile/follow/${this.state.user.userId}`, {
            method: 'put',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    return M.toast({ html: data.error })
                }
                this.setState({ user: data.success.user })
            }).catch(err => console.error(err))
    }

    launchFollowersModal = () => {
        this.setState({ followerModal: true })
    }

    closeFollowersModal = () => {
        this.setState({ followerModal: false })
    }

    launchFollowingModal = () => {
        this.setState({ followingModal: true })
    }

    closeFollowingModal = () => {
        this.setState({ followingModal: false })
    }

    launchTagModal = () => {
        this.setState({ tagModal: true })
    }
    closeTagModal = () => {
        this.setState({ tagModal: false })
    }

    render() {
        let followerModalHtml =
            this.state.followerModal ?
                <Modal
                    open={this.state.followerModal}
                    onClose={this.closeFollowersModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="follow-modal">
                        <h5>Followers</h5>
                        <div className="d-flex-c">
                            {
                                this.state.user.followers.map(f => (
                                    <div key={f}>
                                        <div className="d-flex-r f-center">
                                            <Link to={`/p/profile/${f}`}>
                                                <img src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${f}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="follower" />
                                            </Link>
                                            <h6><strong>{f}</strong></h6>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Modal>
                :
                <></>

        let followingModalHtml =
            this.state.followingModal ?
                <Modal
                    open={this.state.followingModal}
                    onClose={this.closeFollowingModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="follow-modal">
                        <h5>Following</h5>
                        <div className="d-flex-c">
                            {
                                this.state.user.following.map(f => (
                                    <div key={f}>
                                        <div className="d-flex-r f-center">
                                            <Link to={`/p/profile/${f}`}>
                                                <img src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${f}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="follower" />
                                            </Link>
                                            <h6><strong>{f}</strong></h6>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Modal>
                :
                <></>

        let tagModalHtml =
            this.state.tagModal ?
                <Modal
                    open={this.state.tagModal}
                    onClose={this.closeTagModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="follow-modal">
                        <h5>Following Tags</h5>
                        <div className="d-flex-c">
                            {
                                this.state.user.tags.map(f => (
                                    <div key={f}>
                                        <div className="d-flex-r f-center">
                                            <Link to={`/p/tag/${f}`}>
                                                <img src={tagImg} alt="follower" />
                                            </Link>
                                            <h6><strong>{f}</strong></h6>
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
            this.state.user !== null && this.state.curr_user !== null ?
                <div>
                    <Container maxWidth="sm">
                        <div className="d-flex-r">
                            <div className="my-3 d-flex-c">
                                <img src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${this.state.user.userId}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="profile_img" className="responsive-img circle profile-img" />
                                {
                                    this.state.curr_user !== null ?
                                        this.state.user.followers.includes(this.state.curr_user.userId) ?
                                            <button onClick={this.unfollow} className="my-3 btn waves-effect waves-light #2196f3 blue ">UNFOLLOW</button>
                                            :
                                            <button onClick={this.follow} className="my-3 btn waves-effect waves-light #2196f3 blue ">FOLLOW</button>

                                        :
                                        <></>
                                }
                            </div>
                            <Container maxWidth="lg">
                                <div className="d-flex-c info-box">
                                    <div>
                                        <h3>{this.state.user.userId}</h3>
                                    </div>
                                    <div>
                                        <ul className="d-flex-r">
                                            <li><b>{this.state.posts.length}</b> post</li>
                                            <li className="c-pointer" onClick={this.launchFollowersModal}><b>{this.state.user.followers.length}</b> followers</li>
                                            <li className="c-pointer" onClick={this.launchFollowingModal}><b>{this.state.user.following.length}</b> following</li>
                                            <li className="c-pointer" onClick={this.launchTagModal}><b>{this.state.user.tags.length}</b> tags</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h6><strong>{this.state.user.name}</strong></h6>
                                        <p><strong>{`DOB: ${this.state.user.DOB.day}-${this.state.user.DOB.month}-${this.state.user.DOB.year}`}</strong></p>
                                    </div>
                                    <div>
                                        <p>
                                            {this.state.user.desc}
                                        </p>
                                    </div>
                                </div>
                            </Container>
                            {followerModalHtml}
                            {tagModalHtml}
                            {followingModalHtml}
                        </div>
                        <div>
                            {
                                this.state.posts.map(post => <Posts key={post._id} post={post} user={this.state.curr_user} />)
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

export default Profile
