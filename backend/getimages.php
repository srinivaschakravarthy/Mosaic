<?php

define('IMAGEPATH', '../images/');
foreach(glob(IMAGEPATH.'*') as $filename){
    $imag[] =  basename($filename);
}

// print_r($imag);

$result = array('status' => 1, 'msg'=>'success', 'imagesArr' => $imag);
echo json_encode($result);

?>