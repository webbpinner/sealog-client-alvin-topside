import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Row, Col, FormGroup, Panel, Button, Alert, Image } from 'react-bootstrap';
// import ReCAPTCHA from "react-google-recaptcha";
import * as actions from '../../actions';
// import { ROOT_PATH, RECAPTCHA_SITE_KEY } from '../../client_config';
import { ROOT_PATH, TOPSIDE } from '../../client_config';

class Login extends Component {
 
 constructor (props) {
    super(props);

    this.state = {
      stdUsers: true,
      // reCaptcha: null
    }
  }

  componentWillUnmount() {
    this.props.leaveLoginForm();
  }

  // onCaptchaChange(token) {
  //   this.setState({reCaptcha: token})
  // }

  handleFormSubmit({ username, password }) {
    username = username.toLowerCase();
    // let reCaptcha = this.state.reCaptcha
    // this.props.login({username, password, reCaptcha});
    this.props.login({username, password});
  }

  renderAlert(){
    if(this.props.errorMessage) {
      return (
        <Alert bsStyle="danger">
          <strong>Opps!</strong> {this.props.errorMessage}
        </Alert>
      )
    } else if (this.props.successMessage) {
      return (
        <Alert bsStyle="success">
          <strong>Sweet!</strong> {this.props.successMessage}
        </Alert>
      )
    }
  }
 
render() {
    const { handleSubmit, pristine, reset, submitting, valid } = this.props;
    const loginPanelHeader = (<h4 className="form-signin-heading">Please Sign In</h4>);

    const loginShortcuts = ( TOPSIDE )? <Button bsStyle="success" onClick={() => this.props.switch2Guest()} block>Login as Guest</Button> : [
      <Button key="pilot" bsStyle="success" onClick={() => this.props.switch2Pilot()} block>Login as Pilot</Button>,
      <Button key="stbd_obs" bsStyle="success" onClick={() => this.props.switch2StbdObs()} block>Login as Starboard Observer</Button>,
      <Button key="port_obs" bsStyle="success" onClick={() => this.props.switch2PortObs()} block>Login as Port Observer</Button>
    ]


    return (
      <Row>
        <Col sm={5} md={3} mdOffset={2} lg={2} lgOffset={3}>
          <Panel className="form-signin">
            <Panel.Body>
              {loginPanelHeader}
              <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                <FormGroup>
                  <Field
                    name="username"
                    component="input"
                    type="text"
                    placeholder="Username"
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Field
                    name="password"
                    component="input"
                    type="password"
                    placeholder="Password"
                    className="form-control"
                  />
                </FormGroup>
                <br/>
                {this.renderAlert()}
                <div>
                  <Button bsStyle="primary" type="submit" block disabled={submitting || !valid}>Login</Button>
                </div>
              </form>
              <br/>
              {loginShortcuts}
              <br/>
              <div>
                <span>
                  { (TOPSIDE)?<Link to={ `/forgotPassword` }>{<FontAwesomeIcon icon="arrow-left"/>} Forgot Password?</Link> : null }
                </span>
                <span className="pull-right">
                  <Link to={ `/register` }>Register New User {<FontAwesomeIcon icon="arrow-right"/>}</Link>
                </span>
              </div>
            </Panel.Body>
          </Panel>
        </Col>
        <Col>
          <Image className="form-signin" responsive src={`${ROOT_PATH}images/Alvin_Profile.png`}/>
        </Col>
      </Row>
    )
  }
}

                  // <Button bsStyle="primary" type="submit" block disabled={submitting || !valid || !this.state.reCaptcha}>Login</Button>

                // <ReCAPTCHA
                  // ref={e => recaptchaInstance = e}
                  // sitekey={RECAPTCHA_SITE_KEY}
                  // theme="dark"
                  // size="normal"
                  // onChange={this.onCaptchaChange.bind(this)}
                // />

const validate = values => {

  // console.log(values)
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  }

  if (!values.password) {
    errors.password = 'Required'
  }

  return errors
}

// let recaptchaInstance = null;

const afterSubmit = (result, dispatch) => {
//  recaptchaInstance.reset();
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    successMessage: state.auth.message
  }
}

Login = reduxForm({
  form: 'login',
  validate: validate,
  onSubmitSuccess: afterSubmit
})(Login);

export default connect(mapStateToProps, actions)(Login);
