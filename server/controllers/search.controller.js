const zomato = require('../service/zomato.service')

/**
 * Searches and returns cities from the zomato api "/cities"
*/
module.exports.searchCities = async (req, res, next) => {
    let queryParam = req.query
    let searchQuery = {'q': queryParam['q']}

    var data = await zomato.get('cities', searchQuery)
    var satus = 500

    if(data['status'] == 'success'){
        satus = 200
        // filter only Indian cities
        let location_suggestions = data['location_suggestions']
        location_suggestions = location_suggestions.filter(function(item) {
            if (item['country_id'] === undefined || item['country_id'] != 1){
                return false;
            }
            return true;
        });
        data['location_suggestions'] = location_suggestions
    }

    return res.jsonp({status: satus, data: data})
}

/**
 * Searches and returns restaurant within a city from the zomato api "/search"
 * Need city id as input to search the restaurant
*/
module.exports.searchRestaurant = async (req, res, next) => {
    var queryParam = req.query

    var searchQuery = {}
    searchQuery['q'] = queryParam['q']
    searchQuery['entity_id'] = queryParam['cityId']
    searchQuery['entity_type'] = 'city'
    searchQuery['start'] = queryParam['start']
    searchQuery['count'] = queryParam['count']
    searchQuery['sort'] = 'rating'
    searchQuery['order'] = 'desc'

    var data = await zomato.get('search', searchQuery)

    return res.jsonp({status: 200, data: data})
}

/**
 * Fetches ane returns the restaurant data from the Zomato api "/restaurant"
*/
module.exports.getResData = async (req, res, next) => {
    var queryParam = req.params

    var resQuery = {'res_id': queryParam['id']}

    var data = await zomato.get('restaurant', resQuery)

    return res.jsonp({status: 200, data: data})
}
