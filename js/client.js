// Edit me. Feel free to create additional .js files.
var SAMPLING_INTERVAL = 1;//To take average of pixels 
var image = new Image();//Global Variable to store the image object of the input image

/*----------------------------------------Utility functions----------------------------------------*/

var images = [];
var imagesHex = [];
var hexToImage = [];

function getAllImages()
{
  $.ajax(
    {
      url: "backend/getimages.php",
      dataType: "json",
      type:"POST",
      async: false,

      data:
      {
        
      },

      success: function(json)
      {
        if(json.status==1)
        {
            images = (json.imagesArr).slice(0);
            for(var i=0; i<images.length; i++)
            {
              console.log("images/"+images[i]);
              var imagex = new Image();
              imagex.src = document.getElementById(i).src;
              var rgb;
              imagex.onload = (rgb = getAverageRGB(imagex));
              console.log(rgb);
              if(!(rgb.r==0 && rgb.g==0 && rgb.b==0))
              {
                var hexString = rgbToHex(rgb.r,rgb.g,rgb.b).substring(1);
                imagesHex.push(hexString);
                hexToImage[hexString] = "images/" + images[i];
              }
              console.log(imagesHex[i]);
            }
        }
        else
        {
          //console.log('Hi');
        }
      },
      
      error : function()
      {
        console.log("something went wrong");
      }
    });
}

function getClosestImage(hexVal)
{
  var i, minDistance = 1000000, pos = -1;
  var hexR = parseInt(hexVal[0],16);
  var hexG = parseInt(hexVal[2],16);
  var hexB = parseInt(hexVal[4],16); 
  for(i=0;i<imagesHex.length;i++)
  {
    var curR = parseInt(imagesHex[i][0],16);
    var curG = parseInt(imagesHex[i][2],16);
    var curB = parseInt(imagesHex[i][4],16);
    var distance = (hexR-curR)*(hexR-curR) + (hexG-curG)*(hexG-curG) + (hexB-curB)*(hexB-curB);
    if(distance < minDistance)
    {
      minDistance = distance;
      pos = i;
    }
  }
 // console.log(pos);
  return(imagesHex[pos]);
}

function componentToHex(c)//Returns hexadecimal of c 
{
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b)//Returns hex on input of rgb values 
{
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getAverageRGB(imgEl)//Returns the average rgb value of the image 
{ 
  var blockSize = SAMPLING_INTERVAL, //How frequently the pixels are considered in calculating the average 
  defaultRGB = {r:0,g:0,b:0}, // For non-supporting envs
  canvas = document.createElement('canvas'),
  context = canvas.getContext && canvas.getContext('2d'),
  data, width, height,
  i = -4,
  length,
  rgb = {r:0,g:0,b:0},
  count = 0;
  if (!context)//If canvas is not supported return default rgb value
  {
    return defaultRGB;
  }
  //Get image dimensions
  height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
  context.drawImage(imgEl, 0, 0);
  try 
  {
    data = context.getImageData(0, 0, width, height);
  } 
  catch(e) 
  {
    /* security error, img on diff domain */
    alert('Image in different Domain!');
    return defaultRGB;
  }
  length = data.data.length;
  while ( (i += blockSize * 4) < length ) //Sum all rgb values 
  {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i+1];
    rgb.b += data.data[i+2];
  }
  // ~~ used to floor values
  rgb.r = ~~(rgb.r/count);
  rgb.g = ~~(rgb.g/count);
  rgb.b = ~~(rgb.b/count);
  //console.log(rgb);
  return rgb;
}
/*-------------------------------------------------------------------------------------------------*/

