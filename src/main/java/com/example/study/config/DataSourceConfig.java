package com.example.study.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataSourceConfig {

	//@Value("${spring.datasource.driverClassName}")
	String dbDriverClass = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
	
	@Value("${spring.datasource.url}")
	String dbUrl;

	@Value("${spring.datasource.username}")
	String dbUsername;

	@Value("${spring.datasource.password}")
	String dbPassword;

	private static DataSource dataSource;

	@Bean(name="jdbcTemplate")
	JdbcTemplate getJdbcTemplate() {
		dataSource = getDataSource();
		JdbcTemplate template = new JdbcTemplate();
		template.setDataSource(dataSource);
		//Common.logInfo("JDBC connection created");
		return template;
	}

    @Bean
    DataSource getDataSource() {
        DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
        dataSourceBuilder.driverClassName(dbDriverClass);
        dataSourceBuilder.url(dbUrl);
        dataSourceBuilder.username(dbUsername);
        dataSourceBuilder.password(dbPassword);
        return dataSourceBuilder.build();
    }
}
