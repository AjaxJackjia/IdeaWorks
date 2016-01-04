package com.cityu.iw.util;

import java.net.URL;
import java.security.MessageDigest;

public class Util {
	public static String md5(String input) {
		try{
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			byte[] inputByteArray = input.getBytes();
			messageDigest.update(inputByteArray);
			byte[] resultByteArray = messageDigest.digest();
			return byteArrayToHex(resultByteArray);
		}catch(Exception ex) {
			ex.printStackTrace();
		}
		
		return null;
	}
	
	private static String byteArrayToHex(byte[] byteArray) {
		char[] hexDigits = {'0','1','2','3','4','5','6','7','8','9', 'a','b','c','d','e','f' };
		char[] resultCharArray = new char[byteArray.length * 2];
		int index = 0;
		for (byte b : byteArray) {
		     resultCharArray[index++] = hexDigits[b>>> 4 & 0xf];
		     resultCharArray[index++] = hexDigits[b& 0xf];
		}
		
		return new String(resultCharArray);
	}
}