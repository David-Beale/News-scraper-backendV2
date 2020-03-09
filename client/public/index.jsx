import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


//   react code here


$("*").click(function(){
    $.get("demo_test.asp", function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
});
