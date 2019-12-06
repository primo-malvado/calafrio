<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="297mm"
   height="210mm"
   viewBox="0 0 2970 2100"
   version="1.1"
   >


<style>
path{
   fill:#000000;
   stroke:#000000;
   stroke-opacity:1;
   stroke-width:2px;
   stroke-dasharray:none;
}
path.int{
   fill:#ff0000;
   stroke:#ff0000;
}

text{
   font-size: 24px;

    text-anchor: middle;
}
 


</style>
 


<?php 
      $start = 10;
      $max = log(1000, 10);

      for($i = 1; $i<101; $i= $i+1 ){
         $p = $start + log($i,10) / $max * 2900;
         ?>
         
         <path class="int" d="m <?=$p?>,25 v 40 0"/>
         <path class="int" d="m <?=$p?>,100 v 40 0"/>
         <path class="int" d="m <?=$p?>,175 v 40 0"/>
         <path class="int" d="m <?=$p?>,250 v 40 0"/>

<?php 




 /*
 
for($j = 1; $j<10; $j= $j+1 ){
   $p = $start + log($i +$j/10  ,10) / $max * 2900;
   ?>
   
   <path class="" d="m <?=$p?>,25 v 40 0"/>
   <path class="" d="m <?=$p?>,100 v 40 0"/>
   <path class="" d="m <?=$p?>,175 v 40 0"/>
   <path class="" d="m <?=$p?>,250 v 40 0"/>

<?php 
} 
 */

} ?> 


<?php 
   $start = 10;
   $max = log(1000, 10);

   for($i = 1; $i<1001; $i= $i+1 ){
      $p = $start + log($i,10) / $max * 2900;
?>
   
   <text x="<?=$p?>" y="15"><?=$i?></text>
   <text x="<?=$p?>" y="90"><?=$i?></text>
   <text x="<?=$p?>" y="165"><?=$i?></text>
   <text x="<?=$p?>" y="<?=(165+75)?>"><?=$i?></text>

<?php } ?>





 
</svg>
