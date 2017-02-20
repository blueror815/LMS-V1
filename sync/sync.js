 /*
  * Task generator every month
  * setTimeout
  */

 require('rootpath')();

 var fs = require('fs');
 var request = require('request');
 var async = require('async');
 var _ = require('underscore');
 var cron = require('node-schedule');

 var Company = require('app/model/company.model');

 /**
  * Sync funtion to get data.
  */

 module.exports.triggerSyncData = function(app) {

     console.log("=========calling sync data===========");

     cron.scheduleJob('*/59 * * * *', function() {
         module.exports.startSync("", false);
     });
 };


 module.exports.startSync = function(offset, has_more) {

     console.log("=========calling init sync data===========", offset);

     var url = process.env.SYNC_API_URI;
     var api_key = process.env.SYNC_API_KEY;

     url = url + "?hapikey=" + api_key + "&limit=250&properties=name&properties=country&properties=twitterhandle&properties=cluster&properties=cluster_feature&properties=website&properties=companyId&properties=description&offset=" + offset;

     if (!has_more) { // remove all old document and replace new documents
         Company.remove(function(err, result) {
             console.log("===>result...", result);
         })
     }


     request({
         url: url,
         method: 'GET'
     }, function(error, response, body) {
         if (error) {
             console.log(error);
         } else {
             var result = JSON.parse(body);
             var has_more = result['has-more'];
             var new_offset = result.offset;
             var companies = result.companies;

             var length_of_valid = 0;
             var length_of_saved_companies = 0;

             _.map(companies, function(company) {
                 var property = company.properties;
                 if (property.cluster) {

                     length_of_valid++; // calculator the number of valid values...

                     if (property.cluster.value) {
                         var companyId = company.companyId;
                         var cluster = property.cluster.value;
                         var twitterhandle = (property.twitterhandle) ? property.twitterhandle.value : "";
                         var website = (property.website) ? property.website.value : "";
                         var name = (property.name) ? property.name.value : "";
                         var description = (property.description) ? property.description.value : "";
                         var country = (property.country) ? property.country.value : "";
                         var cluster_feature = (property.cluster_feature) ? true : false;

                         var company_data = new Company({
                             companyId: companyId,
                             country: country,
                             cluster: cluster,
                             twitterhandle: twitterhandle,
                             website: website,
                             name: name,
                             description: description,
                             cluster_feature: cluster_feature
                         });

                         company_data.save(function(err, result) {
                             if (err) {
                                 console.log("--->Error", err)
                             } else {
                                 length_of_saved_companies++; // calculate the number of saved companies

                                 console.log("===>Sub iter is...", length_of_valid, length_of_saved_companies);
                                 console.log("===>Has more", has_more);

                                 if (has_more && length_of_saved_companies == length_of_valid) {
                                     module.exports.startSync(new_offset, true);
                                 }
                             }
                         });
                     }
                 }
             });
         }
     });
 }