import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";
import auth from "../services/authService";
import Loading from "./common/loading";
import { Redirect } from "react-router-dom";

class RegisterForm extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {},
    user: {},
    loading: true
  };

  schema = {
    username: Joi.string()
      .required()
      .min(3)
      .label("Username"),
    password: Joi.string()
      .required()
      .min(6)
      .label("Password"),
    isAdmin: Joi.string()
      .required()
      .label("Admin")
  };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user, loading: false });
  }

  doSubmit = async () => {
    try {
      const response = await userService.register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (this.state.loading) return <Loading />;
    if (this.state.user.isAdmin) {
      return (
        <div className="row">
          <div className="col" />
          <div className="col-6">
            <div className="card">
              <div className="card-header">
                {this.state.loading && <Loading />}
                <h1>Register</h1>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  {this.renderInput("username", "Username", false)}
                  {this.renderInput("password", "Password", false, "password")}
                  {this.renderInput("isAdmin", "Admin", false)}
                  {this.renderButton("Login")}
                </form>
              </div>
            </div>
          </div>
          <div className="col" />
        </div>
      );
    }
    return <Redirect to="/" />;
  }
}

export default RegisterForm;
