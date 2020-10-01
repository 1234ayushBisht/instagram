import React, { Component } from 'react'
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            password: ""
        }
    }
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/dashboard"); 
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    login = e => {
        e.preventDefault();
        const userData = {
            userId: this.state.userId,
            password: this.state.password
        };
        this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    }

    render() {
        return (
            <div className="box">
                <div className="card white light-1 p-5">
                    <div className="card-content black-text">
                        <div className="login-header insta-head">
                            <img src={logo} alt="insta-img" className="insta-img" />
                            <h3>Login To Instagram</h3>
                        </div>
                    </div>
                    <div className="row">
                        <form className="col s12">
                            <div className="row">
                                <div className="input-field col s12">
                                    <input onChange={(e) => this.setState({ userId: e.target.value })} placeholder="UserID" type="text" className="validate" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input onChange={(e) => this.setState({ password: e.target.value })} placeholder="Password" type="password" className="validate" />
                                </div>
                            </div>
                            <button onClick={this.login} className="btn waves-effect waves-light #ff5252 red accent-2" type="submit" name="action">Submit</button>
                        </form>
                    </div>
                    <div className="card-action green-text">
                        <Link to="/signup">Don't Have An Instagram Account ?</Link>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);
