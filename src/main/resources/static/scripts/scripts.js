// JavaScript by Joseph Dizon

// Main

var mainTitle;
var mainUrl;

var imgLoading = '<img src="/images/loading.gif" \>';
var regex_email = '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$';

function initLeftBar(_IsOpen)
{
	$('#leftbar .menuitem').click(menuClick);
	
	var mainsub = getCookie_words('mainsub');
	if (mainsub != null && mainsub != '')
	{
		if ($('#leftbar .menuitem[sub='+mainsub+']').length > 0) {
			var $menuitem = $('#leftbar .menuitem[sub='+mainsub+']');
			$menuitem.addClass('selected');
			mainTitle = $menuitem.text();
			mainUrl = mainsub;
		}
	}
	else
	{
		mainTitle = 'Welcome';
		mainUrl = '_welcome';
	}
	var cookieLeftBar = getCookie_words('leftbar');
	if (cookieLeftBar === 'close') closeleftBar();
	
	if (!_IsOpen) closeleftBar();
	else openleftBar();
}

function loadSubPage(_SubPage, _Url)
{
	var $subPage = $(('#'+_SubPage).replace('##','#'));
	$('#mainLoading h1').text('Loading...');
	$subPage.html($('#mainLoading').html());
	$subPage.load(_Url, function(txtResponse, txtStatus, req){
		if (txtStatus == 'error') {
		$subPage.html('<h2 class="red">Failed to load "'+_Url+'"</h2>' + txtResponse);
		}
		else
		{
			if ($('.list.pagination').length > 0)
			{
				listUrl = mainUrl;
				listControlTop = 140;
				
				$subPage.attr('url',mainUrl);
				listInit($subPage);
				//closeleftBar();
			}
			
			initTabGroup($subPage.find('tabgroup'));
		}
	});
}

function loadMain(_Title, _Url)
{
	mainTitle = _Title;
	mainUrl = _Url;
	reloadMain();
}

function backMain()
{
	openleftBar();
	loadMainFromLeft();
}

function reloadMain()
{
	$('#mainLoading h1').text(mainTitle);
	$('#main').html($('#mainLoading').html());
	$('#main').load(mainUrl, function(txtResponse, txtStatus, req){
		if (txtStatus == 'error') {
		$('#main').html('<h2 class="red">Failed to load "'+mainUrl+'"</h2>' + txtResponse);
		}
		else
		{
			if ($('.list').length > 0)
			{
				//listDiv = '#main';
				//listUrl = mainUrl;
				//listControlTop = 140;
				//listInit();
				//closeleftBar();
				
				//var $div = $('.list').parent();
				//var url = $div.attr('url');
				$('#main').attr('url',mainUrl);
				listInit($('#main'));
				
			}
			initTabGroups(); //initialize tabs
		}
	});
}

function menuClick()
{
	$('#leftbar .selected').removeClass('selected');
	$(this).addClass('selected');
	loadMainFromLeft();
}

function loadMainFromLeft()
{
	var $menu = $('#leftbar .selected');
	var sub = $menu.attr('sub');
	if (sub == 'logout')
	{
		putCookie('mainsub', '');
		logout();
	}
	else
	{
		putCookie('mainsub', sub); //Save menu click
		var title = $menu.text();
		loadMain(title, sub);
		//openleftBar();
	}
}

function logout()
{
	window.location.href = "/toLogout";
	//var url = "/toLogout";
	//$('#main').load(url);
}

function doLoad(sel, url, fnc)
{
	var $sel = $(sel);
	$sel.load(url, function(responseText, textStatus, req){
		if (textStatus == "error") {
			  $sel.html("Not Available.");
        }
		else {
			initTabGroup($sel.find('tabgroup'));
			fnc();
		}
	});
}

function doPost(_Url, _Function)
{
	if (isDev) {
				console.log('Post URL: ' + _Url);
	}
	$.post(_Url, _Function)
		.fail(function(data){
			if (isDev) {
				console.log('Post Response: '+data);
			}
			openErrorPopup('Post Failed', 'Post Failed!');
	});
}

