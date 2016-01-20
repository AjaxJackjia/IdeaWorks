package com.cityu.iw.util;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

public class MailUtil {
	private static final Logger LOGGER = Logger.getLogger(MailUtil.class);
	//163mail 用户名密码 
	private static final String MAIL163_USERID = "ideaworks2016@163.com";
	private static final String MAIL163_PASSWORD = "twvxzbxzbioftwqo";
	//gmail 用户名密码
	private static final String GMAIL_USERID = "o2oconf@gmail.com";
	private static final String GMAIL_PASSWORD = "ideaworkscityu.";
	
	public static void sendMailTo(String p_email, JSONObject mailInfo) throws MessagingException, JSONException {
		//check param
		if(p_email.equals("")) {
			return ;
		}
		
//		//设置163mail配置
//		Properties props = get163MailProperties();
		//设置gmail配置
		Properties props = getGmailProperties(); 
		
        MyAuthenticator myauth = new MyAuthenticator(GMAIL_USERID, GMAIL_PASSWORD);
        Session session = Session.getDefaultInstance(props, myauth);
          
        // 创建邮件对象  
        Message msg = new MimeMessage(session);  
        // 设置发件人  
        msg.setFrom(new InternetAddress(GMAIL_USERID));
        // 设置收件人
        msg.addRecipient(Message.RecipientType.TO, new InternetAddress(p_email));
        // 设置主题
        msg.setSubject(mailInfo.getString("subject"));  
        // 设置邮件内容  
        msg.setText(mailInfo.getString("content"));
        
        msg.saveChanges();
        Transport.send(msg);
	}
	
	//获取163邮件服务设置
	private static Properties get163MailProperties() {
		Properties props = new Properties();  
        // 设置邮件服务器主机名  
        props.setProperty("mail.smtp.host", "smtp.163.com");
        // 发送服务器需要身份验证  
        props.setProperty("mail.smtp.auth", "true");
        
        return props;
	}
	
	//获取Gmail邮件服务设置 （GMail via SSL）
	private static Properties getGmailProperties() {
		Properties props = new Properties();  
		// 设置邮件服务器主机名
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.socketFactory.port", "465");
		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.port", "465");
		// 发送服务器需要身份验证 
		props.put("mail.smtp.auth", "true");
		
		return props;
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
