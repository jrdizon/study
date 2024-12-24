package com.example.study.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.study.models.Calculation;
import com.example.study.services.CommonServices;

import java.time.LocalDateTime;

@Controller
public class WebController {

    @Autowired
    CommonServices commonSvc;

    @GetMapping("/")
    String return_Page()
    {
        return "page";
    }

    @GetMapping("/test")
    @ResponseBody
    String return_Test()
    {
        return "test";
    }

    @GetMapping("/start_calculation/{calctype}")
	String startCalculation(
            Model model,
            @PathVariable("calctype") String calctype,
			@RequestParam(required = true, defaultValue = "") int runid,
            @RequestParam(required = true, defaultValue = "") String description )
    {
		try {
            Calculation calc = new Calculation();
            calc.ID = runid;
            calc.calcType = calctype;
            calc.description = description;
            calc.submittedOn = LocalDateTime.now();

            model.addAttribute("calc",calc);
		}
		catch(Exception e)
		{
			model.addAttribute("error",e.getMessage());
		}
        return "calculation"; //resources/templates/calculation.html
	}
}
