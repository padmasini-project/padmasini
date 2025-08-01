package com.padmasiniAdmin.padmasiniAdmin_1.model;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class MotherMCQTest {
	@Id
	String id;
	String testName;
	String marks;
	String timeLimit;
	List<MCQTest> questionsList=new ArrayList<MCQTest>();
	public MotherMCQTest() {
		this.id = new ObjectId().toHexString();
	}
	
	public String getTestName() {
		return testName;
	}
	public void setTestName(String testName) {
		this.testName = testName;
	}
	public String getMarks() {
		return marks;
	}
	public void setMarks(String marks) {
		this.marks = marks;
	}
	public String getTimeLimit() {
		return timeLimit;
	}
	public void setTimeLimit(String timeLimit) {
		this.timeLimit = timeLimit;
	}
	public List<MCQTest> getQuestionsList() {
		return questionsList;
	}
	public void setQuestionsList(List<MCQTest> questionsList) {
		this.questionsList = questionsList;
	}
	@Override
	public String toString() {
		return "MotherMCQTest [testName=" + testName + ", marks=" + marks + ", timeLimit=" + timeLimit
				+ ", questionsList=" + questionsList + "]";
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
}
