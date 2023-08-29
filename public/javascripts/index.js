var result = document.getElementById('result');
var link = document.getElementById('signin');   // get the anchor tag
// get the current path
var path = window.location.pathname;

// for index.ejs Dropdown
result.addEventListener('change', function(){
    var value = result.value;
    console.log("value:", value);
});






// for header.ejs 
if (path === '/emp') {
  link.setAttribute('href', '/signup');
} else {
  link.setAttribute('href', '/emp/signup');
}

