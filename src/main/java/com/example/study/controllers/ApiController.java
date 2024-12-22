package com.example.study.controllers;

//import org.hibernate.annotations.processing.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
//import org.springframework.web.bind.annotation.PathVariable;

import com.example.study.models.Calculation;
import com.example.study.services.CommonServices;
import com.fasterxml.jackson.databind.ObjectMapper;
//import jakarta.validation.Valid;

@RestController
public class ApiController {

    @Autowired
    CommonServices commonSvc;

    @Autowired
    ObjectMapper objectMapper; //Json converter 

    @Value("${spring.application.name}")
	private String spring_application_name;

    @GetMapping("/api/check")
    @ResponseBody
	public String check_API() {
		String output = spring_application_name; // + " Build "+Common.formatDateTime(buildProperties.getTime());
		return output;
	}

    @RequestMapping(value = "/api/getresult", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    String get_Result()
    {
        String result = "result is ok";
        String json;
        try {
            json = objectMapper.writeValueAsString(result); //Convert to json
        }
        catch(Exception ex) {
            json = Error_Json(ex.getMessage()); //"Error: " + e.getMessage();
        }
        return json;
    }

    @RequestMapping(value = "/api/startcalc/{calctype}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	String startCalc(
            @PathVariable("calctype") String calctype,
			@RequestParam(required = true, defaultValue = "") int runid )
    {
        String json;
		try {
            Calculation calc = new Calculation();
            calc.ID = runid;
            calc.calcType = calctype;

            json = commonSvc.create_JSON(calc);

            return json;
		}
		catch(Exception e)
		{
			return Error_Json(e.getMessage()); //"Error: " + e.getMessage();
		}
	}

    @PostMapping("/api/execute")
    String create_JSON(
            @RequestParam int id,
            @RequestParam String desc)
    {
        Object[] obj = new Object[]{id, desc};
        return commonSvc.create_JSON(obj);
    }

    private String Error_Json(String _Msg)
	{
		return  "{ \"Error\":\"" + _Msg + "\"}"; //"Start Calc failed. Error: " + e.getMessage();
	}
}
