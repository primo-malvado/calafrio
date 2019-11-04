import React, { Component } from 'react';
 
 
export default class LoginForm extends Component {
  state = { email: '' };

  onChange = event => {
    const email = event.target.value;
    this.setState(s => ({ email }));
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.login({ variables: { email: this.state.email } });
  };

  render() {
    return (
      <div>
        <h1>Space Explorer</h1>
        <form onSubmit={this.onSubmit}>
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            data-testid="login-input"
            onChange={this.onChange}
          />
          <button type="submit">Log in</button>
        </form>
      </div>
    );
  }
} 
 
 
 
 