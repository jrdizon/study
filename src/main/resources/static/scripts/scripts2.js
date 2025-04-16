// JavaScript by Joseph Dizon


// List Control

//var listDiv
//var listUrl;
//var listPageNo;
//var listPageTotal;
var listTotalRecords;
var listControlTop;
var $listSelected;
var listSelectedId;
var listLeftPos = 0;

function loadList(_Div, _Url)
{
	//listDiv = _Div;
	//listUrl = _Url;
	listControlTop = 140;
	$listSelected = null;
	listSelectedId = null;
	listLeftPos = 0;
	
	var $div = $(_Div);
	$div.attr('url',_Url);
	
	loadListPage($div, _Url);
}

function loadListPage($div, _Url)
{
	//$($div.find('th')[0]).addClass('loading');
	
	if (isDev)
		console.log('loadListPage_URL: ' + _Url);	

	$div.load(_Url, function(txtResponse, txtStatus, req){
		$('button.loading').removeClass('loading');
		if (txtStatus == 'error') {
			$div.html('<h2 class="red">Failed to load "'+_Url+'"</h2>' + txtResponse);
		}
		else
		{
			listInit($div);
		}
	});
}

/*function listGotoPageCurrent()
{
	listGotoPage(listPageNo);
}*/

function listPageReload()
{
	if ($('#ListControl').length == 0)
		return;

	var $div = $($('#ListControl')[0]).parent();
	var url = $div.attr('url');
	loadListPage($div, url);
}

function reloadList(THS)
{
	var $div = $(THS).parent().parent();
	var url = $div.attr('url');
	//$($(THS).parent().prev().find('th')[0]).addClass('loading');
	$(THS).addClass('loading');

	loadListPage($div, url);
}

function listGotoPage(THS) //, pageNo)
{
	var $div = $(THS).parent().parent();
	var url = $div.attr('url');
	var pageNo = $(THS).data('page');

	//if (pageNo != listPageNo) listSelectedId = null; //Clear selected row
	if(pageNo==undefined) pageNo=1;
	var p;

	if (url.includes('?')) p = '&page=';
	else p = '?page=';
	var url = url + p+(pageNo);
	
	//$($(THS).parent().prev().find('th')[0]).addClass('loading');
	$(THS).addClass('loading');
	loadListPage($div, url);
}

function listSortClick()
{
	var $sortTH = $(this);
	//$sortTH.addClass('loading');
	var colIx = $sortTH.parent().find('th').index($sortTH);
	//if ($sortTH.attr('colix') != undefined) colIx = $sortTH.attr('colix'); //old
	var colName = $sortTH.attr('cname');
	if (colName == undefined) colName = $sortTH.text().replace(/ /g,'_');
	var $sortTbl = $sortTH.closest('table');
	var sortIx = $sortTbl.attr('sortix');
	var sortAd = $sortTbl.attr('sortad');
	var newSortAd = 'ASC';
	//console.log('listSortClick colIx:'+colIx);
	if (colIx == sortIx && sortAd == 'ASC') newSortAd = 'DESC';
	
	var $div = $sortTH.closest('[url]');
	var url = $div.attr('url');
	if (url.split('sortcn').length > 1)
		url = url.split('sortcn')[0] + 'sortcn=' + colName + '&sortix=' + colIx + '&sortad=' + newSortAd;
	else if (url.includes('?'))
		url = url + '&sortcn=' + colName + '&sortix=' + colIx + '&sortad=' + newSortAd;
	else
		url = url + '?sortcn=' + colName + '&sortix=' + colIx + '&sortad=' + newSortAd;
		
	//console.log('listSortClick url:'+url);
	
	listLeftPos = $sortTbl.scrollLeft();
	$div.attr('url',url);
	loadListPage($div, url);
	//loadList($div, url);
}

//Download List from Table
function listDownloadClick(title, tableName, $divTable)
{
	openAskPopup("Download List",'Will download <b>'+title+'</b><br/>as a Microsoft Excel .xlsx file.<br/><br/>Are you sure?',
		function(){ listDownload(title, tableName, $divTable); });
}

