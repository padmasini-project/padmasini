import React, { useState, useEffect, useRef } from 'react';
import './ZoologyExplanation.css';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';

const ZoologyExplanation = ({ explanation = '', subtopicTitle = '', onBack, onMarkComplete }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [highlightedRange, setHighlightedRange] = useState({ start: 0, end: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) return;

      // Find Indian female voice or fallback
      const indianFemale = voices.find(
        (v) =>
          (v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')) &&
          v.name.toLowerCase().includes('female')
      );
      const indianVoice = voices.find(
        (v) => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')
      );
      setVoice(indianFemale || indianVoice || voices[0]);
      voicesLoadedRef.current = true;
    };

    if (!voicesLoadedRef.current) {
      if (synth.onvoiceschanged !== undefined) {
        synth.addEventListener('voiceschanged', loadVoices);
      }
      loadVoices();
    }

    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.removeEventListener('voiceschanged', loadVoices);
      }
      synth.cancel();
    };
  }, [synth]);

  useEffect(() => {
    // Reset when explanation changes
    synth.cancel();
    setIsSpeaking(false);
    setHighlightedRange({ start: 0, end: 0 });
    utteranceRef.current = null;
  }, [explanation, synth]);

  const handleTogglePlayPause = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      setHighlightedRange({ start: 0, end: 0 });
    } else if (explanation.trim()) {
      const utterance = new SpeechSynthesisUtterance(explanation);
      utterance.voice = voice;
      utterance.rate = rate;
      utteranceRef.current = utterance;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setHighlightedRange({ start: 0, end: 0 });
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const start = event.charIndex;
          // Find the end of the word by searching for the next space or punctuation
          let end = start;
          while (end < explanation.length && /\S/.test(explanation[end])) {
            end++;
          }
          setHighlightedRange({ start, end });
        }
      };

      synth.speak(utterance);
    }
  };

  const handleBack = () => {
    synth.cancel();
    setIsSpeaking(false);
    setHighlightedRange({ start: 0, end: 0 });
    utteranceRef.current = null;
    if (onBack) onBack();
  };

  useEffect(() => {
    const storedCompletion = localStorage.getItem(`completed-${subtopicTitle}`);
    setIsComplete(storedCompletion === "true");
  }, [subtopicTitle]);  
  
  const handleMarkComplete = () => {
    setIsComplete(true);
    localStorage.setItem(`completed-${subtopicTitle}`, "true");
    if (onMarkComplete) onMarkComplete("explanation");
  };
  

  const { start, end } = highlightedRange;
  const before = explanation.slice(0, start);
  const highlight = explanation.slice(start, end);
  const after = explanation.slice(end);

  return (
      <div className="explanation-container">
        <div className="explanation-content">
          <h2>{subtopicTitle}</h2>
           {/* Mark as Complete Button */}
                 <div className="centered-buttons">
  
           <button
    onClick={handleMarkComplete}
    className={`complete-btn ${isComplete ? 'completed' : ''}`}
    disabled={isComplete}
  >
    {isComplete ? (
      <>
        Completed <FaCheckCircle className="check-icon" />
      </>
    ) : (
      'Mark as Complete'
    )}
  </button>
          <p>
            {before}
            <mark className="highlight">{highlight}</mark>
            {after}
          </p>
  
         
       
        </div>
  
        <div className="voice-controls-wrapper">
          <button className="voice-play-button" onClick={handleTogglePlayPause}>
            {isSpeaking ? <FaPause /> : <FaPlay />}
          </button>
  
          <div className="rate-control">
            <label htmlFor="rate">Speech Speed: {rate.toFixed(2)}x</label>
            <input
              type="range"
              id="rate"
              min="0.25"
              max="2"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
            />
          </div>
  
          {subtopicTitle.trim().toLowerCase() === '1.1 introduction' && (
            <>
              <div className="audio-container">
                <h4>Original Audio</h4>
                <audio controls>
                  <source src={trailAudio} type="audio/mp3" />
                  Your browser does not support the audio tag.
                </audio>
              </div>
  
              <div className="video-container">
                <video width="100%" controls>
                  <source src={trailVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </>
          )}
          </div>
             {/* Back Button */}
             <button onClick={handleBack} className="back-btn">
            Back to Topics
          </button>
        </div>
      </div>
    );
};
export default ZoologyExplanation;


