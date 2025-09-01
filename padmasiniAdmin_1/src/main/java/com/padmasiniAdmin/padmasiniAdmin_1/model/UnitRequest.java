package com.padmasiniAdmin.padmasiniAdmin_1.model;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;

public class UnitRequest {
		 	@Id
		 	private String id;
	        private String unitName;
	        private String standard;
	        private List<Unit> units=new ArrayList<Unit>();
	        private List<MotherMCQTest> test=new ArrayList<MotherMCQTest>();
	        
	        
			
			

			public List<MotherMCQTest> getTest() {
				return test;
			}

			public void setTest(List<MotherMCQTest> test) {
				this.test = test;
			}

			

			

			
			@Override
			public String toString() {
				return "UnitRequest [id=" + id + ", unitName=" + unitName + ", standard=" + standard + ", units="
						+ units + ", test=" + test + "]";
			}

			public List<Unit> getUnits() {
				return units;
			}

			public void setUnits(List<Unit> units) {
				this.units = units;
			}

			public String getUnitName() {
				return unitName;
			}
			
			public String getId() {
				return id;
			}

			public void setId(String id) {
				this.id = id;
			}

			public void setUnitName(String unitName) {
				this.unitName = unitName;
			}
			public String getStandard() {
				return standard;
			}
			public void setStandard(String standard) {
				this.standard = standard;
			}

	        // Getters and Setters
	    }