function listDownload(title, tableName, $divTable)
{
	var $table = $divTable.find('table');
	var sortCn = '';
	var sortAd = '';
	if ($table.attr('sortcn') != null) {
		sortCn = $table.attr('sortcn');
		sortAd = $table.attr('sortad');
	}
	var sorts = '&sortcn=' + sortCn + '&sortad=' + sortAd;
	var url = '/_download?table=' + tableName + '&title=' + title + sorts;
	downloadFile(url);
	setTimeout(checkDownload, 1000);
}

function checkDownload()
{
	if ($('#TempFrame').contents().text()[0] == '!')
		openErrorPopup('Download Error', $('#TempFrame').contents().text().substring(1), noop);
}

function listSelectClick()
{
	$('.list .selected').removeClass('selected');
	if ($(this).hasClass('selectable')) {
		$listSelected = $(this);
		if ($listSelected.find(".data-id").length == 0)
		{
			alert('No element found with class "data-id".');
			return;
		}
		listSelectedId = $listSelected.find(".data-id").data('id');
		$listSelected.addClass('selected');
		$('#btnUpdate').prop('disabled',false);
		$('#btnDelete').prop('disabled',false);
		$('#btnApprove').prop('disabled',false);
		$('#btnReject').prop('disabled',false);
		$('#btnCancel').prop('disabled',true);
		if($listSelected.find('.email').text() == getCookie_email('username')){
			$('#btnDelete').prop('disabled',true);
			$('#btnApprove').prop('disabled',true);
			$('#btnReject').prop('disabled',true);
			$('#btnCancel').prop('disabled',false);
		}
		if($listSelected.find('.submitted_by').text() == getCookie_email('username')){
			$('#btnApprove').prop('disabled',true);
			$('#btnReject').prop('disabled',true);
			$('#btnCancel').prop('disabled',false);
		}
	}
	else {
		$('button.btnEdit').prop('disabled',true);
	}
}

function selectThisOnly(THS)
{
	var $THS = $(THS);
	$THS.parent().find('.selected').removeClass('selected');
	$THS.addClass('selected');
}

function listInit($div)
{
	//var $div = $(listDiv);
	
	if ($div == undefined) {
		console.log('No list found.');
		return; //Exit if no list in the page
	}

	$div.find('td.col-status').each(function(){ $(this).addClass($(this).text().replace(/ /g,'-')) })
	var $divTbl = $div.find('table');
	var $cont = $div.find('#ListControl');

	//var $listParent = $('.list').parent();
	//var divTop = $listParent.offset().top + $listParent.height();
	//if (divTop > listControlTop) listControlTop = divTop;
	//$cont.css('margin-top', (listControlTop - divTop + 4)+'px');
	listTotalRecords = $cont.data('totalrecords');
	if (listTotalRecords == 0)
	{
		$cont.find('.totalRec').html('<red style="font-size:1.2em;">No records found.</red>');
	}
	else
	{
		var listPageNo = $cont.data('pageno');
		var listPageTotal = $cont.data('totalpages');
		//$cont.find('.pageOf').text('Page ' + listPageNo + ' of ' + listPageTotal);
		//$cont.find('.totalRec').text('Total Records: ' + listTotalRecords);
		if (listPageNo > 1)
		{
			$cont.find('.btnListPagePrev').prop('disabled',false);
		}
		if (listPageNo < listPageTotal)
		{
			$cont.find('.btnListPageNext').prop('disabled',false);
		}
		$div.find('tr').click(function(){ listSelectedId = $(this).find('.itemid').data('itemid');});
		$div.find('td[data-id='+listSelectedId+']').parent().addClass('selected');

		//When table is sortable
		if ($divTbl.hasClass('sortable')) { //If table is sortable
			$divTbl.find('th').unbind(); //Remove previous event handler
			$divTbl.find('th:not([no-sort])').click(listSortClick);
			var sortIx= $divTbl.attr('sortix');
			var sortAd= $divTbl.attr('sortad');
			
			//if ($divTbl.find('th[colix='+sortIx+']').length > 0)
			//	$divTbl.find('th[colix='+sortIx+']').addClass('sort-'+sortAd); //old
			//else
				$($divTbl.find('th')[sortIx]).addClass('sort-'+sortAd); //new
			
			if (listLeftPos > 0) //Preserve left scroll position of the table
				$divTbl.scrollLeft(listLeftPos);
		}
	}
	
	var $editCont = $('.editControl');
	if ($editCont.length > 0)
	{
		//if (!$divTbl.is('[upload]')) { //no upload property
			//$editCont.find('.btnUpload').remove();
		$cont.find('button').addClass('small');
		$editCont.find('button').addClass('btnEdit');
		$cont.append($editCont.html());
		$editCont.remove();
		if ($divTbl.is('[upload]')) { //no upload property
			var btnUp = $('#BtnUpload').html();
			$cont.append(btnUp);
			$cont.find('.btnUpload').prop('disabled',false);
		}
	}
	var $downloadCont = $('#DownloadControl');
	if ($downloadCont.length > 0)
	{
		$cont.append($downloadCont.html());
		$downloadCont.remove();
	}
	$('.otherControl button').each(function(){ $(this).detach().appendTo($cont)});
	$div.find('.selectable').click(listSelectClick);
}


