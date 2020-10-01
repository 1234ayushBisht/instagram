import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebaseApp from '../firebase'
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete'
import M from 'materialize-css'
const db = firebaseApp.firestore()

export class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            notifications: []
        }
    }

    componentDidMount = () => {
        // let day = new Date()
        fetch('/api/profile/get-user', {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                db.collection('notifications').where("for", "==", data.success.user.userId)
                    .get()
                    .then(querySnapshot => {
                        let notis = []
                        this.setState({ user: data.success.user })
                        querySnapshot.forEach(doc => notis.push({ id: doc.id, notification: doc.data() }))
                        this.setState({ notifications: notis.reverse() })
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err))
    }

    clear = () => {
        db.collection('notifications').where("for", "==", this.state.user.userId)
            .get()
            .then(querySnapshot => {
                var batch = db.batch()
                querySnapshot.forEach(doc => batch.delete(doc.ref))

                return batch.commit()
            })
            .then(() => {
                M.toast({ html: 'Notifications Cleared.' })
                this.setState({ notifications: [] })
            })
            .catch(err => console.error(err));
    }

    deleteOne = (id) => {
        db.collection("notifications").doc(id).delete().then(() => {
            db.collection('notifications').where("for", "==", this.state.user.userId)
                .get()
                .then(querySnapshot => {
                    let notis = []
                    querySnapshot.forEach(doc => notis.push({ id: doc.id, notification: doc.data() }))
                    this.setState({ notifications: notis.reverse() })
                })
                .catch(err => console.error(err));
        }).catch(err => console.error(err));
    }

    render() {
        return (
            this.state.user !== null ?
                <div>
                    {
                        this.state.notifications.length !== 0 ?
                            this.state.notifications.map(n => (
                                <div key={n.id} className="col s12 m7">
                                    <div className="card horizontal">
                                        <div className="card-image">
                                            <Link to={`/profile/${n.notification.from}`}>
                                                <img className="noti-logo" src={`https://firebasestorage.googleapis.com/v0/b/instagram-1ae56.appspot.com/o/images%2F${n.notification.from}?alt=media&token=82cce9ae-a8e7-4619-bb2a-190aa58f889b`} alt="notis" />
                                            </Link>
                                        </div>
                                        <div className="card-stacked">
                                            <div className="card-content noti-main">
                                                <h5>{n.notification.title}</h5>
                                                <p>{n.notification.message}</p>
                                                <strong>{n.notification.date}</strong>
                                                <button className="noti-del" onClick={() => this.deleteOne(n.id)} name="action"><DeleteIcon /></button>
                                            </div>
                                        </div>
                                        <div className="card-image">
                                            {
                                                n.notification.post.split('?')[0].endsWith('.mp4') || n.notification.post.split('?')[0].endsWith('.avi') || n.notification.post.split('?')[0].endsWith('.webm')
                                                    ?
                                                    <video className="noti-img">
                                                        <source src={n.notification.post} />
                                                    </video>
                                                    :
                                                    <img src={n.notification.post} alt="post-img" className="noti-img" />
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                            :
                            <div>
                                <br />
                                <h6 style={{ textAlign: 'center' }}><b>-No Notifications-</b></h6>
                            </div>

                    }
                    <Fab onClick={this.clear} variant="extended" style={{ position: 'absolute', left: '5px', bottom: '7px', zIndex: 1550 }}>
                        <DeleteIcon />
                        CLEAR
                    </Fab>
                </div>
                :
                <div className="app-progress">
                    <CircularProgress color="secondary" />
                </div>
        )
    }
}

export default Notifications
