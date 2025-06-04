package com.padmasiniAdmin.padmasiniAdmin_1.model;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class WrapperUnit {
	private String parentId;
	private String explanation;
	private String standard;
	private String unitName;
	private String rootUnitId;
	private String subjectName;
	 private MultipartFile audioFileId; 
	
	
	public MultipartFile getAudioFileId() {
		return audioFileId;
	}
	public void setAudioFileId(MultipartFile audioFileId) {
		this.audioFileId = audioFileId;
	}
	@Override
	public String toString() {
		return "WrapperUnit [parentId=" + parentId + ", explanation=" + explanation + ", standard=" + standard
				+ ", unitName=" + unitName + ", rootUnitId=" + rootUnitId + ", subjectName=" + subjectName
				+ ", audioFileId=" + audioFileId + "]";
	}
	public String getRootUnitId() {
		return rootUnitId;
	}
	public void setRootUnitId(String rootUnitId) {
		this.rootUnitId = rootUnitId;
	}
	public String getSubjectName() {
		return subjectName;
	}
	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public String getExplanation() {
		return explanation;
	}
	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}
	public String getStandard() {
		return standard;
	}
	public void setStandard(String standard) {
		this.standard = standard;
	}
	public String getUnitName() {
		return unitName;
	}
	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}
	
}
