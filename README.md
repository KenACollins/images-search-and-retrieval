# Images Search and Retrieval
This web application provides an input box to enter a search term, then retrieves and displays images matching the criteria in an infinitely scrollable area. It accesses Giphy API through REST calls. 

## Try It Out!
Launch https://shrouded-ocean-92988.herokuapp.com/ in your web browser. If you scroll to the bottom of the images, a new set will automatically be retrieved and the web page will grow by another 50 images. There is no need to click a button to retrieve more. 

In case you are unfamiliar with Heroku, they assign ridiculous subdomains to each project when you are using a free account as I am. This is where "shrouded-ocean-92988" comes from.

## Design

I coded the solution in React, creating the following components:

### App

Main component at top of hierarchy.

### SearchBar

Displays an input field with a hardcoded label.

#### ImageList

Using array of images, produces a list ImageCard components.

Has an accompanying CSS stylesheet file for styling the images in a grid, supporting all images of the same width but different heights.

### ImageCard

Displays an individual image.

## Third Party Tools

### Axios

I opted to use axios for Ajax calls instead of fetch() since I like the way I can set HTTP request headers in axios although it turned out that the Giphy API key did not need to be passed in an Accept header, just on the URL.

### Semantic UI

I am an engineer (electrical engineer at heart), not a UX designer, so when I need sample designs I rely on Semantic UI, https://semantic-ui.com/.