import React from "react";

const About: React.FC = () => {
  return (
    <div className="page-container">
      <h1>About</h1>
      <p>Thank you for visiting our application!
        This project was created as part of the curriculum at Codecool, a coding bootcamp that offers intensive programming courses. The goal of this project was to build a full-stack web application that allows users to track their TV shows and manage their watchlists.</p>
      <p>We hope you find this application useful and enjoyable to use. If you have any feedback or suggestions for improvement, please don't hesitate to reach out to us. Thank you again for visiting!</p>
      <h2>Our Team </h2>
      <p>Our team consists of 4 members, each with their own unique skills and contributions to the project:</p>
      <ul>
        <li><strong>Clara Hansson</strong></li>
        <li><strong>Quynh-Lan Nguyen Pham</strong></li>
        <li><strong>Nikolai Gangstø</strong></li>
        <li><strong>Jonathan Nygaard</strong></li>
      </ul>
    </div>
  );
};

export default About;
