function mobileSize () { // attributes to appear/disappear when in "mobile mode" (<769 px)
        $("#collapse-button").show();
        $("#top-nav-button").show();
        $("#nav").hide();
        $(".announcement-bar-mobile").show();
        $(".announcement-bar").hide();
        $("div.header-top-nav").hide();
        $(".download-button4").css("display","block");
        $("#table-of-contents").show();
        $(".switch-mobile").css("display", "inline-block");
        $(".switch").addClass("hidden");
}                                                  

$(document).ready(function() {
    if ($(window).width() >= 769) {
        $("#collapse-button").hide();
        headerScroll(".header-top-nav", 50, false);
        headerScroll(".announcement-bar", 50, false);
        $("#table-of-contents").hide();
        $(".switch-mobile").hide();
        $(".switch").show();
        $("#page-navigation2").addClass("visible")
        $("#page-navigation2").addClass("uncover")
    } else {
        $("#page-navigation2").removeClass("visible")
        $("#page-navigation2").removeClass("uncover")
        mobileSize();
    }
})

$(window).resize(function () {
    
    if ($(window).width() >= 769) {
        $("#nav").show();
        $("#collapse-button").hide();
        $(".announcement-bar-mobile").hide();
        $(".announcement-bar").show();
        $(".download-button4").css("display","none");
        $("#table-of-contents").hide();
        $("#page-navigation2").addClass("visible")
        $("#page-navigation2").addClass("uncover")
        $("body").removeClass("pushable")
        $("#switch").removeClass("hidden")
        $(".switch-mobile").hide();
    } else  {
        $("#page-navigation2").removeClass("visible")
        $("#page-navigation2").removeClass("uncover")
        mobileSize();
    }
})

$(document).ready(function () {
    
    $("#collapse-button").click(function ()  {
        $("#nav").slideToggle();
        $("#collapse-button").toggleClass("active")
        $(".download-button4").css("display","inline-block");
        $("body").toggleClass("notshown")
        $("html").toggleClass("overwatch")
        return false;
    })
})

