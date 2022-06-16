import React, { Component } from "react";

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3 className="home-title">Welcome to ''YOUR ORGANIZER''</h3>
          <p>Here you can create/read/update/delete your todos!</p>
          <p>This organizer is created by Svitlana Vorobets</p>
        </header>
      </div>
    );
  }
}