import React, { Component } from "react";
import { Link } from 'react-router-dom'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Container, Modal, Divider } from '@material-ui/core';
import M from 'materialize-css';
import firebaseApp from '../../firebase';
import EditIcon from '@material-ui/icons/Edit'
import CircularProgress from '@material-ui/core/CircularProgress';
import Posts from '../Posts'
import tagImg from '../../images/hashtag.jpg'

const storage = firebaseApp.storage();

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            posts: [],
            modal: false,
            descChange: false,
            descValue: '',
            imageURL: '',
            followerModal: false,
            followingModal: false,
            tagModal: false
        }
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    componentDidMount = () => {
        fetch('/api/profile/get-user', {
            method: "get",
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ user: data.success.user })
                this.setState({ posts: data.success.posts.reverse() })
                this.setState({ imageURL: `https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${data.success.user.userId}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b` })
            }).catch(err => console.error(err))
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    openModal = e => {
        this.setState({ modal: true });
    }
    closeModal = e => {
        this.setState({ modal: false })
    }

    setNewImg = e => {
        const storageRef = storage.ref()
        const imgRef = storageRef.child(`images/${this.state.user.userId}`)
        imgRef.put(e.target.files[0])
            .then(snapshot => {
                M.toast({ html: 'Profile Photo Uploaded', classes: 'success' })
                imgRef.getDownloadURL()
                    .then(url => {
                    })
            }).catch(err => console.error(err));
        window.location.href = "/"
        window.location.reload()
    }

    setDefaultImg = e => {
        const storageRef = storage.ref()
        const imgRef = storageRef.child(`images/${this.state.user.userId}`)

        fetch('https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg')
            .then(res => {
                return res.blob()
            }).then(blob => {
                imgRef.put(blob)
                    .then(snapshot => {
                        M.toast({ html: 'Profile Photo Removed', classes: 'success' })
                        imgRef.getDownloadURL()
                            .then(url => {
                                this.setState({ imageURL: url })
                            })
                    }).catch(err => console.error(err));
            }).catch(err => {
                console.log(err)
            })
        window.location.href = "/"
        window.location.reload()
    }

    setDesc = e => {
        e.preventDefault()

        fetch('/api/profile/update-desc', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body:
                JSON.stringify({
                    desc: this.state.descValue
                })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    return M.toast({ html: data.error, classes: "danger" })
                }
                M.toast({ html: data.success, classes: "success" })
                this.setState({ user: data.user })
                this.setState({ descChange: false })
                this.setState({ descValue: '' })
            })

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
        let modalHtml =
            this.state.modal ?
                <Modal
                    open={this.state.modal}
                    onClose={this.closeModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="my-modal">
                        <h5>Change Profile Photo</h5>
                        <Divider />
                        <label htmlFor="profile-img-input" className="blue-text">Upload Photo</label>
                        <input type="file" accept="image/*" id="profile-img-input" onChange={this.setNewImg} />
                        <Divider />
                        <button className="red-text" onClick={this.setDefaultImg}>Remove Photo</button>
                        <Divider />
                        <button className="cancelBtn" onClick={this.closeModal}>Cancel</button>
                    </div>
                </Modal>
                :
                <></>


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
                                            <Link to={`/profile/${f}`}>
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
                                            <Link to={`/profile/${f}`}>
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
            this.state.user !== null ?
                <div>
                    <Container maxWidth="sm">
                        <div className="d-flex-r">
                            <div className="my-3 d-flex-c">
                                <img src={this.state.imageURL} alt="profile_img" className="responsive-img circle profile-img" onClick={this.openModal} />
                                <button onClick={this.onLogoutClick} className="my-3 btn waves-effect waves-light red ">LOGOUT</button>
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
                            {modalHtml}
                            {followerModalHtml}
                            {followingModalHtml}
                            {tagModalHtml}
                        </div>
                        <div className="d-flex-r info-box f-center">
                            {
                                this.state.descChange
                                    ?
                                    <div className="d-flex-r info-box edit-desc">
                                        <textarea type="text" onChange={(e) => this.setState({ descValue: e.target.value })} />
                                        <button onClick={this.setDesc}>Edit</button>
                                    </div>
                                    :
                                    <></>
                            }
                            <div>
                                <button className="btn #ffff white black-text" onClick={e => this.state.descChange ? this.setState({ descChange: false }) : this.setState({ descChange: true })}>
                                    <EditIcon />
                                </button>
                            </div>
                        </div>
                        <div>
                            {
                                this.state.posts.reverse().map(post => <Posts key={post._id} post={post} user={this.state.user} />)
                            }
                        </div>
                    </Container>
                </div>
                :
                <div className="app-progress">
                    <CircularProgress color="secondary" />
                </div>
        );
    }
}
Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(Dashboard);