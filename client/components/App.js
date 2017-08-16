import React from 'react';
import NavigationBar from './NavigationBar';
import FlashMessagesList from './flash/FlashMessagesList';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <NavigationBar />
        <FlashMessagesList />
        {this.props.children}
        <div className="form-group" id="footer">
			<p><b>© 2017 Charitick</b></p>
			<p><a href="/">Terms and Conditions</a></p>
		</div>
      </div>
    );
  }
}

export default App;
