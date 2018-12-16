import React, { Component } from "react";
import { Link } from "react-router-dom";
// import Like from './common/like';
import Table from "./common/table";
import auth from "../services/authService";
import placeHolder from "../assets/person-placeholder.png";

class ProvidersTable extends Component {
  columns = [
    {
      path: "profileUrl",
      label: "",
      content: provider => (
        <img
          src={provider.profileUrl || placeHolder}
          width="40px"
          alt="img"
          style={{ borderRadius: 50 }}
        />
      )
    },
    {
      path: "name",
      label: "Provider",
      content: provider => (
        <Link to={`/details/${provider._id}`}>{provider.name}</Link>
      )
    },
    { path: "credentials", label: "Credentials" },
    { path: "location.name", label: "Location" },
    { path: "daysInOffice", label: "Days In Office" },
    { path: "languages", label: "Languages" },
    { path: "wellcheck", label: "Well Check" }

    // {
    //   key: 'like',
    //   content: provider => (
    //     <Like
    //       liked={provider.liked}
    //       onClick={() => this.props.onLike(provider)}
    //     />
    //   )
    // }
  ];

  deleteColumn = {
    key: "delete",
    content: provider => (
      <button
        onClick={() =>
          window.confirm(`Are you sure you wish to delete ${provider.name}?`) &&
          this.props.onDelete(provider)
        }
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const { providers, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={providers}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ProvidersTable;
