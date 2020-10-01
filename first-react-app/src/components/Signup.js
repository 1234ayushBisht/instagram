import React, { Component } from "react";
import logo from '../images/logo.png'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from "axios";
import M from 'materialize-css'
import { Link } from 'react-router-dom'

import firebaseApp from '../firebase'

const storage = firebaseApp.storage()

export class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            userId: "",
            email: "",
            password: "",
            DOB: '',
            image: { type: '' },
            message: {
                value: "",
                msg_state: false,
                type: ""
            },
            loading: false
        }
    }
    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (localStorage.getItem("jwtToken")) {
            this.props.history.push("/dashboard");
        }
    }
    
    submit = e => {
        e.preventDefault()
        this.setState({ loading: true })

        if (!this.state.name || !this.state.userId || !this.state.email || !this.state.password || !this.state.DOB || this.state.image.type === '') {
            this.setState({ loading: false })
            return M.toast({ html: "Please Fill in all fields", classes: 'danger' })
        }

        const newUser = {
            name: this.state.name,
            userId: this.state.userId,
            email: this.state.email,
            password: this.state.password,
            DOB: this.state.DOB
        }

        axios
            .post("/api/signup", { userData :newUser, image: this.state.image.type })
            .then(res => {
                if (res.data.error) {
                    this.setState({ loading: false })
                    M.toast({ html: res.data.error, classes: 'danger' })
                } else {
                    const storageRef = storage.ref()
    
                    const imgRef = storageRef.child(`images/${newUser.userId}`)
                    imgRef.put(this.state.image)
                        .then(snapshot => {
                            M.toast({ html: res.data.success, classes: 'success' })
                            this.setState({ loading: false })
                            this.props.history.push("/login")
                        }).catch(err => console.error(err));
                }

            })
    }

    render() {
        return (
            <div className="box">
                <div className="card white light-1 p-5">
                    <div className="card-content black-text">
                        <div className="login-header insta-head">
                            <img src={logo} alt="insta-img" className="insta-img" />
                            <h3>Signup to Instagram</h3>
                        </div>
                    </div>
                    <div className="row">
                        <form className="col s12">
                            <div className="row">
                                <div className="input-field col s12">
                                    <input placeholder="Name" type="text" className="validate" onChange={e => this.setState({ name: e.target.value })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input placeholder="UserID" type="text" className="validate" onChange={e => this.setState({ userId: e.target.value })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input placeholder="Email" type="email" className="validate" onChange={e => this.setState({ email: e.target.value })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input placeholder="Password" type="password" className="validate" onChange={e => this.setState({ password: e.target.value })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input type="date" className="datepicker" onChange=
                                        {
                                            e => {
                                                let date = e.target.value.split('-')
                                                this.setState({ DOB: { day: date[2], month: date[1], year: date[0] } })
                                            }
                                        }
                                    />
                                </div>
                            </div>
                            <div className="file-field input-field my-3">
                                <div className="btn danger">
                                    <span><AddPhotoAlternateIcon /></span>
                                    <input type="file" accept="image/*" onChange={e => this.setState({ image: e.target.files[0] }) } />
                                </div>
                                {
                                    this.state.image.type === '' ? (<></>) :
                                        <div className="file-path-wrapper">
                                            <span className="helper-text blue-text">{this.state.image.name} selected</span>
                                            <img style={{ width: "3rem", height: "3rem"}} src={URL.createObjectURL(this.state.image)} className="responsive-img circle" alt="select" />
                                        </div>
                                }
                                <div className="file-path-wrapper">
                                    <span className="helper-text">Only PNG or JPEG type files can be uploaded</span>
                                </div>
                            </div>

                            <button onClick={this.submit} className="btn waves-effect waves-light #ff5252 red accent-2 my-3" type="submit" name="action">Submit</button>
                        </form>
                    </div>
                    <div className="card-action green-text">
                        <Link to="/login">Already Created A instagram Account ?</Link>
                    </div>
                    {
                        this.state.loading ?
                            <div className="post-uploading">
                                <div style={{ width: "70%" }}>
                                    <LinearProgress />
                                </div>
                                <h5>Registering User....</h5>
                            </div>
                            :
                            <></>
                    }
                </div>
            </div>
        )
    }
}

export default Signup

