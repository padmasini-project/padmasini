package com.padmasiniAdmin.padmasiniAdmin_1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.padmasiniAdmin.padmasiniAdmin_1.model.Subject;
import com.padmasiniAdmin.padmasiniAdmin_1.repository.SubjectRepository;


	
@CrossOrigin(origins = "*")
@RestController
public class SubjectController {
	@Autowired
	SubjectRepository repo;
	
	@PostMapping("/addSubject")
	public void addSubject(@RequestBody Subject subject) {
		repo.save(subject);
		System.out.println("subject added successfully");
	}
	
	
	@GetMapping("/getAllSubjects")
	public List<Subject> fetchSubject() {
		System.out.println("subject fetched succeddfully");
		return repo.findAll();
		
	}
	
	@PutMapping("/updateSubject/{name}")
	public void update (@RequestBody Subject subject,@PathVariable String name) {
		
		 Subject existing = repo.findByName(name);
		 System.out.println(existing.getName());
		    if (existing != null) {
		        existing.setName(subject.getName()); // or update other fields
		        repo.save(existing);
		        System.out.println("subject updated successfully");
		    }
	}
	
	@DeleteMapping("/deleteSubject/{name}")
	public void delete(@PathVariable String name) {
		long del=repo.deleteByName(name);
		if(del==0)System.out.println("no sub found");
		else System.out.println("successfully deleted");
	}
}
