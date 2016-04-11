package com.cityu.iw.util;

import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Set;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;

import org.apache.log4j.Logger;

import com.cityu.iw.api.user.MailService;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.core.util.MultivaluedMapImpl;

public class RequestUtil {
	private static final Logger LOGGER = Logger.getLogger(RequestUtil.class);

	//test
	public static void main(String[] args) throws Exception {
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("toEmail", "1111111");
		params.put("newPwd", "1111111");
		postWithoutResult("https://127.0.0.1:8443/IdeaWorks/api/users/jackjia/mail/forget-password", params);
	}
	
	/*
	 * exposed interfaces
	 * */
	public static void postWithoutResult(String url, HashMap<String, String> params) throws Exception {
		//get client
		Client client = getSSLClient();
	    WebResource webResource = client.resource(url);
	    WebResource.Builder builder = webResource.getRequestBuilder();
	    
	    //token cookie
 		//builder = builder.cookie(new Cookie("token", token));
 		
	    //request params
 		MultivaluedMap formData = new MultivaluedMapImpl();
 		if(params != null) {
 			Set<String> keys = params.keySet();
 	 		for(String key : keys) {
 	 			formData.add(key, params.get(key));
 	 		}
 		}
 		
 		//send request
 		ClientResponse response = builder.type(MediaType.APPLICATION_FORM_URLENCODED_TYPE).post(ClientResponse.class, formData);
 		
 		if ((response.getStatus() / 100) == 2) {
 			//LOGGER.info("send request ok, " + response.getStatus());
 		}else{
 			//LOGGER.info("send request fail, " + response.getStatus());
 		}
	}
	
	public static void postWithResult(String url) throws Exception {
		//todo
	}
	
	public static void get(String url) throws Exception {
		//todo
	}
	
	
	/*
	 * private methods
	 * */
	// Create a trust manager that does not validate certificate chains
	private static TrustManager[] getTrustAllCerts() {
		TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager(){
			@Override
			public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
			@Override
			public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
			@Override
			public X509Certificate[] getAcceptedIssuers() { return null; }
		}};
		
		return trustAllCerts;
	}
	
	// Install the all-trusting trust manager and return ssl client
	private static Client getSSLClient() throws Exception {
		// Install the all-trusting trust manager
	    SSLContext sslcontext = SSLContext.getInstance("SSL");
	    sslcontext.init(null, getTrustAllCerts(), new SecureRandom());
	    
	    // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = new HostnameVerifier() {
			@Override
			public boolean verify(String hostname, SSLSession session) {
				return true;
			}
        };

        DefaultClientConfig defaultClientConfig = new DefaultClientConfig();
		defaultClientConfig.getProperties().put(com.sun.jersey.client.urlconnection.HTTPSProperties.PROPERTY_HTTPS_PROPERTIES,
						new com.sun.jersey.client.urlconnection.HTTPSProperties(allHostsValid, sslcontext));
		return Client.create(defaultClientConfig);
	}
}