function doPost2(_Url, _FuncOk, _FuncError)
{
	if (isDev)
		console.log('Post URL: ' + _Url);

	$.post(_Url, _FuncOk)
		.fail(function() {
			_FuncError(data);
			if (isDev) {
				console.log('Post Response: '+data);
			}
		});
}

var fncGet;
function doGet(_Url, _Function)
{
	if (isDev)
		console.log('doGet URL: ' + _Url);

	fncGet = _Function;
	$('#temp').text('-');
	$('#temp').load(_Url, function(){
		var res = $('#temp').text();
		if (!res || res == undefined || res.includes('Error'))
		{
			openErrorPopup('Get Failed', 'Get Failed!<br />URL: '+_Url + '<br /><br />'+res);
		}
		else fncGet();
	});
}

function checkGet(data)
{
	var data = $('#temp').text()
	return checkPost(data);
}

var lastResponse = '';
function checkPost(data)
{
	lastResponse = data;
	if (data.includes('Error'))
	{
		openErrorPopup('Submit Failed',data);
		return false;
	}
	return true;
}


// Popup
var zIndex_Default = 1000;
var zPrevious = zIndex_Default; //Previous z-index
function noop(){}

function openPopup(_Popup)
{
	var $popup = $(('#'+_Popup).replace('##','#'));
	if (!$popup || $popup == undefined)
	{
		alert('Invalid Popup Id: '+_Popup);
		return;
	}
	openPopup$($popup);
}


function openPopup$($popup)
{
	var top = $popup.attr('top'); 
	if (top == undefined)
		top = ($(window).height() - $popup.height()) /4;
	var left = $popup.attr('left');
	if (left == undefined)
		left = ($(window).width() - $popup.width()) /2;
	$popup.css('top',top);
	$popup.css('left',left);
	//$('.popup').hide(); //close any previous popup
	var $blanket = $('#Blanket'); //.clone().appendTo('#main');
	//$blanket.attr('id','Blanket_'+zPrevious);
	$blanket.attr('z-index',zPrevious);
	$blanket.css('z-index',zPrevious);
	$blanket.show();
	$popup.attr('z-index',zPrevious+1);
	$popup.css('z-index',zPrevious+1);
	$popup.show();
	
	zPrevious = zPrevious+50;
}

function relocatePopup($popup)
{
	var pTop = ($(window).height() - $popup.height());
	if (pTop < 4) pTop = 4;
	var pLeft = ($(window).width() - $popup.width());
	if (pLeft < 2) pLeft = 2;
	$popup.css('top',pTop/4);
	$popup.css('left',pLeft/2);
}

function closePopup()
{
	//$('#Blanket').hide();
	//$('.popup').hide();
	
	if (zPrevious == zIndex_Default)
		return; //nothing to hide

	zPrevious = zPrevious-50;
	$('.popup[z-index='+(zPrevious+1)+']').hide();
	if ($('#Blanket').attr('z-index') > zIndex_Default) {
		$('#Blanket').attr('z-index',zPrevious-50);
		$('#Blanket').css('z-index',zPrevious-50);
	}
	else
		$('#Blanket').hide();
}

function closePopupAll()
{
	console.log('closePopupAll: '+zPrevious);
	while (zPrevious > zIndex_Default)
		closePopup();
}

function closePopup_ReloadPage()
{
	closePopup();
	listPageReload();
}

var popupFunc;
function execPopupFunc()
{
	if (popupFunc) popupFunc();
}
function openInfoPopup(_HeadText, _BodyText, _Func)
{
	$('#MainInfoPopup .pHead').html(_HeadText);
	$('#MainInfoPopup .pBody').html(_BodyText);
	$('#MainInfoPopup .pFooter').show();
	popupFunc = _Func;
	openPopup('MainInfoPopup');
}

function openErrorPopup(_HeadText, _BodyText, _Func)
{
	$('#MainErrorPopup .pHead').html(_HeadText);
	$('#MainErrorPopup .pBody').html(_BodyText);
	popupFunc = _Func;
	openPopup('MainErrorPopup');
}

function openStatusPopup(_HeadText, _BodyText)
{
	$('#MainInfoPopup .pHead').html(_HeadText);
	$('#MainInfoPopup .pBody').html(_BodyText);
	$('#MainInfoPopup .pFooter').hide();
	openPopup('MainInfoPopup');
}

