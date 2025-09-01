package com.padmasiniAdmin.padmasiniAdmin_1.controller.audio;

import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;

@RestController
@RequestMapping("/api/audio")
public class AudioController {

    private final Region region = Region.AP_SOUTH_1;
    private final String bucketName = "trilokinnovations";


    @DeleteMapping("/delete-file")
    public ResponseEntity<?> deleteFileByUrl(@RequestBody Map<String, String> request) {
        String fileUrl = request.get("fileUrl");
        //String unitId = request.get("unitId");

        if (fileUrl == null || !fileUrl.contains(".amazonaws.com/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid input"));
        }

        // Extract key from URL
        String fileKey = fileUrl.split(".amazonaws.com/")[1];

        try (S3Client s3 = S3Client.builder()
                .region(region)
                .credentialsProvider(credentialsProvider)
                .build()) {

            // Delete from S3
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();
            s3.deleteObject(deleteRequest);

            // Delete URL from MongoDB
//            Query query = new Query(Criteria.where("unitId").is(unitId));
//            Update update = new Update().pull("audioFiles", fileUrl);
//            mongoTemplate.updateFirst(query, update, "yourCollection");
System.out.println("deleted successfully");
Map<String, String> response = new HashMap<>();
response.put("message", "File deleted from S3 and MongoDB");
return ResponseEntity.ok(response);
        } catch (Exception e) {
        	 Map<String, String> error = new HashMap<>();
             error.put("error", "Failed to delete: " + e.getMessage());
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
       
        }
    }
    @GetMapping("/presigned-url")
    public ResponseEntity<Map<String, String>> getPresignedUrl(
            @RequestParam String fileName,
            @RequestParam String fileType
    ) {
        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.AP_SOUTH_1)
                .credentialsProvider(credentialsProvider)
                .build()) {

            String key = "audio/" + System.currentTimeMillis() + "-" + fileName;

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
