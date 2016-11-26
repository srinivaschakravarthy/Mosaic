<!DOCTYPE html>
<html>
  <head>
    <?php
      define('IMAGEPATH', 'images/');
      $count = 0;
      foreach(glob(IMAGEPATH.'*') as $filename){
      $imag[] =  basename($filename);
      $count++;
      }
      for($i=0;$i<$count;$i++)
      {
        echo "<img id='$i' src=images/".$imag[$i]." hidden>";
      }
    ?>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script> 
    <script type="text/javascript" src="js/mosaic.js"></script>
    <script type="text/javascript" src="js/client.js"></script>
    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css">
    <link rel="stylesheet" href="css/style.css">

    <!-- Compiled and minified JavaScript -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js"></script> -->

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Mosaic</title>
  </head>
  <body>
    <!-- Edit me. -->
    <nav class="white ">
      <div class="container nav-wrapper">
        <a href="#" class="brand-logo black-text">Mosaic</a>
      </div>
    </nav>
    <div class="container">
      <h5>Get started by selecting an image to make a mosaic.</h5><hr class="lighten-1">
      <form action="#">
        <div class="file-field input-field">
          <div class="btn black">
            <span>Browse</span>
            <input type="file" accept="image/*" onchange="loadFile(event)">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text">
          </div>
        </div>
        <a class="btn waves-effect waves-light black right" onclick="submitbtn()">Submit</a>
      </form>
      <div>
        <p>Original Image</p>
        <img id="uploadedimg"/>
      </div>
      <div id="mosaicimgwrapper"></div>
      <div id="mosaicimg"></div><!-- div to load mosaic -->
    </div>
    <br><br>
  </body>
</html>
<script>
window.onload = getAllImages();
</script>
