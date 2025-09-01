package com.padmasiniAdmin.padmasiniAdmin_1.model;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Unit {
	@Id
	private String id;
	private String unitName;
	private String parentId;
	private List<Unit> units=new ArrayList<Unit>();
	private String explanation;
	private List<String> audioFileId;
	private List<MotherMCQTest> test;
public String getId() {
	return id;
}





public List<String> getAudioFileId() {
	return audioFileId;
}





public void setAudioFileId(List<String> audioFileId) {
	this.audioFileId = audioFileId;
}





public String getUnitName() {
	return unitName;
}

public List<MotherMCQTest> getTest() {
	return test;
}

public void setTest(List<MotherMCQTest> test) {
	this.test = test;
}

public void setUnitName(String unitName) {
	this.unitName = unitName;
}
public Unit() {}
public Unit(boolean mcq) {
    this.id = new ObjectId().toHexString();  // Generates a unique 24-char hex string
    if (!mcq) {
        test = null;
        System.out.println("❌ test not assigned to: " + id);
    } else {
    	  System.out.println("✅ test assigned to: " + id);
    	test = new ArrayList<>(); // <-- make sure this is present
    }
}
public void setId(String id) {
	this.id = id;
}
public String getParentId() {
	return parentId;
}
public void setParentId(String parentId) {
	this.parentId = parentId;
}
public List<Unit> getUnits() {
	return units;
}
public void setUnits(List<Unit> subunit) {
	this.units = subunit;
}
public String getExplanation() {
	return explanation;
}
public void setExplanation(String explanation) {
	this.explanation = explanation;
}

@Override
public String toString() {
	return "Unit [id=" + id + ", unitName=" + unitName + ", parentId=" + parentId + ", units=" + units
			+ ", explanation=" + explanation + ", audioFileId=" + audioFileId + "]";
}




}
