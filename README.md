# App
* [Demo App](https://reaktor-client.herokuapp.com/)
* Select a product to view (Beanies, Facemasks, or Gloves)
* Included pagination to handle the rendering of the 5000+ products. Scroll to the bottom of the list, or change the number in the URL, to switch to another page

## Product Data
* Data fetched from production service, [repo found here](https://github.com/zcallanan/Express-Products-Service)
* View JSON data for each product by inserting api into the URL:
  * [Beanies](https://reaktor-client.herokuapp.com/api/beanies)
  * [Facemasks](https://reaktor-client.herokuapp.com/api/facemasks)
  * [Gloves](https://reaktor-client.herokuapp.com/api/gloves)

## Availabilities
* Third party API supplies three availabilities that are displayed when available: 
  * In Stock
  * Less Than 10
  * Out of Stock
* If product items are not found in the third party API responses, then the app displays "Unknown Availability"
  * If this occurs it's generally for all products of a manufacturer
