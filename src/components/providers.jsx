import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProvidersTable from "./providersTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getProviders, deleteProvider } from "../services/providerService";
import { getLocations } from "../services/locationService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "../components/common/searchBox";
import auth from "../services/authService";
import Loading from "../components/common/loading";
// import Select from "./common/select";

class Providers extends Component {
  state = {
    providers: [],
    locations: [],
    currentPage: 1,
    pageSize: 12,
    searchQuery: "",
    selectedLocation: null,
    sortColumn: { path: "name", order: "asc" },
    user: {},
    loading: true
  };

  pageOptions = [
    { _id: 10, name: 10 },
    { _id: 20, name: 20 },
    { _id: 40, name: 40 },
    { _id: 60, name: 60 },
    { _id: 80, name: 80 },
    { _id: 100, name: 100 }
  ];

  async componentDidMount() {
    const { data } = await getLocations();
    const locations = [{ _id: "", name: "All Locations" }, ...data];
    const user = auth.getCurrentUser();
    const { data: providers } = await getProviders();
    this.setState({ providers, locations, user, loading: false });
  }

  handleDelete = async provider => {
    const originalProviders = this.state.providers;
    const providers = originalProviders.filter(m => m._id !== provider._id);
    this.setState({ providers });

    try {
      await deleteProvider(provider._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("x");
      toast.error(
        "This provider has already been deleted, please reload the page."
      );

      this.setState({ providers: originalProviders });
    }
  };

  // handleLike = provider => {
  //   const providers = [...this.state.providers];
  //   const index = providers.indexOf(provider);
  //   providers[index] = { ...providers[index] };
  //   providers[index].liked = !providers[index].liked;
  //   this.setState({ providers });
  // };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handlePageSize = number => {
    this.setState({ pageSize: number });
  };

  handleLocationSelect = location => {
    this.setState({
      selectedLocation: location,
      // searchQuery: "",
      currentPage: 1
    });
  };

  handleSearch = query => {
    this.setState({
      searchQuery: query,
      // selectedLocation: null,
      currentPage: 1
    });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedLocation,
      searchQuery,
      providers: allProviders
    } = this.state;

    let filtered = allProviders;
    if (searchQuery)
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.daysInOffice.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.languages.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.credentials.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.gender.toLowerCase() === searchQuery.toLowerCase() ||
          m.special.toLowerCase().includes(searchQuery.toLowerCase()) ||
          // m.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.wellcheck.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.education.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (selectedLocation && selectedLocation._id)
      filtered = filtered.filter(m => m.location._id === selectedLocation._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const providers = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: providers };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, user } = this.state;

    const { totalCount, data: providers } = this.getPagedData();

    return (
      <div className="row">
        {this.state.loading && <Loading />}
        <div className="col-2">
          {user.isAdmin && (
            <Link
              to="/providers/new"
              className="btn btn-success mb-2"
              style={{ width: "100%" }}
            >
              + Add A Provider
            </Link>
          )}
          <span className="btn btn-secondary mb-2" style={{ width: "100%" }}>
            {" "}
            Showing {totalCount} Providers
          </span>
          <ListGroup
            items={this.state.locations}
            selectedItem={this.state.selectedLocation}
            onItemSelect={this.handleLocationSelect}
          />
        </div>
        <div className="col">
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <ProvidersTable
            providers={providers}
            sortColumn={sortColumn}
            // onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
          {/* <Select name="page count" label="Page Count" disabled={false} options={this.pageOptions} onChange={this.handlePageSize}/> */}
        </div>
      </div>
    );
  }
}

export default Providers;
