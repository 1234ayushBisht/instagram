import React, { useState, useEffect } from 'react'
import SnackbarContent from '@material-ui/core/SnackbarContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CircularProgress from '@material-ui/core/CircularProgress';
import M from 'materialize-css'
import firebase from '../firebase'

const db = firebase.firestore()
const storage = firebase.storage()

function Messages() {
    const [user, setUser] = useState(null)
    const [textMsg, setTextMsg] = useState('')
    const [media, setMedia] = useState(null)
    const [messages, setMessages] = useState(null)
    const [loader, setLoader] = useState(false)
    
    useEffect(() => {
        fetch('/api/profile/get-user', {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization': localStorage.getItem('jwtToken')
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data.success.user)
            })
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        db
            .collection('messages')
            .orderBy('time', 'desc')
            .onSnapshot(snapshot => setMessages(snapshot.docs.map(doc => doc.data())))
    }, []);

    const sendText = (e) => {
        e.preventDefault()

        if (textMsg.trim() === "") {
            M.toast({ html: "Please Enter a message" })
        }

        else {
            if (media === null) {
                db.collection('messages').add({
                    media: null,
                    text: textMsg,
                    time: new Date,
                    userId: user.userId
                })
            }
            else {
                if (media.size / 1024 / 1024 > 10) {
                    return M.toast({ html: "Please Add A file smaller than 10MB" })
                }
                setLoader(true)
                const ref = storage.ref();
                const imgRef = ref.child(`messages/${new Date()}-${media.name}`)

                imgRef.put(media)
                    .then(snapshot => {
                        imgRef.getDownloadURL()
                            .then(url => {
                                db.collection('messages').add({
                                    media: url,
                                    text: textMsg,
                                    time: new Date,
                                    userId: user.userId
                                })
                                setLoader(false)
                            })
                    }).catch(err => console.error(err))
            }

            setTextMsg('')
            setMedia(null)
        }
    }

    let nav_color = localStorage.getItem("darkMode") ? "black" : "white"
    let nav_text = localStorage.getItem("darkMode") ? "white" : "black"

    return (
        user !== null ?
            <div>
                <AppBar position="static" style={{ backgroundColor: nav_color, color: nav_text, marginBottom: "20px" }}>
                    <Toolbar>
                        <Typography variant="h6">
                            Messages
                                </Typography>
                    </Toolbar>
                </AppBar>
                <div style={{ height: "30rem", overflowY: "scroll" }}>
                    {
                        messages !== null ?
                            messages.map(m => (
                                <div key={Math.floor(Math.random() * 1000008932782)}>
                                    {
                                        m.userId === user.userId ?
                                            <div className="message msg-right">
                                                <strong>{m.userId}</strong>
                                                <SnackbarContent message={`${m.text}`} />
                                                {
                                                    m.media !== null ?
                                                        m.media.split('?')[0].endsWith('.mp4') || m.media.split('?')[0].endsWith('.avi') || m.media.split('?')[0].endsWith('.webm')
                                                            ?
                                                            <div className="d-flex-r f-center">
                                                                <strong>{m.userId}</strong>
                                                                <video className="message-media-right" controls>
                                                                    <source src={m.media} />
                                                                </video>
                                                            </div>
                                                            :
                                                            <div className="d-flex-r f-center">
                                                                <strong>{m.userId}</strong>
                                                                <img className="message-media-right" src={m.media} alt="post-img" />
                                                            </div>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                            :
                                            <div className="message msg-left">
                                                <strong>{m.userId}</strong>
                                                <SnackbarContent message={`${m.text}`} />
                                                {
                                                    m.media !== null ?
                                                        m.media.split('?')[0].endsWith('.mp4') || m.media.split('?')[0].endsWith('.avi') || m.media.split('?')[0].endsWith('.webm')
                                                            ?
                                                            <div className="d-flex-r f-center">
                                                                <video className="message-media-left" controls>
                                                                    <source src={m.media} />
                                                                </video>
                                                                <strong>{m.userId}</strong>
                                                            </div>
                                                            :
                                                            <div className="d-flex-r f-center">
                                                                <img className="message-media-left" src={m.media} alt="post-img" />
                                                                <strong>{m.userId}</strong>
                                                            </div>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                    }
                                </div>
                            ))
                            :
                            <div className="app-progress">
                                <CircularProgress />
                            </div>
                    }
                </div>


                <div>
                    <div className="message-input-box">
                        <textarea placeholder="Type a message" value={textMsg} onChange={e => setTextMsg(e.target.value)} className="materialize-textarea" style={{ fontSize: "13px" }}></textarea>
                        <button type="submit" onClick={sendText}><SendIcon /></button>
                        <button>
                            <label htmlFor="add-media">
                                <AddPhotoAlternateIcon />
                            </label>
                        </button>
                    </div>
                </div>
                <input
                    type="file" onChange={
                        e => {
                            setMedia(e.target.files[0])
                            setTextMsg(e.target.files[0].name)
                    }}
                    accept="image/*,video/mp4,video/mvi,video/webm"
                    id="add-media"
                    className="d-none"
                />
                {
                    loader ?
                        <div className="post-uploading">
                            <CircularProgress color="primary" />
                            <h5>Uploading Message....</h5>
                        </div>
                        :
                        <></>
                }
            </div >
            :
            <div className="app-progress">
                <CircularProgress color="secondary" />
            </div>
    )
}

export default Messages
