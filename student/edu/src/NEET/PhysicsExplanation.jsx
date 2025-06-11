import React, { useState, useEffect, useRef } from 'react';
import './PhysicsExplanation.css';
import { FaPlay, FaPause, FaCheckCircle } from 'react-icons/fa';

import trailVideo from '../videos/trail.mp4';
import trailAudio from "../audio/trail.mp3";

const PhysicsExplanation = ({ explanation = '', subtopicTitle = '', onBack, onMarkComplete }) => {
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
          {/* Centered Buttons */}
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
          {before} <mark className="highlight">{highlight}</mark> {after}
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

    

        <button onClick={handleBack} className="back-btn">
          Back to Topics
        </button>
      </div>
    </div>
  );
};

export default PhysicsExplanation;


export const physicsExplanations = {
// UNIT AND MEASUREMENT
"1.1 Introduction": "Physics is the branch of science that deals with the study of the basic laws of nature and their manifestation in different natural phenomena. It explains how and why things happen in the universe by studying matter, energy, space, and time. It also provides the basis for various technologies that we use in daily life.",    

"1.2 The International System of Units": "Measurement is the foundation of Physics. To maintain uniformity and consistency in measurements all over the world, the International System of Units (SI Units) was adopted in 1960. SI units consist of seven fundamental units: Length (metre - m), Mass (kilogram - kg), Time (second - s), Temperature (kelvin - K), Electric current (ampere - A), Luminous intensity (candela - cd), and Amount of substance (mole - mol). All other units are derived from these base units. For example, the unit of Force is Newton (N), which is derived as kg·m/s².",

"1.3 Significant Figures": "Significant figures represent all the meaningful digits in a measured or calculated quantity, reflecting the precision of that measurement. The rules for identifying significant figures are: (1) All non-zero digits are significant. (2) Zeros between non-zero digits are significant. (3) Leading zeros (before non-zero digits) are not significant. (4) Trailing zeros after a decimal point are significant. The number of significant figures in a measurement indicates its accuracy.",

"1.4 Dimensions of Physical Quantities": "Dimensions of a physical quantity represent its dependence on the fundamental quantities like Mass (M), Length (L), Time (T), Temperature (K), Electric current (A), Luminous intensity (cd), and Amount of substance (mol). For example, the dimension of speed is [M⁰ L¹ T⁻¹], as it depends only on length and time. Dimensions help in analyzing and deriving relationships between physical quantities.",

"1.5 Dimensional Formulae and Dimensional Equations": "Dimensional formula expresses a physical quantity in terms of base dimensions with specific powers. Example: The dimensional formula of Force is [M¹ L¹ T⁻²]. A dimensional equation equates a physical quantity with its dimensional formula. Example: Work = Force × Displacement, so the dimensional formula of Work is [M¹ L² T⁻²]. Dimensional equations are helpful in checking the correctness of physical relations.",

"1.6 Dimensional Analysis and Its Applications": "Dimensional analysis is a method of using dimensions to solve problems and derive physical relationships. Applications include: (1) Checking the correctness of physical equations by comparing dimensions on both sides. (2) Deriving formulas or relations between physical quantities. (3) Converting units from one system to another. However, dimensional analysis cannot give information about dimensionless constants in an equation.",

"1.7 Test": "Test your understanding of this chapter with conceptual questions, multiple-choice questions, and numerical problems based on Units, Measurements, Significant Figures, Dimensions, Dimensional Analysis, and SI Units.",

// MOTION IN A STRAIGHT LINE

"2.1 Introduction": "Motion in a straight line, also called rectilinear motion, is the simplest form of motion where an object moves along a single straight path. In this motion, the direction of the object does not change. Examples include a car moving on a straight road or a train moving on a straight track. The motion can be uniform (constant speed) or non-uniform (changing speed).",

"2.2 Position, Path Length, and Displacement": "Position refers to the location of a particle in space relative to a reference point. It is often represented using coordinates or distance along a straight line. Path length is the total distance an object has traveled, regardless of direction. Displacement, on the other hand, is the shortest distance between the initial and final positions of the object along with direction. Path length is always positive or zero, but displacement can be positive, negative, or zero depending on the direction of motion.",

"2.3 Average Velocity and Average Speed": "Average speed is the total distance traveled divided by the total time taken, while average velocity is the total displacement divided by the total time taken. If an object returns to its starting point, its displacement is zero, making average velocity zero, but the average speed is still positive because distance is covered. Formula: Average Speed = Total Distance / Total Time, Average Velocity = Total Displacement / Total Time.",

"2.4 Instantaneous Velocity and Speed": "Instantaneous velocity is the velocity of an object at a specific instant of time. It is determined using calculus when the time interval approaches zero. It gives both magnitude and direction. Instantaneous speed is the magnitude of instantaneous velocity (it has no direction). If the velocity is constant, then average and instantaneous velocities are equal.",

"2.5 Acceleration": "Acceleration is the rate at which velocity changes with time. It is a vector quantity and can be positive (speeding up), negative (slowing down, called retardation or deceleration), or zero (constant velocity). Formula: Acceleration (a) = Change in velocity / Time taken = (v - u) / t, where v = final velocity and u = initial velocity. Acceleration can be uniform (constant value) or non-uniform (changing with time).",

"2.6 Kinematic Equations for Uniformly Accelerated Motion": "When acceleration is constant (uniform), the following kinematic equations are used to relate velocity, displacement, acceleration, and time: 1) v = u + at → Final velocity after time t, 2) s = ut + ½at² → Displacement after time t, 3) v² = u² + 2as → Relation between velocity and displacement without time. Here, u = initial velocity, v = final velocity, a = acceleration, s = displacement, t = time. These equations apply only when acceleration is constant.",

"2.7 Relative Velocity": "Relative velocity is the velocity of one object as observed from another moving object. It depends on the motion of both objects. If two objects move in the same direction, the relative velocity = (vA - vB), where vA and vB are velocities of object A and B respectively. If they move in opposite directions, the relative velocity = (vA + vB). Relative velocity helps to understand how fast one object appears to be moving when viewed from another moving object.",
  
// MOTION IN A PLANE

"3.1 Introduction": "Motion in a plane refers to the motion of an object in two dimensions (2D) ,both along the x-axis and y-axis. Unlike motion in a straight line, here the object can change its direction and move along a curved path. The position, velocity, and acceleration of an object are expressed using vectors in 2D motion.",

"3.2 Scalars and Vectors": "Physical quantities are classified into Scalars and Vectors. Scalars have only magnitude (size) like mass, temperature, distance, and speed. Vectors have both magnitude and direction like displacement, velocity, acceleration, and force. Representation of a vector is done by an arrow; length shows magnitude and arrowhead shows direction.",

"3.3 Multiplication of Vectors by Real Numbers": "When a vector is multiplied by a real number (scalar), its magnitude changes but direction remains the same (if scalar is positive) or reverses (if scalar is negative). For example, if vector A is multiplied by 3, its magnitude becomes 3 times longer.",

"3.4 Addition and Subtraction of Vectors — Graphical Method": "Vectors can be added graphically using two methods: 1) Triangle Law of Vector Addition — Place the tail of the second vector at the head of the first vector. 2) Parallelogram Law — Place both vectors from a common point and complete a parallelogram. The diagonal gives the resultant vector. Subtraction is done by adding the negative of a vector.",

"3.5 Resolution of Vectors": "Resolution of a vector means breaking it into two or more components along specified directions, usually perpendicular (x-axis and y-axis). Example: A vector A making angle θ with x-axis has components: Ax = A cos θ (along x-axis), Ay = A sin θ (along y-axis).",

"3.6 Vector Addition — Analytical Method": "In analytical method, vectors are added using their components. If two vectors A and B have components along x and y axes, their resultant R is: Rx = Ax + Bx, Ry = Ay + By, Magnitude of R = √(Rx² + Ry²), Direction of R = tan⁻¹(Ry / Rx).",

"3.7 Motion in a Plane": "Motion in a plane occurs when an object moves along a curved path or in two dimensions simultaneously. The object's position, velocity, and acceleration need to be analyzed in both x and y directions separately using equations of motion.",

"3.8 Motion in a Plane with Constant Acceleration": "When acceleration is constant in both x and y directions, the equations of motion can be applied separately for both axes: x-direction → Sx = Ux t + ½ ax t², y-direction → Sy = Uy t + ½ ay t², where Sx and Sy are displacements, Ux and Uy are initial velocities, ax and ay are accelerations in x and y directions respectively.",

"3.9 Projectile Motion": "Projectile motion is a special case of motion in a plane where an object is thrown into the air making an angle with the horizontal. It follows a parabolic path due to constant acceleration (gravity) acting downwards. Equations: Horizontal motion → constant velocity, Vertical motion → uniformly accelerated motion due to gravity. Time of flight = (2u sinθ) / g, Maximum height = (u² sin²θ) / (2g), Horizontal Range = (u² sin 2θ) / g.",

"3.10 Uniform Circular Motion": "When an object moves in a circular path at a constant speed, it is called uniform circular motion. Even though speed is constant, velocity changes because direction changes continuously. Centripetal acceleration acts towards the center: a = v² / r, where v = speed and r = radius of the circle. The object experiences a centripetal force to maintain its circular path.",

// LAWS OF MOTION

"4.1 Introduction": "Laws of motion deal with the relationship between the motion of an object and the forces acting on it. Isaac Newton formulated three fundamental laws that describe the motion of objects and how forces influence them.",

"4.2 Aristotle’s fallacy": "Aristotle believed that a force is required to keep a body moving, which was later proved wrong. Galileo and Newton explained that objects in motion do not require a continuous force unless an external force like friction acts on them.",

"4.3 The law of inertia": "Galileo introduced the concept of inertia — the tendency of an object to resist a change in its state of rest or motion. There are three types of inertia: (i) Inertia of Rest, (ii) Inertia of Motion, and (iii) Inertia of Direction.",

"4.4 Newton’s first law of motion": "It states that an object remains at rest or in uniform motion in a straight line unless acted upon by an external unbalanced force. This law defines inertia and explains why objects continue their state of motion or rest.",

"4.5 Newton’s second law of motion": "It gives a quantitative definition of force. It states that the rate of change of momentum of an object is directly proportional to the applied force and takes place in the direction of the force. Formula: F = ma, where F is force, m is mass, and a is acceleration.",

"4.6 Newton’s third law of motion": "It states that for every action, there is an equal and opposite reaction. Forces always occur in pairs, acting on two different bodies, and are equal in magnitude but opposite in direction.",

"4.7 Conservation of momentum": "The total momentum of a system of objects remains constant if no external force acts on it. This is a direct consequence of Newton’s third law. Mathematically: m1u1 + m2u2 = m1v1 + m2v2, where u is initial velocity and v is final velocity.",

"4.8 Equilibrium of a particle": "A particle is said to be in equilibrium if the vector sum of all the forces acting on it is zero. Mathematically: ΣF = 0. This means the particle remains at rest or continues to move with constant velocity.",

"4.9 Common forces in mechanics": "These include (i) Gravitational Force – force of attraction between two masses, (ii) Normal Force – force exerted by a surface perpendicular to it, (iii) Tension – force transmitted through a string or rope, (iv) Friction – force opposing relative motion between surfaces.",

"4.10 Circular motion": "When a particle moves in a circular path with constant speed, it is said to be in uniform circular motion. The necessary force for circular motion is provided by centripetal force: Fc = mv²/r, where m is mass, v is speed, and r is radius of the circle.",

"4.11 Solving problems in mechanics": "To solve problems in mechanics, follow steps like: (i) Draw a free body diagram (FBD), (ii) Identify all forces acting on the object, (iii) Apply Newton’s laws of motion, (iv) Use equations of motion and vector analysis to find unknown quantities like force, acceleration, velocity, etc.",

// WORK, ENERGY AND POWER

"5.1 Introduction": "This chapter explains the concepts of work, energy, and power, their inter-relationship, and their significance in mechanics.",

"5.2 Notions of work and kinetic energy : The work-energy theorem": "The work done by a force on a body results in a change in its kinetic energy. This is expressed as the work-energy theorem: W = ΔK = Kf - Ki.",

"5.3 Work": "Work is said to be done when a force applied on a body causes a displacement. Formula: W = F · d · cosθ, where θ is the angle between force and displacement.",

"5.4 Kinetic energy": "Kinetic energy is the energy possessed by a body due to its motion. Formula: K.E. = ½ mv², where m is mass and v is velocity.",

"5.5 Work done by a variable force": "When force varies with displacement, work done is calculated using integration: W = ∫ F(x) dx.",

"5.6 The work-energy theorem for a variable force": "Even for variable forces, the work-energy theorem holds true: The net work done is equal to the change in kinetic energy of the body.",

"5.7 The concept of potential energy": "Potential energy is the energy possessed by a body due to its position or configuration. Example: Gravitational potential energy = mgh.",

"5.8 The conservation of mechanical energy": "In absence of non-conservative forces like friction, total mechanical energy (K.E. + P.E.) of a system remains constant.",

"5.9 The potential energy of a spring": "When a spring is compressed or stretched, it stores potential energy. Formula: U = ½ kx², where k is spring constant and x is displacement.",

"5.10 Power": "Power is the rate at which work is done. Formula: P = W/t. Its SI unit is Watt (W). Instantaneous Power: P = F · v.",

"5.11 Collisions": "Collision is an event where two or more bodies exert forces on each other for a short time. Types of collisions: Elastic and Inelastic. In elastic collisions, momentum and kinetic energy are conserved.",

// SYSTEMS OF PARTICLES AND ROTATIONAL MOTION

"6.1 Introduction": "This chapter deals with the motion of systems of particles and bodies under rotational motion, including concepts like centre of mass, torque, and angular momentum.",

"6.2 Centre of mass": "Centre of mass is a point that represents the mean position of the mass of a system. For a system of particles: R = (Σmiri) / Σmi.",

"6.3 Motion of centre of mass": "The motion of the centre of mass of a system of particles depends only on the external forces acting on the system, irrespective of internal forces.",

"6.4 Linear momentum of a system of particles": "Total linear momentum of a system of particles is equal to the product of total mass and velocity of the centre of mass.",

"6.5 Vector product of two vectors": "Vector or cross product gives a vector perpendicular to the plane of two vectors. Magnitude: |A×B| = AB sinθ.",

"6.6 Angular velocity and its relation with linear velocity": "Angular velocity (ω) is related to linear velocity (v) as: v = rω, where r is the radius of the circular path.",

"6.7 Torque and angular momentum": "Torque (τ) is the rotational equivalent of force. τ = r × F. Angular momentum (L) = r × p, where p is linear momentum.",

"6.8 Equilibrium of a rigid body": "A rigid body is in equilibrium if both the net external force and net external torque acting on it are zero.",

"6.9 Moment of inertia": "Moment of inertia (I) is the rotational equivalent of mass. I = Σmir², where r is the distance from the axis of rotation.",

"6.10 Kinematics of rotational motion about a fixed axis": "Rotational motion equations are similar to linear motion: θ = ω₀t + ½ αt², ω² = ω₀² + 2αθ, where α is angular acceleration.",

"6.11 Dynamics of rotational motion about a fixed axis": "Torque is related to moment of inertia and angular acceleration: τ = Iα.",

"6.12 Angular momentum in case of rotation about a fixed axis": "Angular momentum (L) of a rotating body is given by L = Iω.",

// GRAVITATION

"7.1 Introduction": "Gravitation is the force of attraction between any two objects having mass. This chapter discusses laws governing gravitational force and motion of planets and satellites.",

"7.2 Kepler’s laws": "Kepler proposed three laws of planetary motion: (i) Law of Orbits, (ii) Law of Areas, (iii) Law of Periods.",

"7.3 Universal law of gravitation": "Every particle attracts every other particle in the universe with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them: F = G(m1m2/r²).",

"7.4 The gravitational constant": "G is the universal gravitational constant. Its value is 6.67 × 10⁻¹¹ Nm²/kg².",

"7.5 Acceleration due to gravity of the earth": "The acceleration experienced by a body due to earth’s gravity is denoted by g. g = GM/R², where M is the mass of the earth and R is its radius.",

"7.6 Acceleration due to gravity below and above the surface of earth": "g decreases with height above the surface and depth below the surface. g(h) = g(1 - 2h/R) for h << R; g(d) = g(1 - d/R) for depth d.",

"7.7 Gravitational potential energy": "Gravitational potential energy (U) at a distance r from the centre of earth is U = -GMm/r.",

"7.8 Escape speed": "Escape speed is the minimum speed required to escape from the gravitational pull of a planet. For earth, ve = √(2GM/R) ≈ 11.2 km/s.",

"7.9 Earth satellites": "A satellite is an object that revolves around a planet. Orbital speed of a satellite is v = √(GM/r).",

"7.10 Energy of an orbiting satellite": "Total energy of a satellite in orbit is negative and given by: E = -GMm/2r.",
};
