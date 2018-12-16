import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import Loading from "./common/loading";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
    loading: false
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    const { data } = this.state;
    try {
      this.setState({ loading: true });
      await auth.login(data.username.toLowerCase(), data.password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      this.setState({ loading: false });
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div className="row">
        <div className="col" />
        <div className="col-6">
          <div className="card">
            <div className="card-header">
              {this.state.loading && <Loading />}
              <h1>Login</h1>
            </div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("username", "Username", this.state.loading)}
                {this.renderInput(
                  "password",
                  "Password",
                  this.state.loading,
                  "password"
                )}
                {this.renderButton("Login")}
              </form>
            </div>
          </div>
        </div>
        <div className="col" />
      </div>
    );
  }
}

export default LoginForm;