function openLoadingPopup(_HeadText, _BodyText)
{
	$('#MainInfoPopup .pHead').html(_HeadText);
	$('#MainInfoPopup .pBody').html('<img src="/images/loading.gif" \> ' + _BodyText);
	$('#MainInfoPopup .pFooter').hide();
	openPopup('MainInfoPopup');
}

//Executes _Func when Yes
function openAskPopup(_HeadText, _BodyText, _Func)
{
	if (!_Func) {
		alert('Callback function is not specified!');
		return;
	}
	$('#MainAskPopup .pHead').html(_HeadText);
	$('#MainAskPopup .pBody').html(_BodyText);
	popupFunc = _Func;
	openPopup('MainAskPopup');
}

//Executes _Func(true) when Yes and _Func(false) when No
function openAskYesNo(_HeadText, _BodyText, _Func)
{
	if (!_Func) {
		alert('Callback function is not specified!');
		return;
	}
	$('#MainAskYesNo .pHead').html(_HeadText);
	$('#MainAskYesNo .pBody').html(_BodyText);
	popupFunc = _Func;
	openPopup('MainAskYesNo');
}

function openFileViewer(url)
{
	if (isDev)
		console.log('openFileViewer url: ' + url);

	openPopup('#FileViewer');
	$('#TempFrame').attr('src',url);
}

function load_PopupBody(popupSelector, url)
{
	if (isDev)
		console.log('load_PopupBody url: ' + url);

	$(popupSelector+' .pBody').load(url, function(){ relocatePopup($(popupSelector))});
}

function downloadFile(url)
{
	if (isDev)
		console.log('downloadFile url: ' + url);
	
	//console.log('Download URL:'+url);
	//window.open(url, '_blank');
	$('#TempFrame').attr('src',url);
}

// tabgroup and tab

function initTabGroups()
{
	initTabGroup($('tabgroup[initialize]'));
}

function initTabGroup($THSAll)
{
	//tabgroup can have attribute cookie="cookie_name"
	//tabgroup can have attribute initialize
	$THSAll.each(function(){
		var $THS = $(this);
		if ($THS == undefined)
			return;

		//Initialize each tab
		$THS.find('tab').each(function(){
			$tab = $(this);
			if (!$tab.attr('onclick')) {
				$tab.unbind('click');
				$tab.click(selectedTabClick);
			}
		});

		var $sel = $($THS.find('tab')[0]);
		
		var cook = $THS.attr('cookie');
		if (cook != undefined) {
			var cookieVal = getCookie_words(cook);
			if (cookieVal != null && cookieVal != '') {
				var $cookieTab = $THS.find('tab[tab='+cookieVal+']');
				if ($cookieTab != undefined)
					$sel = $cookieTab; //return;
			}
		}
		selectTabThis($sel);
	});
}

function selectedTabClick()
{
	selectTabThis($(this));
}
function selectTabThis(THS)
{
	//tab must have attribute tab="tab_name"
	//tab can have attribute fnc="function();"
	//tab can have attribute disabled

	var $THS = $(THS);
	if ($THS.attr('disabled')) return;
	
	var $par = $THS.parent();
	if ($par.find('tab[selected]').length > 0) {
		var $prev = $par.find('tab[selected]'); //find previous selected
		$prev.removeAttr('selected'); //remove previous selected
		var prevTab = $prev.attr('tab');
		$('#Div'+prevTab).hide();
	}
	
	$THS.attr('selected','selected');
	var newTab = $THS.attr('tab');
	$('#Div'+newTab).show();

	if ($par.attr('cookie') != undefined) {
		putCookie($par.attr('cookie'),newTab);
	}
	
	if ($THS.attr('fnc') != undefined)
		eval($THS.attr('fnc'));

	initTabGroup($('#Div'+newTab).find('tabgroup'));
}

