package com.cityu.iw.util.mail;

import java.util.Properties;

public class GmailSenderSSL extends MailSender {

	@Override
	public Properties prepare(Properties mailProps) {
		Properties props = new Properties();
		
		props.put("mail.smtp.auth", mailProps.getProperty("mail.gmail.tls.smtp.auth"));
		props.put("mail.smtp.starttls.enable", mailProps.getProperty("mail.gmail.tls.smtp.starttls.enable"));
		props.put("mail.smtp.host", mailProps.getProperty("mail.gmail.tls.smtp.host"));
		props.put("mail.smtp.port", mailProps.getProperty("mail.gmail.tls.smtp.port"));
		
		return props;
	}
	
}
