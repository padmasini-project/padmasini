package com.padmasiniAdmin.padmasiniAdmin_1.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;

public class WrapperMCQTest {
	List<MCQTest> questionsList=new ArrayList<MCQTest>();
	String rootId;
	  @NotBlank(message = "parent ids is required")
	String parentId;
	String SubjectName;
	 
	  String testName;
		String marks;
		String timeLimit;
		String dbname;
		
	public String getDbname() {
			return dbname;
		}

		public void setDbname(String dbname) {
			this.dbname = dbname;
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


	public String getRootId() {
		return rootId;
	}

	public void setRootId(String rootId) {
		this.rootId = rootId;
	}

	
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public String getSubjectName() {
		return SubjectName;
	}
	public void setSubjectName(String subjectName) {
		SubjectName = subjectName;
	}

	@Override
	public String toString() {
		return "WrapperMCQTest [questionsList=" + questionsList + ", rootId=" + rootId + ", parentId=" + parentId
				+ ", SubjectName=" + SubjectName + ", quesId=" + ", testName=" + testName + ", marks=" + marks
				+ ", timeLimit=" + timeLimit + ", dbname=" + dbname + "]";
	}

	public List<MCQTest> getQuestionsList() {
		return questionsList;
	}

	public void setQuestionsList(List<MCQTest> questionsList) {
		this.questionsList = questionsList;
	}


	
}
