import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Button, Col, Panel, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CreateUser from './create_user';
import UpdateUser from './update_user';
import DisplayUserTokenModal from './display_user_token_modal';
import NonSystemUsersWipeModal from './non_system_users_wipe_modal';
import ImportUsersModal from './import_users_modal';
import DeleteUserModal from './delete_user_modal';
import * as actions from '../actions';
import { TOPSIDE } from '../client_config'

const disabledAccounts = ( TOPSIDE )? ['alvin', 'guest', 'pi'] : ['alvin', 'pilot', 'stbd_obs', 'port_obs']

let fileDownload = require('js-file-download');

const maxUsersPerPage = 15

class Users extends Component {

  constructor (props) {
    super(props);

    this.state = {
      activePage: 1
    }

    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.handleUserImportClose = this.handleUserImportClose.bind(this);

  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  handlePageSelect(eventKey) {
    this.setState({activePage: eventKey});
  }

  handleUserDelete(id) {
    this.props.showModal('deleteUser', { id: id, handleDelete: this.props.deleteUser });
  }

  handleNonSystemUsersWipe() {
    this.props.showModal('nonSystemUsersWipe', { handleDelete: this.props.deleteAllNonSystemUsers });
  }

  handleDisplayUserToken(id) {
    this.props.showModal('displayUserToken', { id: id });
  }

  handleUserSelect(id) {
    // console.log("Set User:", id)
    this.props.initUser(id);
  }

  handleUserCreate() {
    // console.log("Clear");
    this.props.leaveUpdateUserForm()
  }

  handleUserImport() {
    this.props.showModal('importUsers');
  }

  handleUserImportClose() {
    this.props.fetchUsers();
  }

  exportUsersToJSON() {
    fileDownload(JSON.stringify(this.props.users.filter(user => user.system_user == false), null, 2), 'sealog_userExport.json');
  }

  exportSystemUsersToJSON() {
    fileDownload(JSON.stringify(this.props.users.filter(user => user.system_user == true), null, 2), 'sealog_systemUserExport.json');
  }


  renderAddUserButton() {
    if (!this.props.showform) {
      return (
        <div className="pull-right">
          <Button bsStyle="primary" bsSize="small" type="button" onClick={ () => this.handleUserCreate()}>Add User</Button>
        </div>
      );
    }
  }

  renderImportUsersButton() {
    if(this.props.roles.includes("admin")) {
      return (
        <div className="pull-right">
          <Button bsStyle="primary" bsSize="small" type="button" onClick={ () => this.handleUserImport()}>Import From File</Button>
        </div>
      );
    }
  }

  renderUsers() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this user.</Tooltip>)
    const tokenTooltip = (<Tooltip id="viewTooltip">Show user's JWT token.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this user.</Tooltip>)

    if(this.props.users){
      let non_system_users = this.props.users.filter((user) => !user.system_user)
      return non_system_users.map((user) => {
        return (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.fullname}</td>
            <td>
              <Link key={`edit_${user.id}`} to="#" onClick={ () => this.handleUserSelect(user.id) }><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesomeIcon icon='pencil-alt' fixedWidth/></OverlayTrigger></Link>{' '}
              {(this.props.roles.includes('admin'))? <Link key={`token_${user.id}`} to="#" onClick={ () => this.handleDisplayUserToken(user.id) }><OverlayTrigger placement="top" overlay={tokenTooltip}><FontAwesomeIcon icon='eye' fixedWidth/></OverlayTrigger></Link> : ''}{' '}
              {(user.id != this.props.profileid && !disabledAccounts.includes(user.username))? <Link key={`delete_${user.id}`} to="#" onClick={ () => this.handleUserDelete(user.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesomeIcon icon='trash' fixedWidth/></OverlayTrigger></Link> : ''}
            </td>
          </tr>
        );
      })      
    }

    return (
      <tr key="noUsersFound">
        <td colSpan="5"> No users found!</td>
      </tr>
    )
  }

  renderSystemUsers() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this user.</Tooltip>)
    const tokenTooltip = (<Tooltip id="deleteTooltip">Show user's JWT token.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this user.</Tooltip>)

    if(this.props.users && this.props.users.length > 0) {
      let system_users = this.props.users.filter((user) => user.system_user)

      return system_users.map((user) => {
        if(user.system_user) {
          return (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.fullname}</td>
              <td>
                {(this.props.roles.includes('admin'))? <Link key={`edit_${user.id}`} to="#" onClick={ () => this.handleUserSelect(user.id) }><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesomeIcon icon='pencil-alt' fixedWidth/></OverlayTrigger></Link> : ''}{' '}
                {(this.props.roles.includes('admin'))? <Link key={`token_${user.id}`} to="#" onClick={ () => this.handleDisplayUserToken(user.id) }><OverlayTrigger placement="top" overlay={tokenTooltip}><FontAwesomeIcon icon='eye' fixedWidth/></OverlayTrigger></Link> : ''}{' '}
                {(user.id != this.props.profileid && !disabledAccounts.includes(user.username))? <Link key={`delete_${user.id}`} to="#" onClick={ () => this.handleUserDelete(user.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesomeIcon icon='trash' fixedWidth/></OverlayTrigger></Link> : ''}
              </td>
            </tr>
          );
        }
      })
    }

    return (
      <tr key="noUsersFound">
        <td colSpan="3"> No users found!</td>
      </tr>
    )   
  }

  renderUserTable() {
    if(this.props.users.filter(user => user.system_user === false).length > 0){
      return (
        <Table responsive bordered striped>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Full Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderUsers()}
          </tbody>
        </Table>
      )
    } else {
      return (
        <Panel.Body>No Users Found!</Panel.Body>
      )
    }
  }

