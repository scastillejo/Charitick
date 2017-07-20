import React, {Component} from 'react';
import {connect} from 'react-redux';

class DonateDetail extends Component {
    render() {
        if (!this.props.items) {
            return (<div></div>);
        }
        return (
            <div>
                <form id="resultform">
                  <div id="searchresultsformdiv">
                    <div className="form-group">
                      <ul className="list-group" id="searchresults">
                        <li>Description: {this.props.items.details.desc}</li>
                        <li>e-mail: {this.props.items.details.email}</li>
                        <li>Time: 
                            {this.props.items.details.hour}:
                            {this.props.items.details.minute}:
                            {this.props.items.details.second}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="form-group">
                     <p>We recommend doing a FULL SEARCH about the organization before donating.</p>
                  </div>
                  <div id="searchresultsbuttondiv">
                    <div className="form-group">
                      <input type="submit" className="btn btn-danger" value="Donate" />
                    </div>
                  </div>  
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.details
    };
}

export default connect(mapStateToProps)(DonateDetail);
