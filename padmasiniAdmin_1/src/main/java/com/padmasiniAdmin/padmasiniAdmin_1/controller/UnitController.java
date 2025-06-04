package com.padmasiniAdmin.padmasiniAdmin_1.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.padmasiniAdmin.padmasiniAdmin_1.model.Unit;
import com.padmasiniAdmin.padmasiniAdmin_1.model.UnitRequest;
import com.padmasiniAdmin.padmasiniAdmin_1.model.WrapperUnit;
import com.padmasiniAdmin.padmasiniAdmin_1.service.UnitService;

@CrossOrigin(origins = "*")
@RestController
public class UnitController {
	 @Autowired 
	    private UnitService unitService;
	 @Autowired
	    private MongoTemplate mongoTemplate;
	 
	    @PostMapping("/addNewSubsection")
	    public void AddSubUnit(@ModelAttribute WrapperUnit unit) {
	    	System.out.println(unit);
//	    	if (unit.getAudioFileId() != null && !unit.getAudioFileId().isEmpty()) {
//	            System.out.println("Audio file name: " + unit.getOriginalFilename());
//	            System.out.println("Audio file size: " + audioFileId.getSize() + " bytes");
//	        } else {
//	            System.out.println("No audio file received.");
//	        }
	        unitService.addUnit( unit);
	    }
	    @DeleteMapping("/deleteUnit")
	    public void deleteUnit(@ModelAttribute WrapperUnit unit) {
	    	System.out.println(unit);
	        unitService.deleteUnit( unit);
	    }
	    @PutMapping("/updateSubsection")
	 public void updateUnit(@ModelAttribute WrapperUnit unit) {
	    	System.out.println(unit);
	        unitService.updateUnit( unit);
	 }
	 @PostMapping("/addNewUnit/{subject}")
	    public void addUnit(@PathVariable String subject, @RequestBody UnitRequest request) {
	        System.out.println("Subject: " + subject);
	        System.out.println("Unit Name: " + request.getUnitName());
	        System.out.println("Standard: " + request.getStandard());
	        System.out.println(request);
	        // Save unit to DB or perform logic
	        mongoTemplate.insert(request, subject);
	        //return ResponseEntity.ok("Unit added successfully");
	    }
	 @GetMapping("/getAllUnits/{subject}")
	    public List<UnitRequest> getUnitsBySubject(@PathVariable String subject) {
		 System.out.println( mongoTemplate.findAll(UnitRequest.class, subject));
	        return mongoTemplate.findAll(UnitRequest.class, subject);
	    }
	 @GetMapping("/getAudio/{id}")
	    public ResponseEntity<Resource> getAudioFile(@PathVariable String id) throws IOException {
	        GridFsResource audioFile = unitService.getAudioFile(id);

	        if (audioFile == null || !audioFile.exists()) {
	            return ResponseEntity.notFound().build();
	        }

	        return ResponseEntity.ok()
	                .contentType(MediaType.parseMediaType(audioFile.getContentType()))
	                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + audioFile.getFilename() + "\"")
	                .body(audioFile);
	    }
}
