//var rest_addr = 'http://192.168.0.12/swdi/api/api/';
var rest_addr = 'http://rocketspin.ph/api/api/';

angular.module('starter.queries', [])

.factory('sqlite', function($http, $localStorage, $cordovaSQLite) {
	
		return {
			multiObserveSave: function(data, callback)
			{
				if($localStorage.userData == undefined) return;
				
				document.addEventListener("deviceready", function ()
				{
					var queryData = [
						"'"+data.uid+"'",
						"'"+data.cid+"'",
						"'"+data.resend_id+"'",
						"'"+data.hcw_title+"'",
						"'"+data.hcw_name+"'",
						"'"+data.organization+"'",
						"'"+data.moment1+"'",
						"'"+data.moment2+"'",
						"'"+data.moment3+"'",
						"'"+data.moment4+"'",
						"'"+data.moment5+"'",
						"'"+data.note+"'",
						"'"+data.location_level1+"'",
						"'"+data.location_level2+"'",
						"'"+data.location_level3+"'",
						"'"+data.location_level4+"'",
						"'"+data.hh_compliance+"'",
						"'"+data.hh_compliance_type+"'",
						"'"+data.glove_compliance+"'",
						"'"+data.gown_compliance+"'",
						"'"+data.mask_compliance+"'",
						"'"+data.mask_type+"'",
						"'"+data.date_registered+"'"
					]

					var query = "INSERT INTO observations (uid, cid, resend_id, hcw_title, hcw_name, organization, moment1, moment2, moment3, moment4, moment5, note, location_level1, location_level2, location_level3, location_level4, hh_compliance, hh_compliance_type, glove_compliance, gown_compliance, mask_compliance, mask_type, date_registered) VALUES ("+queryData.toString()+"); ";
					$cordovaSQLite.execute(db, query)
					.then( function( result ){
						if(typeof callback == 'function') callback(result);
					}, 
					function( err ){
						if(typeof callback == 'function') callback(err);
					});
				});
			},
			
			getObservations: function(callback)
			{
				if($localStorage.userData == undefined) return;
				
				response = [];
				document.addEventListener("deviceready", function ()
				{
					$cordovaSQLite.execute(db, "SELECT * FROM observations").then(function(result) {
						if(result.rows.length > 0){
							for(var i=0; i<result.rows.length; i++)
							{
								response.push(result.rows.item(i));
							}
						}
						if(typeof callback == 'function') callback(response);
							
					},function(error)
					{
						if(typeof callback == 'function') callback(error);
					});
				});
			},
			
			countObservations: function(callback)
			{
				if($localStorage.userData == undefined) return;
				
				document.addEventListener("deviceready", function ()
				{
					$cordovaSQLite.execute(db, "SELECT id FROM observations WHERE uid = "+$localStorage.userData.id)
					.then( function( result )
					{
						if(typeof callback == 'function') callback(result.rows.length);
						return result.rows.length; 
					},
					function ( err ) {
						if(typeof callback == 'function') callback(0);
					});
				});
			},
			
			deleteObservation: function(id, callback)
			{
				if($localStorage.userData == undefined) return;
				document.addEventListener("deviceready", function ()
				{
					$cordovaSQLite.execute(db, "DELETE FROM observations WHERE id = "+id)
					.then( function( result )
					{
						if(typeof callback == 'function') callback(result);
					},
					function ( err ) {
						console.error(err);
						if(typeof callback == 'function') callback(0);
						//if(typeof callback == 'function') callback(err);
					});
				});
			}
		}
	
})

