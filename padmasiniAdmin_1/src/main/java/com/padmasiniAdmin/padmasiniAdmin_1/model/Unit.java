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
	private String audioFileId;
public String getId() {
	return id;
}

public String getAudioFileId() {
	return audioFileId;
}

public void setAudioFileId(String audioFileId) {
	this.audioFileId = audioFileId;
}

public String getUnitName() {
	return unitName;
}

public void setUnitName(String unitName) {
	this.unitName = unitName;
}

public Unit() {
    this.id = new ObjectId().toHexString();  // Generates a unique 24-char hex string
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
