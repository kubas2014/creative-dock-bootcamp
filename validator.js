const fetch = require("node-fetch"); //for calling the api
const parser = require('fast-xml-parser'); //for parsing the xml response
//const Geocoder = require("https://api.mapy.cz/js/api/v4/util/geocoder.js");

async function parseData (data) {
  //no data case
  if (!data) return false;
  //object case
  if (typeof data === "object") { return data; }
  //string case, parse as json
  if (typeof data === "string") { return JSON.parse(data); }
}

function attributeCheck (data) {
  for (a in data) {
    if (!data[a]) {
      const error = new Error("The data is incomplete. Attribute " + a + " is empty.");
      error.status = 404;
      throw error;
    }
  }
}

exports.Validate = async (input) => {
  try {
    //checking the input object
    let address = await parseData(input);

    //TODO: checking the attributes: too strict for testing -> enable for production
    //attributeCheck(address);
    
    //mapycz api
    let api = "http://api4.mapy.cz/geocode?query=";
    //array to explode
    let arr = [address.street,address.number,address.city,address.zip,address.state];
    //building the request
    let requestURL = encodeURI(api + arr.join(" "));
    //calling the mapycz api
    let request = await fetch(requestURL, { method: "GET"
    });
    //the request correctly executed
    if (request.status === 200) {
      //converting response to text
      let response = await request.text();
      //options to parse XML attributes
      const parserOptions = {
        ignoreAttributes: false,
        parseAttributeValue: true
      };
      //prepare json response
      let json = await parser.parse(response, parserOptions);
      let result = {
        id: address.id,
        valid: null
      };
      //checking that the response is 200
      if (json.result.point["@_status"] === 200) {
        //check if the result is an array
        if (Array.isArray(json.result.point.item)) {
          let uniqueStreet = [];
          for (item in json.result.point.item) {
            if (json.result.point.item[item]['@_type'] === "addr") {
              uniqueStreet.push(json.result.point.item[item]);
            }
            //street type: if item.type === stre -> missing number
            //quarter type: if item.type === quar -> missing street, number
            //municipality type: if item.type === muni -> missing street, number
            //address type: item.type === addr --> correct address
          }
          //unique street found
          if (uniqueStreet.length === 1) {
            result.valid = true;
            return result;
          }
          //no unique street found
          else if (uniqueStreet.length === 0) {
            result.valid = false;
            return result;
          }
        }
        //check if the response is an object (case: unique address found)
        else if (typeof json.result.point.item === "object") {
          //check if the type is address
          if (json.result.point.item['@_type'] === "addr") {
            result.valid = true;
            return result;
          }
          //address not found
          else {
            result.valid = false;
            return result;
          }
        }
        //all other cases -> not a valid address
        else {
          result.valid = false;
          return result;
        }

      }
    }
    //throw error if the request to the mapycz api is bad
    else {
      const error = new Error(request.statusText);
      error.status = request.status;
      throw error;
    }
  }
  catch (error) {
    return error;
  }
}
