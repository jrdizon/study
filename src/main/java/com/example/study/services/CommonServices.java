package com.example.study.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class CommonServices {
    @Autowired
    ObjectMapper objectMapper; //Json converter

    public String create_JSON(Object input)
    {
        try {
            return objectMapper.writeValueAsString(input);
        }
        catch(Exception e) {
            return Error_Json(e.getMessage());
        }
    }

    private String Error_Json(String _Msg)
    {
        return  "{ \"Error\":\"" + _Msg + "\"}";
    }


	@Autowired
	public static JdbcTemplate jdbcTemplate;

	public static String AppName = "ApplicationService";

	/* Calc Types:
	 * CRM+SA +BCAR_2024 -- All STD_*
	 * CRM+AIRB -- All IRB + STD_SEC_SA
	 * SACCR +BCAR_2024 -- All SACCR
	 * 
	 * BP2-441
	 * 1. SA +<Reporting Template> -- All STD same as CRM+SA
	 * 2. SA+IRB +<Reporting Template> -- All STD and IRB
	 * 3. SEC +<Reporting Template> -- Only STD_SEC_SA
	 * SACCR +<Reporting Template> -- All SACCR
	 */
	public static final String calcType_SA = "SA"; //All STD
	public static final String calcType_IRB = "IRB"; //All IRB + SEC
	public static final String calcType_IRB0 = "IRB0"; //All IRB only for RISK team
	public static final String calcType_SACCR = "SACCR"; //All SACCR
	public static final String calcType_SAIRB = "SA+IRB"; //All STD and all IRB
	public static final String calcType_SEC = "SEC"; //Only STD_SEC_SA

	public static final String ANSI_RESET = "\u001B[0m";
	public static final String ANSI_BLACK = "\u001B[30m";
	public static final String ANSI_RED = "\u001B[31m";
	public static final String ANSI_GREEN = "\u001B[92m"; //"\\033[0;32m"; //"\u001B[32m";
	public static final String ANSI_DARKGREEN = "\u001B[32m"; //"\\033[0;32m"; //"\u001B[32m";
	public static final String ANSI_YELLOW = "\u001B[33m";
	public static final String ANSI_BLUE = "\u001B[34m";
	public static final String ANSI_PURPLE = "\u001B[35m";
	public static final String ANSI_CYAN = "\u001B[36m";
	public static final String ANSI_WHITE = "\u001B[37m";

	static final String FORMAT_DateTime = "yyyy-MM-dd h:mm:ss a";
	
	public static String sanitizeWords(String _Str)
	{
		if (_Str == null)
			return null;

		return _Str.replaceAll("[^a-zA-Z0-9.@_+\\-?!& ]", "");
	}

	public static String sanitizeEmail(String _Str)
	{
		if (_Str == null)
			return null;

		return _Str.replaceAll("[^a-zA-Z0-9.@_\\-]", "");
	}
	
	
	public static String getCurrentDateTime()
	{
		//Format current datetime
		String strDateFormat = "yyyy-MM-dd HH:mm:ss.SSS";
		return getCurrentDateTime(strDateFormat);
	}
	
	public static String getCurrentDateTime(String strDateFormat)
	{
		return formatDate(new Date(), strDateFormat);
	}
	
	public static String formatDate(Date date)
	{
		return formatDate(date, "yyyy-MM-dd");
	}
	
	public static String formatDateTime(Date date)
	{
		return formatDate(date, FORMAT_DateTime);
	}
	
	public static String formatDateTime(LocalDateTime localDateTime)
	{
		return localDateTime.format(DateTimeFormatter.ofPattern(FORMAT_DateTime));
	}
	
	public static String formatDate(Date date, String strDateFormat)
	{
		DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
		String formattedDatetime = dateFormat.format(date);
		//System.out.println("Current time of the day using Date - 12 hour format: " + formattedDate);
		
		return formattedDatetime;
	}
	
	public static String formatDateTime(Instant instant)
	{	
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(FORMAT_DateTime).withZone(ZoneId.systemDefault());
		
		String formattedDatetime = formatter.format(instant);
		//System.out.println("Current time of the day using Date - 12 hour format: " + formattedDate);
		
		return formattedDatetime;
	}

	/*public static String formatBuild(Date date)
	{
		String strDateFormat = "yyyyMMdd.HH.mm.ss";
		DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
		String formattedDatetime = dateFormat.format(date);
		//System.out.println("Current time of the day using Date - 12 hour format: " + formattedDate);
		
		return formattedDatetime;
	}*/

	public static String formatBuild(Instant instant)
	{
		String strDateFormat = "yyyyMMdd.HH.mm.ss";
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(strDateFormat).withZone(ZoneId.systemDefault());
		
		String formattedDatetime = formatter.format(instant);
		//System.out.println("Current time of the day using Date - 12 hour format: " + formattedDate);
		
		return formattedDatetime;
	}
	
	public static String elapsedTime(Date _StartDate, Date _EndDate)
	{
		if (_StartDate == null ||_EndDate == null)
		{
			return "--";
		}
		
		long millis = _EndDate.getTime() - _StartDate.getTime();
		
		final long hr = TimeUnit.MILLISECONDS.toHours(millis);
		millis = millis - TimeUnit.HOURS.toMillis(hr);
		final long min = TimeUnit.MILLISECONDS.toMinutes(millis);
		millis = millis - TimeUnit.MINUTES.toMillis(min);
		final long sec = TimeUnit.MILLISECONDS.toSeconds(millis);
		
		return String.format("%02d:%02d:%02d", hr, min, sec);
	}
	
	/*public static long getDaysBetween(Date _StartDate, Date _EndDate) {
		long diff = _EndDate.getTime() - _StartDate.getTime();
		return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
	}*/

	/*public static LocalDateTime getLocalDateTime(Date _Date) {
		return LocalDateTime.ofInstant(_Date.toInstant(), ZoneId.systemDefault());
	}*/

	public static void logInfo(String _Message)
	{
		//char esc = '\u001B'; //27;
		//System.out.print(esc);
		//System.out.print("[92m");
		
		//System.out.println(ANSI_GREEN + getCurrentDateTime() + "  ===== " + _Message + ANSI_RESET);
		//logInfo0("  ===== " + _Message);
		System.out.println(ANSI_BLUE + "  ===== " + _Message + ANSI_BLACK); //ANSI_RESET); //ANSI_BLAC does not workK
	}
	
	public static void logInfoGr(String _Message) //Log Info GREEN
	{
		logInfo0(_Message);
	}
	public static void logInfo0(String _Message)
	{
		//char esc = '\u001B'; //27;
		//System.out.print(esc);
		//System.out.print("[92m");
		
		System.out.println(ANSI_DARKGREEN + getCurrentDateTime() + _Message + ANSI_BLACK);
	}
	
	public static void logError(String _Message)
	{
		System.out.println(ANSI_RED + getCurrentDateTime() + "  ===!! Error: " + _Message + ANSI_BLACK);
		//log.error(_Message);
	}
	
	/*public static void save_SystemError(String _ErrorData, String _ErrorMsg)
	{
		logError(_ErrorMsg);

		if (_ErrorMsg != null && _ErrorMsg.length() > 4000)
			_ErrorMsg = "+" + _ErrorMsg.substring(_ErrorMsg.length() - 3900);
		
		String sql = "insert into Calculation_Run_Errors ( [Calc_Id], [Instrument_Index], [Result_Json], [Log_time], [Error] )"
				+ " values ( 0, 0, ?, ?, ?)";
		jdbcTemplate.update(sql, new Object[]{  _ErrorData, new Date(), _ErrorMsg.replace("\"", "") });
	}*/


/// Controller Utilities
/*
	public static Pageable getPageable(int _PageNo, int pageSize)
    {
        int pNo = _PageNo-1;
        if (pNo < 0) pNo = 0;
        Pageable paging = PageRequest.of(pNo, pageSize);

        return paging;
    }
	
	public static Pageable getPageable(int _PageNo, int pageSize, String _SortCol1, String _SortCol2, int _SortIx, String _SortAd)
	{
		int pNo = _PageNo - 1;
		if (pNo < 0) pNo = 0;
		
		Pageable paging;
		if (_SortCol2.equalsIgnoreCase(_SortCol1))
			paging = PageRequest.of(pNo, pageSize, Sort.by(_SortAd.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, _SortCol1));
		else
			paging = PageRequest.of(pNo, pageSize, Sort.by(_SortAd.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, _SortCol1, _SortCol2));

		return paging;
	}

    //Create a ModelAndView object for List using the input parameters
	public static ModelAndView returnMAV_List_Sort(String _Template, Page _Page, int _SortIX, String _SortCN, String _SortAD, String _Permissions)
    {
    	ModelAndView mav = returnMAV_List(_Template, _Page, _Permissions);
    	
		mav.addObject("sortix", _SortIX);
		mav.addObject("sortcn", _SortCN);
		mav.addObject("sortad", _SortAD);
		
		return mav;
    }
	
	public static ModelAndView returnMAV_List(String _Template, Page _Page, String _Permissions)
    {
    	ModelAndView mav = new ModelAndView(_Template);
    	
    	List listModel = _Page.getContent();
    	int cnt = listModel.size();

    	//mav.addObject("count",cnt);
    	//mav.addObject("data",listModel);
    	//mav.addObject("currentPage",_Page.getNumber()+1);
    	//mav.addObject("totalRecords",_Page.getTotalElements());
    	//mav.addObject("totalPages",_Page.getTotalPages());

    	//mav.addObject("permissions", _Permissions);

    	//mav.addObject("_DateFormat", "MM-dd-yyyy");
    	////mav.addObject("permissions", "VAUDSP"); //temporary while permissions is not fixed //permissions);
    	
    	//return mav;
    	
    	return returnMAV_List(mav, listModel, cnt, _Page.getNumber()+1, _Page.getTotalPages(), _Page.getTotalElements(), _Permissions);
    }
    
	public static ModelAndView returnMAV_List(String _Template, List _ListModel, int _ListSize, int _CurrentPage, int _TotalPages, int _TotalRecords, String _Permissions)
    {
    	ModelAndView mav = new ModelAndView(_Template);
    	
    	return returnMAV_List(mav, _ListModel, _ListSize, _CurrentPage, _TotalPages, _TotalRecords, _Permissions);
    }
	
	public static ModelAndView returnMAV_List(ModelAndView mav, List _ListModel, int _ListSize, int _CurrentPage, int _TotalPages, long _TotalRecords, String _Permissions)
    {
    	mav.addObject("count",_ListSize);
    	mav.addObject("data",_ListModel);
    	mav.addObject("currentPage",_CurrentPage);
    	mav.addObject("totalRecords",_TotalRecords);
    	mav.addObject("totalPages",_TotalPages);

    	mav.addObject("permissions", _Permissions);
    	//mav.addObject("permissions", "VAUDSP"); //temporary while permissions is not fixed //permissions);

    	mav.addObject("_DateFormat", "MM-dd-yyyy");
    	
    	return mav;
    }
    
	public static ModelAndView returnMAV_Error(String _Header, String _ErrorMessage)
    {
    	ModelAndView mav = new ModelAndView("error");
    	
    	mav.addObject("error",_Header);
    	mav.addObject("message",_ErrorMessage);
    	mav.addObject("causeby",null);

    	mav.addObject("_DateFormat", "MM-dd-yyyy");
    	//mav.addObject("permissions", "VAUDSP"); //temporary while permissions is not fixed //permissions);
    	
    	return mav;
    }
*/
}
