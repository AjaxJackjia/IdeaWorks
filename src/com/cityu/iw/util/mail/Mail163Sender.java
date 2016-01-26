package com.cityu.iw.util.mail;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class Mail163Sender extends MailSender {

	@Override
	public Properties prepare(Properties mailProps) {
		Properties props = new Properties();
		props.put("mail.smtp.host", mailProps.getProperty("mail.163.smtp.host"));
		props.put("mail.smtp.auth", mailProps.getProperty("mail.163.smtp.auth"));
		
		return props;
	}

}
