import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI();

const inputFile = document.getElementById("input-file");
const dropArea = document.getElementById("drop-area");
const imageView = document.getElementById("img-view");
const base64Image = fs.readFileSync(inputFile, "base64");
let b64imgLink = URL.createObjectURL(base64Image);
let count = 0;

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
                    image_url: `url(${b64imgLink})`,
                },
            ],
        },
    ],
});

let responseOutput = response.output_text;

inputFile.addEventListener("change", uploadImage);

function uploadImage(){
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imageView.style.backgroundImage = `url(${imgLink})`;
    imageView.textContent = counter();
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
    //very basic checker 
    if (responseOutput.toLowerCase().indexOf("no") != -1){
        count = count + 1;
    }
    if (count >= 3) {
        alert("You submitted at least more than 3 incorrect images.");
    }
    return count;
}
