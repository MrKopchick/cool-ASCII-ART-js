const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 = new Image();

image1.src = 'photo2.jpg';

const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('resolutionLabel');
inputSlider.addEventListener('input', handleSlider);

class AsciiEffect{
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;

    constructor(ctx, width, height){
        this.#width = width;
        this.#height = height;
        this.#ctx = ctx;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }

    #convertToSymbols(g){
        if(g > 259) return '@';
        else if(g > 229) return '#';
        else if(g > 204) return '8';
        else if(g > 179) return '&';
        else if(g > 153) return 'o';
        else if(g > 128) return ':';
        else if(g > 102) return '*';
        else if(g > 77) return '.';
        else return ' ';
    }

    #scanImage(cellSize){
        this.#imageCellArray = [];
        for(let y = 0; y < this.#height; y += cellSize){
            for(let x = 0; x < this.#width; x += cellSize){
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY * this.#width) + posX;

                if(this.#pixels.data[pos + 3] > 128){
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos + 2];

                    const total = red + green + blue;
                    const averageColorValue = total / 3;
                    const color = `rgb(${red}, ${green}, ${blue})`;
                    const symbol = this.#convertToSymbols(averageColorValue);
                    this.#imageCellArray.push(new Cell(x, y, symbol, color));
                }
            }
        }
    }

    #drawCells(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for(let i = 0; i < this.#imageCellArray.length; i++){
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }

    draw(cellSize){
        this.#scanImage(cellSize);
        this.#drawCells();
    }
}

class Cell{
    constructor(x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.font = '20px Verdana';
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

let effect;


function handleSlider(){
    if(inputSlider.value == 0){
        inputLabel.innerHTML = `Original image`;
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    }else{
        inputLabel.innerHTML = `Resolution: ${inputSlider.value}px`;
        effect.draw(parseInt(inputSlider.value));
    }
}

image1.onload = function initialize(){
    canvas.width = image1.width;
    canvas.height = image1.height;
    effect = new AsciiEffect(ctx, canvas.width, canvas.height);
    effect.draw(7);
}