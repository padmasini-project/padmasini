import React, { useState, useEffect, useRef } from 'react';
import './ChemistryExplanation.css';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';


const ChemistryExplanation = ({ explanation = '', subtopicTitle = '', onBack, onMarkComplete }) => {
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
export default ChemistryExplanation;

export const chemistryExplanations = {
    "1.1 What is Chemistry?": "Chemistry is the branch of science that deals with the study of matter, its properties, its structure, composition, reactions, and the changes it undergoes. It explores the interaction between different substances and the energy changes associated with these reactions.",
    
    "1.2 Laws of Chemical Combinations": "The laws of chemical combinations govern how substances combine and react with one another. Key laws include the Law of Conservation of Mass (matter is neither created nor destroyed in a chemical reaction), the Law of Definite Proportions (a given compound always contains the same elements in the same proportion by mass), and the Law of Multiple Proportions (when two elements combine to form more than one compound, the ratios of the masses of one element that combine with a fixed mass of the other are simple whole numbers).",
    
    "1.3 Atomic and Molecular Masses": "Atomic mass is the weighted average mass of an atom of an element based on the relative abundance of its isotopes. Molecular mass is the sum of the atomic masses of all atoms in a molecule. Atomic and molecular masses are important for determining the quantities of substances involved in chemical reactions.",
    
    "1.4 Mole Concept and Molar Mass": "The mole concept is a fundamental idea in chemistry used to count entities (atoms, molecules, etc.) by measuring the amount in moles. One mole of a substance contains Avogadro's number (6.022 × 10²³) of particles. Molar mass is the mass of one mole of a substance and is expressed in grams per mole.",
    
    "1.5 Stoichiometry and Limiting Reagent": "Stoichiometry is the calculation of reactants and products in chemical reactions. It is based on the principle of the conservation of mass and the concept of the mole. The limiting reagent is the substance that is completely consumed first in a chemical reaction, determining the amount of product formed.",
    

    "2.1 Discovery of Subatomic Particles": "The discovery of subatomic particles, such as electrons, protons, and neutrons, was pivotal in understanding atomic structure. J.J. Thomson's discovery of the electron, Ernest Rutherford's gold foil experiment leading to the discovery of the nucleus, and James Chadwick's identification of the neutron expanded the model of the atom and contributed to our modern understanding of atomic structure.",
    
    "2.2 Bohr’s Model and its Limitations": "Bohr's model of the atom, proposed in 1913, introduced the idea that electrons occupy discrete energy levels around the nucleus. While it successfully explained the hydrogen spectrum, it had limitations in explaining the spectra of more complex atoms and the behavior of atoms in magnetic fields.",
    
    "2.3 Quantum Mechanical Model of the Atom": "The quantum mechanical model, developed by Schrödinger and others, replaced Bohr’s model. It introduces the concept of orbitals, regions of space where there is a high probability of finding an electron. This model explains atomic behavior more accurately, considering the wave-like properties of electrons.",
    
    "2.4 Quantum Numbers": "Quantum numbers describe the energy, shape, and orientation of orbitals, as well as the spin of electrons. They include the principal quantum number (n), angular momentum quantum number (l), magnetic quantum number (m), and spin quantum number (s). These numbers define the properties of atomic orbitals and the arrangement of electrons in an atom.",
    
    "2.5 Electronic Configuration of Elements": "The electronic configuration of an element describes the distribution of electrons in atomic orbitals. It follows principles like the Aufbau principle, Pauli's exclusion principle, and Hund's rule, which help in determining the arrangement of electrons in atoms and their chemical properties.",
    


    "3.1 Need for Classification": "Classification of elements is essential to organize the vast number of known elements based on their properties and behavior. It helps in understanding trends, predicting chemical reactions, and studying the relationships between different elements.",

    "3.2 Mendeleev’s Periodic Table": "Mendeleev's periodic table, proposed in 1869, was the first to organize elements based on atomic mass. This arrangement revealed periodic trends in the properties of elements. Mendeleev left gaps for undiscovered elements, predicting their properties accurately, which validated the periodic law.",
    
    "3.3 Modern Periodic Table": "The modern periodic table, developed after the discovery of the proton, arranges elements based on atomic number rather than atomic mass. This arrangement corrected the issues in Mendeleev's table and brought clarity to the periodicity of elements' properties. It also introduced the concept of periods and groups.",
    
    "3.4 Periodic Trends in Properties of Elements": "Periodic trends refer to the predictable patterns of properties of elements as you move across a period or down a group in the periodic table. These trends include atomic radius, ionization energy, electron affinity, and electronegativity, which all vary in a predictable manner depending on an element's position in the table.",
    

    "4.1 Ionic Bond": "An ionic bond is formed when electrons are transferred from one atom to another, resulting in the formation of positively and negatively charged ions. The electrostatic force of attraction between oppositely charged ions holds them together in an ionic compound.",
    
    "4.2 Covalent Bond": "A covalent bond is formed when two atoms share one or more pairs of electrons. This type of bond occurs between non-metal atoms and leads to the formation of molecules. Covalent bonding explains the behavior of compounds like water and oxygen.",
    
    "4.3 Metallic Bond": "In metallic bonding, electrons are not shared or transferred but form a 'sea of electrons' that move freely throughout the metal. This explains the high electrical conductivity, malleability, and ductility of metals.",
    
    "4.4 Valence Bond Theory": "Valence Bond (VB) theory explains how atoms form chemical bonds by the overlap of atomic orbitals. The strength of the bond depends on the extent of overlap, and the theory also accounts for the directional nature of bonds.",
    
    "4.5 Molecular Orbital Theory": "Molecular Orbital (MO) theory describes the formation of molecules in terms of molecular orbitals that result from the combination of atomic orbitals. It explains bond formation, bond order, and magnetic properties of molecules.",
    
    "4.6 Hybridization": "Hybridization is the concept where atomic orbitals mix to form new, hybrid orbitals that explain molecular geometry and bonding. For example, in methane (CH₄), carbon undergoes sp³ hybridization to form four equivalent bonds with hydrogen.",
    
    "5.1 Gaseous State: Properties and Laws": "Gases have unique properties like indefinite shape and volume. They follow various gas laws including Boyle’s law (pressure inversely proportional to volume), Charles’s law (volume directly proportional to temperature), and Avogadro’s law (volume proportional to number of moles). These laws describe the behavior of gases under different conditions.",

    "5.2 Ideal Gas Equation and its Applications": "The ideal gas equation PV = nRT combines all gas laws into one. It relates pressure (P), volume (V), temperature (T), and number of moles (n) with the universal gas constant (R). This equation is used to calculate properties of gases under ideal conditions.",

    "5.3 Liquids: Properties and Structure": "Liquids have definite volume but no fixed shape. Their particles are closely packed but can move past each other. Intermolecular forces in liquids are stronger than in gases, leading to properties like fluidity, surface tension, and viscosity.",

    "5.4 Surface Tension and Viscosity": "Surface tension is the force that makes liquid surfaces contract, caused by cohesive forces. Viscosity refers to the resistance of a liquid to flow, which depends on intermolecular attraction. Both properties affect how liquids behave in various conditions.",

    "6.1 System and Surroundings": "In thermodynamics, the system refers to the part of the universe we are studying, while everything else is the surroundings. Systems are classified as open, closed, or isolated based on their ability to exchange energy or matter. This classification helps in analyzing energy interactions.",

"6.2 First Law of Thermodynamics": "The first law states that energy can neither be created nor destroyed; it only transforms. Mathematically, ΔU = q + w, where ΔU is internal energy change, q is heat, and w is work. It explains how energy is conserved in physical and chemical processes.",

"6.3 Enthalpy and Internal Energy": "Internal energy is the total energy contained within a system. Enthalpy (H) is defined as H = U + PV, and it represents the heat content at constant pressure. Changes in enthalpy (ΔH) are used to describe exothermic or endothermic reactions.",

"6.4 Second Law of Thermodynamics": "The second law states that natural processes tend to increase the overall entropy (disorder) of the universe. It introduces the concept of spontaneity, explaining why certain reactions occur naturally while others do not.",

"6.5 Entropy and Gibbs Free Energy": "Entropy (S) is a measure of disorder. Gibbs free energy (G = H − TS) determines spontaneity of a reaction. If ΔG < 0, the process is spontaneous; if ΔG > 0, it is non-spontaneous. This concept combines enthalpy, entropy, and temperature into one useful criterion.",

"7.1 Dynamic Nature of Equilibrium": "In a reversible reaction at equilibrium, the forward and backward reactions occur at equal rates. Although the concentrations of reactants and products remain constant, molecules continue to react dynamically.",

"7.2 Le Chatelier’s Principle": "This principle predicts how a system at equilibrium responds to changes in concentration, temperature, or pressure. The system shifts in the direction that counteracts the change to restore equilibrium.",

"7.3 Equilibrium Constant and its Units": "The equilibrium constant (K) expresses the ratio of product concentrations to reactant concentrations at equilibrium. Its value depends on the reaction and temperature. Units vary based on the reaction stoichiometry.",

"7.4 Applications of Equilibrium": "Equilibrium concepts are applied in industrial and biological processes to maximize yield. Examples include the Haber process for ammonia production and maintaining pH in blood through buffer systems.",

"8.1 Oxidation and Reduction": "Oxidation is the loss of electrons or increase in oxidation state, while reduction is the gain of electrons or decrease in oxidation state. These processes always occur together in a redox reaction.",

"8.2 Redox Reactions in Terms of Electron Transfer": "Redox reactions can be viewed as electron transfers between species. The substance that loses electrons is oxidized (reducing agent), and the one that gains electrons is reduced (oxidizing agent).",

"8.3 Balancing Redox Reactions": "Redox reactions are balanced using the ion-electron or oxidation number method. This ensures that both mass and charge are conserved, crucial for correctly representing chemical changes.",

"8.4 Oxidizing and Reducing Agents": "An oxidizing agent gains electrons and causes oxidation, while a reducing agent loses electrons and causes reduction. Identifying these agents is key to understanding redox behavior.",

"9.1 Occurrence and Isotopes of Hydrogen": "Hydrogen is the most abundant element in the universe. It exists in three isotopic forms: protium, deuterium, and tritium. These isotopes differ in mass and nuclear composition.",

"9.2 Hydrogen Compounds: Water and Hydrogen Peroxide": "Hydrogen forms important compounds like water (H₂O) and hydrogen peroxide (H₂O₂). These compounds have unique properties and play vital roles in chemical and biological systems.",

"9.3 Preparation and Properties of Hydrogen": "Hydrogen can be prepared through electrolysis of water, reaction of metals with acids, or steam reforming. It is a colorless, odorless gas that burns with a pale blue flame.",

"9.4 Hydrogen as a Fuel": "Hydrogen is a clean fuel, producing only water upon combustion. It has high energy content and potential as an alternative to fossil fuels, especially in fuel cells and space missions.",

"10.1 General Properties of s, p, d-block Elements": "s-block elements are soft metals with low ionization energy. p-block includes nonmetals and metalloids with variable oxidation states. d-block (transition metals) show complex properties like variable valency and formation of colored compounds.",

"10.2 Properties of Transition Elements": "Transition elements form colored ions, show magnetic behavior, and act as catalysts. Their variable oxidation states arise from the involvement of d-orbitals in bonding.",

"10.3 Lanthanides and Actinides": "Lanthanides are f-block elements with similar chemical properties and gradual changes in ionic size (lanthanide contraction). Actinides are mostly radioactive and show greater variability in oxidation states.",

"11.1 Some Basic Concepts in Organic Chemistry": "Organic chemistry deals with carbon compounds. Concepts include bond formation, hybridization, and electronic effects like inductive, resonance, and hyperconjugation, which influence reactivity and stability.",

"11.2 Classification of Organic Compounds": "Organic compounds are classified as open-chain (aliphatic), closed-chain (cyclic), saturated, and unsaturated. Further classification is based on functional groups like alcohols, ketones, and amines.",

"11.3 Functional Groups": "Functional groups are specific atoms or groups of atoms that determine the chemical behavior of organic compounds. Examples include –OH (alcohol), –COOH (carboxylic acid), and –NH₂ (amine).",

"11.4 Nomenclature of Organic Compounds": "IUPAC rules are used for naming organic compounds based on the number of carbon atoms, position of functional groups, and nature of substituents, ensuring a standardized naming system.",

"11.5 Methods of Preparation and Reactions of Organic Compounds": "Organic compounds can be synthesized using substitution, addition, elimination, or oxidation-reduction reactions. These methods are important for creating useful molecules in pharmaceuticals and materials.",

"12.1 Alkanes, Alkenes, and Alkynes": "Hydrocarbons are organic compounds of carbon and hydrogen. Alkanes are saturated, alkenes contain double bonds, and alkynes have triple bonds. They differ in bonding and reactivity.",

"12.2 Properties of Hydrocarbons": "Hydrocarbons exhibit properties such as combustibility, boiling/melting points, and reactivity based on the type of bonding. Unsaturated hydrocarbons are more reactive due to π bonds.",

"12.3 Aromatic Hydrocarbons": "Aromatic hydrocarbons like benzene have a cyclic, conjugated π-system. They exhibit special stability known as aromaticity and undergo substitution rather than addition reactions.",

"12.4 Methods of Preparation and Reactions of Hydrocarbons": "Hydrocarbons can be prepared from halogenation, cracking, or reduction of organic compounds. Reactions include combustion, halogenation, and polymerization depending on the hydrocarbon type.",

"13.1 Environmental Pollution": "Pollution is the introduction of harmful substances into the environment. Types include air, water, and soil pollution, often caused by industrial and human activities.",

"13.2 Greenhouse Effect and Global Warming": "Greenhouse gases like CO₂ trap heat in the Earth’s atmosphere, leading to global warming. This causes climate change, melting glaciers, and rising sea levels.",

"13.3 Ozone Depletion": "Ozone in the stratosphere protects life from harmful UV rays. Ozone-depleting substances like CFCs break down ozone molecules, increasing UV exposure and related health risks.",

"13.4 Water Pollution and Treatment": "Water pollution results from the discharge of harmful chemicals into water bodies. Treatment methods include sedimentation, filtration, chlorination, and use of biological processes.",

"13.5 Waste Management and Green Chemistry": "Proper waste management reduces environmental impact. Green chemistry promotes the design of processes that minimize hazardous substances and encourage sustainability.",
};