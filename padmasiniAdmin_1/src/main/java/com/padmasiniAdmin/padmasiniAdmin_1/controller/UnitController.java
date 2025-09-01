package com.padmasiniAdmin.padmasiniAdmin_1.controller;

import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;

import com.padmasiniAdmin.padmasiniAdmin_1.model.UnitRequest;
import com.padmasiniAdmin.padmasiniAdmin_1.model.WrapperUnit;
import com.padmasiniAdmin.padmasiniAdmin_1.model.WrapperUnitRequest;
import com.padmasiniAdmin.padmasiniAdmin_1.service.UnitService;
//import com.padmasiniAdmin.padmasiniAdmin_1.service.UnitService.GridFSFileWithStream;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@RestController
public class UnitController {
	 @Autowired 
	    private UnitService unitService;
	 
	 
	 @GetMapping("/getAllUnits/{dbname}/{subjectName}/{standard}")
	    public List<UnitRequest> getUnitsBySubject(@PathVariable ("dbname") String dbname,@PathVariable ("subjectName") String subjectName,
	    		@PathVariable ("standard") String standard	) {
		// System.out.println( mongoTemplate.findAll(UnitRequest.class, subject));
	        return unitService.getAllUnit(dbname, subjectName,standard);
	    }
	   
	    @PostMapping("/addNewHeadUnit")
	    public  ResponseEntity<Map<String, String>> addUnit( @RequestBody WrapperUnitRequest request) {
	        
	        System.out.println("db name"+request.getDbname());
	        System.out.println(request.getUnit());	
	        
	        Map<String, String> response = new HashMap<>();
	        if(unitService.addNewHeadUnit(request)) {
	        	 response.put("status", "pass");
	        }
	        else {
	        	response.put("status", "failed");
	        }
	        
	        return ResponseEntity.ok(response);
//		 if(!request.getStandard().equals("11th")&&!request.getStandard().equals("12th")) {
//		 		return ResponseEntity.badRequest().body("Standard name cannot be empty");
//		 	}
//	        
//	        // Save unit to DB or perform logic
//	        mongoTemplate.insert(request, subject);
	        //return ResponseEntity.ok("Unit added successfully");
	    }
	    
	    @PutMapping("/updateHeadUnit/{newUnitName}")
		  public ResponseEntity<Map<String, String>> updateHeadUnit(@RequestBody WrapperUnitRequest request,@PathVariable String newUnitName) {
			  System.out.println("new unit name: "+newUnitName);
			  System.out.println("old unnit name"+request.getUnit().getUnitName());
			  Map<String, String> response = new HashMap<>();
			  if(unitService.updateHeadUnitName(request, newUnitName)) {
				  response.put("status", "pass");
		        }
		        else {
		        	response.put("status", "failed");
		        }
		        
		        return ResponseEntity.ok(response);
		  }
	  	    
	    @DeleteMapping("/deleteHeadUnit")
		  public  ResponseEntity<Map<String, String>>  deleteHeadUnit(@RequestBody WrapperUnitRequest request) {
			  System.out.println("in delete"+request.getUnit().getUnitName());
			  
			  Map<String, String> response = new HashMap<>();
			  if(unitService.deleteHeadUnit(request)) {
				  response.put("status", "pass");
		        }
		        else {
		        	response.put("status", "failed");
		        }
		        
		        return ResponseEntity.ok(response);
		  }
	    
	    
	    
	    
	    
	    
	    @DeleteMapping("/deleteUnit")
	    public ResponseEntity<Map<String, String>> deleteUnit(@RequestBody WrapperUnit unit) {
	    	System.out.println(unit);
	        unitService.deleteUnit( unit);
	        Map<String, String> response = new HashMap<>();
	        response.put("status", "deleted");
	        return ResponseEntity.ok(response);
	    }
	    @PostMapping(value = "/updateSubsection"
	    		//, consumes = MediaType.MULTIPART_FORM_DATA_VALUE
	    		)
	    public ResponseEntity<?> updateUnit(
	        @RequestPart("unit") WrapperUnit unit
	        //,@RequestPart(value = "audioFiles", required = false) MultipartFile[] audioFiles
	    ) {
	        System.out.println("update: " + unit);

	        if (!unit.getStandard().equals("11") && !unit.getStandard().equals("12")) {
	            return ResponseEntity.badRequest().body("Standard name cannot be empty");
	        }

	        // Add audio files into the unit
	     //   unit.setAudioFileId(audioFiles);  // Ensure your WrapperUnit class supports this

	        unitService.updateUnit(unit);

	        return ResponseEntity.ok(Map.of("message", "Unit updated successfully"));

	    }

	 
	   
