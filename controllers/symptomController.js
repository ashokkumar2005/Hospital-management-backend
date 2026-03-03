// Basic rule-based AI symptom checker
const symptomDatabase = {
  fever: { conditions: ['Flu', 'Malaria', 'COVID-19', 'Typhoid'], urgency: 'medium', specialist: 'General Physician' },
  headache: { conditions: ['Migraine', 'Tension Headache', 'Hypertension', 'Dehydration'], urgency: 'low', specialist: 'Neurologist' },
  'chest pain': { conditions: ['Angina', 'Heart Attack', 'GERD', 'Muscle Strain'], urgency: 'high', specialist: 'Cardiologist' },
  'shortness of breath': { conditions: ['Asthma', 'Pneumonia', 'Heart Failure', 'Anxiety'], urgency: 'high', specialist: 'Pulmonologist' },
  cough: { conditions: ['Common Cold', 'Bronchitis', 'Asthma', 'COVID-19'], urgency: 'low', specialist: 'General Physician' },
  'stomach pain': { conditions: ['Gastritis', 'Appendicitis', 'IBS', 'Food Poisoning'], urgency: 'medium', specialist: 'Gastroenterologist' },
  fatigue: { conditions: ['Anemia', 'Diabetes', 'Depression', 'Thyroid Disorder'], urgency: 'low', specialist: 'General Physician' },
  dizziness: { conditions: ['Vertigo', 'Low Blood Pressure', 'Anemia', 'Inner Ear Disorder'], urgency: 'medium', specialist: 'Neurologist' },
  rash: { conditions: ['Allergic Reaction', 'Eczema', 'Psoriasis', 'Chickenpox'], urgency: 'low', specialist: 'Dermatologist' },
  'joint pain': { conditions: ['Arthritis', 'Gout', 'Lupus', 'Bursitis'], urgency: 'low', specialist: 'Orthopedist' },
};

const checkSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body; // array of strings
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide symptoms array' });
    }

    const results = [];
    let maxUrgency = 'low';
    const urgencyOrder = { low: 0, medium: 1, high: 2 };

    symptoms.forEach(symptom => {
      const lower = symptom.toLowerCase().trim();
      const match = symptomDatabase[lower];
      if (match) {
        results.push({ symptom: lower, ...match });
        if (urgencyOrder[match.urgency] > urgencyOrder[maxUrgency]) maxUrgency = match.urgency;
      }
    });

    const advice = maxUrgency === 'high'
      ? 'Seek immediate medical attention or visit an emergency room.'
      : maxUrgency === 'medium'
      ? 'Schedule a doctor visit within the next 24-48 hours.'
      : 'Monitor your symptoms and consult a doctor if they persist beyond 3 days.';

    res.json({
      success: true,
      symptoms: results,
      overallUrgency: maxUrgency,
      advice,
      disclaimer: 'This is a preliminary assessment only. Always consult a qualified healthcare professional for accurate diagnosis.',
    });
  } catch (err) { next(err); }
};

module.exports = { checkSymptoms };
