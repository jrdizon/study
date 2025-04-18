package com.example.study.models;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//lombok
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
//Jakarta
@Entity
@Table(name = "Users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="Id")
	public int Id;

	@Column(name="Username")
	public String Username;

	@Column(name="Firstname")
	public String Firstname;

	@Column(name="Lastname")
	public String Lastname;

	@Column(name="StartDate")
	public Date StartDate;

	@Column(name="EndDate")
	public Date EndDate;

	@Column(name="Email")
	public String Email;

	@Column(name="Address")
	public String Address;

	@Column(name="LoginDate")
	public Date LoginDate;

	@Column(name="GUID")
	public String GUID;

}
