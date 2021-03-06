import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Row, Button, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../client_config';
import ImportEventsModal from './import_events_modal';
import ImportAuxDataModal from './import_aux_data_modal';
import DataWipeModal from './data_wipe_modal';
import * as actions from '../actions';

const importEventsDescription = (<div><h5>Import Event Records</h5><p>Add new event data records from a JSON-formated file.</p></div>)

const importAuxDataDescription = (<div><h5>Import Aux Data Records</h5><p>Add new aux data records from a JSON-formated file.</p></div>)

const dataResetDescription = (<div><h5>Wipe Local Database</h5><p>Delete all existing events from the local database.</p></div>)

class Tasks extends Component {

  constructor (props) {
    super(props);

    this.state = {
      description: "" 
    }

    // this.handleFiles = this.handleFiles.bind(this);
  }

  handleEventImport() {
    // var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    // if (is_chrome == true) {
    //   alert("Chrome can not be used when importing event data, sorry.")
    // } else {
    this.props.showModal('importEvents');
    // }
  }

  handleAuxDataImport() {
    // var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    // if (is_chrome == true) {
    //   alert("Chrome can not be used when importing event auxiliary data, sorry.")
    // } else {
    this.props.showModal('importAuxData');
    // }
  }

  handleCruiseImport() {
    this.props.showModal('importCruises');
  }

  handleLoweringImport() {
    this.props.showModal('importLowerings');
  }

  handleEventTemplateImport() {
    this.props.showModal('importEventTemplates');
  }

  handleDataWipe() {
    this.props.showModal('dataWipe', { handleDelete: this.props.deleteAllEvents });
  }

  handleUserImport() {
    this.props.showModal('importUsers');
  }

  componentWillMount() {
  }

  renderTaskTable() {
    return (
      <ListGroup>
        <ListGroupItem onMouseEnter={(e) => this.setState({ description: importEventsDescription })} onMouseLeave={(e) => this.setState({ description: "" })} onClick={ () => this.handleEventImport()}>Import Event Records</ListGroupItem>
        <ListGroupItem onMouseEnter={(e) => this.setState({ description: importAuxDataDescription })} onMouseLeave={(e) => this.setState({ description: "" })} onClick={ () => this.handleAuxDataImport()}>Import Aux Data Records</ListGroupItem>
        <ListGroupItem onMouseEnter={(e) => this.setState({ description: dataResetDescription })} onMouseLeave={(e) => this.setState({ description: "" })} onClick={ () => this.handleDataWipe()}>Wipe Local Database</ListGroupItem>
      </ListGroup>
    )
  }

  render() {
    if (!this.props.roles) {
        return (
          <div>Loading...</div>
        )
    }

    if(this.props.roles.includes("admin")) {

     // const taskForm = (this.props.loweringid)? <UpdateLowering /> : <CreateLowering />
            // <Col sm={6} md={5} lg={4}>
              // { taskForm }
            // </Col>
          // <ImportEventsModal />
          // <ImportAuxDataModal />

      return (
        <Grid fluid>
          <ImportEventsModal />
          <ImportAuxDataModal />
          <DataWipeModal />
          <Row>
            <Col sm={5} mdOffset={1} md={4} lgOffset={2} lg={3}>
                {this.renderTaskTable()}
            </Col>
            <Col sm={7} md={6} lg={5}>
                {this.state.description}
            </Col>
          </Row>
        </Grid>
      );

    } else {
      return (
        <div>
          What are YOU doing here?
        </div>
      )
    }
  }
}

function mapStateToProps(state) {

  let asnapStatus = (state.custom_var)? state.custom_var.custom_vars.filter(custom_var => custom_var.custom_var_name == "asnapStatus") : []

  return {
    roles: state.user.profile.roles,
  }
}

export default connect(mapStateToProps, actions)(Tasks);