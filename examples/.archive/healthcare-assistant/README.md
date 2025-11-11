# 🏥 Healthcare Assistant Demo

AI-powered healthcare chatbot for appointment booking, symptom checking, and patient support.

## ✨ Features

- 📅 **Appointment Booking** - Schedule, reschedule, cancel appointments
- 🩺 **Symptom Checker** - Preliminary symptom assessment (educational only)
- 💊 **Medication Reminders** - Set and manage medication schedules
- 📋 **Health Records Access** - View test results and history
- 🔔 **Appointment Reminders** - Automated notifications
- 👨‍⚕️ **Doctor Matching** - Find specialists based on needs
- 📍 **Location Services** - Find nearby clinics and hospitals
- ⚠️ **Emergency Detection** - Identify urgent situations

## ⚠️ Important Disclaimer

This is a **demonstration only**. Not for actual medical use. Always consult qualified healthcare
professionals for medical advice.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local
npm run dev
```

## 🏗️ Architecture

### Function Calling

```typescript
const healthcareFunctions = [
  {
    name: 'check_appointment_availability',
    description: 'Check available appointment slots',
    parameters: {
      specialty: 'string',
      date: 'string',
      location: 'optional string',
    },
  },
  {
    name: 'book_appointment',
    description: 'Book an appointment with a healthcare provider',
    parameters: {
      doctor: 'string',
      date: 'string',
      time: 'string',
      reason: 'string',
    },
  },
  {
    name: 'get_patient_records',
    description: 'Retrieve patient medical records (with authorization)',
    parameters: {
      recordType: 'appointments | prescriptions | test_results',
    },
  },
  {
    name: 'assess_symptoms',
    description: 'Provide educational information about symptoms (not medical advice)',
    parameters: {
      symptoms: 'array of strings',
      duration: 'string',
    },
  },
]
```

## 💡 Sample Interactions

### Appointment Booking

**Patient**: "I need to see a dermatologist next week"  
**Assistant**: "I can help you book a dermatologist appointment. What day works best for you?"  
**Patient**: "Tuesday afternoon"  
**Assistant**: _Checks availability_ "Dr. Smith has openings at 2 PM and 4 PM on Tuesday. Which
time?"

### Symptom Assessment

**Patient**: "I have a headache and slight fever"  
**Assistant**: _Asks clarifying questions_

- "How long have you had these symptoms?"
- "On a scale of 1-10, how severe is the headache?"
- _Provides educational information_
- "Based on your symptoms, you may want to consider seeing a doctor if..."

### Medication Management

**Patient**: "When should I take my blood pressure medication?"  
**Assistant**: _Accesses medication schedule_  
"Your prescription is for 10mg Lisinopril once daily in the morning. Would you like me to set a
reminder?"

## 🎯 Key Features

### Appointment Management

- Check availability
- Book new appointments
- Reschedule existing
- Cancel appointments
- Send reminders

### Patient Support

- Symptom information (educational)
- Medication schedules
- Test result explanations
- Follow-up care instructions

### Emergency Handling

- Recognize urgent situations
- Provide emergency contact info
- Escalate to human support

## 🔒 HIPAA Compliance Considerations

For production use, implement:

1. **Data Encryption** - Encrypt all PHI (Protected Health Information)
2. **Access Controls** - Role-based permissions
3. **Audit Logs** - Track all data access
4. **Secure Communications** - HTTPS, encrypted storage
5. **Patient Consent** - Explicit consent for AI interaction
6. **Data Minimization** - Only collect necessary information

## 📚 Technologies

- Next.js 15
- OpenAI GPT-4 (healthcare-safe prompting)
- Supabase (secure patient data storage)
- TypeScript
- Tailwind CSS

## 🔗 Related

- [Customer Support](../customer-support) - Support patterns
- [Email Assistant](../email-assistant) - Communication patterns

---

**Status**: 🎯 Demo Only (Not for Medical Use)  
**Use Case**: Healthcare & Patient Support  
**Complexity**: Intermediate  
**Note**: Educational demonstration - not HIPAA compliant
