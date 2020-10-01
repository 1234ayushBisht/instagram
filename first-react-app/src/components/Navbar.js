import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import CircularProgress from '@material-ui/core/CircularProgress';
import { Modal, Divider } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import icon from '../images/text2.png'
import progIcon from '../images/progress.png'
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TelegramIcon from '@material-ui/icons/Telegram';
import CloseIcon from '@material-ui/icons/Close'
import HomeIcon from '@material-ui/icons/Home';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Brightness6Icon from '@material-ui/icons/Brightness6';

import M from 'materialize-css';
import firebaseApp from '../firebase'
const storage = firebaseApp.storage();

export class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            speeddail: false,
            descModal: false,
            post_media: null,
            post_media_preview: null,
            post_desc: '',
            searchBar: false,
            searchResults: [],
            user: null,
            postLoading: false
        }
    }

    componentDidMount = () => {
        if(this.props.auth.isAuthenticated  === true) {
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
                }).catch(err => console.error(err))
        } else {
            this.setState({ user: {} })
        }
    }

    openSpeedDail = () => {
        this.setState({ speeddail: true })
    }

    closeSpeedDail = () => {
        this.setState({ speeddail: false })
    }

    makePost = (e) => {
        if (e.target.files[0]) {
            if(e.target.files[0].size/1024/1024 > 5) {
                return M.toast({ html: "Please Add A file smaller than 5MB" })
            }
            this.setState({ post_media: e.target.files[0] })
            this.setState({ post_media_preview: URL.createObjectURL(e.target.files[0]) })
            this.setState({ descModal: true })
        }
    }

    closeDescModal = () => {
        this.setState({ descModal: false })
    }

 
    submitPost = (e) => {
        e.preventDefault();
        
        if (!this.state.post_desc) {
            return M.toast({ html: 'Please Enter A description', classes: 'danger' })
        }
        this.setState({ postLoading: true })

        const ref = storage.ref();
        const imgRef = ref.child(`post/${new Date()}-${this.state.post_media.name}`)


        imgRef.put(this.state.post_media)
            .then(snapshot => {
                imgRef.getDownloadURL()
                    .then(url => {
                        fetch('/api/post/add', {
                            method: 'post',
                            headers: {
                                'Content-type': 'application/json',
                                'authorization': localStorage.getItem('jwtToken')
                            },
                            body: JSON.stringify({ mediaURL: url, desc: this.state.post_desc })
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.error) {
                                    return M.toast({ html: data.error, classes: 'danger' })
                                }
                                this.setState({ descModal: false })
                                this.setState({ post_desc: '' })
                                M.toast({ html: data.success, classes: 'success' })
                                this.setState({ postLoading: false })
                            })
                    })
            }).catch(err => console.error(err))
    }

    openSearch = () => {
        this.closeSpeedDail()
        this.setState({ searchBar: true })
    }

    closeSearch = () => {
        this.setState({ searchBar: false })
    }

    search = (e) => {
        if (e.target.value) {

            fetch(`/api/profile/get-search-result?${new URLSearchParams({ query: e.target.value })}`, {
                method: 'get',
                headers: {
                    'Content-type': 'application/json',
                    'authorization': localStorage.getItem('jwtToken')
                },
            })
                .then(res => res.json())
                .then(data => this.setState({ searchResults: data.success }))
                .catch(err => console.error(err))
        } else {
            this.setState({ searchResults: [] })
        }
    }

    changeTheme = () => {
        if (localStorage.getItem("darkMode")) {
            localStorage.removeItem("darkMode")
        } else {
            localStorage.setItem("darkMode", true)
        }
        window.location.reload()
    }

    render() {
        const actions = [
            { icon: <Brightness6Icon className="my-speeddail-icon" />, name: 'Switch Theme', event: this.changeTheme },
            { icon: <Link to="/likedPost"><FavoriteIcon className="my-speeddail-icon" /></Link>, name: 'Liked Post', event: this.closeSpeedDail },
            { icon: <SearchIcon className="my-speeddail-icon" />, name: 'Search', event: this.openSearch },
            { icon: <Link to="/dashboard"><AccountCircleIcon className="my-speeddail-icon" /></Link>, name: 'Profile', event: this.closeSpeedDail },
            { icon: <label htmlFor="post-input"><AddCircleIcon className="my-speeddail-icon" /></label>, name: 'Add Post', event: this.closeSpeedDail },
            { icon: <Link to="/notifications"><NotificationsIcon className="my-speeddail-icon" /></Link>, name: 'Notifications', event: this.closeSpeedDail },
            { icon: <Link to="/messages"><TelegramIcon className="my-speeddail-icon" /></Link>, name: 'Messages', event: this.closeSpeedDail },
        ];

        return (
            this.state.user !== null  ?
            <div>
                <div className="navbar-fixed" >
                    <nav>
                        <div className="nav-wrapper white">
                            <Link to="/" className="brand-logo center insta-head">
                                <img src={icon} alt="logo" className="insta-icon responsive-img" />
                            </Link>
                        </div>
                    </nav>
                </div>
                {
                    this.state.searchBar && this.props.auth.isAuthenticated ?
                        <div>
                            <Card  className="search-card">
                                <CardContent>
                                    <div className="d-flex-r">
                                        <input type="search" onChange={this.search} placeholder="Search Here By UserID" />
                                        <CloseIcon onClick={this.closeSearch} />
                                    </div>
                                    <div className="search-results-box">
                                        {
                                            this.state.searchResults.length !== 0 ?
                                                this.state.searchResults.map(user => (
                                                        <div key={user._id} className="d-flex-c search-result">
                                                            <div className="d-flex-r">
                                                                <Link to={`/profile/${user.userId}`} onClick={this.closeSearch}>
                                                                    <img src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${user.userId}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="user" />
                                                                </Link>
                                                                <div>
                                                                    <h6>{user.userId}</h6>
                                                                    <p>{user.name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                ))
                                                :
                                                <p className="gray-text">-No Results-</p>
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        :
                        <></>
                }
                {
                    this.state.descModal ?
                        <Modal
                            open={this.state.descModal}
                            onClose={this.closeDescModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            <div className="desc-modal">
                                <h5>Make A Post</h5>
                                <Divider />
                                <div>
                                    <button className="btn waves-effect waves-light blue" onClick={this.submitPost}>Post</button>
                                    <h6>Selected File: {this.state.post_media.name}</h6>

                                    <div className="img-box">
                                        {
                                            this.state.post_media.name.endsWith('.mp4') || this.state.post_media.name.endsWith('.avi') || this.state.post_media.name.endsWith('.webm')
                                                ?
                                                <video className="responsive-img" controls>
                                                    <source src={this.state.post_media_preview} />
                                                </video>
                                                :
                                                <img src={this.state.post_media_preview} alt="Selected File" className="responsive-img" />
                                        }
                                        <label htmlFor="post-input" className="btn waves-effect waves-light #ff5252 red accent-2">Change</label>
                                    </div>
                                    <textarea type="text" className="materialize-textarea" placeholder="Enter Post Description" onChange={(e) => this.setState({ post_desc: e.target.value })} />
                                    <Divider />
                                    <button className="btn waves-effect waves-light green" onClick={this.closeDescModal}>Cancel</button>
                                </div>
                            </div>
                        </Modal>
                        :
                        <></>
                }
                {
                    this.props.auth.isAuthenticated
                        ?
                        <div>
                            <SpeedDial
                                className="my-speeddail"
                                ariaLabel="SpeedDial tooltip example"
                                icon={<SpeedDialIcon />}
                                onClose={this.closeSpeedDail}
                                onOpen={this.openSpeedDail}
                                open={this.state.speeddail}
                            >
                                {
                                    actions.map((action) => (
                                        window.location.href.endsWith('/') === false && action.name === "Post" ?
                                        <SpeedDialAction
                                            key="Home"
                                            icon={ <Link to="/"><HomeIcon className="my-speeddail-icon" /></Link> }
                                            tooltipTitle="Home"
                                            tooltipOpen
                                            onClick={this.closeSpeedDail}
                                        />
                                            :
                                            <SpeedDialAction
                                                key={action.name}
                                                icon={action.icon}
                                                tooltipTitle={action.name}
                                                tooltipOpen
                                                onClick={action.event}
                                            />
                                    ))
                                }
                            </SpeedDial>
                            <input type="file" accept="image/*,video/mp4,video/mvi,video/webm" id="post-input" className="d-none" onChange={this.makePost} />
                        </div>
                        :
                        <>
                        </>
                }
                {
                    this.state.postLoading ? 
                    <div className="post-uploading">
                        <CircularProgress color="primary"/>
                        <h5>Uploading post....</h5>
                    </div>
                    :
                    <></>
                }
            </div >
            :
            <div className="app-progress-main-nav">
                <div className="app-progress d-flex-c f-center j-center" >
                    <img src={progIcon} alt="logo" />
                </div>
            </div>
        )
    }
}

Navbar.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Navbar);