const express = require('express')
const router = express.Router()

const SearchController = require('../../controllers/search.controller')

//Routing for API version 1.0


router.get('/city', SearchController.searchCities)

router.get('/search', SearchController.searchRestaurant)
router.get('/restaurant/:id', SearchController.getResData)

router.get('/version', (req, res) => {
    res.send({status: status.codes.http['success'], 'version': '1.0'})
})

module.exports = router