/*----------------------------------------Rendering Functions--------------------------------------*/
function seqrendering(numRows, numCols, imagePieces) //Sequential Rendering of tiles #Task-4
{
	document.getElementById('mosaicimgwrapper').innerHTML='<p>Here is the generated mosaic</p>';
	function outerloop(pass, numRows) //Outer loop that iterates through rows of tiles
  {
  	setTimeout(function () //Set timeout to wait for all the tiles to form in a given row --Satisfies the constraints given #Task-3
  	{
	    if (pass >= numRows) //If number of passes are more than number of rows return
	    	return;
  		var row = document.createElement('div');//Create div for each row
      row.setAttribute("style","margin-top:-0.65%;");
  		var j = 0;
	    (
	    	function innerloop() //Inner loop to iterate through tiles in each row 
	    	{
	        var currImage = new Image();
			  	currImage.src = imagePieces[pass*numCols + j];
			  	var rgb = getAverageRGB(currImage);//Calulate the average rgb value of each tile
			  	var tile = document.createElement('img');
			    tile.height = TILE_HEIGHT;
			    tile.width = TILE_WIDTH;
			    tile.src = hexToImage[getClosestImage(rgbToHex(rgb.r,rgb.g,rgb.b).substring(1))];
			    row.appendChild(tile); //Append each tile into row div
	        if (++j < numCols) //Run the inner loop till all the tiles are taken care of when done go to next outer loop 
	        {
	          innerloop();
	        } 
	        else 
	        {
	          outerloop(++pass, numRows);
	        }
	    	}
	    )();
	    document.getElementById('mosaicimg').appendChild(row);//Append the row div to outer div
	  }, 500); 
	}
	outerloop(0, numRows);//Start the outerloop
}

function parallelrendering(numRows, numCols, imagePieces) //Parallel Rendering of tiles #Task-4
{
  for(var i = 0; i < numRows; i++)
  {
  	var row = document.createElement('div');//Create div for each row
    row.setAttribute("style","margin-top:-0.67%;");
  	for(var j = 0; j < numCols; j++)
	  {
	  	var currImage = new Image();
	  	currImage.src = imagePieces[i*numCols + j];
	  	var rgb = getAverageRGB(currImage);
	  	// console.log(rgbToHex(rgb.r,rgb.g,rgb.b));
	  	var tile = document.createElement('img');
	    tile.height = TILE_HEIGHT;
	    tile.width = TILE_WIDTH;
	    tile.src = hexToImage[getClosestImage(rgbToHex(rgb.r,rgb.g,rgb.b).substring(1))];
      // console.log(tile);
	    row.appendChild(tile);//append each tile into the div element 
	  }
	  document.getElementById('mosaicimg').appendChild(row);//Now append div containing each row of tiles to outer div
  }
}
/*-------------------------------------------------------------------------------------------------*/

/*----------------------------------------Tiling Function------------------------------------------*/
function cutImageUp() //Divides the image into tiles of TILE_WIDTH x TILE_HEIGHT #Task-2
{
	var widthOfOnePiece = TILE_WIDTH;
	var heightOfOnePiece = TILE_HEIGHT;
	var numColsToCut = Math.floor(image.width/widthOfOnePiece);
	var numRowsToCut = Math.floor(image.height/heightOfOnePiece);
  var imagePieces = [];
  for(var y = 0; y < numRowsToCut; ++y) //Loop thorugh rows
  {
    for(var x = 0; x < numColsToCut; ++x) //Loop thorugh columns
    {
      var canvas = document.createElement('canvas');
      canvas.width = widthOfOnePiece;
      canvas.height = heightOfOnePiece;
      var context = canvas.getContext('2d');
      context.drawImage(image, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
      imagePieces.push(canvas.toDataURL());//Push the tile into an array

    }
  }
  parallelrendering(numRowsToCut,numColsToCut, imagePieces);//Call parallel rendering function
  // seqrendering(numRowsToCut,numColsToCut, imagePieces);//Call sequential rendering function
}
/*-------------------------------------------------------------------------------------------------*/

/*----------------------------------Main functions-------------------------------------------------*/
var loadFile = function(event)//To display the uploaded image on the client machine #Task-1
{
  var uploadedimg = document.getElementById('uploadedimg');
  uploadedimg.src = URL.createObjectURL(event.target.files[0]);
};

function submitbtn()//Function that is called when the submt button is clicked
{
	var rgb = getAverageRGB(document.getElementById('uploadedimg'));
  //console.log(rgb);
	//document.getElementById('mosaicimg').style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';//Set the background to overall average rgb value of the image for better observability of the mosaic
	image.src = document.getElementById('uploadedimg').src;//Store the uploaded image in the global object for all furthur use
	image.onload = cutImageUp;//Divide the image into tiles
}
/*-------------------------------------------------------------------------------------------------*/