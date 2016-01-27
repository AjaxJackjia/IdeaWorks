package com.cityu.iw.util.mail;

import java.util.Properties;

public class GmailSenderSSL extends MailSender {

	@Override
	public Properties prepare(Properties mailProps) {
		Properties props = new Properties();
		
		props.put("mail.smtp.auth", mailProps.getProperty("mail.gmail.ssl.smtp.auth"));
		props.put("mail.smtp.socketFactory.port", mailProps.getProperty("mail.gmail.ssl.smtp.socketFactory.port"));
		props.put("mail.smtp.socketFactory.class", mailProps.getProperty("mail.gmail.ssl.smtp.socketFactory.class"));
		props.put("mail.smtp.host", mailProps.getProperty("mail.gmail.ssl.smtp.host"));
		props.put("mail.smtp.port", mailProps.getProperty("mail.gmail.ssl.smtp.port"));
		
		return props;
	}
	
}