/*function tab_click(THS)
{
	var $tab = $(THS);
	if ($tab.attr('disabled')) return;
	
	var $par = $tab.parent();
	if ($par.attr('cookie') != undefined) {
		var newTab = $tab.attr('tab');
		putCookie($par.attr('cookie'),newTab);
	}
	
	$tab.siblings('tab').removeAttr('selected');
	$tab.attr('selected',true);
	var fnc = $tab.attr('fnc');
	//console.log('fnc='+fnc);
	eval(fnc); //window[fnc](this);
}*/

// Left Bar

function toggleLeftBar()
{
	if (!$('#leftbar').hasClass('open')) openleftBar();
	else closeleftBar();
}
/* Set the width of the sidebar to 210px and the left margin of the page content to 250px */
function openleftBar() {
  $('#leftbar').addClass('open');
  $('#leftbar').removeClass('close');
  $('.btnToggleLeftBar').attr('title','Close Left Bar');
  putCookie('leftbar','open');
  $('#main').addClass('open');
  $('#main').removeClass('close');
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeleftBar() {
  $('#leftbar').addClass('close');
  $('#leftbar').removeClass('open');
  $('.btnToggleLeftBar').attr('title','Open Left Bar');
  putCookie('leftbar','close');
  $('#main').addClass('close');
  $('#main').removeClass('open');
}

// General

function validate_Email(email)
{
	return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
}

function sanitizeWords(_Str)
{
	if (_Str == null)
		return null;

	return _Str.replace(/[^a-zA-Z0-9?:|!.,$@_\- ]/g, '') ;
}

function sanitizeEmail(_Str)
{	if (_Str == null)
		return null;

	return _Str.replace(/[^a-zA-Z0-9.@_\-]/g, '') ;
}

function getInputValidate(SLR)
{
	var $slr = $(SLR);
 	var val = $slr.val();
 	if (!val) $slr.addClass('border-red');
 	return val;
}

function andEncode(_QueryName, _Val)
{
	return '&' + _QueryName + '=' + encodeURIComponent(_Val);
}

function encodeVal(name, SLR)
{
	return '&' + name + '=' + encodeURIComponent($(SLR).val());
}

function andInputValidateEncode(name, SLR)
{
	return andEncode(name, getInputValidate(SLR));
}

function encodeVal(name, SLR)
{
	return '&' + name + '=' + encodeURIComponent($(SLR).val());
}


function formZero(_hh)
{ 
	if (_hh < 10) return '0'+_hh;
	else return ''+_hh;
}

function stringCurrentDate()
{
	var d = new Date();
	var strDate = d.getFullYear() + '-' + ("0"+(d.getMonth()+1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
	return strDate;
}

function stringCurrentTime()
{
	var today = new Date();
	var hours = today.getHours();
	var amPm;
	if (hours > 11) amPm = " PM";
	else amPm = " AM";
	if (hours > 12) hours = hours - 12;
	var strTime = hours+":"+formZero(today.getMinutes())+":"+formZero(today.getSeconds())+amPm;
	return strTime;
}


// Cookies

function putCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie_00(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function getCookie_email(name) {
	return sanitizeEmail(getCookie_00(name));
}

function getCookie_words(name) {
	return sanitizeWords(getCookie_00(name));
}


function loadCookie_words(_CookieName, $Input)
{
	var v = getCookie_words(_CookieName);
	if (v != null) $Input.val(v);
}

function deleteCookie(name) {
    putCookie(name, "", null);
}

var isDev;
function setDevOn()
{
	if (isDev == 1) return;

	isDev = 1;
	putCookie('dev1mode', '1', 1);
	
	setCSS(0, '.dev1 { }');
	$('.col-arrow').removeClass('disabled');
}

function setDevOff()
{
	if (isDev == 0) return;

	isDev = 0;
	putCookie('dev1mode', '0', 1);
	
	setCSS(0, '.dev1 { display:none !important; }');
}

function setCSS(ruleIndex, ruleText)
{
	var styleText = document.getElementById('MyStyles').sheet;
	styleText.deleteRule(ruleIndex);
	
	var styleText = document.getElementById('MyStyles').sheet;
	styleText.insertRule(ruleText, ruleIndex);
	
	//console.log('setCSS: ' + ruleText)
}

function load_dev1()
{
	var dev1 = getCookie_words('dev1mode') == '1';
	if (dev1) setDevOn();
	//else setDevOff();
}
