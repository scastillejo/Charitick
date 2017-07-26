import React from 'react';
import { connect } from 'react-redux';
import { createDonation } from '../../actions/donateActions';
import TextFieldGroup from '../common/TextFieldGroup';

class DonateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: 0,
      minute: 0,
      second: 0,
      errors: {},
      isLoading: false,
      flag: 'find'
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.myVar = setInterval(function () {
      this.tick();
      this.setTime();
    }.bind(this), 1000);
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {}, isLoading: true });
    const { isAuthenticated } = this.props.auth;
    if(isAuthenticated){
       this.props.createDonation(this.state);
    }
    else{
      this.setState({ errors: { message:'Sign up and log in first!'}, isLoading: false })
    }
  }

  tick(){
    let date = new Date();
    var h, m, s;
    h = 30 * (date.getHours() % 12 + date.getMinutes() / 60);
    m = 6 * date.getMinutes();
    s = 6 * date.getSeconds();
    document.getElementById('s').style.cssText="-webkit-transform:rotate("+s+"deg);";
    document.getElementById('m').style.cssText="-webkit-transform:rotate("+m+"deg);";
    document.getElementById('h').style.cssText="-webkit-transform:rotate("+h+"deg);";
  }

  setTime(){
    var currentdate = new Date();
    var hour = currentdate.getHours();    

    // correct for number over 24, and negatives
    if( hour >= 24 ){ hour -= 24; }
    if( hour < 0   ){ hour += 12; }

    hour = hour + "";
    if( hour.length == 1 ){ hour = "0" + hour; }

    var minute = currentdate.getMinutes();
    minute = minute + "";
    if( minute.length == 1 ){ minute = "0" + minute; }

    var second = currentdate.getSeconds();
    second = second + "";
    if( second.length == 1 ){ second = "0" + second; }

    this.setState({
      hour: hour,
      minute: minute,
      second: second
    });
  }

  componentDidMount(){
    this.myVar;
  }

  componentWillUnmount(){
    clearInterval(this.myVar);
  }

  render() {
    const { title, errors, isLoading } = this.state;
    return (
      <div>
        <form id="clockform" onSubmit={this.onSubmit}>
          <div className="form-group">
            <div id="clockdiv">
              <div className="clock">
                  <div id="s" className="transform"></div>
                  <div id="m" className="transform"></div>
                  <div id="h" className="transform"></div>
                  <div id="center"></div>
              </div>
              <div className="time">
                <span>{this.state.hour}:{this.state.minute}:{this.state.second}</span>
              </div>
              <div className="time">
                <input type="submit" className="btn btn-danger btn-lg" value="Tick" />
              </div>
              { errors.message && <div className="time">{this.state.errors.message}</div>}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

DonateForm.propTypes = {
  auth: React.PropTypes.object.isRequired,
  createDonation: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { createDonation })(DonateForm);
