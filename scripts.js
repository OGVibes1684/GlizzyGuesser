/*import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI();
*/
const inputFile = document.getElementById("input-file");
const dropArea = document.getElementById("drop-area");
const imageView = document.getElementById("img-view");
/*const base64Image = fs.readFileSync(inputFile, "base64");

const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
        {
            role: "user",
            content: [
                { 
                    type: "input_text", 
                    text: "Does this image have a hot dog in it? Answer in either yes or no." },
                {
                    type: "input_image",
                    image_url: `data:image/jpeg;base64,${base64Image}`,
                },
            ],
        },
    ],
});

console.log(response.output_text);*/

inputFile.addEventListener("change", uploadImage);

function uploadImage(){
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imageView.style.backgroundImage = `url(${imgLink})`;
    imageView.textContent = "";
    imageView.style.border = 0;
}

dropArea.addEventListener("dragover", function(e){
    e.preventDefault();
});
dropArea.addEventListener("drop", function(e){
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadImage();
});

function counter() {
    //include openai calls to check image upload
    count = count + 1;
    if (count >= 3) {
        alert("You submitted at least more than 3 incorrect images.");
    }
    return count;
}
