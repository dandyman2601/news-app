# News App by Alvin

A Vue.js application that utilizes the NewsAPI.org API and Vuetify UI framework to fetch and display the top news headlines. \
Uses Vue Router, Vuetify, and Vuex features and concepts. Also has simple test cases using the [Jest Testing Framework](https://cli.vuejs.org/core-plugins/unit-jest.html).

Follows the [Airbnb JavasScript Style](https://github.com/airbnb/javascript) guide with ESLint

## Features

- Display news articles from various sources.
- View detailed information about each article.
- Edit and save titles of articles.
- Navigate to the full article on the source's website.
- Responsive design for mobile and desktop devices.
- Smooth transitions and hover effects.
- Error handling for API requests.
- Search feature
- Filter feature
- Jest Unit Tests
- View history of visited articles
- UI inspiration from popular News sites and Material Design case study [Fortnightly](https://m2.material.io/design/material-studies/fortnightly.htm)

## Installation

### Prerequisites

- Node.js v14+ (mine was v18.14.0)
- npm v6+ (mine was v9.3.1)
- Docker (optional: you may need higher Node versions)

### Clone the Repository

```
git clone https://github.com/dandyman2601/news-app.git
cd news-app
```

### Adding your own NewsAPI API key

1. Visit [NewsAPI](https://newsapi.org/docs/get-started) to obtain an API key after registering

2. Create a `.env` file in the root of the project and assign your obtained API key from [NewsAPI](https://newsapi.org/docs/get-started) as shown below:

```
VUE_APP_API_KEY=YOUR_API_KEY_FROM_NEWS_API
```

## Running the application

### Option 1: Using npm

1. Install dependencies:

```
npm install
```

2. Compiles and hot-reloads for development:

```
npm run serve
```

3. Open your browser and visit: `http://localhost:8080`

### Option 2: Using Docker

1. Build the Docker image:

```
docker build -t news-app .
```

2. Run the Docker container:

```
docker run -it -p 8080:8080 --rm --name news-app-container news-app
```

3. Open your browser and visit: `http://localhost:8080`

## Running ESLint

You can run the ESLint with Airbnb config manually by running the command in the terminal:

```
npm run lint
```

## Running Test Cases

You can run the Jest Unit test cases by running the command in the terminal:

```
npm run test:unit
```

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgments

- This application was developed as part of the assignment for Manatal.
- Special thanks to NewsAPI.org for providing their amazing tools and resources.

---
