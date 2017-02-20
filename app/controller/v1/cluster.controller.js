 /*
  * Task generator every month
  * setTimeout
  */

 require('rootpath')();

 var fs = require('fs');
 var async = require('async');
 var _ = require('underscore');
 var array_unique = require('array-unique');

 var Cluster = require('app/model/cluster.model');
 var Company = require('app/model/company.model');



 function sortByCluster(a, b) {
     if (a.order < b.order)
         return -1;
     if (a.order > b.order)
         return 1;
     return 0;
 }

 function sortByCountry(a, b) {
     if (a.name < b.name)
         return -1;
     if (a.name > b.name)
         return 1;
     return 0;
 }


 /**
  * Sync funtion to get data.
  */

 exports.getAll = function(req, res) {

     var cluster_companies = [];
     var cluster_countries = [];

     async.parallel({
         getClusterCompanies: function(callback) {
             Cluster
                 .find({})
                 .sort({ order: 1 })
                 .exec(function(err, results) {

                     if (err) {
                         callback(err, null);
                     } else {
                         _.map(results, function(ele) {

                             Company
                                 .find({ cluster_feature: true, cluster: ele.name })
                                 .sort({ name: 1 })
                                 .exec(function(err, companies) {

                                     var cluster = {
                                         _id: ele._id,
                                         name: ele.name,
                                         description: ele.description,
                                         game_score: ele.game_score,
                                         game_summary: ele.game_summary,
                                         traction_score: ele.traction_score,
                                         traction_description: ele.traction_description,
                                         maturity_score: ele.maturity_score,
                                         maturity_description: ele.maturity_description,
                                         intensity_score: ele.intensity_score,
                                         intensity_description: ele.intensity_description,
                                         order: ele.order,
                                         color_hex: ele.color_hex,
                                         companies: companies
                                     };

                                     cluster_companies.push(cluster);

                                     if (cluster_companies.length == results.length) {

                                         cluster_companies.sort(sortByCluster);

                                         callback(null, cluster_companies);
                                     }
                                 });
                         });
                     }
                 });
         },
         getClusterCountries: function(callback) {

             var countries = [];
             var cluster_contries = [];

             async.series([
                 function(callback) { // get unique countries array to group companies based on country...
                     Company
                         .find({})
                         .select('country')
                         .sort({ country: 1 })
                         .exec(function(err, companies) {
                             if (err) {
                                 return callback("Database Err");
                             } else {
                                 _.map(companies, function(company) {

                                     var country = company.country;
                                     countries.push(country);

                                     if (countries.length == companies.length) {
                                         countries = array_unique(countries); // remove duplicated element from country array...
                                         //  console.log("===>Countires are...", countries);
                                         callback();
                                     }
                                 });
                             }
                         });
                 },
                 function(callback) {
                     Cluster
                         .find({})
                         .sort({ order: 1 })
                         .exec(function(err, clusters) {
                             if (err) {
                                 return callback("Database err");
                             } else {
                                 _.map(clusters, function(ele) {
                                     var new_countries = [];
                                     var iter = 0; // flag to checkout whether one country object is made or not.
                                     _.map(countries, function(country) {
                                         Company
                                             .find({ cluster: ele.name, country: country })
                                             .sort({ name: 1 })
                                             .exec(function(err, companies) {

                                                 var new_country = {};

                                                 if (companies.length > 0) {
                                                     new_country.companies = companies;
                                                     new_country.name = country;
                                                     new_countries.push(new_country);
                                                 }

                                                 iter++;

                                                 if (iter == countries.length) {

                                                     new_countries.sort(sortByCountry);

                                                     var cluster = {
                                                         _id: ele._id,
                                                         name: ele.name,
                                                         description: ele.description,
                                                         game_score: ele.game_score,
                                                         game_summary: ele.game_summary,
                                                         traction_score: ele.traction_score,
                                                         traction_description: ele.traction_description,
                                                         maturity_score: ele.maturity_score,
                                                         maturity_description: ele.maturity_description,
                                                         intensity_score: ele.intensity_score,
                                                         intensity_description: ele.intensity_description,
                                                         order: ele.order,
                                                         color_hex: ele.color_hex,
                                                         countries: new_countries
                                                     };

                                                     cluster_contries.push(cluster);

                                                     if (cluster_contries.length == clusters.length) {
                                                         callback();
                                                     }
                                                 }
                                             });
                                     });
                                 })
                             }
                         })
                 }
             ], function(err) {
                 callback(err, cluster_contries);
             })
         }
     }, function(err, result) {
         if (err) {

         } else {
             res.json({
                 type: "success",
                 cluster_companies: result.getClusterCompanies,
                 cluster_countries: result.getClusterCountries
             });
         }
     })
 }

 /**
  * One country object should be made by this format.
  *      {
 			name: “United State“,
 			companies:
 			[
 				{
 					name: “Bootcamp“,
 					description: “lorem lorem lorem...“
 				},
 				{
 					name: “Great Company“,
 					description: “lorem lorem lorem...“
 				}
 			]
 		}	
  */

 /**
  * And one cluster-country object should be made by this format.
  *      {
             detail: { },
             countries: [country1, country2]
         },
  */