export const zoologyExplanations = {
// 1. THE LIVING WORLD
"1.1 Characteristics of Living Organisms": "Living organisms show specific characteristics such as growth, reproduction, metabolism, cellular organization, consciousness, and the ability to sense their environment. These features distinguish them from non-living things. While some of these traits like reproduction and movement may be present in non-living systems, the complete set of characteristics defines life.",

"1.2 Diversity in the Living World": "The Earth is home to a vast variety of living organisms. This biodiversity is categorized and studied to understand relationships and evolution. Biological classification helps in organizing this diversity for easier identification, study, and communication. Organisms are grouped based on similarities and differences in structure, function, and genetic makeup.",

"1.3 Taxonomic Categories": "Biological classification uses a hierarchical system of taxonomic categories. These include Kingdom, Phylum (or Division in plants), Class, Order, Family, Genus, and Species. Each level of this hierarchy represents a rank, with species being the most specific and kingdom the most general. This system helps in placing organisms in an organized framework.",

"1.4 Taxonomical Aids": "Taxonomical aids are tools that help in the identification, classification, and study of organisms. These include herbariums (collections of preserved plants), botanical gardens, museums, and zoological parks. Keys, which are based on contrasting characters, are also important tools for identification.",


// KINGDOM ANIMALIA
"2.1 Basis of Classification": "The classification of animals is based on various fundamental features such as body symmetry (radial or bilateral), presence or absence of a coelom (acoelomate, pseudocoelomate, coelomate), levels of organization (cellular, tissue, organ, organ system), germ layers (diploblastic or triploblastic), segmentation (metamerism), and notochord (present or absent). These criteria help group animals with similar structures and functions for easier study and understanding.",

"2.2 Classification of Animals": "The animal kingdom is broadly divided into two groups: non-chordates (animals without a notochord) and chordates (animals with a notochord). Non-chordates include phyla such as Porifera, Cnidaria, Platyhelminthes, Nematoda, Annelida, Arthropoda, Mollusca, and Echinodermata. Chordates include subphyla like Urochordata, Cephalochordata, and Vertebrata. Classification helps in understanding the evolutionary relationships and structural complexity among organisms.",

"2.3 Non-Chordates up to Phylum Level": "Non-chordates are animals that do not possess a notochord at any stage of their life. They include several phyla: Porifera (sponges), Cnidaria (jellyfish), Ctenophora (comb jellies), Platyhelminthes (flatworms), Nematoda (roundworms), Annelida (segmented worms), Arthropoda (insects, spiders), Mollusca (snails, octopuses), and Echinodermata (starfish, sea urchins). Each phylum has distinct characteristics related to body plan, symmetry, coelom, and segmentation.",

"2.4 Chordates up to Class Level": "Chordates are characterized by the presence of a notochord, dorsal hollow nerve cord, and pharyngeal slits at some stage in their life cycle. They are classified into three subphyla: Urochordata and Cephalochordata (both non-vertebrate chordates), and Vertebrata (animals with a backbone). Vertebrates are further classified into classes like Pisces (fishes), Amphibia (frogs), Reptilia (snakes), Aves (birds), and Mammalia (humans, whales). These classes differ in habitat, body covering, mode of reproduction, and circulatory systems.",


// TISSUE LEVEL OF ORGANISATION
"3.1 Animal Tissues": "Tissues are groups of cells that perform a specific function. In animals, there are four major types of tissues: epithelial, connective, muscular, and nervous tissue. Each type is specialized for distinct roles in the body, contributing to its structure and function.",

"3.2 Epithelial Tissue": "Epithelial tissues form the covering or lining of all internal and external body surfaces. They are tightly packed cells with minimal intercellular spaces. Based on the number of layers and shape of cells, they are classified into simple and stratified epithelia, including squamous, cuboidal, columnar, and ciliated types.",

"3.3 Connective Tissue": "Connective tissues connect, support, and bind other tissues and organs. They include loose connective tissue (areolar, adipose), dense connective tissue (tendons, ligaments), specialized connective tissues (cartilage, bone), and fluid connective tissue (blood, lymph).",

"3.4 Muscular Tissue": "Muscular tissue helps in movement and locomotion. It consists of elongated cells called muscle fibers. Based on structure and function, it is categorized into skeletal (voluntary), smooth (involuntary), and cardiac (heart) muscles.",

"3.5 Nervous Tissue": "Nervous tissue is responsible for receiving stimuli and transmitting electrical impulses throughout the body. It consists of neurons (nerve cells) and neuroglia (supporting cells). Neurons have a cell body, axon, and dendrites.",

// ORGAN AND ORGAN SYSTEMS IN ANIMALS
"4.1 Morphology and Anatomy of Earthworm": "Earthworms show a segmented body with a well-marked anterior and posterior end. They exhibit bilateral symmetry and have a closed circulatory system, simple nervous system, and a complete alimentary canal.",

"4.2 Morphology and Anatomy of Cockroach": "Cockroaches have a chitinous exoskeleton, jointed appendages, and segmented bodies. They exhibit an open circulatory system, compound eyes, and a well-developed nervous and reproductive system.",

"4.3 Morphology and Anatomy of Frog": "Frogs are amphibians with smooth, moist skin. They show a closed circulatory system, a three-chambered heart, well-developed sense organs, and dual-mode respiration (skin and lungs).",

// DIGESTION AND ABSORPTION
"5.1 Human Digestive System": "The human digestive system includes the alimentary canal (mouth to anus) and associated glands. It is responsible for ingestion, digestion, absorption, and elimination of food.",

"5.2 Digestive Glands": "Major digestive glands include salivary glands, gastric glands, liver, pancreas, and intestinal glands. These secrete enzymes and other substances necessary for the breakdown of food.",

"5.3 Mechanism of Digestion": "Digestion involves mechanical and chemical processes that break down complex food into simpler forms. Enzymes act at various stages in the mouth, stomach, and intestines to digest carbohydrates, proteins, and fats.",

"5.4 Absorption and Assimilation": "Absorption is the process of transferring digested nutrients into the blood or lymph. Assimilation involves the utilization of these nutrients by body cells for energy, growth, and repair.",

"5.5 Disorders of Digestive System": "Common digestive disorders include indigestion, constipation, vomiting, jaundice, diarrhea, and peptic ulcers. These are caused by infections, unhealthy diet, or malfunctioning organs.",

// RESPIRATION
"6.1 Respiratory Organs": "Respiratory organs vary among animals depending on their habitat and level of organization. In humans, the primary respiratory organs are the lungs. Other animals may use skin (earthworm), gills (fish), or tracheae (insects) for respiration.",

"6.2 Mechanism of Breathing": "Breathing involves inhalation and exhalation. It is controlled by the diaphragm and intercostal muscles. During inhalation, the diaphragm contracts and the chest cavity expands, allowing air in. During exhalation, the diaphragm relaxes, expelling air.",

"6.3 Exchange of Gases": "Gaseous exchange occurs in the alveoli of the lungs where oxygen diffuses into the blood and carbon dioxide diffuses out. This exchange is facilitated by differences in partial pressures and the thin alveolar membrane.",

"6.4 Transport of Gases": "Oxygen is transported in the blood mainly by hemoglobin, while carbon dioxide is transported as bicarbonate ions, carbaminohemoglobin, and dissolved gas in plasma.",

"6.5 Regulation of Respiration": "The respiratory rhythm is regulated by the respiratory centers in the medulla oblongata and pons of the brain. Chemoreceptors and stretch receptors provide feedback to adjust breathing rate and depth.",

"6.6 Respiratory Disorders": "Common disorders include asthma (inflammation of airways), emphysema (damage to alveoli), bronchitis (inflammation of bronchi), and occupational lung diseases like silicosis and asbestosis.",

// BODY FLUIDS AND CIRCULATION
"7.1 Composition of Blood": "Blood is a fluid connective tissue composed of plasma, red blood cells (RBCs), white blood cells (WBCs), and platelets. It functions in transport, regulation, and protection.",

"7.2 Blood Groups": "Humans have four major blood groups – A, B, AB, and O – based on the presence or absence of antigens on RBCs. The Rh factor determines positive or negative blood type.",

"7.3 Coagulation of Blood": "Blood clotting prevents excessive bleeding and involves a cascade of reactions resulting in the conversion of fibrinogen to fibrin, forming a clot.",

"7.4 Human Circulatory System": "It is a closed double circulatory system with pulmonary and systemic circuits. The heart pumps oxygenated blood to the body and deoxygenated blood to the lungs.",

"7.5 Cardiac Cycle": "The cardiac cycle includes systole (contraction) and diastole (relaxation) of the atria and ventricles. It ensures coordinated pumping of blood.",

"7.6 ECG": "Electrocardiogram (ECG) records electrical activity of the heart and helps detect cardiac abnormalities like arrhythmias and myocardial infarction.",

"7.7 Lymphatic System": "The lymphatic system consists of lymph, lymph vessels, and lymph nodes. It helps in fluid balance, defense, and absorption of fats.",

"7.8 Disorders of Circulatory System": "Common disorders include hypertension, coronary artery disease, angina, heart failure, and atherosclerosis.",

// EXCRETION
"8.1 Human Excretory System": "It includes a pair of kidneys, ureters, a urinary bladder, and urethra. Kidneys filter waste from the blood and form urine.",

"8.2 Mechanism of Urine Formation": "Urine formation involves glomerular filtration, tubular reabsorption, and tubular secretion in the nephrons of the kidneys.",

"8.3 Regulation of Kidney Function": "It is regulated by hormones like ADH (vasopressin), aldosterone, and the renin-angiotensin system which maintain fluid and electrolyte balance.",

"8.4 Micturition": "It is the process of releasing urine from the bladder. It is under voluntary and involuntary control regulated by the spinal cord and brain.",

"8.5 Role of Other Organs in Excretion": "Besides kidneys, lungs excrete CO₂, skin excretes sweat, and liver processes and eliminates metabolic waste products.",

"8.6 Disorders of Excretory System": "Includes kidney stones, uremia, glomerulonephritis, and renal failure which can impair excretion and require medical treatment.",

// LOCOMOTION AND MOVEMENT
"9.1 Types of Movement": "Movement in animals can be classified into various types, such as locomotion (movement from one place to another), and non-locomotor movements (like bending or twisting). Locomotion can be through cilia, flagella, or muscular action.",

"9.2 Muscles": "Muscles are specialized tissues responsible for movement. There are three types of muscles: skeletal (voluntary movement), smooth (involuntary movement), and cardiac (found in the heart, also involuntary).",

"9.3 Skeletal System": "The skeletal system provides structural support to the body. It consists of bones and cartilage. The human skeleton is divided into the axial skeleton (skull, spine, ribs) and appendicular skeleton (limbs and girdles).",

"9.4 Joints": "Joints are the points where two or more bones meet. They allow for movement and provide stability. Types of joints include hinge joints (like the elbow), ball-and-socket joints (like the hip), and pivot joints (like the neck).",

"9.5 Disorders of Muscular and Skeletal System": "Disorders include conditions like arthritis (inflammation of joints), osteoporosis (bone weakening), muscular dystrophy (progressive muscle weakness), and sprains.",

// NEURAL CONTROL AND COORDINATION
"10.1 Human Neural System": "The human nervous system is responsible for coordinating and regulating body functions. It is divided into the central nervous system (CNS), consisting of the brain and spinal cord, and the peripheral nervous system (PNS), consisting of sensory and motor neurons.",

"10.2 Neuron and Nerve Impulse": "Neurons are the functional units of the nervous system. A nerve impulse is an electrical signal that travels along the axon of a neuron to communicate with other neurons or muscles. It is transmitted through synapses by neurotransmitters.",

"10.3 Central Nervous System": "The CNS controls sensory perception, thought processes, emotions, and voluntary actions. The brain is the control center, while the spinal cord transmits signals between the brain and the rest of the body.",

"10.4 Peripheral Nervous System": "The PNS connects the CNS to limbs and organs. It is further divided into the somatic nervous system (voluntary control) and the autonomic nervous system (involuntary control, further divided into sympathetic and parasympathetic systems).",

"10.5 Reflex Action": "Reflex actions are automatic, rapid responses to stimuli that do not involve conscious brain control. The reflex arc includes receptors, sensory neurons, the spinal cord, motor neurons, and effectors.",

"10.6 Sense Organs": "Humans have five primary sense organs: eyes (sight), ears (hearing), nose (smell), tongue (taste), and skin (touch). These organs contain specialized receptors that detect stimuli and send signals to the brain for processing.",

// CHEMICAL COORDINATION AND INTEGRATION
"11.1 Endocrine Glands and Hormones": "The endocrine system includes glands that secrete hormones, such as the pituitary, thyroid, adrenal, and pancreas. Hormones regulate various body functions like growth, metabolism, and reproduction.",

"11.2 Mechanism of Hormone Action": "Hormones act on target cells by binding to specific receptors, triggering cellular responses. The mechanism can involve changes in gene expression or activating secondary messengers within cells.",

"11.3 Disorders of Endocrine System": "Disorders of the endocrine system include diabetes mellitus (inadequate insulin production), hyperthyroidism (excessive thyroid hormone), and hypothyroidism (insufficient thyroid hormone).",

// TRENDS IN ECONOMIC ZOOLOGY
"12.1 Sericulture": "Sericulture is the cultivation of silkworms to produce silk. It involves breeding, rearing, and harvesting silkworms for silk production.",

"12.2 Apiculture": "Apiculture, or beekeeping, is the management of bee colonies for the production of honey, beeswax, and other bee products.",

"12.3 Aquaculture": "Aquaculture is the farming of aquatic organisms like fish, shellfish, and seaweed in controlled environments for food production.",

"12.4 Poultry": "Poultry farming involves the breeding and raising of domesticated birds, such as chickens, ducks, and turkeys, for meat and egg production.",

"12.5 Dairy Farming": "Dairy farming focuses on the production of milk and other dairy products from animals like cows, buffaloes, and goats.",

};
