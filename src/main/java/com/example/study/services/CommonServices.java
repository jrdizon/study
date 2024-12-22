package com.example.study.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
}
