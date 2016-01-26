package com.cityu.iw.util.mail;

import java.util.ArrayList;
import java.util.List;

public class MailBean {

	// 邮件接收者，如果是多人，以,隔开
	private String toAddress = null;
	private String ccAddress = null;
	private String bccAddress = null;

	// 邮件主题
	private String subject = "No Subject";
	// 邮件内容
	private String content = null;
	// 邮件发送者
	private String fromAddress = null;

	// 附件路径列表
	private List<String> attachments = new ArrayList<String>();

	public void addAttachment(String filePath) {
		attachments.add(filePath);
	}

	public List<String> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<String> attachments) {
		this.attachments = attachments;
	}

	public String getFromAddress() {
		return fromAddress;
	}

	public void setFromAddress(String fromAddress) {
		this.fromAddress = fromAddress;
	}

	public String getToAddress() {
		return toAddress;
	}

	public void setToAddress(String toAddress) {
		this.toAddress = toAddress;
	}

	public String getCcAddress() {
		return ccAddress;
	}

	public void setCcAddress(String ccAddress) {
		this.ccAddress = ccAddress;
	}

	public String getBccAddress() {
		return bccAddress;
	}

	public void setBccAddress(String bccAddress) {
		this.bccAddress = bccAddress;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getContent() {
		return content
				+ "<br/><br/><br/>----------------------------------------<br/><font color='green'>This email is sent automatically. Please do not reply this email.</font>";
	}

	public void setContent(String content) {
		this.content = content;
	}

}
