# Images Search and Retrieval
This web application provides an input box to enter a search term, then retrieves and displays images matching the criteria in an infinitely scrollable area. It accesses Giphy API through REST calls. 

Though the images are different sizes, they are laid out in a grid that minimizes white space, in a responsive design that starts off occupying five columns on large screens and reduces to one column on the smallest devices. The columns of images are always centered relative to their container.

## Try It Out!
Launch https://shrouded-ocean-92988.herokuapp.com/ in your web browser. Please allow a minute or two. I am hosting it in a free tier cloud service and the app is "put to sleep" when not in active use. 

If you scroll to the bottom of the images, a new set will automatically be retrieved and the web page will grow by another 50 images. There is no need to click a button to retrieve more. A 'back to top' floater will fade in at the bottom right corner of the screen ready to glide you back to the top when clicked. 

In case you are unfamiliar with Heroku, they assign ridiculous subdomains to each project when you are using a free account as I am. This is where "shrouded-ocean-92988" comes from.

## Design

I coded the solution in React, creating the following components:

### App

Main component at top of hierarchy.

Also sets up the 'back to top' floater, relying on an accompanying CSS stylesheet.

### SearchBar

Displays an input field with a hardcoded label.

### ImageList

Using array of images, produces a list ImageCard components.

Has an accompanying CSS stylesheet file for styling the images in a grid, accounting for images of the same width but different heights.

### ImageCard

Displays an individual image.

## Third Party Tools

### Giphy API

I am passing the search term to the Giphy API and then processing the results which are returned in JSON format.  Documentation is available here:

https://developers.giphy.com/docs/api#quick-start-guide

### Axios

I opted to use axios for Ajax calls instead of fetch() since I like the way I can set HTTP request headers in axios.

### Semantic UI

I am an engineer (electrical engineer at heart), not a UX designer, so when I need to whip up a proof of concept I rely on Semantic UI, https://semantic-ui.com/.

## Features

### Infinitely Scrollable Container

Upon entry of a search term, the screen will be filled with related images. As you scroll down the page, before you reach the bottom, another set of 50 images will be retrieved, and another and another as you continue to scroll downward. There is no need to click a button to load more images.

### Responsive Design

On medium sized screens and larger, the images that are returned by the search will fill five columns across the center of the display which white space on the left and right sides.

If you shrink your browser or test this app on a device with a smaller screen, you will see that the number of columns of images gets reduced to four, then three, two, and finally one on the smallest devices. In all cases, the columns of images are centered relative to their container (not left-aligned).

### Efficient Use of Space

The images are all the same width, but different heights. If the images were laid out in a grid of equal heights based on the tallest image in the results, there would be a lot of white space -- a lot of gaps. To tighten up the arrangement of the images, I employed the help of CSS Grid.

### Back to Top Floater

Once you scroll down just enough for the search box to disappear, in the bottom right corner of the screen a round blue icon containing a white triangle will fade in. If you hover your mouse over it, it will turn orange and the text "Back to Top" will appear. 

Click on the icon and the screen will move itself upward in a graceful manner (see note below) to the top of the screen so you can enter a new search term.

Note: At this time, Edge, IE, and Safari browsers do not support the smooth behavior and will jump to the top instantly.

### Error Handling

The app handles, in a user friendly manner, support for three types of error conditions when there are no image results to display:

* User presses Enter but has not typed anything in search term field.
* User has entered such an obscure (or totally misspelled) search term such that there are zero results.
* There are no more search results available because user has scrolled far enough to reach the end.