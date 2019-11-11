/**
 * Service to fetch data from the zomato api
*/

const zomato = {}

var request = require("request-promise")

let apiUrl = "https://developers.zomato.com/api/v2.1/"
let apiKey = process.env.ZOMATO_API_KEY

var options = {
    uri: '',
    headers: {
        'user-key': apiKey
    },
    json: true
};

zomato.get = async (reqTo, data = {}) => {
    let url = apiUrl+reqTo

    options['method']   = 'GET'
    options['uri']      = url
    options['qs']       = data

    let responseData = {}

    await request(options, (error, response, body) => {
        if(response.statusCode == 200){
            responseData = body
        }
        else{
            responseData = error
        }
    })

    return responseData
}


module.exports = zomato
