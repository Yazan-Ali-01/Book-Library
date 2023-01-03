<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">Book Library Application</h3>

  <p align="center">
    Book Library made with node js and express with important basic features
    <br />
    <a href="https://github.com/Yazan-Ali-01/Book-Library"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://yazan-book-library.cyclic.app/">View Demo</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

There are many great node applications about implementing the most important CRUD operations but I wanted to make something on my own with the features that I'm looking for, So I came up with that project and also deployed it on Cyclic so you can look on the online version easily on https://yazan-book-library.cyclic.app/

Here's why:

- You should always try to implement what you learn from the courses you take or from the documentation you read
- A book library application with signup and login features would be a great summurize of what I learned in general
- Front-end is no less imprtant than back-end for the full stack developer so I tried to create it based on bootstrap library

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With


- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- ![https://img.shields.io/badge/Database-Mongoose-blue][mongoose-url]
- ![https://img.shields.io/badge/frontend-ejs-red][ejs-url]
- ![https://img.shields.io/badge/frontend-BootStrap-brightgreen][bootstrap-url]
- ![https://img.shields.io/badge/other-express--session-yellow][express-session-url]
- ![https://img.shields.io/badge/other-flash-lightgrey][flash-url]
- ![https://img.shields.io/badge/other-csrf-orange][csrf-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get started clone the repository and read the installation instructions below

### Prerequisites

list of things you need to use the software

- npm
  ```sh
  npm install npm@latest -g
  ```
- MongoDB installed locally on your PC

### Installation

\_Below is an example of how you can install and set up the app locally.

1. Clone the repo
   ```sh
   git clone https://github.com/Yazan-Ali-01/Book-Library.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your environment variables in `.env.example` then change its name to `.env` only
   ```js
   const MONGODB_URI = "ENTER YOUR MONGODB_URI";
   const SECRET =
     "ENTER YOUR secret first name to signup as admin account when you signup with that first name";
   ```
4. start application with `npm run start:dev` in the terminal
5. Run it in your browser on `localhost:3000`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Email: [yazan.ali.dev@gmail.com](yazan.ali.dev@gmail.com)

Project Link: [https://github.com/Yazan-Ali-01/Book-Library](https://github.com/Yazan-Ali-01/Book-Library)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/Yazan-Ali-01/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/yazan-ali/
[product-screenshot]: images/screenshot.png
[express-url]: https://img.shields.io/badge/backend-express.js-brightgreen
[node-url]: https://img.shields.io/badge/backend-node.js-green
[mongo-url]: https://img.shields.io/badge/Database-MongoDB-blue
[mongoose-url]: https://img.shields.io/badge/-Mongoose-blue?style=flat-square
[ejs-url]: https://img.shields.io/badge/-Ejs-red?style=flat-square
[express-session-url]: https://img.shields.io/badge/-Express--Session-yellow?style=flat-square
[flash-url]: https://img.shields.io/badge/-Flash-lightgrey?style=flat-square
[csrf-url]: https://img.shields.io/badge/-csrf-orange?style=flat-square
[bootstrap-url]: https://img.shields.io/badge/-BootStrap-brightgreen?style=flat-square