	    @PostMapping(value = "/addNewSubsection"
	    		//, consumes = MediaType.MULTIPART_FORM_DATA_VALUE
	    		)
	    public ResponseEntity<Map<String, String>> addSubUnit(
	        @RequestPart("unit") WrapperUnit unit
	        //,@RequestPart(value = "audioFiles", required = false) MultipartFile[] audioFiles
	    ) {
	       // unit.setAudioFileId(audioFiles);
	        System.out.println(unit);
	        unitService.addUnit(unit);
	        Map<String, String> response = new HashMap<>();
	        response.put("status", "success");
	        return ResponseEntity.ok(response);
	    }

	  
	    
	    


//	 @GetMapping("/getAudio/{id}/{dbName}/{collectionName}")
//	    public void getAudioFile(@PathVariable("id") String id,@PathVariable("dbName") String dbName,@PathVariable("collectionName") String collectionName, HttpServletRequest request, HttpServletResponse response) throws IOException {
//		GridFSFileWithStream fileWithStream = unitService.getAudioFile(dbName, collectionName, id);
//
//		    if (fileWithStream == null || fileWithStream.stream == null) {
//		        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
//		        return;
//		    }
//		    long fileLength = fileWithStream.file.getLength();
//		    String range = request.getHeader("Range");
//		    String contentType = fileWithStream.file.getMetadata() != null
//		        ? fileWithStream.file.getMetadata().getString("contentType")
//		        : "application/octet-stream";
//
//		    if (range == null) {
//		        response.setContentType(contentType);
//		        response.setHeader("Content-Length", String.valueOf(fileLength));
//		        org.springframework.util.StreamUtils.copy(fileWithStream.stream, response.getOutputStream());
//		    } 
//		    else {
//		        long start, end;
//		        String[] parts = range.replace("bytes=", "").split("-");
//		        start = Long.parseLong(parts[0]);
//		        end = parts.length > 1 && !parts[1].isEmpty() ? Long.parseLong(parts[1]) : fileLength - 1;
//
//		        if (end >= fileLength) end = fileLength - 1;
//		        long contentLength = end - start + 1;
//
//		        response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
//		        response.setContentType(contentType);
//		        response.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + fileLength);
//		        response.setHeader("Content-Length", String.valueOf(contentLength));
//		        response.setHeader("Accept-Ranges", "bytes");
//		        try (InputStream inputStream = fileWithStream.stream) {
//		            inputStream.skip(start);
//		            byte[] buffer = new byte[1024];
//		            long bytesLeft = contentLength;
//		            OutputStream outputStream = response.getOutputStream();
//
//		            while (bytesLeft > 0) {
//		                int bytesToRead = (int) Math.min(buffer.length, bytesLeft);
//		                int bytesRead = inputStream.read(buffer, 0, bytesToRead);
//		                if (bytesRead == -1) break;
//		                outputStream.write(buffer, 0, bytesRead);
//		                bytesLeft -= bytesRead;
//		            }
//		        }
//	        }
//		    System.out.println("inside get music");
//	 }
//	 @DeleteMapping("/deleteAudio/{id}/{dbName}/{collectionName}")
//	 public ResponseEntity<String> deleteAudio(
//	     @PathVariable("id") String id,
//	     @PathVariable("dbName") String dbName,
//	     @PathVariable("collectionName") String collectionName) {
//
//	     String ans=unitService.deleteAudio(id,dbName,collectionName);
//	     return ResponseEntity.ok(ans);
//	 }

}
