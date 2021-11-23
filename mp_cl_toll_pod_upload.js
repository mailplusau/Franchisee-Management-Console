/**
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-15T07:34:50+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-23T14:22:30+11:00
 */

var imageToText = null;
var imageProcessed = false;

$(window).load(function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
});

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {

});


function showAlert(message) {
  $('#alert').html('<button type="button" class="close">&times;</button>' +
    message);
  $('#alert').show();
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0;
  // $(window).scrollTop($('#alert').offset().top);
}

$(document).on('change', '.input', function(e) {

  pdffile = document.getElementsByClassName("input");

  console.log(pdffile);
  pdffile_url = URL.createObjectURL(pdffile[0].files[0]);
  $('#viewer').show();
  $('#viewer').attr('src', pdffile_url);
});

function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#output').attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
}


function pageInit() {

  $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
  $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
  $("#body").css("background-color", "#CFE0CE");

  var scf_upload = document.getElementsByClassName('input');
  console.log('scf_upload' + scf_upload)
  var scf_upload_field = document.getElementsByClassName('uir-field');
  $('.uir-field-wrapper').attr("style", "padding-left:15%;");
  $('.uir-field-wrapper').attr("style", "padding-left:15%;");
  $('#upload_file_1_fs_lbl_uir_label').attr("style", "padding-left:15%;");

  for (var i = 0; i < scf_upload.length; i++) {
    scf_upload[i].className += " form-control";
  }

  for (var i = 0; i < scf_upload_field.length; i++) {
    scf_upload_field[i].setAttribute("style", "padding-left:15%;");
  }

  $('#alert').hide();

  if (nlapiGetFieldValue('custpage_tollpodid') != 0) {
    setTimeout(function() {
      $('#alert_success').hide();
    }, 3000);
  }

  $('input:file').change(function() {
    console.log(1234);
    pdffile = document.getElementsByClassName("input:file");

    console.log(pdffile);
    pdffile_url = URL.createObjectURL($('input[name="upload_file_1"]')[0].files[
      0]);
    $('#viewer').show();
    $('#viewer').attr('src', pdffile_url);
  });
}

function validate(status) {

  var location = $('.location').val();
  var zee = $('#zee').val();

  console.log(location)
  console.log(zee)

  var return_value = true;

  var alertMessage = ''

  if (isNullorEmpty(zee)) {
    alertMessage +=
      'Please select a Franchisee to which the customer Belongs</br>';
    return_value = false;
  }
  if (isNullorEmpty(location)) {
    alertMessage +=
      'Please select a location where the parcel was dropped off</br>';
    return_value = false;
  }

  // if (isNullorEmpty($('#viewer').attr('src'))) {
  //   alertMessage += 'Please Upload TOLL Proof of Delivery Form</br>';
  //   return_value = false;
  // }
  //

  if (return_value == false) {
    showAlert(alertMessage);
  }
  return return_value;
}

function getImageToTextJSON() {
  var formData = new FormData();
  formData.append('image', $('#YOUR_IMAGE_FILE')[0].files[0]);
  var api = '1iDJ8l2AP/M9iWmwAfOwdQ==ZA4Kr8vimsruo2vG'

  $.ajax({
    method: 'POST',
    headers: {
      'X-Api-Key': '1iDJ8l2AP/M9iWmwAfOwdQ==ZA4Kr8vimsruo2vG'
    },
    url: 'https://api.api-ninjas.com/v1/imagetotext',
    data: formData,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    success: function(result) {
      console.log(result);
      imageToText = result;
      imageProcessed = true;
      console.log(imageToText)
      console.log(JSON.stringify(imageToText))
      document.getElementById('submitter').click();
    },
    error: function ajaxError(jqXHR, textStatus, errorThrown) {
      alert(jqXHR.responseText);
    }
  });
}

function saveRecord() {
  var result = validate();


  console.log(result)

  if (result == true) {
    $(".se-pre-con").show();
    var location = $('.location').val();
    var zee = $('#zee').val();

    // console.log(imageProcessed)
    // console.log(JSON.stringify(imageToText))
    //
    // if(imageProcessed == true){
    //   console.log('inside processed section')
    nlapiSetFieldValue('custpage_operator', zee)
    nlapiSetFieldValue('custpage_location', location)
      // nlapiSetFieldValue('custpage_json', JSON.stringify(imageToText))
    return true;
    // } else {
    //   getImageToTextJSON();
    // }

  }
}

function isNullorEmpty(strVal) {
  return (strVal == null || strVal == '' || strVal == 'null' || strVal ==
    undefined || strVal == 'undefined' || strVal == '- None -' || strVal ==
    '0');
}

function getDate() {
  var date = new Date();
  // if (date.getHours() > 6) {
  //     date = nlapiAddDays(date, 1);
  // }
  date = nlapiDateToString(date);
  return date;
}
