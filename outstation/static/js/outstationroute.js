(function($) {

   'use strict'

    var outstationTaxiRoute;
    var placeFilter = {};
    var tripTypeFilter = {};
    var isSelectedAll = false;
    var init = true;

    var populateRoute = function(){
      fetch('/api/v2/pages/'+route.routeId()+'/').
      then(response => response.json()).
      then(data => {  outstationTaxiRoute = data;
      //console.log(data)
    })
    }

    var routeMap = function(){
      $("#routeMapButton").click(function(e){
        if(init){
          init = false;
          $("#filterPanel").removeClass("hide");
        }else{
          $("#selectAllButton").addClass("hide");
          $("#editButton").removeClass("hide");
          $("#routeMapButton").addClass("hide");
          $("#filterView").addClass("hide");
          showSelectedTagsView();
          generateRoute();
        }
      })
    }

    var showSelectedTagsView = function(){
      $('#selectedFilterView').empty();
      $.each(placeFilter, function(tagKey, tagValue ) {
        $('#selectedFilterView').append("<div class='tag-selected'>"+tagValue+"</div>");
      })
      $.each(tripTypeFilter, function(tripTypeKey, tripTypeValue ) {
        $('#selectedFilterView').append("<div class='tag-selected'>"+tripTypeValue+"</div>");
      })
      $('#selectedFilterView').removeClass('hide');
    }

    var generateRoute = function() {
        if(!$.isEmptyObject(placeFilter) || !$.isEmptyObject(tripTypeFilter)){
            $.each(outstationTaxiRoute.on_route_places.places, function( placeKey, placeValue ) {
              var place = placeValue;
              var locationTags = place.location_tags;
              var tripTypes = place.trip_types;
              var isPlaceFound = false;
              var filterLocationId = "placeOnRoute-"+place.id;
              var filterMapId = "mapBlock-"+place.id;

              $.each(locationTags, function( locationTagKey, locationTagValue ) {
                if(placeFilter[locationTagValue.id] != undefined){
                  $('#'+filterLocationId).removeClass('hide');
                  $('#'+filterMapId).removeClass('hide');
                  isPlaceFound = true;
                  return false;
                }
              });
              if(!isPlaceFound){
                $.each(tripTypes, function( tripTypeKey, tripTypeValue ) {
                  if(tripTypeFilter[tripTypeValue.id] != undefined){
                    $('#'+filterLocationId).removeClass('hide');
                    $('#'+filterMapId).removeClass('hide');
                    isPlaceFound = true;
                    return false;
                  }
                });
              }
              if(!isPlaceFound){
                  $('#'+filterLocationId).addClass('hide');
                  $('#'+filterMapId).addClass('hide');
              }
              isPlaceFound = false;
            });
          } else {
            $('#dynamicRouteMap').children('div').each(function(){
              if($(this).hasClass("hide")){
                $(this).removeClass("hide")
              }
            })
            $('#placesOnRoute').children('div').each(function(){
              if($(this).hasClass("hide")){
                $(this).removeClass("hide")
              }
            })
          }
      }

    var locationTagButtons = function(){
      $('#placeFilter').on('click', function(e){
        e.stopImmediatePropagation()
        if(e.target !== e.currentTarget){
          var tagButton = e.target;
          var tagid = $(tagButton).val();
          var tag = $(tagButton).text();
          if ($(tagButton).hasClass("tag-button-down")) {
              tagButton.classList.add("tag-button-up");
              tagButton.classList.remove("tag-button-down");
              delete placeFilter[tagid];
          } else {
            tagButton.classList.add("tag-button-down");
            tagButton.classList.remove("tag-button-up");
            if(placeFilter[tagid] == undefined)
            {
              placeFilter[tagid]=tag;
            }
          }
        }
      });
    }

    var tripTypeButtons = function(){
      $('#tripTypeFilter').on('click', function(e){
        e.stopImmediatePropagation()
        if(e.target !== e.currentTarget){
          var tripTypeButton = e.target;
          var tripTypeid = $(tripTypeButton).val();
          var tripType = $(tripTypeButton).text();
          if ($(tripTypeButton).hasClass("tripType-button-down")) {
              tripTypeButton.classList.add("tripType-button-up");
              tripTypeButton.classList.remove("tripType-button-down");
              delete tripTypeFilter[tripTypeid];
          } else {
            tripTypeButton.classList.add("tripType-button-down");
            tripTypeButton.classList.remove("tripType-button-up");
            if(tripTypeFilter[tripTypeid] == undefined)
            {
              tripTypeFilter[tripTypeid]=tripType;
            }
          }
        }
      });
    }

    var editFilterButton = function(){
      $('#editButton').on('click', function(e){
        $("#selectAllButton").removeClass("hide");
        $("#editButton").addClass("hide");
        $("#routeMapButton").removeClass("hide");
        $("#filterView").removeClass("hide");
        //enableFilterTags(false);
        $('#selectedFilterView').addClass('hide');
      })
    }

    var selectAllFilterButton = function(){
      $('#selectAllButton').on('click', function(e){
        e.stopImmediatePropagation();
        if(!isSelectedAll){
          $('#placeFilter').children('button').each(function(){
            $(this).addClass("tag-button-down");
            $(this).removeClass("tag-button-up");
            $('#selectAllButton').html("Remove All")
            var tagid = $(this).val();
            var tag = $(this).text();
            if(placeFilter[tagid] == undefined)
            {
              placeFilter[tagid]=tag;
            }
          });
        } else {
          placeFilter={}
          $('#placeFilter').children('button').each(function(){
            $(this).removeClass("tag-button-down");
            $(this).addClass("tag-button-up");
            $('#selectAllButton').html("Select All")
            var tag = $(this).val();
          });
        }
        isSelectedAll=!isSelectedAll;
    });
  }

  $("#like_button_form").submit(function(e){
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'/like/',
        data:{
          route_id:route.routeId(),
          csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(data){
          $("#likes_count").html(data.likes_count);
          if(data.is_liked == true){
            $('#like_button').addClass('border-bottom');
          }else{
            $('#like_button').removeClass('border-bottom');
          }
        }
      });
  })

  var reviewButton = function(){
    $("#writeReviewButton").on('click', function(e){
      $("#reviewListPanel").addClass("hide");
      $("#writeReviewPanel").removeClass("hide");
      $("html, body").animate({
        scrollTop: $("#writeReviewPanel").offset().top
    });
  });
    /*$("#writeReviewButton").on('click', function(e){
    $("#reviewListPanel").addClass("hide");
    $.ajax({
        url: '/review/',
        method: 'GET',
        data:{
          route_id:route.routeId()},
        success: function(data) {
          //window.alert("success" + data);
          $('#writeReviewPanel').append(data);
          $("#writeReviewPanel").removeClass("hide");
        }
    });*/
  //});
  }

/**
  Review Form
**/

  Dropzone.autoDiscover = false;
  var dropzones=[];
  var imageDropzone = new Dropzone('div#reviewImagesDropzone', {
      url: '/review/',
      autoProcessQueue: false,
      autoDiscover: false,
      uploadMultiple: true,
      parallelUploads: 2,
      maxFiles: 10,
      paramName: "images",
      addRemoveLinks: true,
      retryChunks: true,
      parallelChunkUploads: true,
      thumbnailWidth : 80,
      thumbnailheight : 80,
      acceptedFiles: 'image/jpeg, image/jpg, image/png'

  });

 imageDropzone.on("maxfilesexceeded", function(file) {
   if($("#reviewImagesDropzone").hasClass("dz-max-files-reached")){
     $('#imageError').removeClass("hide");
     $("#imageUploadError").html("Maximum 10 number of images can be uploaded");
   }
  });

  imageDropzone.on("removedfile", function(file) {
    var maxFile = imageDropzone.options.maxFiles;
    var totalFiles = $("#reviewImagesDropzone").children(".dz-preview").length
     //console.log(maxFile)
     //console.log(totalFiles)
    if(totalFiles<=maxFile){
      $("#imageUploadError").html("");
      $('#imageError').addClass("hide");
    }
  });

  dropzones.push(imageDropzone);
  var videoDropzone = new Dropzone('div#reviewVideosDropzone', {
    url: '/review/',
    autoProcessQueue: false,
    autoDiscover: false,
    uploadMultiple: true,
    parallelUploads: 2,
    maxFiles: 2,
    paramName: "videos",
    addRemoveLinks: true,
    retryChunks: true,
    parallelChunkUploads: true,
    thumbnailWidth : 80,
    thumbnailheight : 80,
    acceptedFiles: 'video/*'
  });

  videoDropzone.on("maxfilesexceeded", function(file) {
    if($("#reviewVideosDropzone").hasClass("dz-max-files-reached")){
      $("#videoUploadError").html("Maximum 2 number of videos can be uploaded");
      $('#videoError').removeClass("hide");
    }
  });
  videoDropzone.on("removedfile", function(file) {
    var maxFile = videoDropzone.options.maxFiles;
    var totalFiles = $("#reviewVideosDropzone").children(".dz-preview").length;
    if(totalFiles<=maxFile){
      $("#videoUploadError").html("");
      $('#videoError').addClass("hide");
    }
  });

  dropzones.push(videoDropzone);

  $('#reviewForm').submit(function(e) {
    e.preventDefault();
    e.stopPropagation();

    resetErrors();

    if(isValid()){
      $("#spinnerModal").modal({
        backdrop: 'static',
        keyboard: false
      });

      let reviewForm = document.getElementById('reviewForm');
      let reviewFormData = new FormData(reviewForm);
      dropzones.forEach(dropzone => {
        let  { paramName }  = dropzone.options;
        dropzone.files.forEach((file, i) => {
          reviewFormData.append(paramName + '[' + i + ']', file);
        })
      });
      reviewFormData.append('route_id', route.routeId());
      reviewFormData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
        $.ajax({
            url: '/review/',
            method: 'POST',
            data: reviewFormData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
              $('#spinnerModal').modal('toggle');
              if(!data.is_title_spam && !data.is_comment_spam){
                $("#reviews_count").html(data.total_reviews);
                reset();
              } else {
                if(data.is_title_spam){
                  $('#titleError').removeClass("hide");
                  $("#titleError").html("Spam detected in this field");
                  scrollTo('#title');
                }
                if(data.is_comment_spam){
                  $('#commentsError').removeClass("hide");
                  $("#commentsError").html("Spam detected in this field");
                  scrollTo('#title');
                }
              }
            }
        });
      }
  });
  $('#cancelButton').on('click', function(e){
    reset();
  })

  var totalImages = function(){
    var totalImageFiles = $("#reviewImagesDropzone").children(".dz-preview").length;
    return totalImageFiles;
  }

  var totalVideos = function(){
    var totalVideoFiles = $("#reviewVideosDropzone").children(".dz-preview").length;
    return totalVideoFiles;
  }

  var isValid = function(){
    //var isEmptyComments = $('#reviewComments').val()=='';
    var isFormValid = true;
    var scrollToSection="";

    if( $('#reviewComments').val()=='' && totalImages() == 0 && totalVideos() == 0){
      $("#reviewFormError").html("Please provide your comments or upload photos/videos to submit a review.");
      $('#formError').removeClass("hide");
      isFormValid = false;
      return isFormValid;
    }
    if( $('#reviewRating').val()==''){
      $("#ratingError").html("Please provide rating.");
      $('#ratingError').removeClass("hide");
      scrollToSection = '#rating';
      isFormValid = false;
    }
    if(totalImages() > imageDropzone.options.maxFiles) {
      $('#imageError').removeClass("hide");
      $("#imageUploadError").html("Maximum 10 number of images can be uploaded");
      if(scrollToSection =="") {
        scrollToSection = '#reviewImagesDropzone';
      }
      isFormValid = false;
    }
    if(totalVideos() > videoDropzone.options.maxFiles) {
      $("#videoUploadError").html("Maximum 2 number of videos can be uploaded");
      $('#videoError').removeClass("hide");
      if(scrollToSection =="") {
        scrollToSection = '#reviewVideosDropzone';
      }
      isFormValid = false;
    }
    if(scrollToSection !="") {
      scrollTo(scrollToSection)
    }
    return isFormValid;

  }
  var reset= function(){
    reviewForm.reset();
    resetErrors();

    dropzones.forEach(dropzone => {
      dropzone.removeAllFiles();
    });

    $("#writeReviewPanel").addClass("hide");
    $("#reviewListPanel").removeClass("hide");
  }

  var resetErrors= function(){
    $("#reviewFormError").html("");
    $('#formError').addClass("hide");
    $("#imageUploadError").html("");
    $('#imageError').addClass("hide");
    $("#videoUploadError").html("");
    $('#videoError').addClass("hide");
    $("#reviewFormError").html("");
    $('#formError').addClass("hide");
    $('#titleError').addClass("hide");
    $("#titleError").html("");
    $('#commentsError').addClass("hide");
    $("#commentsError").html("");
    $("#ratingError").html("");
    $('#ratingError').addClass("hide");

  }

  var scrollTo = function(section){
    $("html, body").animate({
      scrollTop: $(section).offset().top
    });
  }



	// Dom Ready
	$(function() {
		populateRoute();
    routeMap();
    locationTagButtons();
    tripTypeButtons();
    editFilterButton();
    selectAllFilterButton();
    reviewButton();
   	});
})(jQuery);
