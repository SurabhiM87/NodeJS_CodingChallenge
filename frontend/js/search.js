$(document).ready(function(){
    $('#searchBtn').on('click', function(button, k){
        getArtistData();
    })
    $('#searchCeleb').keypress(function(e){

        if(e.which == 13)
        {
            $('#searchBtn').trigger("click");
            return false;
        }
    });
    $('#searchCeleb').keyup(function(e){
        $("#error").css("display","none");
    });
    function getArtistData(){
        var searchTextBox = $('#searchCeleb');
        if(searchTextBox.val() == ""){
            $("#error").text("* Please enter artist's name");
            $("#error").css("display","block");
        }
        else{
            var data = searchTextBox.val();
            $.ajax({
                type: 'POST',
                data: {
                    searchValue: encodeURIComponent(data.trim())
                },
                url: app.jsonUrl,
                success: function(data) {
                    if(data){
                        setImages(data);
                    }
                    else{
                        $("#error").text("* No entries exist for selected artist. Please try again.");
                        $("#error").css("display","block");
                        $(".box").css("visibility","hidden");
                    }
                }
            })

        }
    }
    function showImages(imageData){
        for(var i=0;i<imageData.artistName.length; i++){
            $("#image"+i).find("img").attr("src",imageData.imageUrls[i]);
            $("#image"+i).find("p").text(imageData.artistName[i]);
            $("#image"+i).css("visibility","visible");
        }
    }
    function setImages(imageData){
        if(imageData.artistName.length == 6){
            showImages(imageData);
        }
        else{
            var totalArtists = imageData.artistName.length;
            for(var i =5; i>=totalArtists; i--){
                $("#image"+i).css("visibility","hidden");
            }
            showImages(imageData);
        }

    }
});