// Upload file

var br_Title;
var br_DropZone;
var br_Filename;
function openUploadPopup(title)
{
	br_DropZone = $('#br_DropZone');

	br_Title = title;
	if (title)
		$('#PopupUpload .nextTitle').text(' - '+title);
	else
		$('#PopupUpload .nextTitle').text('');

	dzone_Init();
	br_DropZone.find('.dzAction').val('Append');
	br_DropZone.find('.dzPurpose').val('');
	//br_DropZone.find('.dzApprover').val('');
/*
	$cont = br_DropZone.find('.dropzone-container');
	$cont.removeClass('over');
	$cont.removeClass('file');
	$cont.addClass('drop');
	br_DropZone.find('.dz-label').text('DROP FILE HERE');
	
    br_DropZone.find('.dropzone').val(''); //Clear the input
	br_DropZone.find('.dzAction').val('Append');
	br_DropZone.find('.dzPurpose').val('');
	//br_DropZone.find('.dzApprover').val('');

	$('.dropzone').prop('disabled', false);
	$('#DzBtnUpload').prop('disabled',true);
	*/
	openPopup('#PopupUpload');
}

function dzone_Init()
{
	var $cont = br_DropZone.find('.dropzone-container');
	$cont.removeClass('over');
	$cont.removeClass('file');
	$cont.addClass('drop');
	br_DropZone.find('.dz-label').text('DROP FILE HERE');
	
    br_DropZone.find('.dropzone').val(''); //Clear the input

	$('.dropzone').prop('disabled', false);
	$('#DzBtnUpload').prop('disabled',true);
}

function dzone_DragOver(ev, THS) {
    ev.preventDefault();
    $(THS).parent().addClass('over'); //.dropzone-container
}

function dzone_DragLeave(ev, THS) {
    ev.preventDefault();
    $(THS).parent().removeClass('over'); //.dropzone-container
}

function dzone_Change(ev, THS) {
    //if (THS.files[0].size > 307200) {
    //    askError("Upload File Too Big","File is too big!<br />Upload file size limit is 30K.");
    //    return;
    //};
    br_Filename = $(THS).val().replace('C:\\fakepath\\', '');
	
	$cont = br_DropZone.find('.dropzone-container');
	if (br_Filename != '') {
		$cont.removeClass('over');
		$cont.removeClass('drop');
		$cont.addClass('file');
		
		br_DropZone.find('.dz-label').text(br_Filename);

		$('#DzBtnUpload').prop('disabled',false);
	}
	else
		dzone_Init();
}

