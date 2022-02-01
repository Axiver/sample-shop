# BED-CA1

API Service for SP IT!

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See Installing for notes on how to deploy the project on a live system.

### Prerequisites

You need Node.js, npm (which comes with Node.js) and MySQL to deploy this express app.

[Download Node.js and npm](https://nodejs.org/en/)
[Download MySQL](https://dev.mysql.com/downloads/)

### Installing
#### Node packages

After downloading Nodejs and npm, `cd` into the directory you installed the express application to and run `npm i`. It should automatically install all the needed modules for this bot to work.

#### Setup
##### Manual

1. Edit `/models/databaseConfig.js` with your editor of choice and modify `host`, `port`, `user` and `password` such that the express app is able to communicate with your MySQL server later on.
2. Load `db-init.sql` in MySQL Workbench and execute it to create the necessary tables and schemas for the app to work.
3. Load `db-seed.sql` in MySQL Workbench and execute it to populate the created tables for the app to work.
4. Ensure that your MySQL server is up and running.
5. Execute `node server.js` in the root directory of the application's installation directory.

The application will now be running at http://localhost:3000

## Advanced Features

This app has many advanced features, such as:
1. Password hashing
2. Email format validation
3. Input formatting (Remove spaces from the ends)
4. Support for promotional periods
5. Ensures that there can only be one promotion ongoing for any given product
6. Support for multiple product images for a given product
7. Support for retrieval of a particular image of a particular product

## Database Structure
A word document showing the tables created and their linkage is available in `db-structure.docx`.

## API Documentation
Documentation for endpoints that are part of the bonus requirements (image uploading and retrieval, promotional period creation/retrieval/deletion) are available at [Endpoints](##Endpoints).
Screenshots of every endpoint (basic and advanced included) being tested are available at `screenshots.docx`. 

## Endpoints

### POST /product/:id/image
#### Success Response
Code: 201 Created
Content: Sequence of the newly uploaded image
```
{
    "sequence": 1
}
```
#### Request Body
Content-Type: multipart/form-data
Key: "image"
Value: Image to be uploaded

#### Error Response(s)
##### Image is larger than 1MB
Code: 413 Payload Too Large

##### Image filetype is not a .jpg or .png
Code: 415 Unsupported Media Type

##### Product already has the image in its product gallery
Code: 422 Unprocessable Entity

##### Unknown Error
Code: 500 Internal Server Error


### GET /product/:id/image
#### Success Response
Code: 200 OK
Content: Total number of images in a product gallery
```
{
    "count": 1
}
```
#### Request Body
N/A

#### Error Response(s)
##### Unknown Error
Code: 500 Internal Server Error


### GET /product/:id/image/:sequence
#### Success Response
Code: 200 OK
Content: Image file

#### Request Body
N/A

#### Error Response(s)
##### Resource not found
Code: 404 Not Found

##### Unknown Error
Code: 500 Internal Server Error


### POST /promotions/
#### Success Response
Code: 201 Created

#### Request Body
```
{
    "productid": 1,
    "discount": 100,
    "start_date": "2022-01-02 00:00:00",
    "end_date": "2022-01-02 23:59:59"
}
```
#### Error Response(s)
##### Incorrect Date time format or Promotion coincides with an existing one or Invalid discount value or Date time supplied is in the past
Code: 422 Unprocessable Entity

##### Unknown Error
Code: 500 Internal Server Error


### GET /promotions/product/:id
#### Success Response
Code: 200 OK
Content: Past, Ongoing and Future promotions for the product
```
[{
        "id": 1,
        "productid": 1,
        "discount": 200,
        "start_date": "2021-12-24 10:09:17",
        "end_date": "2021-12-26 10:09:17"
    },
    {
        "id": 6,
        "productid": 1,
        "discount": 100,
        "start_date": "2022-01-02 00:00:00",
        "end_date": "2022-01-02 23:59:59"
},
...
]
```
#### Request Body
N/A

#### Error Response(s)
##### No promotions for the product was found
Code: 404 Not Found

##### Unknown Error
Code: 500 Internal Server Error


### DELETE /promotions/:id
#### Success Response
Code: 204 No Content

#### Request Body
N/A

#### Error Response(s)
##### Unknown Error
Code: 500 Internal Server Error

## New Additions for CA2
### GET /product/sort/searchterms/:searchTerms
#### Success Response
Code: 200 OK
Content: Products with names that match the search terms supplied
```
[
    {
        "name": "SP AMD Ryzen 3600 Laptop",
        "description": "Best Laptop",
        "categoryid": 1,
        "brand": "SP IT!",
        "price": 1855.5,
        "categoryname": "Laptops"
    },
    {
        "name": "ASUS AMD Ryzen 5600x Laptop",
        "description": "Bester Laptop",
        "categoryid": 1,
        "brand": "ASUS",
        "price": 1949.99,
        "categoryname": "Laptops"
    },
    ...
]
```
#### Request Body
N/A

#### Error Response(s)
##### No products matching the provided search terms were found
Code: 404 Not Found

##### Unknown Error
Code: 500 Internal Server Error


### GET /product/sort/ratings/
#### Success Response
Code: 200 OK
Content: Products sorted based on their ratings in descending order
```
[
    {
        "name": "SPhone 9000",
        "productid": 7,
        "description": "Basically a quantum computer",
        "categoryid": 3,
        "brand": "SP IT!",
        "price": 3845.99,
        "avgRating": 5,
        "categoryname": "Mobile Phones"
    },
    {
        "name": "SP AMD Ryzen 3600 Laptop",
        "productid": 1,
        "description": "Best Laptop",
        "categoryid": 1,
        "brand": "SP IT!",
        "price": 1855.5,
        "avgRating": 1.5,
        "categoryname": "Laptops"
    },
    ...
]
```
#### Request Body
N/A

#### Error Response(s)
##### Unknown Error
Code: 500 Internal Server Error


### POST /tracking/view/product/:productid
#### Success Response
Code: 204 No Content

#### Request Body
N/A

#### Error Response(s)
##### Unknown Error
Code: 500 Internal Server Error


### POST /tracking/view/product/:productid
#### Success Response
Code: 204 No Content

#### Request Body
N/A

#### Error Response(s)
##### Unknown Error
Code: 500 Internal Server Error


### GET /product/filter/category/:categoryid
#### Success Response
Code: 200 OK
Content: Products filtered based on their category
```
[
    {
        "name": "SPhone 9000",
        "productid": 7,
        "description": "Basically a quantum computer",
        "categoryid": 3,
        "brand": "SP IT!",
        "price": 3845.99,
        "avgRating": 5,
        "categoryname": "Mobile Phones"
    },
    ...
]
```
#### Request Body
N/A

#### Error Response(s)
##### Unknown Error
Code: 500 Internal Server Error