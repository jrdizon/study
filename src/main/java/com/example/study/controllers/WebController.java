package com.example.study.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WebController {

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
}