function br_uploadFile() {

	var inv = ''; 
	var purpose = br_DropZone.find('.dzPurpose').val();

	/*
	var approver = br_DropZone.find('.dzApprover').val();
	
	if (purpose == '' && approver == '')
		inv += 'Purpose and Approver are required.';
	else if (purpose == '' && approver != '')
		inv += 'Purpose is required.';
	else if (purpose != '' && approver == '')
		inv += 'Approver is required.';
	else if (!validate_Email(approver))
		inv += 'Invalid Approver email.';
	else if (approver.toLowerCase() == $('#UserName').text().toLowerCase())
		inv += 'Invalid Approver User Email!<br/>User cannot be approver.<br/><br/>Please select a different approver.';
	*/
	if (purpose == '')
		inv += 'Purpose is required.';
		
	if (inv != '') {
		openErrorPopup('Invalid Parameters', inv);
		return
	}

	openStatusPopup('Uploading File', imgLoading+' Uploading file...');

    var url = '/_uploadfile?title='+encodeURIComponent(br_Title);
	console.log('Upload URL: '+url);

    //var formData = new FormData(br_DropZone.parent()[0]); //new FormData($('#br_form')[0]);
    var formId = br_DropZone.find('form').attr('id');
    var formData = new FormData(document.getElementById(formId));
    $('.dropzone').prop('disabled', true); //DONOT remove this. Upload will fail when removed.

    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data, status, jqXHR) {
            //brUploadEnd();
            //alert(data);
			closePopup(); //Close Status popup
			$('.dropzone').prop('disabled', false);
            if (data[0] == '!') {
                //br_DropZone.find('.br_dropzone_Failed').show();
                //br_DropZone.find('.br_dropzone_Failed').fadeOut(5000);
                openErrorPopup('Upload Error', data.substring(1));
                return;
            }
			if (data[0] == '<') {
                //br_DropZone.find('.br_dropzone_Failed').show();
                //br_DropZone.find('.br_dropzone_Failed').fadeOut(5000);
                openErrorPopup('Upload File Error', data);
                return;
            }
            else {
				openInfoPopup('Upload Completed', data, closePopupAll);
            }
        },
        error: function (xhr) {
			//alert('Error: '+xhr.statusText);
			closePopup(); //Close Status popup
			$('.dropzone').prop('disabled', false);
            br_DropZone.find('.br_dropzone_Failed').show();
            br_DropZone.find('.br_dropzone_Failed').fadeOut(5000);

            var err = 'A server error has occured while uploading the file.<br/>File: ' + br_Filename;
            openErrorPopup('Upload Error', err);
        }
    });
}

/*function uploadFile() {
    var url = '/_uploadfile';
	var formId = br_DropZone.parent().attr('id');
    var formData = new FormData(document.getElementById(formId));
		fetch(url, {
		method: "POST", 
		body: formData
		})
    .then((response) => response.text())
    .then((text) => {
      openErrorPopup('Drop File Error', text);
    });

  if (response.status == 200) {
    alert("File successfully uploaded."+ response.text);
  }
  else {
	alert("File ??.");
  }
}*/
/*
async function uploadFile() {
    var url = '/_uploadfile';
	var formId = br_DropZone.parent().attr('id');
    var formData = new FormData(document.getElementById(formId));

  let response = await fetch(url, {
    method: "POST", 
    body: formData
  }); 

  if (response.status == 200) {
    alert("File successfully uploaded."+ response.text());
  }
  else {
	alert("File ??."+ response.text());
  }
}*/

/*function brUploadEnd() {
    //close_Popup();
    br_DropZone.removeClass('dropzone-busy');
    br_DropZone.find('.dropzone').val('');
    br_DropZone.find('img').hide();
    br_DropZone.find('.dropzone-title').text('Drop Files Here');
    $('.dropzone').prop('disabled', false);
    //$('.dropzone').show();
    //brlap_dragout(br_DropZone);
}*/
