import React from 'react';
import DonateForm from './DonateForm';
import DonateDetail from './DonateDetail';

require('../../styles/style.css');

class NewEventPage extends React.Component {
  render() {
    return (
      <div>
        <DonateForm />
        <DonateDetail />
      </div>
    );
  }
}

export default NewEventPage;
