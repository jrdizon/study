package com.example.study.services;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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

	public User getUser(int _Id)
	{
		String sql = "select * from [Users] where id = ?";

		Map<String, Object> dataSet = jdbcTemplate.queryForMap(sql, new Object[]{ _Id });

		User usr = new User();
		usr.Id = (int)dataSet.get("Id");
		usr.Username = (String)dataSet.get("Username");
		usr.Firstname = (String)dataSet.get("Firstname");
		usr.Lastname = (String)dataSet.get("Lastname");
		usr.Email = (String)dataSet.get("Email");
		usr.Address = (String)dataSet.get("Address");
		usr.StartDate = (Date)dataSet.get("StartDate");
		usr.EndDate = (Date)dataSet.get("EndDate");

		return usr;
	}

	public String updateUser(
			int _Id, String _username, String _FirstName, String _LastName, String _email, String _address, String _StartDate, String _EndDate
	)
	{
		String sql = "declare @id int;" +
			" set @id = ?" +
			" update [Users] set" +
			" [Username] = ?," +
			" [Firstname] = ?," +
			" [Lastname] = ?," +
			" [Email] = ?," +
			" [Address] = ?," +
			" [StartDate] = ?," +
			" [EndDate] = ?" + //
			" from [Users] where Id = @id";

		try {
			jdbcTemplate.update(sql, new Object[]{ _Id, _username, _FirstName, _LastName, _email, _address, _StartDate, _EndDate });
			return "ok";
		}
		catch(Exception ex) {
			return "Error: " + ex.getMessage();
		}
	}
	
	private User load_User(ResultSet rs) throws SQLException
	{
		User rec = new User();

		rec.Id = rs.getInt("Id");
		rec.Username = rs.getString("Username");
		rec.Firstname = rs.getString("Firstname");
		rec.Lastname = rs.getString("Lastname");
		rec.Email = rs.getString("Email");
		rec.StartDate = rs.getDate("StartDate");
		rec.EndDate = rs.getDate("EndDate");
		rec.Address = rs.getString("Address");
		rec.LoginDate = rs.getDate("LoginDate");
		rec.GUID = rs.getString("GUID");
		return rec;
	}

}
