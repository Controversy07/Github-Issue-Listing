

function search_repo() //main function for all 3 server calls
{
  blurHandler(3,.6);

  var url=$("#repo_url").val();
  var split=url.split('/');

  if((split[0]!="https:")||(split[1]!="")||(split[2]!="github.com")||(isEmpty(split[3]))||(isEmpty(split[4]))||split.length!=5)  //incorrect format of the url
  {
    // check if the url is in proper format before making a server call
    showErrMsg("Invalid Url !!! Url should be in format as show in the textbox");
    $("#repo_url").val("");
    blurHandler(0,0);
    return false;
  }
  var $url = "https://api.github.com/repos/"+split[3]+"/"+split[4];
  servercall($url,total_issuecount);
  if(isEmpty($("#repo_url").val()))// break out of a function as the reposiroty does not exist
  {
    return;
  }


  var dateObj = new Date(); //date object to sort issue based on time
  var today=dateObj.getFullYear() + '-' + (dateObj.getMonth()+1) + '-' + (dateObj.getDate()-1)+'T'+dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds() + "Z";
  var $url_today = "https://api.github.com/repos/"+split[3]+"/"+split[4]+"/issues?since="+today;
  servercall($url_today,today_issuecount);

  dateObj=new Date().setDate(new Date().getDate() - 7);
  dateObj=  new Date(dateObj);
  var last_week=dateObj.getFullYear() + '-' + (dateObj.getMonth()+1) + '-' + (dateObj.getDate())+'T'+dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds() + "Z";
  var $url_last_week = "https://api.github.com/repos/"+split[3]+"/"+split[4]+"/issues?since="+last_week;
  servercall($url_last_week,lastweek_issuecount);
  /*

  Every pull request is an issue, but not every issue is a pull request.
  For this reason, “shared” actions for both features, like manipulating assignees, labels and milestones, are provided within the Issues API.

  */
  if(!$("#pull_req_toggle").is(":checked")) //if the user just wants to have a issue count without pull request count
  {
    var $pull_url = "https://api.github.com/repos/"+split[3]+"/"+split[4]+"/pulls?state=open";
    servercall($pull_url,get_lastpage_url);
  }
  show_result();// display the calculated results
  return;
}

function get_lastpage_url(data,xhr)
{
  /*  This api uses paging thus the default value is "per_page=30".
      The maximum is per_page=100. To get more than 100 results, you need to call it multiple times
      instead we determine total number of pull requests from the last page returned in the Link header.
      the link headder returns the next url and the last url
      eg-: ' <https://api.github.com/repositories/{ id } /pulls?state=open&page={ LASTAPGE }>; rel="last" ' where rel indicates relative url
  */
  var link=xhr.getResponseHeader("link");
  link=link.split(','); //separting the last and the next url
  var $lastpage_url=(link[1].match("<(.*)>")[1])//get the value of the url alone as show in example url
  servercall($lastpage_url,remove_pull_count);
}


function remove_pull_count(data,xhr,url)
{
  var total_page= url.split("page=")[1];//  matching to get the value of the page as show in example url
  var open_pull_count=((total_page-1)*30)+data.length;
  $("#issue_total span").text(  $("#issue_total span").html() - open_pull_count);
}

function blurHandler(zin,opc)   // blur handler
{
	$(".blur").css({"z-index":zin,"opacity":opc});
	$('html, body').css({
	    overflow: "hidden"
	});
}


function servercall(url,callback)// simple js ajax call
{
  $.ajax(
  {
        url: url,
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function(data, textStatus, xhr)
        {
          if(callback!=undefined)
          {
              callback(data,xhr,url);
          }
          return;
        },
        error: function(data, textStatus, xhr)
        {
          if(xhr=="Forbidden")
          {
              showErrMsg("url throttling limit reached, try again later.");
          }
          else
          {
            showErrMsg("No such repository exists, try again!");
          }
          blurHandler(0,0);
          $("#repo_url").val("");
        },
  });
}


function show_result()//display the result by hidingb and showing appropiate divs
{
  blurHandler(0,0);
  $("#issue_rest span").text($("#issue_total span").text() -  $("#issue_lastweek span").text() - $("#issue_today span").text());
  $(".search_form").hide();
  $(".search_section").animate({top: "150px"},function()
  {
    $(".result_form").show();
  });

}


function total_issuecount(resp)
{
  if(resp!=undefined)
  {
    $("#issue_total span").text(resp.open_issues_count);
  }
  else
  {
      $("#issue_total span").text(0);
  }
}
function lastweek_issuecount(resp)
{
  if(resp!=undefined)
  {
    $("#issue_lastweek span").text(resp.length -  $("#issue_today span").text());
  }
  else
  {
      $("#issue_lastweek span").text(0);
  }
}

function today_issuecount(resp)
{
  if(resp!=undefined)
  {
    $("#issue_today span").text(resp.length);
  }
  else
  {
      $("#issue_today span").text(0);
  }
}

function isEmpty(str)
{
    return str ? false : true;
}



function showErrMsg(msg)  //erro msg notfication
{

    $('.top_msg').html(msg); //No I18N
    $(".cross_mark").addClass("cross_mark_error");
    $( "#error_space" ).addClass("show_error");

    setTimeout(function() {
    	$( "#error_space" ).removeClass("show_error");
    	$(".cross_mark").removeClass("cross_mark_error");
    }, 4000);;

}


function search_again() //restart the function
{
  $(".result_form").hide();
  $(".search_section").animate({top: "350px"},function(){
    $("#issue_lastweek span").html("");
    $("#repo_url").val("");
    $(".search_form").show();
  });

}
