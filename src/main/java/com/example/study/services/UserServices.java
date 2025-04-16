package com.example.study.services;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.study.models.User;

@Service
public class UserServices {

	@Autowired
	JdbcTemplate jdbcTemplate;

	public List<User> getList_All()
	{
		List<User> lstUsers = new ArrayList<User>();
		
		String sql = "select * from [Users] order by Username";
		
		//lstUsers = jdbcTemplate.query(sql,new BeanPropertyRowMapper(User.class));
		lstUsers = jdbcTemplate.query(sql, (rs, rowNum) -> load_User(rs));

		return lstUsers;
	}
	
	private User load_User(ResultSet rs) throws SQLException
	{
		User rec = new User();

		rec.Id = rs.getInt("Id");
		rec.Username = rs.getString("Username");
		rec.Firstname = rs.getString("Firstname");
		rec.Lastname = rs.getString("Lastname");
		rec.StartDate = rs.getDate("StartDate");
		rec.GUID = rs.getString("GUID");
		return rec;
	}

}
