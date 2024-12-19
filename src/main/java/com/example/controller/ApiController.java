package com.example.controller;

import org.hibernate.annotations.processing.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.services.CommonServices;
import com.fasterxml.jackson.databind.ObjectMapper;
//import jakarta.validation.Valid;

@RestController
public class ApiController {

    @Autowired
    CommonServices commonSvc;

    @Autowired
    ObjectMapper objectMapper; //Json converter 

    @GetMapping("/api/hello")
    String return_Hello()
    {
        return "Hello!";
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

    @RequestMapping(value = "/api/startcalc/{calctype}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	String startCalc(
			//@Valid @Pattern (regexp = "^[a-zA-Z0-9.@_+\\-]*$") @PathVariable("calctype") String calcType, //AIRB, SA
			@RequestParam(required = true, defaultValue = "") int runid )
    {
		try {
            return "{ \"run_id\":\"" + runid + "\"}";
		}
		catch(Exception e)
		{
			return Error_Json(e.getMessage()); //"Error: " + e.getMessage();
		}
	}

    private String Error_Json(String _Msg)
	{
		return  "{ \"Error\":\"" + _Msg + "\"}"; //"Start Calc failed. Error: " + e.getMessage();
	}
}
