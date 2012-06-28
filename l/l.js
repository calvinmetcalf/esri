var w;
$(function() {
uiStuff();
var d= new L.LayerGroup();
var url = "http://services.massdot.state.ma.us/ArcGIS/rest/services/Assets/FiberOpticLines/MapServer/0/query?outFields=*&f=json&outSR=4326&where=OBJECTID+%3E+0";
var center = new L.LatLng(41.914541,-71.592407);
var zoom = 8;
var stati=["Existing","Proposed","Gap"];
var lines =[];
$.get(url,function(e){
    $.each(e.features,data);
    },"JSONP");
var t={
    url: "http://{s}.mqcdn.com/tiles/1.0.0/{which}/{z}/{x}/{y}.{ext}",
    options:{
        attribution:"Tiles from Mapquest"
    },
    osm:{
        which:"osm",
        ext:"png",
        subdomains:["otile1","otile2","otile3","otile4"],
        attribution:"Tiles from Mapquest, Tile data from Open Street Map"
    },
    aerial:{
        which:"sat",
        ext:"jpg",
       subdomains:["oatile1","oatile2","oatile3","oatile4"],
        maxZoom:15
    }
};

t.o = new L.TileLayer(t.url, 
    $.extend(
        {},
        t.options,
        t.osm
    )
);
t.a = new L.TileLayer(t.url, 
    $.extend(
        {},
        t.options,
        t.aerial
    )
);

var controls = new L.Control.Layers({
    "Map Quest OSM": t.o,
    "Map Questy Aerial": t.a
    },{"Fiber":d});
var m = new L.Map('map',{
    center:center,
    zoom:zoom,
    layers:[t.o,d]
    });
m.addControl(controls);

function data(i,v){
     var ft = {id:i,
    name:v.attributes.Route,
    status:v.attributes.Status};
    var path = $.map(v.geometry.paths[0],mapLL);
     var color;
    if(ft.status==="Existing"){
     color="#FF9900";   
    }else if(ft.status==="Proposed"){
        color="#ff0000";   
        
    }else if(ft.status==="Gap"){
        color="#000000";   
        
    }
    ft.line = new L.Polyline(path,{color:color,opacity:1});
    lines.push(ft);
    d.addLayer(ft.line);
    ft.line.bindPopup("<div class='iw'>"+ft.name+" which is "+ft.status+"</div>");
}
$('#tabs-2').append('<select id="stat"><option value="all">Choose Status</option></select>');

$.each(stati,function(i,k){
    $('#stat').append("<option value='" +k+"'>"+k+"</option>");
});
$('#stat').change(function(){
    d.clearLayers();
    var val = $('#stat').val();
    if(val==='all'){
        $.each(lines,function(i,v){
            d.addLayer(v.line);
        });
}else {
    $.each(lines,function(i,v){
        if(v.status===val){
           d.addLayer(v.line);
        }
        });
}
    
    });
$("#geocode").click(function(){
    var adr=$("#address").val();
    
    $.ajax({
       jsonp: "json_callback",
       url:"http://open.mapquestapi.com/nominatim/v1/search?format=json&q="+adr,
       success:georesult
        });
    function georesult(data){
        var ll = new L.LatLng(parseFloat(data[0].lat),parseFloat(data[0].lon));
        w= new L.Marker(ll);
m.addLayer(w).setView(ll,14);

        
    }
    
});
$('#resetgeo').click(function(){
   m.removeLayer(w).setView(center,zoom);
});
function mapLL(v){return new L.LatLng(v[1],v[0]);}
function uiStuff(){
    $( "#tabs" ).tabs({
        collapsible: true,
        selected: -1
    });     

    $( "input:submit,input:reset" ).button();
    
    $('input, textarea').placeholder();
    
}
});