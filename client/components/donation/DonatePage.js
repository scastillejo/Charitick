import React from 'react';
import DonateForm from './DonateForm';
import DonateDetail from './DonateDetail';

require('../../styles/style.css');

class NewEventPage extends React.Component {
  render() {
    return (
    	<div className="row">
	        <div className="col-md-4 col-md-offset-4">
		        <DonateForm />
        		<DonateDetail />
		    </div>
	    </div>
    );
  }
}

export default NewEventPage;
