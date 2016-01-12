package com.cityu.iw.util;

import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;

public class MailUtil {
	private static final Logger LOGGER = Logger.getLogger(MailUtil.class);
	private static final String MAIL_USERID = "ideaworks2016@163.com";
	private static final String MIAL_PASSWORD = "ideaworkscityu.";
	
	public static void sendMailTo(String p_email) throws MessagingException {
		//check param
		if(p_email.equals("")) {
			return ;
		}
		
		Properties props = new Properties();  
        // 开启debug调试  
        props.setProperty("mail.debug", "true");  
        // 发送服务器需要身份验证  
        props.setProperty("mail.smtp.auth", "true");  
        // 设置邮件服务器主机名  
        props.setProperty("mail.host", "smtp.163.com");  
        // 发送邮件协议名称  
        props.setProperty("mail.transport.protocol", "smtp");  
          
        // 设置环境信息  
        Session session = Session.getInstance(props);  
          
        // 创建邮件对象  
        Message msg = new MimeMessage(session);  
        msg.setSubject("JavaMail测试");  
        // 设置邮件内容  
        msg.setText("这是一封由JavaMail发送的邮件！");  
        // 设置发件人  
        msg.setFrom(new InternetAddress(MAIL_USERID));  
          
        Transport transport = session.getTransport();  
        // 连接邮件服务器  
        transport.connect(MAIL_USERID, MIAL_PASSWORD);  
        // 发送邮件  
        transport.sendMessage(msg, new Address[] {new InternetAddress(p_email)});  
        // 关闭连接  
        transport.close();  
	}
}
