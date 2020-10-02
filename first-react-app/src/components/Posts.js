import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Divider, Modal } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkIcon from '@material-ui/icons/Link';
import CancelIcon from '@material-ui/icons/Cancel'
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import TwitterIcon from '@material-ui/icons/Twitter';
import M from 'materialize-css'

import firebaseApp from '../firebase'
const db = firebaseApp.firestore()


export class Posts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            post: this.props.post,
            postCommentValue: '',
            commentModal: false,
            share: false
        }
    }

    commentToPost = () => {
        fetch(`/api/post/comment/${this.state.post._id}`, {
            method: 'put',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({ comment: this.state.postCommentValue })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    return M.toast({ html: data.error, classes: 'danger' })
                }
                M.toast({ html: data.success.message, classes: 'success' })

                if (this.state.user.userId !== this.state.post.user) {
                    let date = new Date()
                    db.collection('notifications').add({
                        for: this.state.post.user,
                        from: this.state.user.userId,
                        message: `${this.state.user.name} commented "${this.state.postCommentValue}" on your post.`,
                        title: "New Comment",
                        date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
                        post: data.success.post.mediaURL
                    })
                        .then((doc) => {
                            this.setState({ postCommentValue: '' })
                            this.setState({ post: data.success.post })
                        })
                        .catch(err => console.error(err))
                } else {
                    this.setState({ postCommentValue: '' })
                    this.setState({ post: data.success.post })
                }

            })
            .catch(err => console.error(err))
    }

    likePost = () => {
        fetch(`/api/post/like/${this.state.post._id}`, {
            method: 'put',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ post: data.success.post })

                if (this.state.user.userId !== this.state.post.user) {
                    let date = new Date()
                    db.collection('notifications').add({
                        for: this.state.post.user,
                        from: this.state.user.userId,
                        message: `${this.state.user.name} liked your post.`,
                        title: "New Like",
                        date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
                        post: data.success.post.mediaURL
                    })
                        .then((doc) => { })
                        .catch(err => console.error(err))
                }
            })
            .catch(err => console.error(err))
    }

    unlikePost = () => {
        fetch(`/api/post/like/${this.state.post._id}`, {
            method: 'put',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ post: data.success.post })
            })
            .catch(err => console.error(err))
    }

    openShareModal = () => {
        this.setState({ share: true })
    }
    closeShareModal = () => {
        this.setState({ share: false })
    }

    copyShareLink = () => {
        navigator.clipboard.writeText(this.state.post.mediaURL)
        M.toast({ html: "Copied Link" })
    }

    deletePost = () => {
        fetch(`/api/post/delete/${this.state.post._id}`, {
            method: "delete",
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    return M.toast({ html: data.error, classes: "danger" })
                }
                this.setState({ post: null })
                M.toast({ html: data.success, classes: "success" })
            })
            .catch(err => console.error(err))
    }

    openCommentModal = () => {
        this.setState({ commentModal: true })
    }
    closeCommentModal = () => {
        this.setState({ commentModal: false })
    }

    render() {
        let shareModal =
            this.state.share ?
                <Modal
                    open={this.state.share}
                    onClose={this.closeShareModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="shareModal">
                        <div className="share-head">Share</div>
                        <Divider />
                        <div className="share-opt" data-href={this.state.post.mediaURL} data-layout="button_count" data-size="small">
                            <a target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(this.state.post.mediaURL)}&amp;src=sdkpreparse`} className="share-opt">
                                <FacebookIcon style={{ margin: '5px' }} />Share on Facebook
                                </a>
                        </div>
                        <Divider />

                        <div className="share-opt">
                            <a target="__blank" className="share-opt" href={`https://twitter.com/intent/tweet?text=${this.state.post.desc}&url=${encodeURI(this.state.post.mediaURL)}`} data-size="large">
                                <TwitterIcon style={{ margin: '5px' }} /> Share on Twitter
                            </a>
                        </div>
                        <Divider />

                        <div className="share-opt">
                            <a target="__blank" href={`http://web.whatsapp.com/send?text=${encodeURIComponent(this.state.post.mediaURL)}`} data-action="share/whatsapp/share" className="share-opt">
                                <WhatsAppIcon style={{ margin: '5px' }} />Share on Whatsapp
                                </a>
                        </div>
                        <Divider />

                        <div className="share-opt m-more" onClick={this.copyShareLink}><LinkIcon style={{ margin: '5px' }} />Copy Link</div>
                        <Divider />
                        <div className="share-opt m-more" onClick={this.closeShareModal}><CancelIcon style={{ margin: '5px' }} />Cancel</div>
                    </div>
                </Modal>
                :
                <></>

        let all_comments = [...this.state.post.comments].reverse();

        let commentModalHtml =
            this.state.commentModal ?
                <Modal
                    open={this.state.commentModal}
                    onClose={this.closeCommentModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className="follow-modal">
                        <h5 style={{textAlign: "center", color: "red", borderBottom: "0px"}}>Comments</h5>
                        <hr/>
                        <div className="row" style={{ margin: '0px' }}>
                            <div className="d-flex-r f-center" style={{border: "0px", borderRadius: "0px", margin: "7px"}}>
                                <div className="input-field col s11" style={{ marginLeft: "0px" }}>
                                    <textarea value={this.state.postCommentValue} placeholder="Add Your Comment" onChange={e => this.setState({ postCommentValue: e.target.value })} className="materialize-textarea" style={{ fontSize: "13px" }}></textarea>
                                </div>
                                <div className="send-btn" onClick={this.commentToPost}>
                                    <SendIcon />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex-c">
                            {
                                all_comments.map(c => (
                                    <div key={c} className="d-flex-r f-center" style={{border: "0px", borderRadius: "0px", margin: "7px"}}>
                                        <Link to={`/p/profile/${c[0]}`}>
                                            <img src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${c[0]}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="post-img" className="tiny-img circle" />
                                        </Link>
                                        <p><b>{c[0]} </b> {c[1]}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Modal>
                :
                <></>

        return (
            this.state.post !== null ?
                <div>
                    <Card style={{ margin: '4rem 0rem' }} raised={true} className=" main-app-post">
                        <div className="d-flex-r f-center">
                            <Link to={`/p/profile/${this.state.post.user}`}>
                                <img src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${this.state.post.user}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="post-img" className="post-small-img circle" />
                            </Link>
                            <div>
                                <CardHeader
                                    title={this.state.post.user}
                                    subheader={this.state.post.Date}
                                />
                            </div>
                        </div>
                        {
                            this.state.post.mediaURL.split('?')[0].endsWith('.mp4') || this.state.post.mediaURL.split('?')[0].endsWith('.avi') || this.state.post.mediaURL.split('?')[0].endsWith('.webm')
                                ?
                                <video className="post-video responsive-img darkmode-ignore" controls>
                                    <source src={this.state.post.mediaURL} />
                                </video>
                                :
                                <img src={this.state.post.mediaURL} alt="post-img" className="post-img responsive-img" />
                        }
                        <CardActions disableSpacing>
                            <IconButton aria-label="like post">
                                <div>
                                    {
                                        this.state.post.likes.includes(this.state.user.userId) ?
                                            <div className="red-text" onClick={this.unlikePost}>
                                                <FavoriteIcon onClick={this.unlikePost} />
                                            </div>
                                            :
                                            <div>
                                                <FavoriteIcon onClick={this.likePost} />
                                            </div>
                                    }
                                </div>
                            </IconButton>
                            <IconButton aria-label="share" onClick={this.openShareModal}>
                                <ShareIcon />
                            </IconButton>
                            {
                                this.state.post.user === this.state.user.userId ?
                                    <IconButton aria-label="settings">
                                        <div>
                                            <div onClick={this.deletePost}>
                                                <DeleteIcon onClick={this.deletePost} />
                                            </div>
                                        </div>
                                    </IconButton>
                                    :
                                    <></>
                            }
                        </CardActions>
                        <CardContent>
                            <Typography component="h6">{this.state.post.likes.length} people like this.</Typography>
                            <strong>{this.state.post.user}</strong>
                            <Typography variant="body2" color="textSecondary" component="h6">
                                {
                                    this.state.post.desc.split(' ').map(item => (
                                        <span key={item}>
                                            {
                                                item.startsWith('\n#') || item.startsWith('#') ?
                                                    item.startsWith('\n#') ?
                                                        <Link to={`/p/tag/${item.slice(2)}`}>{`${item} `}</Link>
                                                        :
                                                        <Link to={`/p/tag/${item.slice(1)}`}>{`${item} `}</Link>
                                                    :
                                                    <span>{`${item} `}</span>
                                            }
                                        </span>
                                    ))
                                }
                            </Typography>
                            
                        </CardContent>
                        <div>
                            {
                                this.state.post.comments.length !== 0 ?
                                    <div style={{padding:"10px", textDecoration:"underline"}} className="c-pointer">
                                        <Typography variant="body2" color="textSecondary" component="h6" onClick={this.openCommentModal}>View All {this.state.post.comments.length} comments</Typography>
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                        <Divider />
                        <div>
                            <div className="row" style={{ margin: '0px' }}>
                                <div className="d-flex-r f-center">
                                    <div className="input-field col s11" style={{ marginLeft: "0px" }}>
                                        <textarea value={this.state.postCommentValue} placeholder="Drop A Comment" onChange={e => this.setState({ postCommentValue: e.target.value })} className="materialize-textarea" style={{ fontSize: "13px" }}></textarea>
                                    </div>
                                    <div className="send-btn" onClick={this.commentToPost}>
                                        <SendIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {shareModal}
                    {commentModalHtml}
                </div>
                :
                <></>
        )
    }
}

export default Posts
