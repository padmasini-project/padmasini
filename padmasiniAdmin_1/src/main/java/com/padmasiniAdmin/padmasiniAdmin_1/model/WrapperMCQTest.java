package com.padmasiniAdmin.padmasiniAdmin_1.model;

import java.util.List;
import jakarta.validation.constraints.NotBlank;

public class WrapperMCQTest {

    private List<MCQTest> questionsList; 

    private String rootId;

    @NotBlank(message = "parent id is required")
    private String parentId;

    private String subjectName;  

    private String testName;
    private int marks;          // ✅ changed from String → int
    private int timeLimit;      // ✅ changed from String → int
    private String dbname;

    // Getters and Setters
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

    public int getMarks() {
        return marks;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }

    public int getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(int timeLimit) {
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
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public List<MCQTest> getQuestionsList() {
        return questionsList;
    }

    public void setQuestionsList(List<MCQTest> questionsList) {
        this.questionsList = questionsList;
    }

    @Override
    public String toString() {
        return "WrapperMCQTest [questionsList=" + questionsList +
                ", rootId=" + rootId +
                ", parentId=" + parentId +
                ", subjectName=" + subjectName +
                ", testName=" + testName +
                ", marks=" + marks +
                ", timeLimit=" + timeLimit +
                ", dbname=" + dbname + "]";
    }
}
