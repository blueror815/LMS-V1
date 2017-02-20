 /*
  * Task generator every month
  * setTimeout
  */

 require('rootpath')();

 var fs = require('fs');
 var async = require('async');
 var _ = require('underscore');

 var Company = require('app/model/company.model');


 /**
  * function to make regular express for search
  */

 function escapeRegExp(str) {
     var x = '';
     if (str)
         x = str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
     return x;
 }

 /**
  * Sync funtion to get data.
  */

 exports.index = function(req, res) {
     var params = req.body;

     // search terms
     var searchData = params.search ? params.search : '';
     var re = new RegExp(escapeRegExp(searchData), 'i');


     // pagination variables
     var recordsPerPage = params.recordsPerPage ? params.recordsPerPage : 20;


     var skip = params.pageNo ? (params.pageNo) : 0;
     skip = skip * recordsPerPage;


     var query = [
         { 'name': { $regex: re } },
         { 'description': { $elemMatch: { _: re } } }
     ];

     console.log("===>query", query);

     async.parallel({
         getTotalCount: function(callback) {
             Company.count()
                 //  .or(query)
                 .exec(function(err, totalCount) {
                     callback(err, totalCount);
                 });
         },
         getCompanies: function(callback) {
             Company.find()
                 //  .or(query)
                 .limit(recordsPerPage)
                 .skip(skip)
                 .exec(function(err, companies) {
                     callback(err, companies);
                 });
         }
     }, function(err, result) {
         console.log("===>Result", result);
         var data = {
             companies: result.getCompanies,
             totalCount: result.getTotalCount,
             status: 'success'
         }
         res.json(data);
     })
 };