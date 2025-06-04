import React, { useState, useEffect, useRef } from 'react';
import './BotanyExplanation.css'; // Updated to Botany-specific CSS
import { FaPlay, FaPause } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';

const BotanyExplanation = ({ explanation = '', subtopicTitle = '', onBack, onMarkComplete }) => {
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

export default BotanyExplanation;

export const botanyExplanations = {

    "1.1 Characteristics of Plants": "Plants are multicellular, autotrophic organisms that carry out photosynthesis. They have cell walls made of cellulose, chloroplasts for capturing sunlight, and grow throughout their life. Unlike animals, plants are generally stationary and show limited response to stimuli.",

"1.2 Classification Systems": "Plant classification systems aim to organize plants based on similarities and evolutionary relationships. Early systems were artificial, using superficial features. Later, natural and phylogenetic systems evolved, considering a wider range of characteristics, including morphology, anatomy, and genetic data.",

"1.3 Binomial Nomenclature": "Binomial nomenclature is the formal system of naming species, introduced by Carolus Linnaeus. Each organism is given a two-part Latin name: the genus (capitalized) and the species (lowercase). For example, *Mangifera indica* refers to the mango plant. This universal naming helps avoid confusion across languages and regions.",

"1.4 Herbarium and Botanical Gardens": "Herbaria are collections of preserved plant specimens used for scientific study, while botanical gardens are institutions that maintain living collections of plants. Both play a crucial role in research, conservation, education, and referencing in taxonomy and plant identification.",

"2.1 Algae":"Algae are simple, autotrophic, aquatic organisms that contain chlorophyll and perform photosynthesis. They are mostly unicellular or filamentous and can be found in freshwater or marine environments. Algae reproduce vegetatively, asexually (by spores), and sexually (isogamy, anisogamy, oogamy). They are classified into green (Chlorophyceae), brown (Phaeophyceae), and red (Rhodophyceae) algae based on pigments and storage products.",

"2.2 Bryophytes":"Bryophytes are non-vascular land plants, including mosses and liverworts. They grow in moist, shady environments and lack true roots, stems, or leaves. The plant body is a gametophyte, while the sporophyte is dependent on it. Bryophytes play a role in soil formation and water retention. They reproduce through alternation of generations.",

"2.3 Pteridophytes":"Pteridophytes are the first vascular plants, including ferns, horsetails, and club mosses. They have true roots, stems, and leaves, and possess vascular tissues (xylem and phloem). The dominant phase is the sporophyte. Pteridophytes reproduce via spores and show alternation of generations with independent gametophyte and sporophyte stages.",

"2.4 Gymnosperms":"Gymnosperms are seed-producing, non-flowering vascular plants. Their seeds are naked, not enclosed in fruits. They include conifers, cycads, and ginkgo. Gymnosperms have well-developed roots, stems, and leaves. They show heterospory (two types of spores) and have a dominant sporophyte stage. Fertilization is usually by wind.",

"2.5 Angiosperms":"Angiosperms are flowering plants with seeds enclosed in fruits. They are the most diverse group of plants. Based on the number of cotyledons, they are divided into monocots and dicots. Angiosperms have advanced vascular tissues, double fertilization, and show alternation of generations with dominant sporophyte.",

"3.1 Root, Stem and Leaf":"These are the vegetative parts of a plant. The root anchors the plant and absorbs water and minerals. Roots may be taproot (dicots) or fibrous (monocots). The stem supports the plant, transports nutrients, and may be modified for storage or climbing. The leaf is the main photosynthetic organ, typically with a lamina, petiole, and venation pattern. Leaves are arranged in specific patterns for optimal sunlight capture.",

"3.2 Inflorescence and Flower":"Inflorescence refers to the arrangement of flowers on the plant. It can be racemose (indeterminate) or cymose (determinate). A flower is the reproductive unit, typically with four whorls: calyx (sepals), corolla (petals), androecium (stamens), and gynoecium (carpels). Floral symmetry, position of ovary, and aestivation are key features used in classification.",

"3.3 Fruit and Seed":"After fertilization, the ovary develops into a fruit and the ovules become seeds. Fruits may be true (only from ovary) or false (from other floral parts). Seeds contain the embryo, stored food, and protective coats. They may be monocot or dicot based on the number of cotyledons.",

"3.4 Modifications and Adaptations":"Plant parts often undergo modifications to adapt to specific environments. Roots may be modified for storage (e.g., carrot), stems for climbing (e.g., tendrils in cucumber), and leaves for protection or water storage (e.g., cactus spines). These adaptations support survival in various habitats.",

// 4. ANATOMY OF FLOWERING PLANTS
"4.1 Tissues and Tissue Systems":"Plants consist of three main tissue types: meristematic tissues (for growth), permanent tissues (for structure and function), and vascular tissues (for transport). Meristematic tissues are found at the tips and sides of plants, and permanent tissues can be simple (parenchyma, collenchyma, sclerenchyma) or complex (xylem and phloem). The dermal tissue system forms the plant's outer covering, the vascular tissue system deals with transport, and the ground tissue system fills and stores nutrients.",

"4.2 Anatomy of Dicot and Monocot Plants":"Dicot plants have vascular bundles arranged in a circle, whereas monocots have scattered vascular bundles. Dicots have reticulate (net-like) venation in their leaves, while monocots have parallel venation. Dicot roots are usually taproots, while monocots have fibrous roots.",

"4.3 Secondary Growth":"Secondary growth refers to the thickening of plant stems and roots through the activity of lateral meristems like vascular cambium (producing secondary xylem and phloem) and cork cambium (producing bark). This growth contributes to the formation of woody plants, mostly found in dicots.",

//5. CELL – THE UNIT OF LIFE
"5.1 Cell Theory": [
  "The cell theory states that:",
  "1. All living organisms are composed of cells.",
  "2. The cell is the basic structural and functional unit of life.",
  "3. All cells arise from pre-existing cells.",
  "This theory forms the foundation of modern biology."
],

"5.2 Structure of Prokaryotic and Eukaryotic Cells":"Prokaryotic cells (e.g., bacteria) lack a nucleus and other membrane-bound organelles. They have a simple structure with a plasma membrane, cytoplasm, and genetic material in a nucleoid region. Eukaryotic cells (e.g., plant and animal cells) have a true nucleus, membrane-bound organelles (like mitochondria, chloroplasts), and a more complex internal structure.",

"5.3 Cell Organelles and Functions":"Cell organelles perform specific functions. Nucleus stores genetic material, mitochondria produce energy, chloroplasts conduct photosynthesis (in plant cells), and ribosomes synthesize proteins. Other organelles include the endoplasmic reticulum (for protein and lipid synthesis), Golgi apparatus (for packaging and transport), and lysosomes (for digestion).",

//6. BIOMOLECULES
"6.1 Types of Biomolecules":"Biomolecules are organic molecules that form the building blocks of life. The major types are carbohydrates, proteins, lipids, and nucleic acids. These molecules play critical roles in energy storage, cell structure, and genetic information transmission.",

"6.2 Structure and Function of Proteins, Carbohydrates, Lipids, Nucleic Acids": [
  "1. Proteins: Made of amino acids, they function in enzymes, structure, and transport.",
  "2. Carbohydrates: Provide energy and are involved in cell recognition.",
  "3. Lipids: Serve as energy stores and make up cell membranes.",
  "4. Nucleic acids: DNA and RNA store and transmit genetic information."
],

"6.3 Enzymes and Their Activity":"Enzymes are proteins that speed up biochemical reactions. They work by lowering the activation energy needed for reactions. Enzyme activity is influenced by factors such as temperature, pH, and substrate concentration.",

//7. CELL CYCLE AND CELL DIVISION
"7.1 Cell Cycle Phases":"The cell cycle consists of Interphase (where the cell grows and DNA replicates) and M-phase (mitosis or meiosis, where the cell divides). Interphase includes G1 (growth phase), S (synthesis phase), and G2 (growth phase).",

"7.2 Mitosis and Meiosis":["1.Mitosis produces two genetically identical diploid cells. It involves stages: prophase, metaphase, anaphase, and telophase.",

"2.Meiosis is a reduction division that produces four non-identical haploid cells (gametes), contributing to genetic diversity."],

"7.3 Significance of Cell Division":"Cell division is crucial for growth, repair, and reproduction. Mitosis is involved in asexual reproduction, while meiosis facilitates sexual reproduction and genetic variation.",


//8. TRANSPORT IN PLANTS
"8.1 Transport of Water and Minerals":"Water and minerals are absorbed by roots and transported through xylem vessels. Water movement occurs through processes like osmosis and capillary action. Transpiration (evaporation of water from leaf surfaces) plays a major role in pulling water up through plants.",

"8.2 Transport of Food":"Phloem transports the products of photosynthesis (mainly sugars) from source (leaves) to sink (roots, fruits). This is known as translocation.",

"8.3 Transpiration":"Transpiration is the loss of water vapor from aerial plant parts, primarily through stomata. It helps in nutrient transport and maintaining water balance.",

"8.4 Mechanisms of Transport":"Transport in plants is regulated by processes such as diffusion, osmosis, and active transport. Each process ensures the movement of water, minerals, and nutrients to appropriate parts of the plant.",

//9. MINERAL NUTRITION
"9.1 Essential Elements and Their Functions":"Plants require essential elements for growth, which are divided into macronutrients (e.g., nitrogen, phosphorus, potassium) and micronutrients (e.g., iron, zinc, copper). Each element serves specific roles in metabolism, enzyme activation, and structural development.",

"9.2 Deficiency Symptoms":"Deficiency of essential nutrients results in specific symptoms such as yellowing of leaves (chlorosis) due to nitrogen or iron deficiency. Potassium deficiency can cause leaf curling and reduced growth.",

"9.3 Nitrogen Cycle and Nitrogen Fixation":"The nitrogen cycle involves the conversion of atmospheric nitrogen into usable forms by nitrogen-fixing bacteria, which plants then absorb. This cycle is vital for plant growth, as nitrogen is essential for protein synthesis.",

//10. PHOTOSYNTHESIS IN HIGHER PLANTS
"10.1 Photosynthetic Pigments and Light Reaction":"Photosynthesis occurs in chloroplasts, involving pigments like chlorophyll that absorb sunlight. The light reaction uses sunlight to produce energy-rich molecules (ATP and NADPH) and oxygen as a byproduct.",

"10.2 Cyclic and Non-Cyclic Photophosphorylation":["1.Cyclic photophosphorylation produces ATP only.",

"2.Non-cyclic photophosphorylation produces both ATP and NADPH, which are needed for the Calvin Cycle."],

"10.3 Calvin Cycle and C4 Pathway":"The Calvin Cycle fixes carbon dioxide into sugars. The C4 pathway is a modified form of photosynthesis found in plants like maize, which allows more efficient carbon fixation in hot environments.",

"10.4 Factors Affecting Photosynthesis":"Factors such as light intensity, carbon dioxide concentration, and temperature impact the rate of photosynthesis.",

//11. RESPIRATION IN PLANTS
"11.1 Glycolysis and Fermentation":"Glycolysis is the breakdown of glucose into pyruvate, releasing energy. In the absence of oxygen, fermentation occurs, producing ethanol (in plants) and carbon dioxide.",

"11.2 Krebs Cycle":"The Krebs Cycle is a series of reactions that occur in the mitochondria, breaking down pyruvate to produce ATP, carbon dioxide, and electron carriers (NADH and FADH2).",

"11.3 Electron Transport Chain":"The electron transport chain uses the electrons from NADH and FADH2 to create a proton gradient across the mitochondrial membrane, which drives ATP synthesis.",

"11.4 Respiratory Quotient and Energy Yield":"The respiratory quotient (RQ) is the ratio of CO₂ produced to O₂ consumed during respiration. The energy yield varies based on the type of substrate being metabolized.",

//12. PLANT GROWTH AND DEVELOPMENT
"12.1 Phases of Growth and Growth Curves":"Plants grow in three phases: cell division, cell elongation, and cell differentiation. Growth curves show logarithmic and stationary phases of growth.",

"12.2 Plant Growth Regulators":"Hormones like auxins, cytokinins, gibberellins, abscisic acid, and ethylene regulate plant growth and development, including processes like flowering, seed germination, and fruit ripening.",

"12.3 Photoperiodism and Vernalization":"Photoperiodism is the response of plants to the duration of light. Vernalization is the cold-induced flowering mechanism in some plants.",

"12.4 Seed Dormancy and Germination":"Seed dormancy is a period of inactivity, and germination occurs when favorable conditions break dormancy, allowing the seed to sprout.",

};