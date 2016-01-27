package com.cityu.iw.util.mail;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.cityu.iw.util.Util;

public abstract class MailSender {
	private static MailSender instance;
	private static Properties mailProps;

	public static MailSender getInstance() {
		if(instance == null) {
			mailProps = Util.loadProperties("mail.properties");
			String senderClass = mailProps.getProperty("mail.sender");
			instance = getMailSenderByClassName(senderClass);
			
			if (instance == null) { //默认为gmail ssl
				instance = new GmailSenderSSL();
			}
		}
		
		return instance;
	}

	private static MailSender getMailSenderByClassName(String senderClass) {
		MailSender sender = null;
		try {
			sender = (MailSender) Class.forName(senderClass).newInstance();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return sender;
	}

	public abstract Properties prepare(Properties mailProps);

	public void send(MailBean mail) throws AddressException, MessagingException {
		Properties props = prepare(mailProps);

		final String userName = mailProps.getProperty("mail.username");
		final String password = mailProps.getProperty("mail.password");

		MyAuthenticator myauth = new MyAuthenticator(userName, password);
        Session session = Session.getDefaultInstance(props, myauth);
          
        // 创建邮件对象  
        Message msg = new MimeMessage(session);  
        
    	// 设置发件人
    	String from = mail.getFromAddress() == null ? mailProps.getProperty("mail.username") : mail.getFromAddress();
		msg.setFrom(new InternetAddress(from));
	
        // 设置收件人
        msg.addRecipient(Message.RecipientType.TO, new InternetAddress(mail.getToAddress()));
        // 设置主题
        msg.setSubject(mail.getSubject());

		Multipart multipart = new MimeMultipart();
		// 加入文本内容
		MimeBodyPart mimeBodyPart = new MimeBodyPart();
		// 让其支持HTML内容
		mimeBodyPart.setContent(mail.getContent(), "text/html;charset=utf8");
		multipart.addBodyPart(mimeBodyPart);
		msg.setContent(multipart);
		
        msg.saveChanges();
        Transport.send(msg);
	}

	public static void main(String[] args) throws AddressException, MessagingException {
		MailSender mailSender = MailSender.getInstance();
		MailBean mail = new MailBean();
		mail.setToAddress("nju_jackjia@163.com");
		mail.setSubject("测试邮件");
		mail.setContent("Test.");
		mailSender.send(mail);
	}

}

class MyAuthenticator extends javax.mail.Authenticator {
	private String strUser;
	private String strPwd;
	
	public MyAuthenticator(String user, String password) {
		this.strUser = user;
		this.strPwd = password;
	}

	protected PasswordAuthentication getPasswordAuthentication() {
		return new PasswordAuthentication(strUser, strPwd);
	}
}
