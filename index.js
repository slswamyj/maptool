//Parse map json and input json. Create output JSON as per activity stream v2.0
let Q = require("q");
let fs = require("fs");
let readline = require("readline");

const mapjsonfilename = "map.json";
const inputjsonfile = "input.json";

function fread(filename) {
  var deferred = Q.defer();
  fs.readFile(filename, "utf-8", function (error, text) {
    if (error) {
        deferred.reject(new Error(error));
    } else {
        deferred.resolve(text);
    }
  });
  return deferred.promise;
}

let mapobj, inputobj, outputobj, outvals = [];

fread(mapjsonfilename).then(function(text) {
   mapobj = JSON.parse(text);
   console.log("Mapped format:\n");
   console.log(mapobj);
   readinputjson(inputjsonfile);
});

function readinputjson(filename) {
  fread(filename).then(function(text) {
    inputobj = JSON.parse(text);
    console.log("\nInput JSON:\n")
    console.log(inputobj);
    getmapvalues(mapobj, inputobj, outputobj, outvals).then(function() {
      let obj = createOutputJson(mapobj, outvals);
      console.log("\noutput object\n"); 
      console.log(obj);  
    });
  });
}

function getmapvalues(mapobj, inputobj, outputobj, outvals) {
  var deferred = Q.defer();
  console.log("\nParsed data: \n")
  Object.keys(mapobj).forEach(function(key) {
    let val = mapobj[key];
    let newval = inputobj[val];
    outvals.push(newval);
    console.log(val + ' : ' + newval);
  });
  deferred.resolve();
  return deferred.promise;
}

function getObjectkeys(obj) {
  return Object.keys(obj);
}

function createOutputJson(mapobj, outvals) {
  let outarray = getObjectkeys(mapobj);
  let newobj = { }; 

  for(let ind=0; ind < outarray.length; ind++) {
    newobj[outarray[ind]] = outvals[ind];
  }
  return newobj;  
}