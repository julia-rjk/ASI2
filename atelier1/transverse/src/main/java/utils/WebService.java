package utils;


import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

@Slf4j
public class WebService {

    /**
     * Static method to perform an HTTP GET Request
     *
     * @param url The URL to perform GET Request
     * @return The response under the form of a String
     * @author Atma
     */
    public static String get(String url) {
        try {
            return new RestTemplate()
                    .getForEntity(url, String.class)
                    .getBody();
        } catch (Exception e) {
            log.error("Error when GET URL=[{}] : {}", url, e.getMessage());
            return null;
        }
    }

    /**
     * Generic static method to perform an HTTP POST Request
     * <p>
     * The method will take the object in parameter, convert it to JSON
     * and send it to the URL in parameter.
     *
     * @param url          The URL to perform POST Request
     * @param objectToSend The Object to send to the URL
     * @return The response under the form of a String
     * @author Atma
     */
    public static <T> String post(String url, T objectToSend) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Set the header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf(MediaType.APPLICATION_JSON_VALUE));

            // Set the request
            HttpEntity<String> request = new HttpEntity<>(objectToSend.toString(), headers);

            // Send
            return restTemplate.postForObject(url, request, String.class);
        } catch (Exception e) {
            log.error("Error when POST URL=[{}] : {}", url, e.getMessage());
            return null;
        }
    }
}
