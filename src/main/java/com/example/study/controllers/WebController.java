package com.example.study.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.study.models.Calculation;
import com.example.study.models.User;
import com.example.study.services.CommonServices;
import com.example.study.services.UserServices;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Controller
public class WebController {

	@Autowired
	UserServices userServices;

    @Autowired
    CommonServices commonSvc;

    @GetMapping("/")
    String homePage(Model model, HttpServletResponse response)
    {
		model.addAttribute("username", "test_userName");
		model.addAttribute("fullname", "test_fullName");
		
	    model.addAttribute("active", false);

		Cookie cookieUser = new Cookie("username", "test_userName");
		cookieUser.setHttpOnly(false);
		cookieUser.setSecure(true);
		response.addCookie(cookieUser);
        model.addAttribute("appName", "Study");
        model.addAttribute("appType", "BCAR");
        /*if (buildProperties != null && buildProperties.getTime() != null) {
        	model.addAttribute("version", "Build "+Common.formatDateTime(buildProperties.getTime()));
        	model.addAttribute("build", Common.formatBuild(buildProperties.getTime()));
        	model.addAttribute("uptime", upTime.toString());
        }
        else {
        	model.addAttribute("version", "No build info");
        	model.addAttribute("build", Common.formatBuild(new Date()));
        	model.addAttribute("uptime", "Local");
        }*/
    	model.addAttribute("version", "No build info");
    	model.addAttribute("build", commonSvc.formatDateTime(new Date())); //formatBuild(new Date()
    	model.addAttribute("uptime", "Local");
  
        return "home";
    }
    
    @GetMapping("/listusers")
    String listAll_Users(Model model)
    {
    	List<User> lstUsers = userServices.getList_All();

    	model.addAttribute("users",lstUsers);

        return "users_list";
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

    @GetMapping("/test")
    @ResponseBody
    String return_Test()
    {
        return "test";
    }
}
