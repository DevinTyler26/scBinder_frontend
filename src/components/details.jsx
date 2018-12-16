import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getProvider, saveProvider } from "../services/providerService";
import { getLocations } from "../services/locationService";
import placeHolder from '../assets/person-placeholder.png';
import auth from '../services/authService';
import Loading from './common/loading';


class Details extends Form {
  state = {
    data: {
      name: "",
      credentials: "",
      gender: "",
      locationId: "",
      daysInOffice: "",
      languages: "",
      special: "",
      profileUrl: "",
      wellcheck: "",
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
    credentials: Joi.string()
      .label("Credentials"),
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
    education: Joi.string()
      .label("Education"),
    bio: Joi.string()
      .label("Bio"),
    special: Joi.string()
      .label("Special Notes"),
    profileUrl: Joi.string()
      .label("Profile Url"),
    wellcheck: Joi.string()
      .label("Well Check Length"),
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
    const user = auth.getCurrentUser();
    this.setState({ user });
    
    await this.populateLocations();
    await this.populateProvider();
    this.setState({ loading: false })
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
    const { user, data } = this.state

    if (this.state.loading) return <Loading />
    else {
      return (
        <React.Fragment>
          <form onSubmit={this.handleSubmit}>
            <h1>Provider Details</h1>
            <div className="row">
              <div className="col">
                <img className="mb-4" src={ data.profileUrl || placeHolder } alt={ data.name } style={{ borderRadius: 50, width: "80%"}}/>
              </div>
              <div className="col">
                {this.renderInput("name", "Provider", !user.isAdmin)}
                {this.renderInput("credentials", "Credentials", !user.isAdmin)}
                {this.renderInput("gender", "Gender", !user.isAdmin)}
                {this.renderSelect("locationId", "Location", !user.isAdmin, this.state.locations)}
              </div>              
              <div className="col">
                {this.renderInput("daysInOffice", "Days In Office", !user.isAdmin)}
                {this.renderInput("wellcheck", "Well Check Length", !user.isAdmin)}          
                {this.renderInput("languages", "Languages Spoken", !user.isAdmin)}
                {this.renderInput("profileUrl", "Profile Image Url", !user.isAdmin)}
              </div>
              </div>
            <div className="row">  
              <div className="col">                        
                {this.renderTextArea("special", "Special Notes", !user.isAdmin)}
                {this.renderTextArea("education", "Education", !user.isAdmin)}              
                {this.renderTextArea("bio", "Bio", !user.isAdmin)}
                {user.isAdmin && this.renderButton("Save")}
              </div> 
            </div>
          </form>
        </React.Fragment>
      );
    }
  }
}

export default Details;
