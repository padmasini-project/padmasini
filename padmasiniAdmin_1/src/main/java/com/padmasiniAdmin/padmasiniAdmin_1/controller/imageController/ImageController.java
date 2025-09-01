package com.padmasiniAdmin.padmasiniAdmin_1.controller.imageController;

import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
@RestController
@RequestMapping("/api/image")
public class ImageController {
private final Region region = Region.AP_SOUTH_1;
   private final String bucketName = "trilokinnovations-test-admin";

   
   
 
   
   @GetMapping("/presigned-url-image")
   public ResponseEntity<Map<String, String>> getPresignedUrl(
    @RequestParam String fileName,
    @RequestParam String fileType,
    @RequestParam String folderPath){
	   
    try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.AP_SOUTH_1)
                .credentialsProvider(credentialsProvider)
                .build()) {

            String key = folderPath+"/" + System.currentTimeMillis() + "-" + fileName;


            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(fileType)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .putObjectRequest(objectRequest)
                    .signatureDuration(Duration.ofMinutes(15))
                    .build();

              URL uploadUrl = presigner.presignPutObject(presignRequest).url();

            Map<String, String> response = new HashMap<>();
            response.put("uploadUrl", uploadUrl.toString());
            response.put("fileUrl", "https://" + bucketName + ".s3.ap-south-1.amazonaws.com/" + key);

            System.out.println("Presigned URL generated: " + uploadUrl);
 
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Failed to generate presigned URL: " + e.getMessage());
            e.printStackTrace(); // 🔍 log full error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not generate presigned URL: " + e.getMessage()));
        }
   }
}