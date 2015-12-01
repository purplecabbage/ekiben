

var currentView;

Function.prototype.bind = function(sub) {
    var me = this;
    return function(){ return me.apply(sub, arguments);};
};

function init()
{
	document.addEventListener("touchmove",preventDefault,true);
	document.addEventListener("deviceready",onDeviceReady);
	window.addEventListener("orientationchange", setOrientation);
	
	x$("#horzList li").click( onNavButton.bind(this));
	
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window,
					   0, 0, 0, 0, 0, false, false, false, false, 0, null);
	document.getElementById("li1").dispatchEvent(evt);
	
	var gb0 = new GloveBox("view1Content");
	
	gb0.snap= {y:60};
	
	var gb1 = new GloveBox("view2Content");
	var gb2 = new GloveBox("view3Content");
	
	
	makeFakeData();
	
	
	if(navigator.userAgent.indexOf("iPhone") == -1)
	{
		onDeviceReady(null);
		x$("#app").css({"left":"320px"});
	}
	
}

function makeFakeData()
{
    var item = "<li>This is Item #NUM</li>";
    var items = "";
    for(var n = 0; n< 200; n++)
    {
        items += item.replace(/NUM/,n);
    }
    
    x$("#view1Content").html(items);
    x$("#view2Content").html(items);
    x$("#view3Content").html(items);
}

function onDeviceReady(e)
{


}

function onNavButton(e)
{
	x$("#horzList li").removeClass("active");
    x$(e.currentTarget).addClass("active");
	
	var direction = "right";
	var lastView = currentView;

	switch(e.currentTarget.id)
	{
		case "li1"  :
			currentView = "view1";
			break;
		case "li2" :
			currentView = "view2";
			direction = ( lastView == "view1" ? "left" : "right" );
			break;
		case "li3" :
			currentView = "view3";
			direction = "left";
			break;
	}
	if(currentView != lastView)
	{
	    showAndHide(direction,currentView,lastView);
	}
}

function showAndHide(direction,toShow,toHide)
{
	slideByID(toHide,direction,false);
	slideByID(toShow,direction,true);
}

function slideByID(id,direction,bShow)
{	
	var node = x$("#" + id);
	if(node)
	{
	    if(bShow)
	    {
	        // preTransform based on direction
	        // without a transition
	        var preTransform = "translate3D(" + ((direction == "left") ? 320 : -320)  + "px,0px,0px)";
    	    node.css({"-webkit-transition-duration":"0s"});
    	    node.css({"-webkit-transform":preTransform});
    	    node.removeClass("hidden");
    	    // reset transition time
    	    // slide to x=0
    	    var later = function()
    	    {
    	        node.css({"-webkit-transition-duration":"500ms"});
    	        node.css({"-webkit-transform":"translate3D(0px,0px,0px)"});
	        };
	        setTimeout(later,1); 
	    }
	    else
	    {
	        // apply transform based on direction
	        var x = direction == "left" ? -320 : 320;
	        node.css({"-webkit-transform":"translate3D(" + x + "px,0px,0px)"});
	    }
    	if(!bShow && node.elements.length > 0)
    	{
    	    // hide after transition
    	    node.elements[0].addEventListener( 'webkitTransitionEnd',onHideTransitionEnd, false );
    	}
    }
	
}

function onHideTransitionEnd(e)
{
    // only hide the unhidden
    var node = x$(e.currentTarget);
    if(!node.hasClass("hidden"))
    {
       x$(e.currentTarget).addClass("hidden");
    }
    // always remove the listener
    e.currentTarget.removeEventListener( 'webkitTransitionEnd',onHideTransitionEnd, false );
}


function preventDefault(evt)
{
	evt.preventDefault();
	
	return false;
}

function setOrientation() 
{  
	var orient = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';  
	alert("orientation :: " + orient);
}

