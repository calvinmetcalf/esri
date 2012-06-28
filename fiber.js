var d=[];
$(function() {
var url = "http://services.massdot.state.ma.us/ArcGIS/rest/services/Assets/FiberOpticLines/MapServer/0/query?outFields=*&f=json&outSR=4326&where=OBJECTID+%3E+0";
var g =google.maps;
var center = new g.LatLng(41.914541,-71.592407);
var zoom = 8;
var infowindow = new g.InfoWindow();
var stati=["Existing","Proposed","Gap"];
var m = new g.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });
    
 

    $.get(url,data,"jsonp"
    );

function data(e){
   $.each(e.features,parseFt);
}
$( "#tabs" ).tabs({
    collapsible: true,
    selected: -1
});
          
$( "input:submit,input:reset" ).button();

$('input, textarea').placeholder();
function parseFt(i,v){
    var ft = {id:i,
    name:v.attributes.Route,
    status:v.attributes.Status};
    var path = $.map(v.geometry.paths[0],mapLL);
    //if you have a feature with multipart lines ^^ won't work
    var color;
    if(ft.status==="Existing"){
     color="#00ff00";   
    }else if(ft.status==="Proposed"){
        color="#ff0000";   
        
    }else if(ft.status==="Gap"){
        color="#000000";   
        
    }
    ft.line = new g.Polyline({path:path,map:m,strokeColor:color});
    g.event.addListener(ft.line, 'click', iw);
    function iw(event){
    infowindow.setContent("<div class='iw'>"+ft.name+" which is "+ft.status+"</div>");
  infowindow.setPosition(event.latLng);

  infowindow.open(m);
}
d.push(ft);
}
function mapLL(v){return new g.LatLng(v[1],v[0]);}
geocoder();
function geocoder(geof,addrf,resetf){
    var ozoom = m.getZoom();
    var ocenter = m.getCenter();
    var gc = new g.Geocoder();
    geof = geof||'geocode';
    addrf = addrf||'address';
    resetf = resetf||'resetgeo';
    gc.geomarker = new g.Marker();
    var geoinfo = new g.InfoWindow();
    $('#' + geof).click(function(){
        gc.geocode( { 'address': $("#" + addrf).val()}, function(results, status) {
            if (status == g.GeocoderStatus.OK) {
                var r = results[0];
                m.setCenter(r.geometry.location);
                m.setZoom(14);
                gc.geomarker.content = "<div class='geoinfo'>Formatted address:<br/>"+r.formatted_address+"</div>";
                gc.geomarker.setPosition(r.geometry.location); 
                gc.geomarker.setMap(m);
                g.event.addListener(gc.geomarker, 'click',function(){
                                geoinfo.setContent(gc.geomarker.content);
                              geoinfo.open(m,gc.geomarker);
            				});
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    });

    $('#' + resetf).click(function(){
        m.setCenter(ocenter);
        m.setZoom(ozoom);
        gc.geomarker.setMap(null);
    });
};
$('#tabs-2').append('<select id="stat"><option value="all">Choose Status</option></select>');

$.each(stati,function(i,k){
    $('#stat').append("<option value='" +k+"'>"+k+"</option>");
});
$('#stat').change(function(){
    var val = $('#stat').val();
    if(val==='all'){
        $.each(d,function(i,v){
            v.line.setMap(m);
        });
}else {
    $.each(d,function(i,v){
        if(v.status===val){
            v.line.setMap(m);
        }else{  v.line.setMap(null);
        }
        });
}
    
    });
});
