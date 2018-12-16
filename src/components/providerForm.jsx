import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getProvider, saveProvider } from "../services/providerService";
import { getLocations } from "../services/locationService";
import Loading from "./common/loading";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class ProviderForm extends Form {
  state = {
    data: {
      name: "",
      credentials: "",
      gender: "",
      locationId: "",
      daysInOffice: "",
      languages: "",
      education: "",
      bio: "",
      special: "",
      profileUrl: "",
      wellcheck: ""
    },
    user: {},
    locations: [],
    errors: {},
    loading: true
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .min(2)
      .max(60)
      .label("Title"),
    credentials: Joi.string().label("Credentials"),
    gender: Joi.string()
      .required()
      .label("Gender"),
    locationId: Joi.string()
      .required()
      .label("Location"),
    daysInOffice: Joi.string()
      .required()
      .min(2)
      .max(255)
      .label("Days in Office"),
    languages: Joi.string()
      .required()
      .min(2)
      .max(255)
      .label("Languages Spoken"),
    education: Joi.string().label("Education"),
    bio: Joi.string().label("Bio"),
    special: Joi.string().label("Special Notes"),
    profileUrl: Joi.string().label("Profile Url"),
    wellcheck: Joi.string().label("Well Check Length")
  };

  async populateLocations() {
    const { data: locations } = await getLocations();
    this.setState({ locations });
  }

  async populateProvider() {
    try {
      const providerId = this.props.match.params.id;
      if (providerId === "new") return;

      const { data: provider } = await getProvider(providerId);
      this.setState({ data: this.mapToViewModel(provider) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateLocations();
    await this.populateProvider();
    const user = auth.getCurrentUser();

    this.setState({ user, loading: false });
  }

  mapToViewModel(provider) {
    return {
      _id: provider._id,
      name: provider.name,
      credentials: provider.credentials,
      gender: provider.gender,
      locationId: provider.location._id,
      daysInOffice: provider.daysInOffice,
      languages: provider.languages,
      education: provider.education,
      bio: provider.bio,
      special: provider.special,
      profileUrl: provider.profileUrl,
      wellcheck: provider.wellcheck
    };
  }

  doSubmit = async () => {
    this.setState({ loading: true });
    await saveProvider(this.state.data);
    this.props.history.push("/providers");
  };

  render() {
    const { loading } = this.state;
    if (loading) return <Loading />;
    if (this.state.user.isAdmin) {
      return (
        <div>
          <h1>Provider Form</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-6">
                {loading && <Loading />}
                {this.renderInput("name", "Provider", loading)}
                {this.renderInput("credentials", "Credentials", loading)}
                {this.renderInput("gender", "Gender", loading)}
                {this.renderSelect(
                  "locationId",
                  "Location",
                  loading,
                  this.state.locations
                )}
              </div>
              <div className="col-6">
                {this.renderInput("daysInOffice", "Days In Office", loading)}
                {this.renderInput("wellcheck", "Well Check Length", loading)}
                {this.renderInput("languages", "Languages Spoken", loading)}
                {this.renderInput("profileUrl", "Profile Image Url", loading)}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderTextArea("special", "Special Notes", loading)}
                {this.renderTextArea("education", "Education", loading)}
                {this.renderTextArea("bio", "Bio", loading)}
                {this.renderButton("Save")}
              </div>
            </div>
          </form>
        </div>
      );
    }
    return <Redirect to="/" />;
  }
}

export default ProviderForm;
