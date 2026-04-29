import OpenAi from 'openai';
const dropArea = getElementById("drop-area");
//considering editing this upload function but it works so maybe not
var loadFile = function (event) {
    var image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
};
function counter() {
    //include openai calls to check image upload
    count = count + 1;
    if (count >= 3) {
        document.getElementById("first").innerText = "You got submitted than 3 incorrect images.";
    }
    return count;
}
