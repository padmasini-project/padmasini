package com.padmasiniAdmin.padmasiniAdmin_1.service;

import java.util.Iterator;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import com.mongodb.client.MongoClient;
import com.padmasiniAdmin.padmasiniAdmin_1.model.MCQTest;
import com.padmasiniAdmin.padmasiniAdmin_1.model.MotherMCQTest;
import com.padmasiniAdmin.padmasiniAdmin_1.model.Unit;
import com.padmasiniAdmin.padmasiniAdmin_1.model.UnitRequest;
import com.padmasiniAdmin.padmasiniAdmin_1.model.WrapperMCQTest;
@Service
public class MCQTestService {
	@Autowired
    private MongoClient mongoClient;
public String addQuestion(WrapperMCQTest data) {
	MotherMCQTest mcq=new MotherMCQTest();
	mcq.setTestName(data.getTestName());
	mcq.setMarks(data.getMarks());
	mcq.setTimeLimit(data.getTimeLimit());
	mcq.setQuestionsList(data.getQuestionsList());
	System.out.println(mcq.getId());
	UnitRequest root=getById(data.getRootId(), data.getSubjectName(),data.getDbname());
	if (root == null) {
        System.out.println("Root unit not found");
        return null;
    }
	if(root.getId().equals(data.getParentId()))root.getTest().add(mcq);
	else {
		for(Unit unit:root.getUnits()) {
			if(unit.getId().equals(data.getParentId())) {
				unit.getTest().add(mcq);
				//return unit.getUnitName();
			}
		}
	}
	System.out.println("successfully saved");
	System.out.println("root: "+root);
	System.out.println(mcq);
	MongoTemplate mongoTemplate=new MongoTemplate(mongoClient,data.getDbname());
	mongoTemplate.save(root,data.getSubjectName());
	return root.getUnitName();
}
public String updateQuestion(WrapperMCQTest data,String oldName) {
	//MCQTest q=new MCQTest(data.getQuestion(),data.getExplanation(),data.getOptions(),data.getAnswer());
	UnitRequest root=getById(data.getRootId(), data.getSubjectName(),data.getDbname());
	if (root == null) {
        System.out.println("Root unit not found");
        return null;
    }
	String newName=data.getTestName();
	WrapperMCQTest data2=data;
	data2.setTestName(oldName);
	deleteQuestion(data2);
	System.out.println("deletion done");
	data.setTestName(newName);
	String unit =addQuestion(data);
//	for(MotherMCQTest ques:root.getTest()) {
//		if(ques.getId().equals(data.getQuesId())) {
//			if(data.getQuestion().trim()!=null)ques.setQuestion(data.getExplanation());
//			if(data.getAnswer()!=null)ques.setAnswer(data.getAnswer());
//			if(data.getOption1()!=null)ques.setOption1(data.getOption1());
//			if(data.getOption2()!=null)ques.setOption2(data.getOption2());
//			if(data.getOption3()!=null)ques.setOption3(data.getOption3());
//			if(data.getOption4()!=null)ques.setOption4(data.getOption4());
//			if(data.getExplanation()!=null)ques.setExplanation(data.getExplanation());
//			if(data.getTestName()!=null)ques.setTestName(data.getTestName());
//			if(data.getMarks()!=null)ques.setMarks(data.getMarks());
//			if(data.getTimeLimit()!=null)ques.setTimeLimit(data.getTimeLimit());
//			MongoTemplate mongoTemplate=new MongoTemplate(mongoClient,data.getDbname());
//			mongoTemplate.save(root,data.getSubjectName());
//			return root.getUnitName();
//		}
//	}
//	for(Unit unit:root.getUnits()) {
//		if(unit.getId().equals(data.getParentId()))
//		for(MCQTest ques:unit.getTest()) {
//			if(ques.getId().equals(data.getQuesId())) {
//				if(data.getQuestion().trim()!=null)ques.setQuestion(data.getExplanation());
//				if(data.getAnswer()!=null)ques.setAnswer(data.getAnswer());
//				if(data.getOption1()!=null)ques.setOption1(data.getOption1());
//				if(data.getOption2()!=null)ques.setOption2(data.getOption2());
//				if(data.getOption3()!=null)ques.setOption3(data.getOption3());
//				if(data.getOption4()!=null)ques.setOption4(data.getOption4());
//				if(data.getTestName()!=null)ques.setTestName(data.getTestName());
//				if(data.getMarks()!=null)ques.setMarks(data.getMarks());
//				if(data.getTimeLimit()!=null)ques.setTimeLimit(data.getTimeLimit());
//				MongoTemplate mongoTemplate=new MongoTemplate(mongoClient,data.getDbname());
//				if(data.getExplanation()!=null)ques.setExplanation(data.getExplanation());
//				mongoTemplate.save(root,data.getSubjectName());
//				return unit.getUnitName();
//			}
//		}
//	}
	return unit.isEmpty()?null:unit;
}
public String deleteQuestion(WrapperMCQTest data) {
	System.out.println("inside edlete service");
	System.out.println(data);
	UnitRequest root=getById(data.getRootId(), data.getSubjectName(),data.getDbname());
	if (root == null) {
        System.out.println("Root unit not found");
        return null;
    }
	Iterator<MotherMCQTest> iterator=root.getTest().iterator();
	while(iterator.hasNext()) {
		MotherMCQTest q=iterator.next();
		System.out.println("test name:"+q.getTestName());
		if(q.getTestName().equals(data.getTestName())) {
			iterator.remove();
			MongoTemplate mongoTemplate=new MongoTemplate(mongoClient,data.getDbname());
			mongoTemplate.save(root,data.getSubjectName());
			System.out.println("removed");
			return root.getUnitName();
		}
	}
	for(Unit unit:root.getUnits()) {
		System.out.println(unit.getUnitName());
		if(unit.getId().equals(data.getParentId())) {
			Iterator<MotherMCQTest> iterators=unit.getTest().iterator();
			while(iterators.hasNext()) {
				MotherMCQTest q=iterators.next();
				System.out.println("test name:"+q.getTestName());
				System.out.println(data.getTestName());
				if(q.getTestName().equals(data.getTestName())) {
					iterators.remove();
					MongoTemplate mongoTemplate=new MongoTemplate(mongoClient,data.getDbname());
					mongoTemplate.save(root,data.getSubjectName());
					System.out.println("removed");
					return unit.getUnitName();
				}
			}
		}
	}
	System.out.println("empty");
	return null;
}

public UnitRequest getById(String id,String collectionName,String dbname) {
	
	MongoTemplate mongoTemplate=new MongoTemplate(mongoClient,dbname);
	try {
        return mongoTemplate.findById(new ObjectId(id), UnitRequest.class, collectionName);
    } catch (IllegalArgumentException e) {
        // If not a valid ObjectId, fallback to String ID
        return mongoTemplate.findById(id, UnitRequest.class, collectionName);
    }
}
}
