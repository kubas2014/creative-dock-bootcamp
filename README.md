# Address Validator

### How does it work

This package uses the Geocoding feature of Mapy.cz API to verify whether an address is valid. You can find out more about the API here: http://api.mapy.cz.
This software gives no guarantee as to the accuracy of the addresses and should not be used for life-critical or other similar use cases requiring absolute accuracy.

### Setting up the app

1. Clone this Github repository on your local machine
2. Navigate to the root folder of this repository within your command line (CL) and run `npm install` to install npm dependencies
3. Still in the CL, run `npm start` to start the server
4. Open your browser and navigate to localhost:3000

### Running the app

1. call the `/validate` route with a post method
2. the route expects a request with a body having some of the following attributes (non-strict version):
```javascript
{
  id: 123,
  street: "Street",
  number: 11,
  zip: 13400,
  city: "City",
  state: "Czech Republic"
}
```
3. you can expect the following output:
```javascript
{
  id: 123,
  valid: boolean // true / false
}
```
4. if your request was incorrect, the function throws an error
5. you can also use a strict version of the address validator by uncommenting the `attributeCheck(address)` function in the validator.js file.
