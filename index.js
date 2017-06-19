var f = {};

f.mk_sheet_num = {};
f.mk_report_page_num = {};
f.mk_preview = {};

f.setup_body = function(title, sections){
  document.title = title;
  var body = document.body;
  var status_bar = document.createElement('div');
  status_bar.id = 'status';
  status_bar.innerHTML = 'loading status...';
  body.insertBefore(status_bar, body.firstChild);
};

f.pad_zero = function(num, size){
  var s = '000000000' + num;
  return s.substr(s.length-size);
};

f.obj_names = function( object ) {
  if( object !== undefined ) {
    var a = [];
    for( var id in object ) {
      if( object.hasOwnProperty(id) )  {
        a.push(id);
      }
    }
    return a;
  }
};

f.object_defined = function(object){
  //logger.info(object);
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      //logger.info(key);
      if( object[key] === null || object[key] === undefined ) return false;
    }
  }
  return true;
};

f.nullToObject = function(object){
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key] === null ){
        object[key] = {};
      } else if( typeof object[key] === 'object' ) {
        object[key] = f.nullToObject(object[key]);
      }
    }
  }
  return object;
};

f.blank_copy = function(object){
  var newObject = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key].constructor === Object ) {
        newObject[key] = {};
        for( var key2 in object[key] ){
          if( object[key].hasOwnProperty(key2) ){
            newObject[key][key2] = null;
          }
        }
      } else {
        newObject[key] = null;
      }
    }
  }
  return newObject;
};

f.blank_clean_copy = function(object){
  var newObject = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key].constructor === Object ) {
        newObject[key] = {};
        for( var key2 in object[key] ){
          if( object[key].hasOwnProperty(key2) ){
            var clean_key = f.clean_name(key2);
            newObject[key][clean_key] = null;
          }
        }
      } else {
        newObject[key] = null;
      }
    }
  }
  return newObject;
};

f.merge_objects = function merge_objects(object1, object2){
  for( var key in object1 ){
    if( object1.hasOwnProperty(key) ){
      //if( key === 'make' ) logger.info(key, object1, typeof object1[key], typeof object2[key]);
      //logger.info(key, object1, typeof object1[key], typeof object2[key]);
      if( object1[key] && object1[key].constructor === Object ) {
        if( object2[key] === undefined ) object2[key] = {};
        merge_objects( object1[key], object2[key] );
      } else {
        object2[key] = object1[key];
      }
    }
  }
};

f.array_to_object = function(arr) {
  var r = {};
  for (var i = 0; i < arr.length; ++i)
  r[i] = arr[i];
  return r;
};

f.nan_check = function nan_check(object, path){
  if( path === undefined ) path = "";
  path = path+".";
  for( var key in object ){
    //logger.info( "NaNcheck: "+path+key );

    if( object[key] && object[key].constructor === Array ) object[key] = f.array_to_object(object[key]);


    if(  object[key] && ( object.hasOwnProperty(key) || object[key] !== null )){
      if( object[key].constructor === Object ){
        //logger.info( "  Object: "+path+key );
        nan_check( object[key], path+key );
      } else if( object[key] === NaN || object[key] === null ){
        logger.info( "NaN: "+path+key );
      } else {
        //logger.info( "Defined: "+path+key, object[key]);

      }
    }

  }
};

f.str_to_num = function str_to_num(input){
  var output;
  if(!isNaN(input)) output = Number(input);
  else output = input;
  return output;
};


f.pretty_word = function(name){
  return name.charAt(0).toUpperCase() + name.slice(1);
};

f.to_underscore = function(name){
  return name.replace(/([A-Z])/g, function($1){
    return '_'+$1.toLowerCase();
  });
};

f.pretty_name = function(name){
  name = f.to_underscore(name);
  var l = name.split('_');
  l.forEach(function(name_seqment,i){
    l[i] = f.pretty_word(name_seqment);
  });
  var pretty = l.join(' ');

  return pretty;
};


f.pretty_names = function(object){
  var new_object = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      var new_key = f.pretty_name(key);
      new_object[new_key] = object[key];
    }
  }
  return new_object;
};
f.name_to_id = function(name){
  return name.replace(' ','_').replace(/\W/g, '_').toLowerCase();
};

f.clean_name = function(name){
  return name.split(' ')[0];
};

f.format_value = function(value_in){
  var value_out;

  if( typeof value_in === 'undefined' || value_in === null ) {
    value_out = false;
  } else if( value_in.constructor === Array ){
    value_out = value_in.join(', ');
  } else if( value_in.constructor === Object ){
    value_out = false;
  } else if( isNaN(value_in) ){
    value_out = value_in;
  } else {
    var value_float = parseFloat(value_in);
    if( (value_float%1) === 0 ){ // if is intiger
      value_out = parseFloat(value_in).toFixed(0);
    } else {
      value_out = parseFloat(value_in).toFixed(2);
    }
  }

  return value_out;
};

f.lowercase_properties = function lowercase_properties(obj) {
  var new_object = new obj.constructor();
  for( var old_name in obj ){
    if (obj.hasOwnProperty(old_name)) {
      var new_name = old_name.toLowerCase();
      if(obj[old_name] && ( obj[old_name].constructor === Object || obj[old_name].constructor === Array )){
        new_object[new_name] = lowercase_properties(obj[old_name]);
      } else {
        new_object[new_name] = obj[old_name];
      }
    }

  }
  return new_object;
};

f.clear_object = function(obj){
  for( var id in obj ){
    if( obj.hasOwnProperty(id)){
      delete obj[id];
    }
  }
};


f.are_we_there_yet = function are_we_there_yet(test, done, fail ){
  if( test() ){
    //logger.info('test: PASS');
    done();
  } else {
    //logger.info('test: fail');
    //*
    // may need polyfill for IE9
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout
    if(fail) fail();
    setTimeout(
      are_we_there_yet,
      10,
      test,
      done,
      fail
    );
    //*/
  }
};

f.mk_ready = function(names, callback){
  var list = {};
  var data_collection = {};
  names.forEach(function(name){
    list[name] = false;
  });
  var ready = false;

  return function(name, data){
    if( name === false ){
      callback({error:false});
    }
    //logger.info('name:', name);
    if(name){
      list[name] = true;
      if(data){
        data_collection[name] = data;
      }
    }
    for( name in list){
      if( list[name] === false ){
        return false;
      }
    }
    //logger.info('ready!!!!!', list);
    if(callback){
      callback(data_collection);
    }
    return true;
  };
};

f.mk_ready_count = function(total_count, callback){
  var count = 0;
  var data_collection = {};
  var ready = false;

  return function(data){
    count++;
    if(data){
      data_collection[count] = data;
    }
    if( count < total_count ){
      return false;
    }
    if(callback){
      callback(data_collection);
    }
    return true;
  };
};


f.split_long_sentence = function(string, length){
  var lines = [];
  while( string.length >= length ){
    var i = length;
    while( string[i] !== ' ' ){
      i--;
    }
    lines.push(string.slice(0,i));
    string = string.slice(i+1);
  }
  lines.push(string);
  return lines;
};


f.range = function(num) {
  return Array.apply(null, Array(num)).map(function ($, i) {return i;});
};

f.mk_range_measurment = function(){
  var range = [];

  var check = function(value){
    range[0] = range[0] || value;
    range[1] = range[1] || value;
    if( value < range[0] ){
      range[0] = value;
    }
    if( value > range[1] ){
      range[1] = value;
    }
    return range;
  };

  return check;
};


module.exports = f;
//export default f;
