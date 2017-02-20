/**
 * Routes all API requests to particular functions
 * This file would be referenced by the 'app.js' file, as;
 * 
 *
 * 	var app  = express();
 *		var routes = require(./router);
 *		
 *	And called
 *
 *		routes.setup(app);
 *
 *
 */

require('rootpath')();


/*   These vars are for mobile API  */
var company = require('app/controller/v1/company.controller');
var cluster = require('app/controller/v1/cluster.controller');


module.exports.setup = function(app) {

    console.log("===>Cluster...", cluster);
    app.post('/company', company.index);
    app.post('/cluster/all', cluster.getAll);

    /* route to handel 404 error */
    app.use('*', function(req, res) {
        res.status(404)
            .json({
                message: 'No route found.'
            });
    });

};