  renderSystemUserTable() {
    if (this.props.users.filter(user => user.system_user === true).length > 0){
      return (
        <Table responsive bordered striped>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Full Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderSystemUsers()}
          </tbody>
        </Table>
      )
    } else {
      return (
        <Panel.Body>No System Users Found!</Panel.Body>
      )
    }
  }

  renderUsersHeader() {

    const Label = "Users"

    // const importTooltip = (<Tooltip id="importTooltip">Import Users</Tooltip>)
    const exportTooltip = (<Tooltip id="exportTooltip">Export Users</Tooltip>)
    const deleteAllNonSystemTooltip = (<Tooltip id="deleteAllNonSystemTooltip">Delete all non-system Users</Tooltip>)

    const disableBtn = (this.props.users.filter(user => user.system_user === false).length > 0)? false : true

    // <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleImportUserList }><OverlayTrigger placement="top" overlay={importTooltip}><FontAwesomeIcon icon='upload' fixedWidth/></OverlayTrigger></Button>

    return (
      <div>
        { Label }
        <div className="pull-right">
          <OverlayTrigger placement="top" overlay={deleteAllNonSystemTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleNonSystemUsersWipe() } disabled={disableBtn}><FontAwesomeIcon icon='trash' fixedWidth/></Button></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={exportTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.exportUsersToJSON() } disabled={disableBtn}><FontAwesomeIcon icon='download' fixedWidth/></Button></OverlayTrigger>
        </div>
      </div>
    );
  }

  renderSystemUsersHeader() {

    const Label = "System Users"

    // const importTooltip = (<Tooltip id="importTooltip">Import Users</Tooltip>)
    const exportTooltip = (<Tooltip id="exportTooltip">Export Users</Tooltip>)

    // <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleImportUserList }><OverlayTrigger placement="top" overlay={importTooltip}><FontAwesomeIcon icon='upload' fixedWidth/></OverlayTrigger></Button>
    let export_icon = (this.props.roles.includes("admin"))? (<OverlayTrigger placement="top" overlay={exportTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.exportSystemUsersToJSON() }><FontAwesomeIcon icon='download' fixedWidth/></Button></OverlayTrigger>) : null

    return (
      <div>
        { Label }
        <div className="pull-right">
          {export_icon}
        </div>
      </div>
    );
  }

  renderPagination() {
    if(this.props.users && this.props.users.length > maxUsersPerPage) {

      let priceCount = this.props.users.length;
      let last = Math.ceil(priceCount/maxUsersPerPage);
      let delta = 2
      let left = this.state.activePage - delta
      let right = this.state.activePage + delta + 1
      let range = []
      let rangeWithDots = []
      let l = null

      for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(<Pagination.Item key={l + 1} active={(this.state.activePage === l+1)} onClick={() => this.setState({activePage: (l + 1)})}>{l + 1}</Pagination.Item>)
          } else if (i - l !== 1) {
            rangeWithDots.push(<Pagination.Ellipsis />);
          }
        }
        rangeWithDots.push(<Pagination.Item key={i} active={(this.state.activePage === i)} onClick={() => this.setState({activePage: i})}>{i}</Pagination.Item>);
        l = i;
      }

      return (
        <Pagination>
          <Pagination.First onClick={() => this.setState({activePage: 1})} />
          <Pagination.Prev onClick={() => { if(this.state.activePage > 1) { this.setState(prevState => ({ activePage: prevState.activePage-1}))}}} />
          {rangeWithDots}
          <Pagination.Next onClick={() => { if(this.state.activePage < last) { this.setState(prevState => ({ activePage: prevState.activePage+1}))}}} />
          <Pagination.Last onClick={() => this.setState({activePage: last})} />
        </Pagination>
      )
    }
  }

  render() {
    if (!this.props.roles) {
        return (
          <div>Loading...</div>
        )
    }

    if (this.props.roles.includes("admin") || this.props.roles.includes("cruise_manager")) {

      let userForm = (this.props.userid)? <UpdateUser /> : <CreateUser />

      return (
        <div>
          <DisplayUserTokenModal />
          <DeleteUserModal />
          <ImportUsersModal handleExit={this.handleUserImportClose}/>
          <NonSystemUsersWipeModal />
          <Row>
            <Col sm={6} mdOffset= {1} md={5} lgOffset= {2} lg={4}>
              <Panel>
                <Panel.Heading>{this.renderSystemUsersHeader()}</Panel.Heading>
                {this.renderSystemUserTable()}
                {this.renderPagination()}
              </Panel>
              <Panel>
                <Panel.Heading>
                  {this.renderUsersHeader()}
                </Panel.Heading>
                {this.renderUserTable()}
              </Panel>
              {this.renderAddUserButton()}
              {this.renderImportUsersButton()}
            </Col>
            <Col sm={6} md={5} lg={4}>
              { userForm }
            </Col>
          </Row>
        </div>
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
  return {
    users: state.user.users,
    userid: state.user.user.id,
    profileid: state.user.profile.id,
    roles: state.user.profile.roles
  }
}

export default connect(mapStateToProps, actions)(Users);