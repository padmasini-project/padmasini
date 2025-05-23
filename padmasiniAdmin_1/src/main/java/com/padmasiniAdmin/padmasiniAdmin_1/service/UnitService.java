package com.padmasiniAdmin.padmasiniAdmin_1.service;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.padmasiniAdmin.padmasiniAdmin_1.model.Unit;
import com.padmasiniAdmin.padmasiniAdmin_1.model.UnitRequest;
import com.padmasiniAdmin.padmasiniAdmin_1.model.WrapperUnit;
import com.padmasiniAdmin.padmasiniAdmin_1.repository.UnitRepository;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class UnitService {
	 @Autowired
	    private GridFsTemplate gridFsTemplate;
    @Autowired
    private MongoTemplate mongoTemplate;
    public String storeAudio(MultipartFile file) throws IOException {
        ObjectId id = gridFsTemplate.store(
            file.getInputStream(), 
            file.getOriginalFilename(), 
            file.getContentType()
        );
        return id.toString();
    }

    public GridFsResource getAudioFile(String id) {
        GridFSFile file = gridFsTemplate.findOne(Query.query(
            org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id)
        ));
        return gridFsTemplate.getResource(file);
    }
    public void deleteUnit(WrapperUnit data) {
    	UnitRequest root = getById(data.getRootUnitId(),data.getSubjectName());
        if (root == null) {
            System.out.println("Root unit not found");
            return;
        }
        System.out.println("before: "+root);
        boolean deleted = false;
        if (root.getId().equals(data.getParentId())) {
            // If root and parent are the same, delete the whole document using Query
            mongoTemplate.remove(
                Query.query(Criteria.where("_id").is(root.getId())),
                UnitRequest.class,
                data.getSubjectName()
            );
            System.out.println("Root unit deleted.");
            return;
        }
        if (root.getUnits() != null) {
            deleted = removeUnitById(root.getUnits(), data.getParentId());
        }

        // Case 2: Recursive deletion from nested units
        if (!deleted && root.getUnits() != null) {
            for (Unit unit : root.getUnits()) {
                if (deleteFromSubUnits(unit, data.getParentId())) {
                    deleted = true;
                    break;
                }
            }
        }
        if (deleted) {
            mongoTemplate.save(root, data.getSubjectName());  // Save updated document
            System.out.println("Unit deleted successfully.");
        } else {
            System.out.println("Parent ID not found.");
        }
    }
    private boolean deleteFromSubUnits(Unit current, String targetId) {
        if (current.getUnits() != null) {
            boolean removed = removeUnitById(current.getUnits(), targetId);
            if (removed) return true;

            for (Unit child : current.getUnits()) {
                if (deleteFromSubUnits(child, targetId)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean removeUnitById(List<Unit> units, String targetId) {
        Iterator<Unit> iterator = units.iterator();
        while (iterator.hasNext()) {
            Unit unit = iterator.next();
            if (unit.getId() != null && unit.getId().equals(targetId)) {
                iterator.remove();
                return true;
            }
        }
        return false;
    }

    public void addUnit(WrapperUnit data) {
        Unit unit=new Unit();
        if (data.getParentId() == null || data.getParentId().isEmpty()) {
            unit.setParentId(null);  // Store null if empty or not provided
        } else {
            unit.setParentId(data.getParentId());  // Store the provided value
        }
        if (data.getAudioFileId() == null || data.getAudioFileId().isEmpty()) {
        	System.out.println("this is emptys");
            unit.setAudioFileId(null);  // Store null if empty or not provided
        } else {
        	String idauido=null;
			try {
				idauido = storeAudio(data.getAudioFileId());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return;
			}
            
			unit.setAudioFileId(idauido);  // Store the provided value
			System.out.println("Audio file received: " + unit.getAudioFileId());
        }
        if (data.getUnitName() == null || data.getUnitName().isEmpty()) {
            unit.setUnitName(null);  // Store null if empty or not provided
        } else {
            unit.setUnitName(data.getUnitName());  // Store the provided value
        }
        // Set explanation as null if it's empty or not provided
        if (data.getExplanation() == null || data.getExplanation().isEmpty()) {
            unit.setExplanation(null);  // Store null if empty or not provided
        } else {
            unit.setExplanation(data.getExplanation());  // Store the provided value
        }

        System.out.println(unit);
        UnitRequest root = getById(data.getRootUnitId(),data.getSubjectName());
        if (root == null) {
            System.out.println("Root unit not found");
            return;
        }
        System.out.println("before: "+root);
        boolean inserted = false;
        if(root.getId().equals(data.getParentId())) {
        	root.getUnits().add(unit);
        	inserted=true;
        }
        else if (root.getUnits() != null) {
            for (Unit units : root.getUnits()) {
                if (insertIntoParent(units, data.getParentId(), unit)) {
                    inserted = true;
                    break;
                }
            }
        }
        if (inserted) {
        	System.out.println("in insertion");
        	mongoTemplate.save(root, data.getSubjectName());  // ✅ correct: saves in dynamic collection
            System.out.println(root);// Save the updated root document
        } else {
            System.out.println("Parent ID not found in any subunit");
        }
//        Unit parent=getById(data.getParentId());
//        if(parent ==null) {
//        	System.out.println("no parent");
//        	return;
//        }
//        parent.getSubunit().add(unit);
//        unitRepository.save(parent);
    }
    
    public void updateUnit(WrapperUnit data) {
    	UnitRequest root = getById(data.getRootUnitId(),data.getSubjectName());
        if (root == null) {
            System.out.println("Root unit not found");
            return;
        }
        System.out.println("before: "+root);
        boolean inserted = false;
        if(root.getId().equals(data.getParentId())) {
        	root.setUnitName(data.getUnitName());
        	
        	inserted=true;
        }
        else if (root.getUnits() != null) {
            for (Unit units : root.getUnits()) {
                if (updateParent(units,data.getParentId(),data)) {
                    inserted = true;
                    break;
                }
            }
        }
        if (inserted) {
        	System.out.println("in insertion");
        	mongoTemplate.save(root, data.getSubjectName());  // ✅ correct: saves in dynamic collection
            System.out.println(root);// Save the updated root document
        } else {
            System.out.println("Parent ID not found in any subunit");
        }
    }
    private boolean updateParent(Unit current, String targetParentId,WrapperUnit data) {
        if (current.getId() != null && current.getId().equals(targetParentId)) {
            if(data.getUnitName()!=null)current.setUnitName(data.getUnitName());
            //current.setExplanation(data.getExplanation());
            if(data.getExplanation()!=null) {
            	current.setExplanation(data.getExplanation());
            }
            if (current.getAudioFileId() != null) {
                gridFsTemplate.delete(Query.query(Criteria.where("_id").is(current.getAudioFileId())));
            }
            if (data.getAudioFileId() == null || data.getAudioFileId().isEmpty()) {
            	System.out.println("this is emptys");
                //current.setAudioFileId(null);  // Store null if empty or not provided
            } else {
            	String idauido=null;
    			try {
    				idauido = storeAudio(data.getAudioFileId());
    			} catch (IOException e) {
    				// TODO Auto-generated catch block
    				e.printStackTrace();
    				return false ;
    			}
                
    			current.setAudioFileId(idauido);  // Store the provided value
    			System.out.println("Audio file received: " + data.getAudioFileId());
            }
           
			
            return true;
        }

        if (current.getUnits() != null) {
            for (Unit child : current.getUnits()) {
                if (updateParent(child, targetParentId,data)) {
                    return true;
                }
            }
        }

        return false;
    }
    private boolean insertIntoParent(Unit current, String targetParentId, Unit newUnit) {
        if (current.getId() != null && current.getId().equals(targetParentId)) {
            current.getUnits().add(newUnit);
            return true;
        }

        if (current.getUnits() != null) {
            for (Unit child : current.getUnits()) {
                if (insertIntoParent(child, targetParentId, newUnit)) {
                    return true;
                }
            }
        }

        return false;
    }
    

    // Fetch by ID
    public UnitRequest getById(String id,String collectionName) {
    	try {
            return mongoTemplate.findById(new ObjectId(id), UnitRequest.class, collectionName);
        } catch (IllegalArgumentException e) {
            // If not a valid ObjectId, fallback to String ID
            return mongoTemplate.findById(id, UnitRequest.class, collectionName);
        }
    }

}

